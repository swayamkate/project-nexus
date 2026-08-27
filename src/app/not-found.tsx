import Link from 'next/link';
import { FileQuestion, ArrowLeft, Home, HelpCircle, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | MahaSkill Track',
  description: 'The requested resource could not be found in the Maharashtra Skilling Registry.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-none">MahaSkill Track</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">Govt of Maharashtra</span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10">
        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-xl shadow-blue-500/10">
          <FileQuestion className="w-10 h-10 text-blue-400" />
        </div>
        
        <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-3">
          Error 404 • Resource Not Located
        </span>
        
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Page Not Found in Registry
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The registry page, trainee record, or link you are looking for does not exist, has been archived, or was moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/30 cursor-pointer text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Go to Trainee Dashboard</span>
          </Link>
          
          <Link 
            href="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-5 py-3 rounded-xl font-bold transition cursor-pointer text-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support Center</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        Maharashtra State Skill Development Society (MSSDS) • Zero-PII Protected
      </footer>
    </div>
  );
}
