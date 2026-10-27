import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import {
  FolderPlus,
  Edit3,
  Layers,
  Code2,
  Users,
  Github,
  Globe,
  Loader2,
  ArrowRight,
  Info,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Mobile App',
  'AI / Machine Learning',
  'Data Science',
  'Blockchain / Web3',
  'IoT / Robotics',
  'Game Development',
  'Cloud & DevOps',
  'Cybersecurity',
  'Open Source',
  'Other',
];

const CreateEditProjectPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    techStack: '',
    requiredSkills: '',
    maxMembers: 4,
    status: 'Recruiting',
    githubRepo: '',
    demoUrl: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const loadProject = async () => {
        try {
          setLoading(true);
          const res = await projectsAPI.getProjectById(id);
          const proj = res.data.project;
          setFormData({
            title: proj.title || '',
            description: proj.description || '',
            category: proj.category || 'Web Development',
            techStack: proj.techStack ? proj.techStack.join(', ') : '',
            requiredSkills: proj.requiredSkills ? proj.requiredSkills.join(', ') : '',
            maxMembers: proj.maxMembers || 4,
            status: proj.status || 'Recruiting',
            githubRepo: proj.githubRepo || '',
            demoUrl: proj.demoUrl || '',
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load project details');
        } finally {
          setLoading(false);
        }
      };
      loadProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.requiredSkills.trim()) {
      setError('Please provide title, description, and at least one required skill');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        techStack: formData.techStack
          ? formData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        maxMembers: Number(formData.maxMembers),
        status: formData.status,
        githubRepo: formData.githubRepo.trim(),
        demoUrl: formData.demoUrl.trim(),
      };

      if (isEditing) {
        await projectsAPI.updateProject(id, payload);
        navigate(`/projects/${id}`);
      } else {
        const res = await projectsAPI.createProject(payload);
        navigate(`/projects/${res.data.project._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading project data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
            {isEditing ? <Edit3 className="w-3.5 h-3.5" /> : <FolderPlus className="w-3.5 h-3.5" />}
            {isEditing ? 'Project Configuration' : 'Create New Project'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Project Details' : 'Post an Open Student Project'}
          </h1>
          <p className="text-sm text-slate-600">
            Define requirements, target technologies, and maximum team members to recruit teammates.
          </p>
        </div>

        {error && (
          <div className="p-4 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. EduQuest: Gamified Coding Platform for CS Undergrads"
              className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
              >
                <option value="Recruiting">Recruiting (Open for Applications)</option>
                <option value="In Progress">In Progress (Active Sprint)</option>
                <option value="Completed">Completed (Archived / Demo)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Description & Goals <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem, the proposed solution, expected timeline, milestones, and what each teammate will learn or build..."
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {/* Required Skills & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Required Skills (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-brand-600" />
                These skills power CrewUp's smart algorithmic matching.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Tech Stack (Comma separated)
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g. TypeScript, Express, Vite, Docker, Redis"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Team Capacity & Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Team Size (2 - 12)
              </label>
              <input
                type="number"
                min={2}
                max={12}
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Repo (Optional)
              </label>
              <input
                type="url"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Demo Link (Optional)
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? 'Save Changes' : 'Publish Project'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditProjectPage;
