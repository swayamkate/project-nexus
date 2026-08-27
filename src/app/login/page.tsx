'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient, createPublicClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  User, 
  AtSign,
  KeyRound,
  RotateCcw,
  ChevronLeft,
  GraduationCap,
  Shield,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { formatHumanError } from '@/lib/errorUtils';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Auth flow mode: 'login' | 'signup' | 'otp_verify'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp_verify'>('login');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const supabase = createClient();
  const publicSupabase = createPublicClient();

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (authMode === 'otp_verify' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authMode, resendCooldown]);

  const handleLogin = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let authEmail = identifier.trim();

      // If user entered a username (no @), look up their email via secure RPC
      if (!authEmail.includes('@')) {
        const { data: lookedUpEmail, error: lookupErr } = await supabase.rpc('get_trainee_email_by_username', {
          p_username: authEmail.toLowerCase()
        });

        if (lookupErr || !lookedUpEmail) {
          throw new Error(`Username "${authEmail}" not found. Please enter your registered email address.`);
        }
        authEmail = lookedUpEmail;
      }

      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (signInErr) {
        if (signInErr.message.includes('Email not confirmed')) {
          setOtpEmail(authEmail);
          setAuthMode('otp_verify');
          setResendCooldown(60);
          setCanResend(false);
          throw new Error('Your email address has not been confirmed yet. We have opened the OTP verification screen for you.');
        }
        throw signInErr;
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!identifier.includes('@')) {
        throw new Error('Please enter a valid email address for account registration.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please verify and retype your password.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const cleanUsername = (username || identifier.split('@')[0]).trim().toLowerCase();
      const cleanEmail = identifier.trim().toLowerCase();

      // 1. Check if username is already taken via secure RPC
      const { data: isAvailable, error: checkErr } = await publicSupabase.rpc('is_username_available', {
        p_username: cleanUsername
      });

      // A failed availability check is an infrastructure/configuration error,
      // not evidence that the requested username exists. Treating every RPC
      // error as "taken" made all usernames look unavailable when the
      // migration was missing or the API returned 401/404.
      if (checkErr) {
        throw new Error('We could not check username availability right now. Please try again in a moment.');
      }

      if (isAvailable === false) {
        throw new Error(`Username "${cleanUsername}" is already taken. Please choose another username.`);
      }

      // 2. Call Supabase SignUp (dispatches confirmation email via Resend SMTP)
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
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
        window.location.href = '/dashboard';
      } else {
        setOtpEmail(cleanEmail);
        setAuthMode('otp_verify');
        setResendCooldown(60);
        setCanResend(false);
        setSuccessMsg(`Verification code sent to ${cleanEmail}! Enter the 6-digit code below.`);
      }
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((char, idx) => {
        if (idx < 6) updated[idx] = char;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const token = otpDigits.join('').trim();
    if (token.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let verifyRes = await supabase.auth.verifyOtp({
        email: otpEmail,
        token,
        type: 'signup'
      });

      if (verifyRes.error) {
        verifyRes = await supabase.auth.verifyOtp({
          email: otpEmail,
          token,
          type: 'email'
        });
      }

      if (verifyRes.error) {
        throw new Error(verifyRes.error.message || 'Invalid or expired OTP code. Please check your inbox or request a new code.');
      }

      setSuccessMsg('Account verified successfully! Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !otpEmail) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: otpEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (resendErr) throw resendErr;

      setSuccessMsg(`Fresh verification code sent to ${otpEmail}!`);
      setResendCooldown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!identifier || !identifier.includes('@')) {
      setError('Please enter a valid email address to receive a One-Click Magic Link.');
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
      setSuccessMsg(`Secure Magic Link dispatched to ${identifier}. Check your email.`);
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier || !identifier.includes('@')) {
      setError('Please enter your registered email address in the field above to receive password reset instructions.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(identifier.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (resetErr) throw resetErr;
      setSuccessMsg(`Password reset instructions dispatched to ${identifier}. Please check your email inbox.`);
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative">
      
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition flex-shrink-0">
            <span className="text-white font-black text-xl tracking-tighter">N</span>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">Nexus</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Skilling & Career Intelligence</span>
          </div>
        </Link>

        <Link 
          href="/" 
          className="text-xs font-bold text-slate-500 hover:text-blue-600 transition flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60 relative">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Nexus Candidate Portal</span>
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'login' && 'Sign In to Your Account'}
              {authMode === 'signup' && 'Create Trainee Profile'}
              {authMode === 'otp_verify' && 'Verify 6-Digit Code'}
            </h1>
            
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {authMode === 'login' && 'Access your longitudinal certifications, follow-ups, and career progression.'}
              {authMode === 'signup' && 'Register your verified profile on Maharashtra’s longitudinal skilling grid.'}
              {authMode === 'otp_verify' && `We sent an activation code to ${otpEmail}`}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          {authMode !== 'otp_verify' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                  authMode === 'login' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                  authMode === 'signup' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl mb-4 text-center font-medium leading-relaxed">
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-xl mb-4 text-center font-medium flex items-center justify-center space-x-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* --- VIEW 1: SIGN IN --- */}
          {authMode === 'login' && (
            <form 
              onSubmit={handleLogin} 
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400 font-medium"
                    placeholder="user@nexus.in or username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400 font-medium"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sign In to Dashboard</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* --- VIEW 2: SIGN UP --- */}
          {authMode === 'signup' && (
            <form 
              onSubmit={handleSignUp} 
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Desired Username</label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400 font-mono"
                    placeholder="priya_sharma"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400"
                    placeholder="yourname@nexus.in"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Create Password (min 6 chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition placeholder:text-slate-400"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed mt-3 cursor-pointer text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Register & Send Verification Code</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* --- VIEW 3: OTP VERIFICATION --- */}
          {authMode === 'otp_verify' && (
            <form 
              onSubmit={handleVerifyOtp} 
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600 font-semibold">Enter the 6-digit activation code sent to your email</p>
              </div>

              {/* 6 Monospace Input Boxes */}
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-mono"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => handleVerifyOtp(e)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Verify & Activate Profile</span>
                {!loading && <CheckCircle2 className="w-4 h-4" />}
              </button>

              {/* Resend Actions */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                  className="flex items-center space-x-1 hover:text-slate-800 transition cursor-pointer font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  className={`flex items-center space-x-1 font-bold ${
                    canResend ? 'text-blue-600 hover:text-blue-700 cursor-pointer' : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}</span>
                </button>
              </div>
            </form>
          )}

          {/* Passwordless Magic Link Button */}
          {authMode === 'login' && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={handleMagicLink}
                disabled={loading}
                type="button"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Send One-Click Magic Link to Email</span>
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-slate-400 z-10 border-t border-slate-200/60 bg-white/60">
        © {new Date().getFullYear()} Nexus. All rights reserved.
      </footer>
    </div>
  );
}
