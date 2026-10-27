import { Project } from '../models/Project.js';
import { JoinRequest } from '../models/JoinRequest.js';
import { Task } from '../models/Task.js';
import { attachSkillMatchToProjects, calculateSkillMatch } from '../services/skillMatcher.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      techStack,
      requiredSkills,
      maxMembers,
      githubRepo,
      demoUrl,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category',
      });
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (skillsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one required skill',
      });
    }

    const stackArray = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
      ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      title,
      description,
      category,
      techStack: stackArray,
      requiredSkills: skillsArray,
      maxMembers: maxMembers ? Math.max(2, Math.min(12, Number(maxMembers))) : 4,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Owner',
          joinedAt: new Date(),
        },
      ],
      githubRepo: githubRepo || '',
      demoUrl: demoUrl || '',
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills githubUrl');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects with search, filter, and skill matching
// @route   GET /api/projects
// @access  Public (Optional Auth for skill matching)
export const getProjects = async (req, res, next) => {
  try {
    const { search, category, status, tech, sort } = req.query;

    const query = {};

    // Search keyword
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { techStack: searchRegex },
        { requiredSkills: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Tech filter
    if (tech && tech.trim()) {
      const techRegex = new RegExp(tech.trim(), 'i');
      query.$or = [
        ...(query.$or || []),
        { techStack: techRegex },
        { requiredSkills: techRegex },
      ];
    }

    let projects = await Project.find(query)
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills')
      .sort({ createdAt: -1 });

    // Attach real smart skill match info if user is authenticated
    let projectsWithMatch = attachSkillMatchToProjects(projects, req.user);

    // Apply sorting
    if (sort === 'compatibility' && req.user) {
      projectsWithMatch.sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
    } else if (sort === 'spots') {
      projectsWithMatch.sort(
        (a, b) =>
          b.maxMembers - (b.members?.length || 0) -
          (a.maxMembers - (a.members?.length || 0))
      );
    } else if (sort === 'oldest') {
      projectsWithMatch.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    res.json({
      success: true,
      count: projectsWithMatch.length,
      projects: projectsWithMatch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public (Optional Auth)
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatarUrl college bio githubUrl')
      .populate('members.user', 'name email avatarUrl college skills githubUrl bio');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const projectObj = project.toObject();

    // Attach skill match
    if (req.user) {
      const match = calculateSkillMatch(req.user.skills || [], project.requiredSkills);
      projectObj.compatibility = match.matchPercentage;
      projectObj.matchingSkills = match.matchingSkills;
      projectObj.missingSkills = match.missingSkills;

      // Check user relationship
      projectObj.isOwner = project.owner._id.toString() === req.user._id.toString();
      projectObj.isMember = project.members.some(
        (m) => m.user?._id?.toString() === req.user._id.toString()
      );

      // Check if user has an existing join request
      const existingRequest = await JoinRequest.findOne({
        project: project._id,
        applicant: req.user._id,
      });

      projectObj.userApplicationStatus = existingRequest
        ? existingRequest.status
        : null;
    } else {
      projectObj.compatibility = null;
      projectObj.isOwner = false;
      projectObj.isMember = false;
      projectObj.userApplicationStatus = null;
    }

    res.json({
      success: true,
      project: projectObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can update project details',
      });
    }

    const {
      title,
      description,
      category,
      techStack,
      requiredSkills,
      maxMembers,
      status,
      githubRepo,
      demoUrl,
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (status) project.status = status;
    if (githubRepo !== undefined) project.githubRepo = githubRepo;
    if (demoUrl !== undefined) project.demoUrl = demoUrl;

    if (maxMembers !== undefined) {
      const num = Number(maxMembers);
      if (num < project.members.length) {
        return res.status(400).json({
          success: false,
          message: `Cannot set maximum members to ${num} because there are already ${project.members.length} members.`,
        });
      }
      project.maxMembers = num;
    }

    if (techStack !== undefined) {
      project.techStack = Array.isArray(techStack)
        ? techStack
        : typeof techStack === 'string'
        ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    if (requiredSkills !== undefined) {
      const skills = Array.isArray(requiredSkills)
        ? requiredSkills
        : typeof requiredSkills === 'string'
        ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      if (skills.length > 0) {
        project.requiredSkills = skills;
      }
    }

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills githubUrl');

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete this project',
      });
    }

    await Project.findByIdAndDelete(project._id);
    await JoinRequest.deleteMany({ project: project._id });
    await Task.deleteMany({ project: project._id });

    res.json({
      success: true,
      message: 'Project and all associated workspace data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's owned and joined projects
// @route   GET /api/projects/my-projects
// @access  Private
export const getMyProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const owned = await Project.find({ owner: userId })
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills')
      .sort({ updatedAt: -1 });

    const joined = await Project.find({
      'members.user': userId,
      owner: { $ne: userId },
    })
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      owned,
      joined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart recommended projects based on user skills
// @route   GET /api/projects/recommendations
// @access  Private
export const getRecommendedProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find active projects where user is not yet a member or owner
    const candidateProjects = await Project.find({
      status: 'Recruiting',
      owner: { $ne: userId },
      'members.user': { $ne: userId },
    })
      .populate('owner', 'name email avatarUrl college')
      .populate('members.user', 'name email avatarUrl college skills');

    const matchedProjects = attachSkillMatchToProjects(candidateProjects, req.user);

    // Filter projects that aren't full and sort by compatibility descending
    const recommendations = matchedProjects
      .filter((p) => (p.members?.length || 0) < p.maxMembers)
      .sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0))
      .slice(0, 6);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};
