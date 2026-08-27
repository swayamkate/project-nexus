'use client';

import React from 'react';
import { LucideIcon, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  badge?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  badge,
  className = '',
}) => {
  return (
    <div className={`w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Decorative Icon Enclave */}
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50/80 border border-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm shadow-blue-500/10">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 stroke-[1.75]" />
        </div>
        {badge && (
          <span className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full shadow-xs">
            {badge}
          </span>
        )}
      </div>

      {/* Title & Explanatory Text */}
      <div className="max-w-md space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
