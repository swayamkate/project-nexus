'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Settings,
  Palette,
  ShieldCheck,
  CalendarClock,
  Save,
  CheckCircle2,
  Loader2,
  Globe,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Building2,
  ToggleLeft,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  DEFAULT_SETTINGS,
  SETTING_TYPES,
  type SettingKey,
  type SettingsMap,
} from '@/lib/platformSettings';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
};

const inputClass =
  'w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500';

function SectionCard({ icon, title, subtitle, children }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, dirty, onRevert, children }: {
  label: string;
  hint?: string;
  dirty?: boolean;
  onRevert?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-slate-300 font-bold text-xs">{label}</label>
        {dirty && onRevert && (
          <button
            type="button"
            onClick={onRevert}
            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> reset
          </button>
        )}
      </div>
      {children}
      {hint && <p className="text-[10px] text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsMap>({ ...DEFAULT_SETTINGS });
  const [loaded, setLoaded] = useState(false);
  const [dirtyKeys, setDirtyKeys] = useState<Set<SettingKey>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warn'; text: string } | null>(null);
  const [migrationPending, setMigrationPending] = useState(false);

  const showToast = useCallback((type: 'success' | 'error' | 'warn', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
          setMigrationPending(Boolean(data.migrationPending));
        } else {
          showToast('error', data.error || 'Failed to load settings.');
        }
      } catch {
        if (active) showToast('error', 'Network error while loading settings.');
      } finally {
        if (active) {
          setLoading(false);
          setLoaded(true);
        }
      }
    };
    load();
    return () => { active = false; };
  }, [showToast]);

  const setSetting = <K extends SettingKey>(key: K, value: SettingsMap[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setDirtyKeys(prev => new Set(prev).add(key));
  };

  const revertKey = (key: SettingKey) => {
    setSettings(prev => ({ ...prev, [key]: DEFAULT_SETTINGS[key] }));
    setDirtyKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSave = async () => {
    if (dirtyKeys.size === 0) {
      showToast('warn', 'No changes to save.');
      return;
    }
    setSaving(true);
    try {
      const patch: Record<string, unknown> = {};
      dirtyKeys.forEach(key => { patch[key] = settings[key]; });

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: patch }),
      });
      const data = await res.json();

      if (!res.ok) {
        const detail = Array.isArray(data.validationErrors) && data.validationErrors.length
          ? ` (${data.validationErrors.join('; ')})`
          : '';
        showToast('error', (data.error || 'Save failed.') + detail);
        return;
      }

      if (Array.isArray(data.validationErrors) && data.validationErrors.length) {
        showToast('warn', `Saved, but rejected: ${data.validationErrors.join('; ')}`);
      } else {
        showToast('success', `Saved ${data.savedKeys?.length ?? dirtyKeys.size} settings to the database.`);
      }
      setDirtyKeys(new Set());
    } catch {
      showToast('error', 'Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const featureKeys = (Object.keys(SETTING_TYPES) as SettingKey[]).filter(k => k.startsWith('features.'));

  const isDirty = (key: SettingKey) => dirtyKeys.has(key);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 space-x-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-bold">Loading platform configuration…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top text-xs font-bold text-white ${
            toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'warn' ? 'bg-amber-600' : 'bg-rose-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span className="max-w-md">{toast.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Settings & Console Customizer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Every value here persists to the <code className="text-blue-400">platform_settings</code> table and is consumed live by both portals.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || dirtyKeys.size === 0}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving…' : dirtyKeys.size ? `Save ${dirtyKeys.size} change${dirtyKeys.size > 1 ? 's' : ''}` : 'Saved'}</span>
        </button>
      </div>

      {migrationPending && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <b>Migration pending:</b> the <code>platform_settings</code> table was not found on the database, so defaults are shown and saving is disabled.
            Apply <code>src/db/migrations/006_platform_settings.sql</code> on the server, then reload this page.
          </div>
        </div>
      )}

      {/* General */}
      <SectionCard icon={<Building2 className="w-5 h-5" />} title="General Identity" subtitle="Public name, tagline, and support contact used across both portals.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Platform Name" dirty={isDirty('general.app_name')} onRevert={() => revertKey('general.app_name')}>
            <input type="text" className={inputClass} value={settings['general.app_name']}
              onChange={e => setSetting('general.app_name', e.target.value)} />
          </Field>
          <Field label="Support Email" dirty={isDirty('general.support_email')} onRevert={() => revertKey('general.support_email')}>
            <input type="email" className={inputClass} value={settings['general.support_email']}
              onChange={e => setSetting('general.support_email', e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Tagline" dirty={isDirty('general.tagline')} onRevert={() => revertKey('general.tagline')}>
              <input type="text" className={inputClass} value={settings['general.tagline']}
                onChange={e => setSetting('general.tagline', e.target.value)} />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* Branding */}
      <SectionCard icon={<Palette className="w-5 h-5" />} title="White-Label Branding & Console Theme" subtitle="Colors, theme mode, and messaging applied live to the admin console and the public trainee portal.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="Console Theme Mode" hint="Select preferred UI theme. Default is System (auto-matches OS dark/light mode).">
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    theme === 'system'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>System ({resolvedTheme})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </Field>
          </div>

          <Field label="Primary Color" hint="Applied as --brand-primary CSS variable." dirty={isDirty('branding.primary_color')} onRevert={() => revertKey('branding.primary_color')}>
            <div className="flex items-center space-x-3">
              <input type="color" value={settings['branding.primary_color']} className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                onChange={e => setSetting('branding.primary_color', e.target.value)} />
              <input type="text" className={inputClass} value={settings['branding.primary_color']}
                onChange={e => setSetting('branding.primary_color', e.target.value)} />
            </div>
          </Field>
          <Field label="Accent Color" hint="Applied as --brand-accent CSS variable." dirty={isDirty('branding.accent_color')} onRevert={() => revertKey('branding.accent_color')}>
            <div className="flex items-center space-x-3">
              <input type="color" value={settings['branding.accent_color']} className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                onChange={e => setSetting('branding.accent_color', e.target.value)} />
              <input type="text" className={inputClass} value={settings['branding.accent_color']}
                onChange={e => setSetting('branding.accent_color', e.target.value)} />
            </div>
          </Field>
          <div className="md:col-span-2">
            <Field label="Login Page Headline" dirty={isDirty('branding.login_headline')} onRevert={() => revertKey('branding.login_headline')}>
              <input type="text" className={inputClass} value={settings['branding.login_headline']}
                onChange={e => setSetting('branding.login_headline', e.target.value)} />
            </Field>
          </div>
          <Field label="Broadcast Banner" dirty={isDirty('branding.banner_enabled')} onRevert={() => revertKey('branding.banner_enabled')}>
            <button type="button" onClick={() => setSetting('branding.banner_enabled', !settings['branding.banner_enabled'])}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                settings['branding.banner_enabled']
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
              <ToggleLeft className={`w-4 h-4 ${settings['branding.banner_enabled'] ? 'rotate-180' : ''}`} />
              <span>{settings['branding.banner_enabled'] ? 'Enabled on public portal' : 'Disabled'}</span>
            </button>
          </Field>
          <Field label="Banner Message" hint="Shown site-wide when the banner is enabled." dirty={isDirty('branding.banner_text')} onRevert={() => revertKey('branding.banner_text')}>
            <input type="text" className={inputClass} placeholder="e.g. Scheduled maintenance on Sunday 02:00 IST"
              value={settings['branding.banner_text']} onChange={e => setSetting('branding.banner_text', e.target.value)} />
          </Field>
        </div>
      </SectionCard>

      {/* Localization */}
      <SectionCard icon={<Globe className="w-5 h-5" />} title="Localization" subtitle="Languages offered in the trainee portal and the default fallback.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Enabled Languages" dirty={isDirty('localization.enabled_languages')} onRevert={() => revertKey('localization.enabled_languages')}>
            <div className="flex flex-wrap gap-2">
              {(['en', 'hi', 'mr'] as const).map(code => {
                const active = settings['localization.enabled_languages'].includes(code);
                return (
                  <button key={code} type="button"
                    onClick={() => {
                      const current = settings['localization.enabled_languages'];
                      if (active && current.length === 1) return;
                      setSetting('localization.enabled_languages',
                        active ? current.filter(c => c !== code) : [...current, code].sort());
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                      active ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                    {LANGUAGE_LABELS[code]}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Default Language" dirty={isDirty('localization.default_language')} onRevert={() => revertKey('localization.default_language')}>
            <select className={inputClass} value={settings['localization.default_language']}
              onChange={e => setSetting('localization.default_language', e.target.value as 'en' | 'hi' | 'mr')}>
              {settings['localization.enabled_languages'].map(code => (
                <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* Survey cadence */}
      <SectionCard icon={<CalendarClock className="w-5 h-5" />} title="Longitudinal Survey Cadence" subtitle="Milestones, reminder/escalation windows, and dispatch channels for follow-up surveys.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Milestones (months after placement)" hint="Comma-separated, e.g. 3, 6, 12, 24." dirty={isDirty('surveys.milestones_months')} onRevert={() => revertKey('surveys.milestones_months')}>
            <input type="text" className={inputClass}
              value={settings['surveys.milestones_months'].join(', ')}
              onChange={e => {
                const parsed = e.target.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n) && n > 0);
                setSetting('surveys.milestones_months', parsed);
              }} />
          </Field>
          <Field label="Reminder Window (days before milestone)" dirty={isDirty('surveys.reminder_days_before')} onRevert={() => revertKey('surveys.reminder_days_before')}>
            <input type="number" min={0} max={60} className={inputClass} value={settings['surveys.reminder_days_before']}
              onChange={e => setSetting('surveys.reminder_days_before', parseInt(e.target.value, 10) || 0)} />
          </Field>
          <Field label="Escalation Window (days after missed milestone)" dirty={isDirty('surveys.escalation_days_after')} onRevert={() => revertKey('surveys.escalation_days_after')}>
            <input type="number" min={1} max={90} className={inputClass} value={settings['surveys.escalation_days_after']}
              onChange={e => setSetting('surveys.escalation_days_after', parseInt(e.target.value, 10) || 1)} />
          </Field>
          <Field label="SMS Template" hint="{name} and {portal} placeholders are substituted at dispatch time." dirty={isDirty('surveys.sms_template')} onRevert={() => revertKey('surveys.sms_template')}>
            <input type="text" className={inputClass} value={settings['surveys.sms_template']}
              onChange={e => setSetting('surveys.sms_template', e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button type="button" onClick={() => setSetting('surveys.enable_whatsapp', !settings['surveys.enable_whatsapp'])}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                settings['surveys.enable_whatsapp'] ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
              WhatsApp Dispatch: {settings['surveys.enable_whatsapp'] ? 'ON' : 'OFF'}
            </button>
            <button type="button" onClick={() => setSetting('surveys.enable_sms', !settings['surveys.enable_sms'])}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                settings['surveys.enable_sms'] ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
              SMS Fallback: {settings['surveys.enable_sms'] ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard icon={<ShieldCheck className="w-5 h-5" />} title="Security Policies" subtitle="Session, password, and lockout policies for administrative access.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Session Timeout (minutes)" dirty={isDirty('security.session_timeout_minutes')} onRevert={() => revertKey('security.session_timeout_minutes')}>
            <input type="number" min={15} max={10080} className={inputClass} value={settings['security.session_timeout_minutes']}
              onChange={e => setSetting('security.session_timeout_minutes', parseInt(e.target.value, 10) || 15)} />
          </Field>
          <Field label="Password Minimum Length" dirty={isDirty('security.password_min_length')} onRevert={() => revertKey('security.password_min_length')}>
            <input type="number" min={6} max={64} className={inputClass} value={settings['security.password_min_length']}
              onChange={e => setSetting('security.password_min_length', parseInt(e.target.value, 10) || 8)} />
          </Field>
          <Field label="Max Failed Login Attempts" hint="Temporary lockout threshold for admin logins." dirty={isDirty('security.max_login_attempts')} onRevert={() => revertKey('security.max_login_attempts')}>
            <input type="number" min={3} max={20} className={inputClass} value={settings['security.max_login_attempts']}
              onChange={e => setSetting('security.max_login_attempts', parseInt(e.target.value, 10) || 5)} />
          </Field>
          <Field label="Superadmin 2FA" dirty={isDirty('security.require_2fa_superadmins')} onRevert={() => revertKey('security.require_2fa_superadmins')}>
            <button type="button" onClick={() => setSetting('security.require_2fa_superadmins', !settings['security.require_2fa_superadmins'])}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                settings['security.require_2fa_superadmins'] ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
              {settings['security.require_2fa_superadmins'] ? 'Enforced' : 'Not enforced'}
            </button>
          </Field>
        </div>
      </SectionCard>

      {/* Feature flags */}
      <SectionCard icon={<Sparkles className="w-5 h-5" />} title="Feature Flags" subtitle="Turn trainee-portal modules on or off instantly — no redeploy needed.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featureKeys.map(key => (
            <button key={key} type="button" onClick={() => setSetting(key, !settings[key])}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold border cursor-pointer transition text-left ${
                settings[key] ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
              <span>
                {key.replace('features.', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">{key}</span>
              </span>
              <span className={`px-2 py-1 rounded-lg ${settings[key] ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                {settings[key] ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-between bg-[#0a1020] border border-slate-800/80 rounded-2xl px-6 py-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          {dirtyKeys.size ? <span><b className="text-amber-300">{dirtyKeys.size}</b> unsaved change{dirtyKeys.size > 1 ? 's' : ''}</span> : <span>All changes saved to database{loaded ? '' : ' (loading…)'}</span>}
        </div>
        <button onClick={handleSave} disabled={saving || dirtyKeys.size === 0}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
