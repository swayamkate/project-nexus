import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Nexus',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-center p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-xl shadow-blue-500/10">
        <FileQuestion className="w-12 h-12 text-blue-400" />
      </div>
      <h1 className="text-5xl font-black text-white mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for doesn't exist, has been moved, or you don't have authorization to view it.
      </p>
      <Link href="/" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
