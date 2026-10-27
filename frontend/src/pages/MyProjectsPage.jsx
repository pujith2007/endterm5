import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, requestsAPI } from '../services/api';
import {
  FolderGit2,
  Users,
  Send,
  PlusCircle,
  Kanban,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Layers,
} from 'lucide-react';

const MyProjectsPage = () => {
  const [activeTab, setActiveTab] = useState('owned'); // 'owned' | 'joined' | 'applications'
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, reqRes] = await Promise.all([
        projectsAPI.getMyProjects(),
        requestsAPI.getUserRequests(),
      ]);
      setOwnedProjects(projRes.data.owned || []);
      setJoinedProjects(projRes.data.joined || []);
      setApplications(reqRes.data.requests || []);
    } catch (err) {
      console.error('Failed to load my projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelApplication = async (requestId) => {
    if (window.confirm('Withdraw this application?')) {
      try {
        await requestsAPI.cancelRequest(requestId);
        setApplications((prev) => prev.filter((a) => a._id !== requestId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel application');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.deleteProject(projectId);
        setOwnedProjects((prev) => prev.filter((p) => p._id !== projectId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Projects & Teams
          </h1>
          <p className="text-sm text-slate-600">
            Manage the projects you lead, teams you collaborate in, and your pending applications.
          </p>
        </div>

        <Link
          to="/projects/create"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm shadow-brand-500/25 flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Project
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('owned')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'owned'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects I Lead ({ownedProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'joined'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Joined Teams ({joinedProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          My Applications ({applications.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your project portfolio...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: OWNED PROJECTS */}
          {activeTab === 'owned' && (
            <div>
              {ownedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedProjects.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {p.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                p.status === 'Recruiting'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          <Link to={`/projects/${p._id}`}>
                            <h3 className="font-bold text-slate-900 text-lg hover:text-brand-600 transition-colors">
                              {p.title}
                            </h3>
                          </Link>
                        </div>

                        <div className="flex items-center gap-1">
                          <Link
                            to={`/projects/edit/${p._id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Members info */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {p.members?.length || 1} of {p.maxMembers} Members
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${p._id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                          >
                            Manage Applicants
                          </Link>
                          <Link
                            to={`/workspace/${p._id}`}
                            className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-sm flex items-center gap-1"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                            Workspace
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">You haven't posted any projects yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Have an idea for a class project, hackathon, or startup? Post it to find teammates!
                  </p>
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Your First Project
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOINED TEAMS */}
          {activeTab === 'joined' && (
            <div>
              {joinedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {joinedProjects.map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            Team Member
                          </span>
                          <Link to={`/projects/${p._id}`}>
                            <h3 className="font-bold text-slate-900 text-lg hover:text-brand-600 transition-colors mt-1">
                              {p.title}
                            </h3>
                          </Link>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Lead: {p.owner?.name}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {p.members?.length} Members
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${p._id}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                          >
                            Project Info
                          </Link>
                          <Link
                            to={`/workspace/${p._id}`}
                            className="px-3.5 py-1.5 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-sm flex items-center gap-1"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                            Open Workspace
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">You haven't joined any project teams yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Browse open student projects, check your skill compatibility, and send join applications!
                  </p>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Explore Projects Now
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const proj = app.project;
                    return (
                      <div
                        key={app._id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/projects/${proj?._id}`}
                              className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                            >
                              {proj?.title || 'Project'}
                            </Link>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {proj?.category}
                            </span>
                          </div>

                          {app.message && (
                            <p className="text-xs text-slate-600 italic">"{app.message}"</p>
                          )}

                          <p className="text-[11px] text-slate-400">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3">
                          {app.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Review
                              </span>
                              <button
                                onClick={() => handleCancelApplication(app._id)}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                              >
                                Withdraw
                              </button>
                            </div>
                          )}

                          {app.status === 'accepted' && (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Accepted
                              </span>
                              <Link
                                to={`/workspace/${proj?._id}`}
                                className="px-3 py-1 rounded-lg bg-brand-600 text-white text-xs font-bold shadow hover:bg-brand-700"
                              >
                                Enter Workspace
                              </Link>
                            </div>
                          )}

                          {app.status === 'rejected' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              Not Accepted
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <Send className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">No submitted applications</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you apply to open projects, track their review status here.
                  </p>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Find Projects to Apply
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
