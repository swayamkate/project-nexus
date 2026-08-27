'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { formatHumanError } from '@/lib/errorUtils';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('MahaSkill Application Runtime Error:', error);
  }, [error]);

  const humanFriendlyMsg = formatHumanError(error);

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto z-10">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/10 text-red-400">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-3">
          Error 500 • System Exception
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Something Didn't Go As Planned
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          {humanFriendlyMsg}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/30 cursor-pointer text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-5 py-3 rounded-xl font-bold transition cursor-pointer text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>

      <footer className="w-full text-center py-6 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        Maharashtra State Skill Development Society (MSSDS) • Error telemetry logged
      </footer>
    </div>
  );
}
