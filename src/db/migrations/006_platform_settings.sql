-- =====================================================================
-- Migration 006: Platform Settings Registry
-- Purpose: Single source of truth for every admin-configurable value
--          (branding, localization, survey cadence, security, features).
-- Consumers: admin-app Settings page (write via service role),
--            admin-app layout + main portal (public anon read).
-- Safe to re-run (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}'::jsonb,
  category    TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  updated_by  UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.platform_settings IS
  'Admin-customizable platform configuration. One row per setting key; value is the JSON scalar/array/object.';

-- Keep updated_at fresh on every change.
CREATE OR REPLACE FUNCTION public.touch_platform_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_platform_settings_touch ON public.platform_settings;
CREATE TRIGGER trg_platform_settings_touch
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_platform_settings_updated_at();

-- ---------------------------------------------------------------------
-- 2. Row Level Security
--    READ  : public (anon) — branding/banner/localization must be visible
--            to logged-out trainees on the static portal.
--    WRITE : only authenticated users holding an admin/superadmin role
--            in public.user_roles.
-- ---------------------------------------------------------------------
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read platform settings" ON public.platform_settings;
CREATE POLICY "Public read platform settings"
  ON public.platform_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin write platform settings" ON public.platform_settings;
CREATE POLICY "Admin write platform settings"
  ON public.platform_settings
  FOR ALL
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'superadmin')
    )
  );

-- ---------------------------------------------------------------------
-- 3. Seed defaults (INSERT ... ON CONFLICT keeps live values intact)
--    Values below must mirror DEFAULT_SETTINGS in
--    admin-app/src/lib/platformSettings.ts.
-- ---------------------------------------------------------------------
INSERT INTO public.platform_settings (key, category, description, value) VALUES
  ('general.app_name',                 'general',      'Public-facing platform name',                               '"Nexus"'),
  ('general.tagline',                  'general',      'Tagline shown in portal footer / metadata',                 '"Empowering Vocational Futures through Zero-PII Longitudinal Tracking"'),
  ('general.support_email',            'general',      'Support contact email shown on help pages',                 '"support@nexus.gov.in"'),
  ('branding.primary_color',           'branding',     'Primary brand color (hex), drives portal accent UI',        '"#2563eb"'),
  ('branding.accent_color',            'branding',     'Secondary accent color (hex)',                              '"#0ea5e9"'),
  ('branding.login_headline',          'branding',     'Headline on the login page',                                '"Skilling Outcomes & Longitudinal Tracking"'),
  ('branding.theme_mode',              'branding',     'Default color theme for both portals',                     '"system"'),
  ('analytics.show_personal_wage_chart','analytics',   'Show trainee personal wage chart',                          'true'),
  ('analytics.show_district_benchmarks','analytics',  'Show published district benchmarks',                        'true'),
  ('analytics.show_skill_gaps',        'analytics',    'Show published skill-gap data',                             'true'),
  ('analytics.wage_chart_title',       'analytics',    'Personal wage chart heading',                               '"Longitudinal Wage Progression Trajectory"'),
  ('analytics.benchmark_title',        'analytics',    'District benchmark heading',                                '"District Labor Deficit Matrix"'),
  ('analytics.skill_gap_title',        'analytics',    'Skill-gap heading',                                         '"High-Demand Skill Shortages"'),
  ('branding.banner_enabled',          'branding',     'Show the broadcast banner on public portals',               'false'),
  ('branding.banner_text',             'branding',     'Broadcast banner message',                                  '""'),
  ('localization.enabled_languages',   'localization', 'Language codes offered in the UI',                           '["en","hi","mr"]'),
  ('localization.default_language',    'localization', 'Fallback language code',                                    '"en"'),
  ('surveys.milestones_months',        'surveys',      'Longitudinal follow-up milestones (months after placement)', '[3,6,12,24]'),
  ('surveys.reminder_days_before',     'surveys',      'Days before a milestone to start reminders',                 '7'),
  ('surveys.escalation_days_after',    'surveys',      'Days after a missed milestone to escalate',                  '14'),
  ('surveys.enable_whatsapp',          'surveys',      'Dispatch milestone surveys via WhatsApp',                    'true'),
  ('surveys.enable_sms',               'surveys',      'Dispatch milestone surveys via SMS fallback',                'true'),
  ('surveys.sms_template',             'surveys',      'SMS/WhatsApp template; {name} and {portal} supported',       '"Nexus: Your vocational follow-up check-in is due. Submit at {portal}"'),
  ('security.session_timeout_minutes', 'security',     'Admin session timeout in minutes',                           '1440'),
  ('security.require_2fa_superadmins', 'security',     'Require 2FA for superadmin accounts',                        'true'),
  ('security.password_min_length',     'security',     'Minimum password length enforced at signup',                 '8'),
  ('security.max_login_attempts',      'security',     'Failed login attempts before temporary lockout',             '5'),
  ('features.employers_portal',        'features',     'Enable the employer job portal on the trainee site',         'true'),
  ('features.voice_surveys',           'features',     'Enable IVR / voice survey channel',                          'false'),
  ('features.community_hub',           'features',     'Enable the community interview-question hub',                'true'),
  ('features.self_employment',         'features',     'Enable the self-employment validation module',               'true')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------
-- 4. Index for category-filtered reads
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_platform_settings_category
  ON public.platform_settings (category);
