'use client';

import React from 'react';
import { LucideIcon, Sparkles, Plus } from 'lucide-react';

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  badge?: string;
  className?: string;
}

export const EmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  badge,
  className = '',
}) => {
  return (
    <div className={`w-full bg-[#0a1020]/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 stroke-[1.75]" />
        </div>
        {badge && (
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-extrabold rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
