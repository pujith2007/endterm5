import { JoinRequest } from '../models/JoinRequest.js';
import { Project } from '../models/Project.js';
import { Notification } from '../models/Notification.js';
import { calculateSkillMatch } from '../services/skillMatcher.js';

// @desc    Apply to join a project
// @route   POST /api/requests
// @access  Private
export const createJoinRequest = async (req, res, next) => {
  try {
    const { projectId, message } = req.body;
    const applicantId = req.user._id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project ID',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // 1. Prevent owner from applying
    if (project.owner.toString() === applicantId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to join your own project',
      });
    }

    // 2. Prevent already joined members
    const isMember = project.members.some(
      (m) => m.user.toString() === applicantId.toString()
    );
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project team',
      });
    }

    // 3. Prevent applying to full project
    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'This project team has already reached its maximum member capacity',
      });
    }

    // 4. Prevent applying if project is completed
    if (project.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This project is already completed and no longer accepting applications',
      });
    }

    // 5. Prevent duplicate pending applications
    const existingRequest = await JoinRequest.findOne({
      project: projectId,
      applicant: applicantId,
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'You already have a pending application for this project',
        });
      } else if (existingRequest.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Your application has already been accepted',
        });
      } else {
        // If previously rejected, allow re-applying by updating status to pending
        existingRequest.status = 'pending';
        existingRequest.message = message || '';
        await existingRequest.save();

        // Notify owner
        await Notification.create({
          recipient: project.owner,
          sender: applicantId,
          project: project._id,
          type: 'application_received',
          title: 'New Team Application',
          message: `${req.user.name} re-applied to join your project "${project.title}"`,
          link: `/projects/${project._id}`,
        });

        return res.json({
          success: true,
          message: 'Application submitted successfully',
          request: existingRequest,
        });
      }
    }

    const request = await JoinRequest.create({
      project: projectId,
      applicant: applicantId,
      message: message || '',
      status: 'pending',
    });

    // Notify project owner
    await Notification.create({
      recipient: project.owner,
      sender: applicantId,
      project: project._id,
      type: 'application_received',
      title: 'New Team Application',
      message: `${req.user.name} applied to join your project "${project.title}"`,
      link: `/projects/${project._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a project (Owner only)
// @route   GET /api/requests/project/:projectId
// @access  Private (Owner only)
export const getProjectRequests = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can review join applications',
      });
    }

    const requests = await JoinRequest.find({ project: projectId })
      .populate('applicant', 'name email avatarUrl college skills githubUrl bio')
      .sort({ createdAt: -1 });

    // Attach skill match of each applicant relative to this project
    const requestsWithMatch = requests.map((reqItem) => {
      const itemObj = reqItem.toObject();
      const applicantSkills = itemObj.applicant?.skills || [];
      const match = calculateSkillMatch(applicantSkills, project.requiredSkills);
      return {
        ...itemObj,
        compatibility: match.matchPercentage,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
      };
    });

    res.json({
      success: true,
      count: requestsWithMatch.length,
      requests: requestsWithMatch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by logged-in user
// @route   GET /api/requests/my-applications
// @access  Private
export const getUserRequests = async (req, res, next) => {
  try {
    const requests = await JoinRequest.find({ applicant: req.user._id })
      .populate({
        path: 'project',
        select: 'title category status maxMembers members owner',
        populate: {
          path: 'owner',
          select: 'name email avatarUrl college',
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept or reject application
// @route   PUT /api/requests/:id
// @access  Private (Project Owner only)
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be accepted or rejected',
      });
    }

    const request = await JoinRequest.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('project');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join application not found',
      });
    }

    const project = await Project.findById(request.project._id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can decide on join applications',
      });
    }

    if (request.status === status) {
      return res.status(400).json({
        success: false,
        message: `This application has already been marked as ${status}`,
      });
    }

    if (status === 'accepted') {
      // Check capacity
      if (project.members.length >= project.maxMembers) {
        return res.status(400).json({
          success: false,
          message: 'Project is already full. Increase max capacity first or reject other members.',
        });
      }

      // Add to members if not already
      const alreadyMember = project.members.some(
        (m) => m.user.toString() === request.applicant._id.toString()
      );

      if (!alreadyMember) {
        project.members.push({
          user: request.applicant._id,
          role: 'Member',
          joinedAt: new Date(),
        });
        await project.save();
      }

      // Notification to applicant
      await Notification.create({
        recipient: request.applicant._id,
        sender: req.user._id,
        project: project._id,
        type: 'application_accepted',
        title: 'Application Accepted! 🎉',
        message: `Congratulations! Your request to join "${project.title}" has been accepted. You can now access the team workspace.`,
        link: `/workspace/${project._id}`,
      });
    } else {
      // Notification to applicant for rejection
      await Notification.create({
        recipient: request.applicant._id,
        sender: req.user._id,
        project: project._id,
        type: 'application_rejected',
        title: 'Application Update',
        message: `Your request to join "${project.title}" was not accepted at this time.`,
        link: `/projects/${project._id}`,
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: `Application has been ${status}`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw / Cancel a pending application
// @route   DELETE /api/requests/:id
// @access  Private (Applicant only)
export const cancelRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join application not found',
      });
    }

    if (request.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own application',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending applications can be cancelled',
      });
    }

    await JoinRequest.findByIdAndDelete(request._id);

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
};
