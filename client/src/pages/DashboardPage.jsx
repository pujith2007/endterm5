import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, requestsAPI } from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import CompatibilityBadge from '../components/common/CompatibilityBadge';
import SkillTag from '../components/common/SkillTag';
import {
  Sparkles,
  FolderGit2,
  Users,
  Send,
  PlusCircle,
  ArrowRight,
  Compass,
  Kanban,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [myProjects, setMyProjects] = useState({ owned: [], joined: [] });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [recRes, projRes, reqRes] = await Promise.all([
          projectsAPI.getRecommendations(),
          projectsAPI.getMyProjects(),
          requestsAPI.getUserRequests(),
        ]);

        setRecommendations(recRes.data.recommendations || []);
        setMyProjects({
          owned: projRes.data.owned || [],
          joined: projRes.data.joined || [],
        });
        setApplications(reqRes.data.requests || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalTeams = myProjects.owned.length + myProjects.joined.length;
  const pendingApps = applications.filter((a) => a.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading your student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-violet-800 text-white p-8 sm:p-10 shadow-xl shadow-brand-500/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/40 p-1 object-cover shadow-inner"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Active Student
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
                {user?.college || 'University Innovator'} • {user?.skills?.length || 0} registered skills
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/projects/create"
              className="px-4 py-2.5 rounded-xl bg-white text-brand-800 font-bold text-sm shadow hover:bg-brand-50 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              Post New Project
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explore All
            </Link>
          </div>
        </div>

        {/* User Skills Cloud in Banner */}
        {user?.skills && user.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/15 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-indigo-200">Your Skills:</span>
            {user.skills.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-white/15 text-white capitalize text-[11px] font-medium"
              >
                {s}
              </span>
            ))}
            <Link
              to="/profile"
              className="text-[11px] text-amber-300 hover:underline font-semibold ml-1"
            >
              + Edit Skills
            </Link>
          </div>
        )}
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{myProjects.owned.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Owned Projects
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{myProjects.joined.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Joined Teams
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{pendingApps.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Apps
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{recommendations.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Skill Matches
            </p>
          </div>
        </div>
      </div>

      {/* Smart Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Recommended For Your Skills
            </h2>
            <p className="text-xs text-slate-600">
              Matched algorithmically based on your technical capabilities
            </p>
          </div>
          <Link
            to="/explore?sort=compatibility"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Matches <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((proj) => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              No matching open projects found right now.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adding more skills to your profile or explore all active student projects.
            </p>
            <Link
              to="/profile"
              className="inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              Update Profile Skills →
            </Link>
          </div>
        )}
      </div>

      {/* Active Workspaces / My Teams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Kanban className="w-5 h-5 text-indigo-600" />
              Your Active Collaboration Workspaces
            </h2>
            <p className="text-xs text-slate-600">
              Access Kanban boards and sprint tasks for your teams
            </p>
          </div>
          <Link
            to="/my-projects"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {totalTeams > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Owned Projects */}
            {myProjects.owned.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    Lead (Owner)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {p.members?.length || 1}/{p.maxMembers} Members
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/workspace/${p._id}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    View Info
                  </Link>
                </div>
              </div>
            ))}

            {/* Joined Projects */}
            {myProjects.joined.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Team Member
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {p.members?.length || 1}/{p.maxMembers} Members
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/workspace/${p._id}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    View Info
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              You haven't formed or joined any project teams yet.
            </p>
            <p className="text-xs text-slate-500">
              Start by discovering an open project or post your own project idea!
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                to="/explore"
                className="text-xs font-bold px-3 py-1.5 bg-brand-600 text-white rounded-lg shadow-sm"
              >
                Find Teams
              </Link>
              <Link
                to="/projects/create"
                className="text-xs font-bold px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
              >
                Post Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
