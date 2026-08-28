-- NEXUS PRODUCTION SQL EDITOR PATCH
-- Run as the Supabase SQL editor owner, after the base schema has been installed.
-- This script is idempotent and fixes the live auth/settings dependencies.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Platform settings used by both the public portal and admin panel.
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  category text NOT NULL DEFAULT 'general',
  description text NOT NULL DEFAULT '',
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.touch_platform_settings_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_platform_settings_touch ON public.platform_settings;
CREATE TRIGGER trg_platform_settings_touch
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_platform_settings_updated_at();

INSERT INTO public.platform_settings (key, category, description, value) VALUES
 ('general.app_name','general','Public platform name','"Nexus"'::jsonb),
 ('general.tagline','general','Public tagline','"Empowering Vocational Futures through Zero-PII Longitudinal Tracking"'::jsonb),
 ('general.support_email','general','Support email','"support@nexus.in"'::jsonb),
 ('branding.primary_color','branding','Primary brand color','"#2563eb"'::jsonb),
 ('branding.accent_color','branding','Accent brand color','"#0ea5e9"'::jsonb),
 ('branding.login_headline','branding','Login headline','"Skilling Outcomes & Longitudinal Tracking"'::jsonb),
 ('branding.theme_mode','branding','Default color theme for both portals','"system"'::jsonb),
 ('analytics.show_personal_wage_chart','analytics','Show trainee personal wage chart','true'::jsonb),
 ('analytics.show_district_benchmarks','analytics','Show published district benchmarks','true'::jsonb),
 ('analytics.show_skill_gaps','analytics','Show published skill-gap data','true'::jsonb),
 ('analytics.wage_chart_title','analytics','Personal wage chart heading','"Longitudinal Wage Progression Trajectory"'::jsonb),
 ('analytics.benchmark_title','analytics','District benchmark heading','"District Labor Deficit Matrix"'::jsonb),
 ('analytics.skill_gap_title','analytics','Skill-gap heading','"High-Demand Skill Shortages"'::jsonb),
 ('branding.banner_enabled','branding','Show broadcast banner','false'::jsonb),
 ('branding.banner_text','branding','Broadcast banner text','""'::jsonb),
 ('localization.enabled_languages','localization','Enabled language codes','["en","hi","mr"]'::jsonb),
 ('localization.default_language','localization','Default language','"en"'::jsonb),
 ('surveys.milestones_months','surveys','Survey milestones after placement','[3,6,12,18,24]'::jsonb),
 ('surveys.reminder_days_before','surveys','Reminder window in days','7'::jsonb),
 ('surveys.escalation_days_after','surveys','Escalation window in days','14'::jsonb),
 ('surveys.enable_whatsapp','surveys','Enable WhatsApp dispatch','true'::jsonb),
 ('surveys.enable_sms','surveys','Enable SMS fallback','true'::jsonb),
 ('features.employers_portal','features','Enable employers portal','true'::jsonb),
 ('features.voice_surveys','features','Enable voice surveys','false'::jsonb),
 ('features.community_hub','features','Enable community hub','true'::jsonb),
 ('features.self_employment','features','Enable self-employment module','true'::jsonb)
ON CONFLICT (key) DO UPDATE SET category=EXCLUDED.category, description=EXCLUDED.description;

-- Align the two values currently inconsistent across the public pages and docs.
UPDATE public.platform_settings
SET value = '"support@nexus.in"'::jsonb
WHERE key = 'general.support_email';
UPDATE public.platform_settings
SET value = '[3,6,12,18,24]'::jsonb
WHERE key = 'surveys.milestones_months';

-- Public settings are readable anonymously; writes are restricted to admins.
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admin write platform settings" ON public.platform_settings;
CREATE POLICY "Public read platform settings" ON public.platform_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write platform settings" ON public.platform_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin','superadmin')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin','superadmin')));

-- Login needs these checks while trainees remain private under RLS.
CREATE OR REPLACE FUNCTION public.get_trainee_email_by_username(p_username text)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT email FROM public.trainees
  WHERE lower(username) = lower(trim(p_username))
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_username_available(p_username text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.trainees WHERE lower(username) = lower(trim(p_username))
  );
$$;

REVOKE ALL ON FUNCTION public.get_trainee_email_by_username(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_username_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_trainee_email_by_username(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;

-- Keep SECURITY DEFINER functions safe from search_path changes.
ALTER FUNCTION public.get_trainee_email_by_username(text) SET search_path = public;
ALTER FUNCTION public.is_username_available(text) SET search_path = public;

COMMIT;

-- Verification (run separately if the editor disallows result statements after COMMIT):
-- SELECT key, value FROM public.platform_settings ORDER BY key;
-- SELECT public.is_username_available('__nexus_sql_editor_probe__');
