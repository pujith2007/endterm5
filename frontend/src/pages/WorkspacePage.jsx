import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/workspace/TaskCard';
import TaskModal from '../components/workspace/TaskModal';
import {
  Kanban,
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Settings,
  Sparkles,
  Loader2,
  Layers,
} from 'lucide-react';

const WorkspacePage = () => {
  const { id: projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      setError('');
      const [projRes, taskRes] = await Promise.all([
        projectsAPI.getProjectById(projectId),
        tasksAPI.getProjectTasks(projectId),
      ]);
      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load workspace. Ensure you are an approved member of this project.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [projectId]);

  const handleCreateTask = async (taskData) => {
    const res = await tasksAPI.createTask({
      projectId,
      ...taskData,
    });
    setTasks((prev) => [res.data.task, ...prev]);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      await tasksAPI.updateTask(taskId, { status: newStatus });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
      fetchWorkspaceData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleProjectStatusChange = async (newStatus) => {
    try {
      setChangingStatus(true);
      await projectsAPI.updateProject(projectId, { status: newStatus });
      setProject((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update project status');
    } finally {
      setChangingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Initializing team workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Workspace Access Restricted</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{error}</p>
        <div className="pt-2">
          <Link
            to="/my-projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Projects
          </Link>
        </div>
      </div>
    );
  }

  // Filter tasks into 3 columns
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  // Overall progress
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const isOwner = project.isOwner;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/projects/${projectId}`}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Project Details
              </Link>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                {project.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Kanban className="w-7 h-7 text-brand-600" />
              {project.title}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Owner project status switcher */}
            {isOwner && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 uppercase">Status:</span>
                <select
                  value={project.status}
                  disabled={changingStatus}
                  onChange={(e) => handleProjectStatusChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Recruiting">Recruiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-brand-500/25 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Sprint Progress</span>
              <span className="text-brand-600 font-bold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500">
              {doneTasks.length} of {totalTasks} tasks finished • {inProgressTasks.length} in progress • {todoTasks.length} pending
            </div>
          </div>

          {/* Team Members strip */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Team:</span>
            <div className="flex -space-x-2 overflow-hidden">
              {project.members?.map((m, idx) => {
                const u = m.user || m;
                return (
                  <img
                    key={idx}
                    src={
                      u.avatarUrl ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`
                    }
                    alt={u.name}
                    title={`${u.name} (${m.role || 'Member'})`}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 object-cover"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: TO DO */}
        <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col space-y-3 min-h-[500px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
                To Do
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {todoTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                canDelete={isOwner || task.createdBy?._id === user?._id}
                members={project.members}
              />
            ))}
            {todoTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No tasks to do. Click "Add Task" to create one.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: IN PROGRESS */}
        <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex flex-col space-y-3 min-h-[500px]">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-indigo-900 uppercase tracking-wide">
                In Progress
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                canDelete={isOwner || task.createdBy?._id === user?._id}
                members={project.members}
              />
            ))}
            {inProgressTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-indigo-300 italic">
                No active tasks in flight.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: DONE */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col space-y-3 min-h-[500px]">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-extrabold text-sm text-emerald-900 uppercase tracking-wide">
                Done
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {doneTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                canDelete={isOwner || task.createdBy?._id === user?._id}
                members={project.members}
              />
            ))}
            {doneTasks.length === 0 && (
              <div className="p-6 text-center text-xs text-emerald-300 italic">
                No tasks marked done yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        members={project.members || []}
      />
    </div>
  );
};

export default WorkspacePage;
