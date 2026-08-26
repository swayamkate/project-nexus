'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Mail, Lock, Loader2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Try Superadmin Environment Variable Authentication
      const saRes = await fetch('/api/auth/superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (saRes.ok) {
        router.push('/');
        router.refresh();
        return;
      }

      // 2. Try standard Supabase Auth (for created sub-admins)
      const { error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (sbError) throw new Error('Invalid administrative credentials.');
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-none">NEXUS ADMIN</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">Control Center</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Restricted Access</span>
        </div>
      </header>

      {/* Admin Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#0a1020]/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight">Administrative Sign In</h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Superadmin & System Operator Access Portal
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3.5 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Admin Email / Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="admin@nexus.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Authenticate & Enter Console</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center py-5 text-[11px] text-slate-500 z-10">
        Unauthorized access attempts are logged and monitored.
      </footer>
    </div>
  );
}
