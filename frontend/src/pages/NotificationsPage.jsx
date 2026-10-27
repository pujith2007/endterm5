import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  Users,
  Kanban,
  Check,
  Clock,
  ArrowRight,
  Info,
  XCircle,
  Loader2,
} from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markAsRead(notif._id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <Users className="w-5 h-5 text-brand-600" />;
      case 'application_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'application_rejected':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'task_assigned':
        return <Kanban className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-brand-600" />
            In-App Notifications
          </h1>
          <p className="text-sm text-slate-600">
            Stay updated with team applications, approvals, and workspace task assignments.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300'
                  : 'bg-brand-50/40 border-brand-200 hover:border-brand-300 shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {notif.title}
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 inline-block animate-pulse" />
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

                {notif.link && (
                  <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-brand-600">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No notifications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You'll receive notifications when students apply to your projects, team leads accept your
            requests, or teammates assign you tasks!
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
