import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { Notification } from '../models/Notification.js';

// Helper to verify if user is member or owner
const checkMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { allowed: false, notFound: true };

  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some(
    (m) => m.user.toString() === userId.toString()
  );

  return {
    allowed: isOwner || isMember,
    isOwner,
    isMember,
    project,
  };
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private (Project members only)
export const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { allowed, notFound, project } = await checkMembership(
      projectId,
      req.user._id
    );

    if (notFound) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You must be a team member to access this workspace',
      });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email avatarUrl college')
      .populate('createdBy', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Project members only)
export const createTask = async (req, res, next) => {
  try {
    const { projectId, title, description, assignedTo, status, priority, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectId and task title',
      });
    }

    const { allowed, notFound, project } = await checkMembership(
      projectId,
      req.user._id
    );

    if (notFound) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only project members can create tasks',
      });
    }

    // Verify assignedTo is a project member if provided
    if (assignedTo) {
      const isAssigneeMember =
        project.owner.toString() === assignedTo.toString() ||
        project.members.some((m) => m.user.toString() === assignedTo.toString());

      if (!isAssigneeMember) {
        return res.status(400).json({
          success: false,
          message: 'Can only assign tasks to current team members',
        });
      }
    }

    const task = await Task.create({
      project: projectId,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatarUrl college')
      .populate('createdBy', 'name email avatarUrl');

    // Notify assignee if assigned to someone else
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        project: project._id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `${req.user.name} assigned you the task: "${title}" in "${project.title}"`,
        link: `/workspace/${project._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private (Project members only)
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { allowed, project } = await checkMembership(
      task.project,
      req.user._id
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only project members can update tasks',
      });
    }

    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    if (assignedTo !== undefined) {
      const prevAssignee = task.assignedTo?.toString();
      task.assignedTo = assignedTo || null;

      // If new assignee specified and not self, notify
      if (
        assignedTo &&
        assignedTo.toString() !== prevAssignee &&
        assignedTo.toString() !== req.user._id.toString()
      ) {
        await Notification.create({
          recipient: assignedTo,
          sender: req.user._id,
          project: project._id,
          type: 'task_assigned',
          title: 'Task Assigned',
          message: `${req.user.name} assigned you: "${task.title}" in "${project.title}"`,
          link: `/workspace/${project._id}`,
        });
      }
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatarUrl college')
      .populate('createdBy', 'name email avatarUrl');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Task creator or project owner)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { isOwner, allowed } = await checkMembership(task.project, req.user._id);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isCreator && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only the task creator or project owner can delete this task',
      });
    }

    await Task.findByIdAndDelete(task._id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
