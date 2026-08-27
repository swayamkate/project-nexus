import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LayoutDashboard, HelpCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Console Route Not Found | Nexus Admin',
};

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-black text-lg text-white">NEXUS ADMIN</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10">
        <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-3">
          Error 404 • Administrative Path Unresolved
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Control Center Route Not Found
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The requested administrative module, verification batch, or telemetry page does not exist or has been relocated.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/30 text-xs"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Executive Console</span>
        </Link>
      </main>

      <footer className="w-full text-center py-4 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        Nexus Administrative Command Center • Encrypted Session
      </footer>
    </div>
  );
}
