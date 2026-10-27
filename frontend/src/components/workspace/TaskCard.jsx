import React from 'react';
import { Calendar, User as UserIcon, Trash2, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete, canDelete, members = [] }) => {
  const { _id, title, description, assignedTo, status, priority, dueDate } = task;

  const getPriorityStyle = () => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getPriorityStyle()}`}
        >
          {priority} priority
        </span>

        {canDelete && (
          <button
            onClick={() => onDelete(_id)}
            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
        {description && (
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {assignedTo ? (
            <>
              <img
                src={
                  assignedTo.avatarUrl ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${assignedTo.name}`
                }
                alt={assignedTo.name}
                className="w-5 h-5 rounded-full bg-slate-200"
              />
              <span className="text-[11px] font-medium text-slate-700 truncate max-w-[90px]">
                {assignedTo.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(dueDate)}</span>
          </div>
        )}
      </div>

      {/* Quick Status Shift Buttons */}
      <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-50">
        {status !== 'todo' && (
          <button
            onClick={() =>
              onStatusChange(
                _id,
                status === 'done' ? 'in-progress' : 'todo'
              )
            }
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 py-1 px-1.5 rounded hover:bg-slate-100 transition-colors"
            title="Shift Left"
          >
            <ArrowLeftCircle className="w-3.5 h-3.5" />
            <span>{status === 'done' ? 'In Progress' : 'To Do'}</span>
          </button>
        )}

        <div className="ml-auto">
          {status !== 'done' && (
            <button
              onClick={() =>
                onStatusChange(
                  _id,
                  status === 'todo' ? 'in-progress' : 'done'
                )
              }
              className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 py-1 px-1.5 rounded hover:bg-brand-50 transition-colors"
              title="Shift Right"
            >
              <span>{status === 'todo' ? 'Start' : 'Mark Done'}</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
