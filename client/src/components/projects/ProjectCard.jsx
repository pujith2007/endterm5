import React from 'react';
import { Link } from 'react-router-dom';
import CompatibilityBadge from '../common/CompatibilityBadge';
import SkillTag from '../common/SkillTag';
import { Users, ArrowRight, Layers, CheckCircle } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const {
    _id,
    title,
    description,
    category,
    requiredSkills = [],
    techStack = [],
    maxMembers = 4,
    members = [],
    status = 'Recruiting',
    owner,
    compatibility,
    matchingSkills = [],
  } = project;

  const currentMembers = members.length;
  const isFull = currentMembers >= maxMembers;

  const getStatusBadge = () => {
    switch (status) {
      case 'Recruiting':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner / Tags */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {category}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge()}`}
            >
              {status}
            </span>
          </div>

          {/* Smart Skill Compatibility */}
          {compatibility !== undefined && compatibility !== null && (
            <CompatibilityBadge percentage={compatibility} size="sm" />
          )}
        </div>

        {/* Title */}
        <Link to={`/projects/${_id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Skills required */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 4).map((skill, idx) => {
              const isMatch = matchingSkills.some(
                (m) => m.toLowerCase() === skill.toLowerCase()
              );
              return <SkillTag key={idx} name={skill} isMatch={isMatch} size="xs" />;
            })}
            {requiredSkills.length > 4 && (
              <span className="text-xs text-slate-600 px-1.5 py-0.5 font-medium">
                +{requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        {/* Owner Info */}
        <div className="flex items-center gap-2.5">
          <img
            src={
              owner?.avatarUrl ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${owner?.name || 'Owner'}`
            }
            alt={owner?.name}
            className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {owner?.name || 'Student'}
            </span>
            <span className="text-[10px] text-slate-600 truncate max-w-[110px]">
              {owner?.college || 'University'}
            </span>
          </div>
        </div>

        {/* Members count & Link */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              isFull ? 'text-amber-600' : 'text-slate-600'
            }`}
            title={`${currentMembers} of ${maxMembers} team slots filled`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {currentMembers}/{maxMembers}
            </span>
          </div>

          <Link
            to={`/projects/${_id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
