'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Loader2, ArrowRight, CheckCircle2, Sparkles, Eye, EyeOff, User, AtSign } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        let authEmail = identifier.trim();

        // If user entered a username (no @), look up their email from the trainees table
        if (!authEmail.includes('@')) {
          const { data: trainee, error: lookupErr } = await supabase
            .from('trainees')
            .select('email')
            .eq('username', authEmail.toLowerCase())
            .maybeSingle();

          if (lookupErr || !trainee?.email) {
            throw new Error(`Username "${authEmail}" not found. Please enter your registered email address.`);
          }
          authEmail = trainee.email;
        }

        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (signInErr) {
          if (signInErr.message.includes('Email not confirmed')) {
            throw new Error('Your email address has not been confirmed yet. Please check your inbox for the verification link sent by Resend.');
          }
          throw signInErr;
        }

        router.push('/dashboard');
        router.refresh();
      } else {
        // Validation for registration
        if (!identifier.includes('@')) {
          throw new Error('Please enter a valid email address for account registration.');
        }

        const cleanUsername = (username || identifier.split('@')[0]).trim().toLowerCase();

        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: identifier.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: cleanUsername,
              full_name: fullName.trim() || cleanUsername,
            }
          },
        });

        if (signUpErr) throw signUpErr;

        if (data.session) {
          router.push('/dashboard');
          router.refresh();
        } else {
          setSuccessMsg(`Verification email dispatched to ${identifier}! Please click the confirmation link in your inbox to activate your account.`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication request failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!identifier || !identifier.includes('@')) {
      setError('Please enter a valid email address above to receive a Magic Link.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: identifier.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpErr) throw otpErr;
      setSuccessMsg(`Secure Magic Link sent to ${identifier}. Check your email.`);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch Magic Link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">NEXUS</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">National Skilling Portal</span>
          </div>
        </Link>

        <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center">
          ← Back to Homepage
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#0a1020]/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/70 relative">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill India Mission Registry</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isLogin ? 'Trainee Sign In' : 'Create Trainee Profile'}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isLogin 
                ? 'Sign in with your Email or Username to manage your career trajectory.' 
                : 'Register your longitudinal career progression profile on the national network.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs p-3.5 rounded-xl mb-4 text-center leading-relaxed">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs p-3.5 rounded-xl mb-4 text-center flex items-center justify-center space-x-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                    placeholder="e.g. Avishkar Kedar"
                  />
                </div>
              </div>
            )}

            {/* Username (Sign Up only) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Desired Username</label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                    placeholder="e.g. avishkar2026"
                  />
                </div>
              </div>
            )}

            {/* Email or Username for Login / Email for Sign Up */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {isLogin ? 'Email Address or Username' : 'Registered Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={isLogin ? "text" : "email"}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-900 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder={isLogin ? "trainee@domain.com or username" : "trainee@domain.com"}
                />
              </div>
            </div>

            {/* Password with View Password Toggle */}
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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 text-white text-sm pl-10 pr-11 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-slate-300 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
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
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">or passwordless</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Magic Link */}
          <button
            onClick={handleMagicLink}
            disabled={loading}
            type="button"
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Send One-Click Magic Link</span>
          </button>

          {/* Mode Switcher Footer */}
          <div className="text-center mt-6 pt-5 border-t border-slate-800/80">
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
