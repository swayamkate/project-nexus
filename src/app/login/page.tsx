'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Loader2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        
        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          // If auto-confirm is on, sign them in directly
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!signInErr) {
            router.push('/dashboard');
            router.refresh();
            return;
          }
          setSuccessMsg('Account created! Please check your email if confirmation is required.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address above to receive a Magic Link.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSuccessMsg('Secure Magic Link dispatched to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send Magic Link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">NEXUS</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">Skill Mission</span>
          </div>
        </Link>

        <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center">
          ← Back to Homepage
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#0a1020]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-black/60 relative">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Skilling Portal</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Trainee Account'}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isLogin 
                ? 'Sign in to access your skills trajectory, certifications, and follow-ups.' 
                : 'Join the privacy-first longitudinal outcome and career progress registry.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs p-3.5 rounded-xl mb-4 text-center leading-snug">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs p-3.5 rounded-xl mb-4 text-center flex items-center justify-center space-x-2 leading-snug">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="trainee@domain.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={handleMagicLink}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isLogin ? 'Sign In to Dashboard' : 'Register Trainee Profile'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-5 mb-5 flex items-center justify-center space-x-3">
            <div className="h-px bg-slate-800/80 flex-1" />
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">or passwordless</span>
            <div className="h-px bg-slate-800/80 flex-1" />
          </div>

          {/* Magic Link Option */}
          <button
            onClick={handleMagicLink}
            disabled={loading}
            type="button"
            className="w-full bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Send One-Click Magic Link</span>
          </button>

          {/* Mode Switcher Footer */}
          <div className="text-center mt-6 pt-5 border-t border-slate-800/60">
            <p className="text-xs text-slate-400">
              {isLogin ? "New to the Skill Mission portal?" : "Already registered?"}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }}
                className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-4 ml-1"
              >
                {isLogin ? 'Create an Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-[11px] text-slate-500 z-10">
        © 2026 Nexus National Skilling Framework. Protected by Zero-PII Cryptographic Enclaves.
      </footer>
    </div>
  );
}
