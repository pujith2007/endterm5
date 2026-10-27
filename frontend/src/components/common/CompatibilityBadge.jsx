import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const CompatibilityBadge = ({ percentage, size = 'md' }) => {
  if (percentage === undefined || percentage === null) return null;

  const num = Number(percentage);

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (num >= 75) {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-500/10';
    dotColor = 'bg-emerald-500';
  } else if (num >= 40) {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (num > 0) {
    bgClass = 'bg-blue-50 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-500';
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3 py-1.5 text-sm font-bold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClasses} transition-all`}
      title={`Calculated compatibility based on your profile skills: ${num}%`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <Sparkles className="w-3 h-3 opacity-70" />
      <span>{num}% Match</span>
    </span>
  );
};

export default CompatibilityBadge;
