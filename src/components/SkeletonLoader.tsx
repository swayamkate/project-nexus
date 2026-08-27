import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'table-row';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const getBaseClasses = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full w-12 h-12';
      case 'card':
        return 'rounded-2xl h-44 w-full';
      case 'table-row':
        return 'rounded-xl h-14 w-full';
      case 'text':
      default:
        return 'rounded-lg h-4 w-full';
    }
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 ${getBaseClasses()} ${className}`}
    />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-3">{skeletons}</div>;
};

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-36 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};
