-- NEXUS / SIH2026 — COMPLETE, IDEMPOTENT SUPABASE REPAIR
--
-- Run this single file in the Supabase SQL Editor as the database owner.
-- It is safe to re-run and supports both historical schema variants used by
-- this project (employee_count vs employees_count, completion_date vs
-- completed_date, and schemas with/without monthly_income_range).
--
-- This script does not seed demo trainees, certificates, courses, charts,
-- wages, districts, or skill gaps. It only creates missing structural pieces,
-- removes synthetic defaults, and preserves user-entered records.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. Minimum tables required by the web and admin portals.
--    Existing tables are never replaced; missing columns are added below.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL UNIQUE,
  username text,
  role text NOT NULL DEFAULT 'trainee',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  trainee_id text NOT NULL UNIQUE,
  username text UNIQUE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  phone text DEFAULT '',
  dob date,
  gender text,
  aadhaar_masked text,
  address text DEFAULT '',
  district text DEFAULT '',
  state text,
  pincode text DEFAULT '',
  avatar_url text DEFAULT '',
  profile_completion_pct integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  highest_education text DEFAULT '',
  board_university text DEFAULT '',
  year_of_passing integer,
  education_percentage numeric(5,2),
  skills text[] NOT NULL DEFAULT '{}'::text[],
  about_me text,
  privacy_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sector text NOT NULL,
  duration_months integer NOT NULL DEFAULT 3,
  provider_name text NOT NULL DEFAULT '',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainee_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  program_id uuid REFERENCES public.training_programs(id) ON DELETE CASCADE,
  enrolled_date date NOT NULL DEFAULT current_date,
  completed_date date,
  certified_date date,
  certificate_id text,
  status text NOT NULL DEFAULT 'enrolled',
  grade text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainee_employment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  status text,
  company_name text,
  designation text,
  joining_date date,
  monthly_salary numeric(12,2),
  offer_letter_url text,
  business_name text,
  business_type text,
  business_category text,
  business_status text,
  establishment_date date,
  monthly_revenue numeric(12,2),
  monthly_profit numeric(12,2),
  monthly_income_range text,
  employees_count integer,
  employee_count integer,
  udyam_number text,
  udyam_reg_number text,
  gst_number text,
  business_address text,
  verified_by_admin boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainee_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  milestone text NOT NULL,
  due_date date,
  completed_date date,
  status text NOT NULL DEFAULT 'upcoming',
  current_status text,
  current_income_range text,
  income_growth_pct numeric(5,2),
  job_satisfaction_score integer,
  skill_utilization_score integer,
  additional_support_needed text,
  survey_channel text,
  survey_data_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_url text,
  document_name text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email text,
  action text NOT NULL,
  target_entity text,
  target_id text,
  details text,
  ip_address text,
  status text NOT NULL DEFAULT 'Success',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.top_skill_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name text NOT NULL,
  demand_count integer NOT NULL DEFAULT 0,
  supply_count integer NOT NULL DEFAULT 0,
  gap_percentage numeric(5,2) NOT NULL DEFAULT 0,
  priority_level text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.district_employment_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_name text NOT NULL,
  total_trained integer NOT NULL DEFAULT 0,
  employed_count integer NOT NULL DEFAULT 0,
  self_employed_count integer NOT NULL DEFAULT 0,
  seeking_count integer NOT NULL DEFAULT 0,
  avg_wage numeric(10,2),
  placement_rate numeric(5,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainee_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id uuid REFERENCES public.trainees(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recommended_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  provider text NOT NULL,
  link_url text,
  description text,
  target_skills text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Provision a private profile and a default role whenever Supabase Auth creates
-- a user. The trigger is deliberately tolerant: a profile failure must not
-- prevent the auth account from being created, and no personal defaults are
-- fabricated.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  clean_username text;
  derived_name text;
BEGIN
  clean_username := lower(trim(COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))));
  derived_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');

  INSERT INTO public.trainees (user_id, email, username, full_name, trainee_id)
  VALUES (NEW.id, NEW.email, clean_username, COALESCE(derived_name, ''), 'TRN-' || upper(substr(replace(NEW.id::text, '-', ''), 1, 12)))
  ON CONFLICT (email) DO UPDATE SET user_id = EXCLUDED.user_id,
    username = COALESCE(public.trainees.username, EXCLUDED.username);

  INSERT INTO public.user_roles (user_id, email, username)
  VALUES (NEW.id, NEW.email, clean_username)
  ON CONFLICT (email) DO UPDATE SET user_id = EXCLUDED.user_id,
    username = COALESCE(public.user_roles.username, EXCLUDED.username);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. Add columns missing from older installations. All additions are NULL or
-- empty-safe; no fabricated personal outcomes are introduced.
-- ---------------------------------------------------------------------------
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS profile_completion_pct integer DEFAULT 0;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}'::text[];
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='trainees' AND column_name='privacy_hash') THEN
    EXECUTE $sql$ALTER TABLE public.trainees
      ALTER COLUMN privacy_hash SET DEFAULT encode(digest(gen_random_bytes(32), 'sha256'), 'hex')$sql$;
  END IF;
END $$;

ALTER TABLE public.trainee_enrollments ADD COLUMN IF NOT EXISTS completed_date date;
ALTER TABLE public.trainee_enrollments ADD COLUMN IF NOT EXISTS certified_date date;
ALTER TABLE public.trainee_enrollments ADD COLUMN IF NOT EXISTS certificate_id text;
ALTER TABLE public.trainee_enrollments ADD COLUMN IF NOT EXISTS grade text;
ALTER TABLE public.trainee_enrollments ADD COLUMN IF NOT EXISTS status text DEFAULT 'enrolled';

ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS monthly_income_range text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS employees_count integer;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS employee_count integer;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS udyam_number text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS udyam_reg_number text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS joining_date date;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.trainee_followups ADD COLUMN IF NOT EXISTS completed_date date;
ALTER TABLE public.trainee_followups ADD COLUMN IF NOT EXISTS survey_data_json jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.trainee_followups ADD COLUMN IF NOT EXISTS survey_channel text;
ALTER TABLE public.trainee_followups ADD COLUMN IF NOT EXISTS current_income_range text;
ALTER TABLE public.trainee_followups ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Preserve values when a historical installation used a different name.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='completion_date')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='completed_date') THEN
    EXECUTE 'UPDATE public.trainee_enrollments SET completed_date = COALESCE(completed_date, completion_date)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_employment' AND column_name='employee_count')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_employment' AND column_name='employees_count') THEN
    EXECUTE 'UPDATE public.trainee_employment SET employees_count = COALESCE(employees_count, employee_count)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_employment' AND column_name='udyam_reg_number')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_employment' AND column_name='udyam_number') THEN
    EXECUTE 'UPDATE public.trainee_employment SET udyam_number = COALESCE(udyam_number, udyam_reg_number)';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Remove synthetic defaults. This is conditional so the script works with
-- every prior schema and can be executed repeatedly.
-- ---------------------------------------------------------------------------
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    ('trainees','dob'), ('trainees','gender'), ('trainees','aadhaar_masked'),
    ('trainees','state'), ('trainees','year_of_passing'),
    ('trainee_enrollments','certificate_id'), ('trainee_enrollments','grade'),
    ('trainee_employment','status'), ('trainee_employment','business_category'),
    ('trainee_employment','business_status'), ('trainee_employment','establishment_date'),
    ('trainee_employment','monthly_income_range'), ('trainee_employment','employees_count'),
    ('trainee_employment','employee_count'), ('trainee_followups','current_status'),
    ('trainee_followups','current_income_range'), ('trainee_followups','job_satisfaction_score'),
    ('trainee_followups','skill_utilization_score'), ('trainee_followups','survey_channel')
  ) AS x(table_name, column_name)
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns c
               WHERE c.table_schema='public' AND c.table_name=r.table_name AND c.column_name=r.column_name) THEN
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT', r.table_name, r.column_name);
    END IF;
  END LOOP;
END $$;

ALTER TABLE public.trainees ALTER COLUMN profile_completion_pct SET DEFAULT 0;

-- No enrollment can display as a credential until an evaluator supplies the
-- certificate ID and certification date. Rows are retained for auditability.
UPDATE public.trainee_enrollments
SET certificate_id = NULL, certified_date = NULL, grade = NULL
WHERE status IS DISTINCT FROM 'certified';

UPDATE public.trainee_enrollments
SET status = 'completed', certified_date = NULL, grade = NULL
WHERE status = 'certified' AND NULLIF(btrim(certificate_id), '') IS NULL;

-- ---------------------------------------------------------------------------
-- 4. Settings + username RPC used by anonymous login/signup checks.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  category text NOT NULL DEFAULT 'general',
  description text NOT NULL DEFAULT '',
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.platform_settings (key, category, description, value) VALUES
 ('general.app_name','general','Public platform name','"Nexus"'::jsonb),
 ('general.tagline','general','Public tagline','"Empowering Vocational Futures through verified outcomes"'::jsonb),
 ('general.support_email','general','Support email','"support@nexus.in"'::jsonb),
 ('branding.primary_color','branding','Primary brand color','"#2563eb"'::jsonb),
 ('branding.accent_color','branding','Accent brand color','"#0ea5e9"'::jsonb),
 ('branding.login_headline','branding','Login headline','"Skilling Outcomes & Longitudinal Tracking"'::jsonb),
 ('branding.theme_mode','branding','Default color theme','"system"'::jsonb),
 ('branding.banner_enabled','branding','Show broadcast banner','false'::jsonb),
 ('branding.banner_text','branding','Broadcast banner text','""'::jsonb),
 ('localization.enabled_languages','localization','Enabled language codes','["en","hi","mr"]'::jsonb),
 ('localization.default_language','localization','Default language','"en"'::jsonb),
 ('surveys.milestones_months','surveys','Survey milestones','[3,6,12,18,24]'::jsonb),
 ('surveys.reminder_days_before','surveys','Reminder window','7'::jsonb),
 ('surveys.escalation_days_after','surveys','Escalation window','14'::jsonb),
 ('surveys.enable_whatsapp','surveys','Enable WhatsApp dispatch','true'::jsonb),
 ('surveys.enable_sms','surveys','Enable SMS fallback','true'::jsonb),
 ('features.employers_portal','features','Enable employers portal','true'::jsonb),
 ('features.voice_surveys','features','Enable voice surveys','false'::jsonb),
 ('features.community_hub','features','Enable community hub','true'::jsonb),
 ('features.self_employment','features','Enable self-employment module','true'::jsonb),
 ('analytics.show_personal_wage_chart','analytics','Show personal wage chart','true'::jsonb),
 ('analytics.show_district_benchmarks','analytics','Show published district benchmarks','true'::jsonb),
 ('analytics.show_skill_gaps','analytics','Show published skill gaps','true'::jsonb),
 ('analytics.wage_chart_title','analytics','Personal wage chart title','"Longitudinal Wage Progression Trajectory"'::jsonb),
 ('analytics.benchmark_title','analytics','District benchmark title','"District Labor Deficit Matrix"'::jsonb),
 ('analytics.skill_gap_title','analytics','Skill-gap title','"High-Demand Skill Shortages"'::jsonb)
ON CONFLICT (key) DO UPDATE SET category=EXCLUDED.category, description=EXCLUDED.description;

CREATE OR REPLACE FUNCTION public.get_trainee_email_by_username(p_username text)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT email FROM public.trainees
  WHERE lower(username) = lower(trim(p_username)) LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_username_available(p_username text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT CASE WHEN NULLIF(trim(p_username), '') IS NULL THEN false
    ELSE NOT EXISTS (SELECT 1 FROM public.trainees WHERE lower(username)=lower(trim(p_username)))
  END;
$$;

REVOKE ALL ON FUNCTION public.get_trainee_email_by_username(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_username_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_trainee_email_by_username(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read platform settings" ON public.platform_settings;
CREATE POLICY "Public read platform settings" ON public.platform_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_trainees_username_lower
  ON public.trainees (lower(username));

COMMIT;

-- ---------------------------------------------------------------------------
-- 5. Verification queries (run after the transaction if desired).
-- ---------------------------------------------------------------------------
-- SELECT public.is_username_available('__nexus_probe__');
-- SELECT column_name FROM information_schema.columns
--   WHERE table_schema='public' AND table_name='trainee_employment'
--   ORDER BY ordinal_position;
-- SELECT id, trainee_id, status, certificate_id, certified_date, grade
--   FROM public.trainee_enrollments ORDER BY created_at DESC LIMIT 20;
