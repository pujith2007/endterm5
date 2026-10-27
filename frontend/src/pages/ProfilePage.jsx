import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import {
  User,
  GraduationCap,
  Mail,
  Github,
  Code,
  Heart,
  Edit,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    bio: user?.bio || '',
    skills: user?.skills ? user.skills.join(', ') : '',
    interests: user?.interests ? user.interests.join(', ') : '',
    githubUrl: user?.githubUrl || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || '',
      college: user?.college || '',
      bio: user?.bio || '',
      skills: user?.skills ? user.skills.join(', ') : '',
      interests: user?.interests ? user.interests.join(', ') : '',
      githubUrl: user?.githubUrl || '',
    });
    setSuccessMsg('');
    setErrorMsg('');
    setEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      await updateProfile({
        name: formData.name.trim(),
        college: formData.college.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        interests: formData.interests ? formData.interests.split(',').map((i) => i.trim()).filter(Boolean) : [],
        githubUrl: formData.githubUrl.trim(),
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 overflow-hidden">
        {/* Cover gradient */}
        <div className="h-36 bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleOpenEdit}
              className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs shadow-sm backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              <Edit className="w-3.5 h-3.5 text-brand-600" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile info & Avatar */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="-mt-16 mb-4 flex items-end justify-between">
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-28 h-28 rounded-2xl border-4 border-white bg-slate-100 shadow-md object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  {user?.college || 'University Student'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email}
                </span>
                {user?.githubUrl && (
                  <a
                    href={user?.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-brand-600 hover:underline font-semibold"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>

            {user?.bio && (
              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-xl border border-slate-100">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Interests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-600" />
              Technical Skills ({user?.skills?.length || 0})
            </h3>
            <button
              onClick={handleOpenEdit}
              className="text-xs text-brand-600 font-semibold hover:underline"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 font-semibold text-xs border border-brand-200 capitalize"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                No technical skills added yet. Add your skills to match with projects!
              </p>
            )}
          </div>
        </div>

        {/* Interests & Domains */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Interests & Domains ({user?.interests?.length || 0})
            </h3>
            <button
              onClick={handleOpenEdit}
              className="text-xs text-brand-600 font-semibold hover:underline"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.interests && user.interests.length > 0 ? (
              user.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-200"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                No interests added yet (e.g. AI, Web Development, Robotics).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Student Profile"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              University / College
            </label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="e.g. Carnegie Mellon University"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="What are your goals, favorite languages, or project experiences?"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, Node.js, Python, MongoDB, Tailwind"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Interests / Domains (Comma separated)
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="Machine Learning, Full-Stack, IoT"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
