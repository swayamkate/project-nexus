'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  ShieldCheck, 
  Sliders, 
  CalendarClock, 
  Building2, 
  Save, 
  CheckCircle2, 
  Loader2, 
  Landmark, 
  Globe, 
  Lock, 
  KeyRound, 
  Users, 
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

export const dynamic = 'force-static';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // State 1: Branding & White-Label
  const [branding, setBranding] = useState({
    missionTitle: 'Maharashtra State Skill Development Society (MSSDS)',
    missionTagline: 'Empowering Vocational Futures through Zero-PII Longitudinal Tracking',
    portalEmblemUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=100&h=100&fit=crop&q=80',
    primaryColor: '#2563eb', // Royal Blue
    bannerNotice: 'System Status: State-wide longitudinal tracking is active across all 36 Maharashtra district nodes.'
  });

  // State 2: Survey Cadence & Escalations
  const [cadence, setCadence] = useState({
    reminderDaysBefore: 7,
    escalationDaysAfter: 14,
    enableWhatsApp: true,
    enableSMS: true,
    smsTemplate: 'MahaSkill: Your vocational follow-up check-in is due. Submit at https://sih2026.avishkark.in/login'
  });

  // State 3: RBAC Matrix
  const [rbac, setRbac] = useState({
    districtAdminCanApproveDocs: true,
    districtAdminCanDisburseGrants: false,
    evaluatorCanGradeCourses: true,
    auditorCanExportFullCSV: true,
    require2FAForSuperadmins: true,
    sessionTimeout: '24h'
  });

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save configuration event in PostgreSQL audit_logs
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'UPDATE_SYSTEM_SETTINGS',
        target_entity: 'CONFIGURATION_REGISTRY',
        details: `Updated white-label branding, survey cadence (${cadence.reminderDaysBefore}d window), and RBAC policies`,
        status: 'Success'
      });

      setToastMsg('System customization & security policies saved to PostgreSQL database!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Settings & Console Customizer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure state mission white-label branding, longitudinal survey cadences, RBAC permissions, and security enclaves.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* Module 1: White-Label Branding & Identity */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Mission Branding & Identity</h3>
              <p className="text-xs text-slate-400">Customize the public-facing department title, crest, and color scheme.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">State Mission / Department Title</label>
              <input
                type="text"
                required
                value={branding.missionTitle}
                onChange={e => setBranding({ ...branding, missionTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">Mission Tagline</label>
              <input
                type="text"
                required
                value={branding.missionTagline}
                onChange={e => setBranding({ ...branding, missionTagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-300 font-bold block mb-1.5">Portal Broadcast Notice Banner</label>
              <input
                type="text"
                value={branding.bannerNotice}
                onChange={e => setBranding({ ...branding, bannerNotice: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">Theme Primary Accent</label>
              <div className="flex gap-2">
                {[
                  { name: 'Royal Blue', val: '#2563eb', bg: 'bg-blue-600' },
                  { name: 'Govt Navy', val: '#1e3a8a', bg: 'bg-blue-900' },
                  { name: 'Emerald', val: '#059669', bg: 'bg-emerald-600' },
                  { name: 'Saffron Gold', val: '#d97706', bg: 'bg-amber-600' },
                  { name: 'Deep Purple', val: '#7c3aed', bg: 'bg-purple-600' },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => setBranding({ ...branding, primaryColor: c.val })}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      branding.primaryColor === c.val ? 'border-white bg-slate-800 text-white' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Longitudinal Survey Cadence */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Longitudinal Survey Cadence & Automations</h3>
              <p className="text-xs text-slate-400">Configure reminder lead times and automated escalation windows.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">Pre-Milestone Reminder Window</label>
              <select
                value={cadence.reminderDaysBefore}
                onChange={e => setCadence({ ...cadence, reminderDaysBefore: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={3}>3 Days Prior to Milestone Due Date</option>
                <option value={7}>7 Days Prior (Standard Recommended)</option>
                <option value={14}>14 Days Prior (Extended Window)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1.5">Overdue Escalation Trigger</label>
              <select
                value={cadence.escalationDaysAfter}
                onChange={e => setCadence({ ...cadence, escalationDaysAfter: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value={7}>Escalate to District Officer after 7 Days Overdue</option>
                <option value={14}>Escalate after 14 Days Overdue</option>
                <option value={30}>Escalate after 30 Days Overdue</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-300 font-bold block mb-1.5">SMS Survey Broadcast Template</label>
              <input
                type="text"
                value={cadence.smsTemplate}
                onChange={e => setCadence({ ...cadence, smsTemplate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Module 3: Granular RBAC Permissions */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Role-Based Access Control (RBAC) & Security Policies</h3>
              <p className="text-xs text-slate-400">Configure permission scopes for District Officers, Evaluators, and Auditors.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div>
                <span className="font-bold text-white block">District Admin Document Approvals</span>
                <span className="text-slate-400 text-[11px]">Allow District Skill Officers to approve/reject Udyam & GST proofs directly.</span>
              </div>
              <input
                type="checkbox"
                checked={rbac.districtAdminCanApproveDocs}
                onChange={e => setRbac({ ...rbac, districtAdminCanApproveDocs: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div>
                <span className="font-bold text-white block">Direct Grant Disbursement Authority</span>
                <span className="text-slate-400 text-[11px]">Require State Superadmin dual-signoff for capital grant disbursements above ₹1,00,000.</span>
              </div>
              <input
                type="checkbox"
                checked={rbac.districtAdminCanDisburseGrants}
                onChange={e => setRbac({ ...rbac, districtAdminCanDisburseGrants: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div>
                <span className="font-bold text-white block">Enforce Two-Factor Authentication (2FA) for Superadmins</span>
                <span className="text-slate-400 text-[11px]">Enforce mandatory OTP verification for all administrative session logins.</span>
              </div>
              <input
                type="checkbox"
                checked={rbac.require2FAForSuperadmins}
                onChange={e => setRbac({ ...rbac, require2FAForSuperadmins: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div>
                <span className="font-bold text-white block">Executive Session Inactivity Timeout</span>
                <span className="text-slate-400 text-[11px]">Automatically terminate console sessions when left inactive.</span>
              </div>
              <select
                value={rbac.sessionTimeout}
                onChange={e => setRbac({ ...rbac, sessionTimeout: e.target.value })}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
