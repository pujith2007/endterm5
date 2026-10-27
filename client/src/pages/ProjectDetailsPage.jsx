import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsAPI, requestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CompatibilityBadge from '../components/common/CompatibilityBadge';
import SkillTag from '../components/common/SkillTag';
import Modal from '../components/common/Modal';
import {
  Users,
  Calendar,
  Layers,
  Github,
  Globe,
  Sparkles,
  ArrowRight,
  Send,
  Kanban,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Loader2,
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  // Review Applicants Modal state (Owner only)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getProjectById(id);
      setProject(res.data.project);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleOpenReview = async () => {
    try {
      setReviewModalOpen(true);
      setLoadingApplicants(true);
      const res = await requestsAPI.getProjectRequests(id);
      setApplicants(res.data.requests || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await requestsAPI.updateRequestStatus(requestId, status);
      // Refresh project & applicants
      fetchProjectDetails();
      const res = await requestsAPI.getProjectRequests(id);
      setApplicants(res.data.requests || []);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to update application to ${status}`);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      setApplyError('');
      await requestsAPI.createJoinRequest({
        projectId: id,
        message: applicationMessage.trim(),
      });
      setApplySuccess('Application sent successfully! The project owner has been notified.');
      setTimeout(() => {
        setApplyModalOpen(false);
        setApplySuccess('');
        setApplicationMessage('');
        fetchProjectDetails();
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to send application');
    } finally {
      setApplying(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks? This action cannot be undone.')) {
      try {
        await projectsAPI.deleteProject(id);
        navigate('/my-projects');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading project information...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-slate-500">{error || 'This project does not exist or has been removed.'}</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold text-sm shadow"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    techStack = [],
    requiredSkills = [],
    maxMembers = 4,
    members = [],
    status,
    owner,
    githubRepo,
    demoUrl,
    compatibility,
    matchingSkills = [],
    missingSkills = [],
    isOwner,
    isMember,
    userApplicationStatus,
    createdAt,
  } = project;

  const currentMembers = members.length;
  const isFull = currentMembers >= maxMembers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {category}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                status === 'Recruiting'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'In Progress'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {status}
            </span>
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Posted {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Workspace Access for Team */}
          {(isOwner || isMember) && (
            <Link
              to={`/workspace/${id}`}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all"
            >
              <Kanban className="w-4 h-4" />
              Enter Workspace
            </Link>
          )}

          {/* Owner specific actions */}
          {isOwner && (
            <>
              <button
                onClick={handleOpenReview}
                className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Users className="w-4 h-4" />
                Review Applicants
              </button>

              <Link
                to={`/projects/edit/${id}`}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDeleteProject}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Non-member Application State */}
          {!isOwner && !isMember && (
            <>
              {userApplicationStatus === 'pending' ? (
                <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Application Pending
                </div>
              ) : userApplicationStatus === 'rejected' ? (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Re-Apply
                </button>
              ) : isFull ? (
                <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-semibold">
                  Team is Full
                </div>
              ) : isAuthenticated ? (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Apply to Join Team
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition-all flex items-center gap-2"
                >
                  Log In to Apply
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Requirements, Tech */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skill Compatibility Card (if authenticated and not owner) */}
          {isAuthenticated && compatibility !== null && compatibility !== undefined && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50/70 via-indigo-50/50 to-purple-50/40 border border-brand-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Your Skill Compatibility Match
                  </h3>
                </div>
                <CompatibilityBadge percentage={compatibility} size="lg" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Calculated against your registered profile skills ({matchingSkills.length} of{' '}
                {requiredSkills.length} required skills matched).
              </p>

              {/* Matching & Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Matching Skills ({matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchingSkills.length > 0 ? (
                      matchingSkills.map((s, idx) => (
                        <SkillTag key={idx} name={s} isMatch={true} size="xs" />
                      ))
                    ) : (
                      <span className="text-xs text-slate-600 italic">No matching skills yet</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    Skills to Learn / Missing ({missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((s, idx) => (
                        <SkillTag key={idx} name={s} isMissing={true} size="xs" />
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">
                        You know all required skills! 🚀
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Project Overview</h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>

            {/* Links */}
            {(githubRepo || demoUrl) && (
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4 flex-wrap text-xs font-semibold">
                {githubRepo && (
                  <a
                    href={githubRepo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Repository
                  </a>
                )}
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" />
                    Live Project Preview
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tech Stack & Required Skills */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600" />
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((s, idx) => (
                  <SkillTag
                    key={idx}
                    name={s}
                    isMatch={matchingSkills.some((m) => m.toLowerCase() === s.toLowerCase())}
                  />
                ))}
              </div>
            </div>

            {techStack.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Full Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Team Roster & Project Owner */}
        <div className="space-y-6">
          {/* Project Owner Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Project Lead / Creator
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={owner?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${owner?.name}`}
                alt={owner?.name}
                className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 object-cover"
              />
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm">{owner?.name}</h4>
                <p className="text-xs text-slate-600">{owner?.college || 'Student'}</p>
              </div>
            </div>

            {owner?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed italic">"{owner?.bio}"</p>
            )}

            {owner?.githubUrl && (
              <a
                href={owner?.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                View GitHub
              </a>
            )}
          </div>

          {/* Team Roster */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Team Roster ({currentMembers}/{maxMembers})
              </h3>
              <span className="text-xs font-bold text-brand-600">
                {maxMembers - currentMembers} open {maxMembers - currentMembers === 1 ? 'spot' : 'spots'}
              </span>
            </div>

            {/* Capacity meter */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isFull ? 'bg-amber-500' : 'bg-brand-600'
                }`}
                style={{ width: `${(currentMembers / maxMembers) * 100}%` }}
              />
            </div>

            <div className="space-y-3 pt-2">
              {members.map((m, idx) => {
                const memberUser = m.user;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          memberUser?.avatarUrl ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${memberUser?.name}`
                        }
                        alt={memberUser?.name}
                        className="w-8 h-8 rounded-full bg-slate-200 object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {memberUser?.name}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {memberUser?.college || 'Student'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        m.role === 'Owner'
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Apply to Project */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply to Join Project Team"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          {applyError && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {applyError}
            </div>
          )}
          {applySuccess && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
              {applySuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Pitch & Note to Team Lead
            </label>
            <textarea
              rows={4}
              required
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="Explain why you're interested, your experience with the required tech stack, and what you'd like to build..."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            💡 The project owner will see your full profile, technical skills, and calculated compatibility score.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              {applying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Review Applicants (Owner only) */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review Applicants (${applicants.length})`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {loadingApplicants ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
            </div>
          ) : applicants.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {applicants.map((reqItem) => {
                const applicant = reqItem.applicant;
                return (
                  <div
                    key={reqItem._id}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            applicant?.avatarUrl ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${applicant?.name}`
                          }
                          alt={applicant?.name}
                          className="w-10 h-10 rounded-full bg-slate-100 border object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {applicant?.name}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {applicant?.college || 'Student'} • {applicant?.email}
                          </p>
                        </div>
                      </div>

                      <CompatibilityBadge percentage={reqItem.compatibility} size="sm" />
                    </div>

                    {reqItem.message && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                        "{reqItem.message}"
                      </div>
                    )}

                    {/* Applicant skills */}
                    {applicant?.skills && applicant.skills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-600 uppercase">
                          Skills:
                        </span>
                        {applicant.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium capitalize"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        Applied on {new Date(reqItem.createdAt).toLocaleDateString()}
                      </span>

                      {reqItem.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(reqItem._id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(reqItem._id, 'accepted')}
                            disabled={isFull}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm disabled:opacity-50"
                          >
                            Accept into Team
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-full ${
                            reqItem.status === 'accepted'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {reqItem.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-sm text-slate-500">
              No applications received for this project yet.
            </p>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
