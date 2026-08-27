'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { formatHumanError } from '@/lib/errorUtils';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Console Error:', error);
  }, [error]);

  const humanFriendlyMsg = formatHumanError(error);

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto z-10">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-3">
          Error 500 • Administrative Exception
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
          Executive Operation Error
        </h1>

        <p className="text-slate-300 text-xs mb-6 leading-relaxed bg-[#0a1020] p-4 rounded-2xl border border-slate-800">
          {humanFriendlyMsg}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition text-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Operation</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-5 py-2.5 rounded-xl font-bold transition text-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      <footer className="w-full text-center py-4 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        State Skilling Administration Gateway
      </footer>
    </div>
  );
}
