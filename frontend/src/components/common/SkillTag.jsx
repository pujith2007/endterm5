import React from 'react';
import { Check } from 'lucide-react';

const SkillTag = ({ name, isMatch = false, isMissing = false, size = 'sm' }) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (isMatch) {
    styleClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
  } else if (isMissing) {
    styleClasses = 'bg-slate-50 text-slate-600 border-dashed border-slate-300';
  }

  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${styleClasses} ${sizeClasses} capitalize transition-colors`}
    >
      {isMatch && <Check className="w-3 h-3 text-emerald-600" />}
      {name}
    </span>
  );
};

export default SkillTag;
