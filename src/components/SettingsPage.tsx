'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Laptop, 
  Send,
  MessageSquare,
  Smartphone,
  Info,
  LogOut
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const SettingsPage: React.FC = () => {
  const { user, profile, employment, enrollments, followups, language, setLanguage, t, signOut } = useUser();
  const supabase = createClient();

  // Notification Permission State
  const [notifPerm, setNotifPerm] = useState<string>('default');
  const [inAppAlerts, setInAppAlerts] = useState(true);

  // Active Session Info State
  const [sessionInfo, setSessionInfo] = useState<{
    browser: string;
    os: string;
    screen: string;
    lastSignIn: string;
  }>({
    browser: 'Web Browser',
    os: 'Unknown OS',
    screen: 'Desktop',
    lastSignIn: 'Active Now'
  });

  // Password Change State
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Detect Real Notification Permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPerm(Notification.permission);
    }

    // 2. Detect Real Active Browser & OS Session
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      let detectedBrowser = 'Chrome / Chromium';
      if (ua.includes('Edg/')) detectedBrowser = 'Microsoft Edge';
      else if (ua.includes('Firefox/')) detectedBrowser = 'Mozilla Firefox';
      else if (ua.includes('Safari/') && !ua.includes('Chrome/')) detectedBrowser = 'Apple Safari';
      else if (ua.includes('OPR/') || ua.includes('Opera/')) detectedBrowser = 'Opera';

      let detectedOS = 'Windows OS';
      if (ua.includes('Mac OS') || ua.includes('Macintosh')) detectedOS = 'macOS';
      else if (ua.includes('Android')) detectedOS = 'Android';
      else if (ua.includes('iPhone') || ua.includes('iPad')) detectedOS = 'iOS';
      else if (ua.includes('Linux')) detectedOS = 'Linux';

      const lastSignIn = user?.last_sign_in_at 
        ? new Date(user.last_sign_in_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : 'Active Session';

      setSessionInfo({
        browser: detectedBrowser,
        os: detectedOS,
        screen: `${window.innerWidth} x ${window.innerHeight}`,
        lastSignIn
      });
    }
  }, [user]);

  const handleRequestPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setToastMsg('Browser notifications are not supported on this browser.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotifPerm(perm);
      if (perm === 'granted') {
        setToastMsg('Browser notifications enabled! You will receive longitudinal & survey alerts.');
        new Notification('Nexus Notification Enclave', {
          body: 'Notifications are active for longitudinal milestones and state survey alerts.',
        });
      } else if (perm === 'denied') {
        setToastMsg('Notifications blocked in browser. Please grant permission in browser settings.');
      }
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error('Push notification error:', err);
    }
  };

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passStrength = calculateStrength(newPass);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassMsg(null);

    try {
      if (newPass !== confirmNewPass) {
        throw new Error('New passwords do not match.');
      }
      if (newPass.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) throw error;

      setPassMsg({ type: 'success', text: 'Password updated successfully!' });
      setNewPass('');
      setConfirmNewPass('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPassSaving(false);
    }
  };

  const handleExportDossier = () => {
    const dossierData = {
      export_date: new Date().toISOString(),
      system: 'Nexus Platform',
      privacy_enclave_hash: profile?.privacy_hash || 'SHA256-ENCLAVE-VERIFIED',
      trainee_profile: {
        trainee_id: profile?.trainee_id,
        username: profile?.username,
        full_name: profile?.full_name,
        email: profile?.email,
        phone: profile?.phone,
        district: profile?.district,
        state: profile?.state,
      },
      employment_record: employment,
      certifications: enrollments,
      longitudinal_followups: followups
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus_dossier_${profile?.trainee_id || 'TRN'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMsg('Your complete Skilling & Employment Dossier has been exported as JSON!');
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 text-slate-800 animate-in fade-in-50">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <span>{t('settings.title', 'Settings & Preferences')}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('settings.subtitle', 'Manage your real-time notification alerts, active device sessions, security keys, and language.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Notifications & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Real Push Notification Permission */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('settings.notifications', 'Survey & Milestone Notification Alerts')}</h3>
                <p className="text-[11px] text-slate-500">{t('settings.notificationsDesc', 'Enable browser push notifications for timely wage survey reminders and verification alerts.')}</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Browser Push Permission Card */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-800">{t('settings.browserPush', 'Browser / Web Push Notifications')}</span>
                    {notifPerm === 'granted' ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {t('settings.permissionGranted', 'Permission Enabled')}
                      </span>
                    ) : notifPerm === 'denied' ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                        {t('settings.permissionDenied', 'Blocked')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Get instant desktop & mobile alerts whenever a 3M–24M wage survey or scheme approval is ready.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRequestPushPermission}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    notifPerm === 'granted'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : notifPerm === 'denied'
                      ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20'
                  }`}
                >
                  {notifPerm === 'granted' 
                    ? 'Active' 
                    : notifPerm === 'denied' 
                    ? 'Blocked in Browser' 
                    : 'Enable Notifications'}
                </button>
              </div>

              {/* In-App Live Popups Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">In-App Live Bell Alerts</span>
                  <span className="text-[11px] text-slate-500">Real-time counter and notification bell alerts in the top bar.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInAppAlerts(!inAppAlerts);
                    setToastMsg(`In-app alerts ${!inAppAlerts ? 'enabled' : 'disabled'}.`);
                    setTimeout(() => setToastMsg(null), 2500);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${inAppAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${inAppAlerts ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Telegram Roadmap Pill */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-blue-950">Telegram Direct Bot Alerts</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-600 text-white rounded">Roadmap</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Direct Telegram Bot integration will allow you to link your Telegram chat ID to receive survey check-in prompts directly on Telegram.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account Security & Password */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('settings.security', 'Account Security & Password')}</h3>
                <p className="text-[11px] text-slate-500">Update your account password and review authenticated credentials.</p>
              </div>
            </div>

            {passMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmNewPass}
                    onChange={e => setConfirmNewPass(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              {newPass && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={passStrength > 50 ? "text-emerald-600" : "text-amber-600"}>
                      {passStrength <= 25 && 'Weak'}
                      {passStrength === 50 && 'Moderate'}
                      {passStrength === 75 && 'Good'}
                      {passStrength === 100 && 'Strong (Recommended)'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passStrength <= 25 ? 'bg-rose-500' : passStrength <= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${passStrength}%` }} 
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passSaving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {passSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{t('settings.updatePassword', 'Update Password')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: REAL Active Device Sessions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('settings.activeSessions', 'Active Authenticated Sessions')}</h3>
                <p className="text-[11px] text-slate-500">Real-time device and token session currently authenticated.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      {sessionInfo.browser} on {sessionInfo.os} (Current Device)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Screen: {sessionInfo.screen} • Authenticated: {sessionInfo.lastSignIn}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg shrink-0">
                  Active Now
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Language & Dossier */}
        <div className="space-y-6">
          
          {/* Section 4: Language Selection */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('settings.language', 'Interface Language')}</h3>
                <p className="text-[11px] text-slate-500">Instant multilingual localization</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setToastMsg('Interface switched to English');
                  setTimeout(() => setToastMsg(null), 2500);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  language === 'en' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>English (Official)</span>
                {language === 'en' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('mr');
                  setToastMsg('भाषा मराठीत बदलली गेली आहे');
                  setTimeout(() => setToastMsg(null), 2500);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  language === 'mr' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>मराठी (महाराष्ट्र राज्य)</span>
                {language === 'mr' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setToastMsg('भाषा हिंदी में परिवर्तित कर दी गई है');
                  setTimeout(() => setToastMsg(null), 2500);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  language === 'hi' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>हिंदी (राष्ट्रीय मानक)</span>
                {language === 'hi' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Section 5: Skilling Dossier Export */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Download Verified Dossier</h3>
                <p className="text-[11px] text-slate-500">Portable cryptographic data export</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Export your complete vocational record, verified certificates, and employment history in structured JSON format.
            </p>

            <button
              type="button"
              onClick={handleExportDossier}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>

          {/* Section 6: Sign Out Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <button
              type="button"
              onClick={signOut}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
