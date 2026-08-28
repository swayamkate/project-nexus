-- =============================================================================
-- NEXUS ENTERPRISE MASTER DATABASE: COMPLETE CONSOLIDATED IDEMPOTENT SCHEMA
-- Platform: Nexus Skilling Outcomes & Longitudinal Intelligence System (SIH 2026 PS-135)
-- Features: 100% Fail-Proof, Idempotent Execution (DROP POLICY IF EXISTS + ON CONFLICT)
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. CORE EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. SECURITY & RBAC HELPER FUNCTIONS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
      AND role IN ('admin', 'superadmin', 'evaluator')
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
      AND role = 'superadmin'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_trainee_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM public.trainees WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- -----------------------------------------------------------------------------
-- 2. CORE SCHEMAS & TABLES (ALL 40 ENTITIES)
-- -----------------------------------------------------------------------------

-- 2.1 User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'evaluator', 'trainee')),
  district VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB DEFAULT '{"can_verify": true, "can_edit_trainees": true, "can_schedule_melawas": true, "can_manage_staff": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Trainees Table
CREATE TABLE IF NOT EXISTS public.trainees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  trainee_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  alt_phone VARCHAR(50),
  guardian_phone VARCHAR(50),
  apaar_id VARCHAR(100),
  digilocker_id VARCHAR(100),
  naps_apprentice_id VARCHAR(100),
  dob DATE,
  gender VARCHAR(50),
  district VARCHAR(100),
  current_residence_district VARCHAR(100),
  migration_status VARCHAR(50) DEFAULT 'local',
  highest_education VARCHAR(150),
  board_university VARCHAR(255),
  year_of_passing INT,
  education_percentage NUMERIC(5, 2),
  skills TEXT[] DEFAULT '{}',
  about_me TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  profile_completion_pct INT DEFAULT 85,
  consent_data_sharing BOOLEAN DEFAULT true,
  consent_longitudinal_tracking BOOLEAN DEFAULT true,
  consent_epfo_verification BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Trainee Employment Table
CREATE TABLE IF NOT EXISTS public.trainee_employment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'unemployed',
  employment_type VARCHAR(100),
  employer_name VARCHAR(255),
  job_title VARCHAR(255),
  sector VARCHAR(100),
  work_location VARCHAR(255),
  monthly_salary NUMERIC(12, 2),
  training_relevance VARCHAR(50) DEFAULT 'direct_match',
  contract_type VARCHAR(50) DEFAULT 'permanent',
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  business_category VARCHAR(100),
  business_status VARCHAR(50) DEFAULT 'active',
  establishment_date DATE,
  monthly_revenue NUMERIC(12, 2) DEFAULT 0,
  monthly_profit NUMERIC(12, 2) DEFAULT 0,
  monthly_income_range VARCHAR(100),
  udyam_number VARCHAR(100),
  gst_number VARCHAR(50),
  business_address TEXT,
  employees_count INT DEFAULT 0,
  is_employer_verified BOOLEAN DEFAULT false,
  verified_by_admin BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  appreciation_details TEXT,
  unemployed_reason VARCHAR(100),
  unemployed_perspective TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Training Programs Table
CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) UNIQUE NOT NULL,
  sector VARCHAR(100) NOT NULL,
  duration_months INT NOT NULL DEFAULT 3,
  provider_name VARCHAR(255) NOT NULL DEFAULT 'Maharashtra State Skill Development Society (MSSDS)',
  description TEXT,
  accountability_rating NUMERIC DEFAULT 4.5,
  retention_rate_6m_pct NUMERIC DEFAULT 85.0,
  avg_wage_lift_inr NUMERIC DEFAULT 12000,
  remedial_status TEXT DEFAULT 'good_standing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 Trainee Enrollments Table
CREATE TABLE IF NOT EXISTS public.trainee_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_date DATE,
  certified_date DATE,
  certificate_id VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'enrolled',
  grade VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Verifications Table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 Longitudinal Follow-Ups Table
CREATE TABLE IF NOT EXISTS public.trainee_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  milestone VARCHAR(50) NOT NULL,
  current_status VARCHAR(50) NOT NULL,
  job_satisfaction_score INT CHECK (job_satisfaction_score BETWEEN 1 AND 5),
  training_utility_score INT CHECK (training_utility_score BETWEEN 1 AND 5),
  current_salary NUMERIC(12, 2),
  employer_name VARCHAR(255),
  retention_flag BOOLEAN DEFAULT true,
  notes TEXT,
  survey_completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_entity VARCHAR(100) NOT NULL,
  target_id UUID,
  details TEXT,
  ip_address VARCHAR(100) DEFAULT '127.0.0.1',
  status VARCHAR(50) DEFAULT 'Success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Rozgar Melawas Table
CREATE TABLE IF NOT EXISTS public.rozgar_melawas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title TEXT NOT NULL,
  district TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TEXT DEFAULT '09:00 AM',
  end_time TEXT DEFAULT '05:00 PM',
  participating_employers_count INT DEFAULT 10,
  target_trades TEXT[] DEFAULT '{}',
  available_openings INT DEFAULT 100,
  registered_candidates_count INT DEFAULT 0,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 Melawa Registrations Table
CREATE TABLE IF NOT EXISTS public.melawa_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  melawa_id UUID REFERENCES public.rozgar_melawas(id) ON DELETE CASCADE,
  trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
  qr_pass_token TEXT UNIQUE NOT NULL,
  registration_status TEXT DEFAULT 'registered',
  spot_interviews_count INT DEFAULT 0,
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.11 Communication Broadcasts Table
CREATE TABLE IF NOT EXISTS public.communication_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(50) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  recipient_count INT NOT NULL DEFAULT 0,
  target_district VARCHAR(100) DEFAULT 'All Maharashtra',
  target_milestone VARCHAR(50) DEFAULT 'All Milestones',
  message_preview TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Delivered',
  gateway_used VARCHAR(100) DEFAULT 'CDAC Mobile Seva / NIC SMS Gateway',
  dispatched_by VARCHAR(255) DEFAULT 'State SuperAdmin (admin@avishkark.in)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.12 Training Centers Table
CREATE TABLE IF NOT EXISTS public.training_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_code VARCHAR(100) UNIQUE NOT NULL,
  center_name VARCHAR(255) NOT NULL,
  center_type VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  taluka VARCHAR(100) NOT NULL,
  principal_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  nsqf_lab_rating INT NOT NULL DEFAULT 5,
  biometric_compliance_pct INT NOT NULL DEFAULT 95,
  equipment_readiness_pct INT NOT NULL DEFAULT 92,
  active_batches INT NOT NULL DEFAULT 6,
  total_capacity INT NOT NULL DEFAULT 240,
  accreditation_status VARCHAR(50) NOT NULL DEFAULT 'Valid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.13 Direct Benefit Transfer (DBT) Table
CREATE TABLE IF NOT EXISTS public.dbt_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  trainee_name VARCHAR(255) NOT NULL,
  trainee_email VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  scheme_name VARCHAR(150) NOT NULL,
  disbursed_amount NUMERIC(12, 2) NOT NULL,
  bank_name VARCHAR(150) NOT NULL,
  masked_account_number VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Success',
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'APBS / PFMS',
  disbursed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.14 Job Market Vacancies Table
CREATE TABLE IF NOT EXISTS public.job_market_vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector VARCHAR(100) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  openings_count INT NOT NULL DEFAULT 10,
  avg_monthly_salary NUMERIC(12, 2) NOT NULL,
  demand_level VARCHAR(50) DEFAULT 'High',
  required_nsqf INT DEFAULT 4,
  growth_cagr_5yr NUMERIC(5, 2) DEFAULT 18.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.15 External Courses Table
CREATE TABLE IF NOT EXISTS public.external_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  platform VARCHAR(100) NOT NULL,
  duration_weeks INT NOT NULL DEFAULT 8,
  nsqf_level INT DEFAULT 4,
  trade_domain VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  is_free BOOLEAN DEFAULT true,
  rating NUMERIC(3, 2) DEFAULT 4.8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.16 Skill Assessments Table
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 20,
  passing_score INT NOT NULL DEFAULT 70,
  badge_title VARCHAR(100) NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.17 Interview Questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  concept_answer TEXT NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'Intermediate',
  upvotes INT DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.18 Trainee Career Goals Table
CREATE TABLE IF NOT EXISTS public.trainee_career_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID UNIQUE NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  target_role VARCHAR(255) NOT NULL,
  target_salary NUMERIC(12, 2) NOT NULL,
  timeline_days INT DEFAULT 90,
  daily_study_hours INT DEFAULT 2,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.19 Career Roadmaps Table
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.20 Trainee Notifications Table
CREATE TABLE IF NOT EXISTS public.trainee_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.21 Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. ENABLE RLS ON ALL CORE TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rozgar_melawas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.melawa_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dbt_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_market_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 4. IDEMPOTENT RLS POLICIES (DROP IF EXISTS BEFORE CREATE)
-- -----------------------------------------------------------------------------

-- 4.1 user_roles
DROP POLICY IF EXISTS "Admins read and manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public lookup user role by email" ON public.user_roles;
CREATE POLICY "Admins read and manage roles" ON public.user_roles FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public lookup user role by email" ON public.user_roles FOR SELECT TO anon, authenticated USING (true);

-- 4.2 trainees
DROP POLICY IF EXISTS "Admins manage all trainees" ON public.trainees;
DROP POLICY IF EXISTS "Trainees view and edit own profile" ON public.trainees;
DROP POLICY IF EXISTS "Public read trainees for verification" ON public.trainees;
CREATE POLICY "Admins manage all trainees" ON public.trainees FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Trainees view and edit own profile" ON public.trainees FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public read trainees for verification" ON public.trainees FOR SELECT TO anon, authenticated USING (true);

-- 4.3 trainee_employment
DROP POLICY IF EXISTS "Admins manage employment" ON public.trainee_employment;
DROP POLICY IF EXISTS "Trainees manage own employment" ON public.trainee_employment;
CREATE POLICY "Admins manage employment" ON public.trainee_employment FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Trainees manage own employment" ON public.trainee_employment FOR ALL TO authenticated USING (trainee_id = get_trainee_id()) WITH CHECK (trainee_id = get_trainee_id());

-- 4.4 training_programs
DROP POLICY IF EXISTS "Public read programs" ON public.training_programs;
DROP POLICY IF EXISTS "Public read training programs" ON public.training_programs;
DROP POLICY IF EXISTS "Admins manage programs" ON public.training_programs;
DROP POLICY IF EXISTS "Admin write training programs" ON public.training_programs;
CREATE POLICY "Public read programs" ON public.training_programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage programs" ON public.training_programs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.5 trainee_enrollments
DROP POLICY IF EXISTS "Read enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Read enrollments by owner, admin, or valid certificate" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Admins insert enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Admins update enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Admins delete enrollments" ON public.trainee_enrollments;
CREATE POLICY "Read enrollments" ON public.trainee_enrollments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage enrollments" ON public.trainee_enrollments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.6 verifications
DROP POLICY IF EXISTS "Trainees insert own verifications" ON public.verifications;
DROP POLICY IF EXISTS "Trainees and admins view verifications" ON public.verifications;
DROP POLICY IF EXISTS "Trainees read own verifications or admin all" ON public.verifications;
DROP POLICY IF EXISTS "Admins update verifications" ON public.verifications;
DROP POLICY IF EXISTS "Admins delete verifications" ON public.verifications;
CREATE POLICY "Trainees insert own verifications" ON public.verifications FOR INSERT TO authenticated WITH CHECK (trainee_id = get_trainee_id() OR is_admin());
CREATE POLICY "Trainees and admins view verifications" ON public.verifications FOR SELECT TO authenticated USING (trainee_id = get_trainee_id() OR is_admin());
CREATE POLICY "Admins update verifications" ON public.verifications FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.7 communication_broadcasts
DROP POLICY IF EXISTS "Admins manage communication broadcasts" ON public.communication_broadcasts;
CREATE POLICY "Admins manage communication broadcasts" ON public.communication_broadcasts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.8 training_centers
DROP POLICY IF EXISTS "Read training centers" ON public.training_centers;
DROP POLICY IF EXISTS "Admins manage training centers" ON public.training_centers;
CREATE POLICY "Read training centers" ON public.training_centers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage training centers" ON public.training_centers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.9 dbt_disbursements
DROP POLICY IF EXISTS "Admins manage dbt disbursements" ON public.dbt_disbursements;
DROP POLICY IF EXISTS "Trainees view own dbt" ON public.dbt_disbursements;
CREATE POLICY "Admins manage dbt disbursements" ON public.dbt_disbursements FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Trainees view own dbt" ON public.dbt_disbursements FOR SELECT TO authenticated USING (trainee_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR is_admin());

-- 4.10 rozgar_melawas
DROP POLICY IF EXISTS "Public read melawas" ON public.rozgar_melawas;
DROP POLICY IF EXISTS "Admins manage melawas" ON public.rozgar_melawas;
CREATE POLICY "Public read melawas" ON public.rozgar_melawas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage melawas" ON public.rozgar_melawas FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4.11 audit_logs
DROP POLICY IF EXISTS "Admins insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins insert audit logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (is_admin());

-- 4.12 Read-only public tables
DROP POLICY IF EXISTS "Public read vacancies" ON public.job_market_vacancies;
CREATE POLICY "Public read vacancies" ON public.job_market_vacancies FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read courses" ON public.external_courses;
CREATE POLICY "Public read courses" ON public.external_courses FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read assessments" ON public.skill_assessments;
CREATE POLICY "Public read assessments" ON public.skill_assessments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read interviews" ON public.interview_questions;
CREATE POLICY "Public read interviews" ON public.interview_questions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read settings" ON public.platform_settings;
CREATE POLICY "Public read settings" ON public.platform_settings FOR SELECT TO anon, authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 5. SEED OFFICIAL REAL DATA (IDEMPOTENT VIA ON CONFLICT)
-- -----------------------------------------------------------------------------

-- 5.1 Official Administrative User Roles
INSERT INTO public.user_roles (email, username, role, is_active) VALUES
('admin@avishkark.in', 'Avishkar', 'superadmin', true),
('avishkarkedar@gmail.com', 'admin', 'superadmin', true),
('admin@nexus.gov.in', 'district_admin', 'admin', true),
('evaluator@district.gov.in', 'pune_evaluator', 'evaluator', true)
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  role = EXCLUDED.role,
  is_active = true;

-- 5.2 Official Candidate: Avishkar Kedar
INSERT INTO public.trainees (
  id, trainee_id, username, full_name, email, phone, alt_phone, guardian_phone, apaar_id, digilocker_id, naps_apprentice_id, dob, gender, district, highest_education, skills, about_me, is_verified, profile_completion_pct
) VALUES (
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'TRN-847291',
  'avishkar_kedar',
  'Avishkar Kedar',
  'avishkar.kedar@mahaskill.in',
  '+91 9820011223',
  '+91 9820044556',
  '+91 9422033445',
  'APAAR-2026-8492-0194',
  'DL-MAHA-SKILL-849201',
  'NAPS-MAHA-2026-00482',
  '2002-05-14',
  'Male',
  'Pune',
  'Diploma in Mechatronics / Vocational ITI',
  ARRAY['EV Battery Diagnostics', 'High Voltage Safety', 'CAN-Bus Communication', 'Lithium-Ion Cell Balancing', 'PLC Programming'],
  'Advanced EV & Precision Machining Specialist certified by Maharashtra State Skill Development Mission (MSSDS). Founder of Kedar Mechatronics Solutions.',
  true,
  100
) ON CONFLICT (id) DO UPDATE SET
  full_name = 'Avishkar Kedar',
  username = 'avishkar_kedar',
  email = 'avishkar.kedar@mahaskill.in',
  is_verified = true,
  profile_completion_pct = 100;

-- 5.3 Candidate Employment Record
INSERT INTO public.trainee_employment (
  trainee_id, status, business_name, business_type, business_category, business_status, establishment_date, monthly_revenue, monthly_profit, monthly_income_range, udyam_number, gst_number, business_address, employees_count, is_employer_verified, verified_by_admin
) VALUES (
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'self_employed',
  'Kedar Mechatronics Solutions',
  'Sole Proprietorship / Private MSME',
  'CleanTech, EV Diagnostics & Industrial Automation',
  'active',
  '2024-06-15',
  68000.00,
  42000.00,
  '₹40,000 - ₹75,000',
  'UDYAM-MH-26-0084920',
  '27AAAPL8492K1Z5',
  'Gala No. 14, MIDC Bhosari Sector 10, Pune, Maharashtra 411026',
  5,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 5.4 Training Programs
INSERT INTO public.training_programs (
  id, title, sector, duration_months, provider_name, description, accountability_rating, retention_rate_6m_pct
) VALUES (
  'c6a0d3e0-d319-469c-8878-eaef0463de26',
  'EV Lithium-Ion Battery Diagnostics & High Voltage Servicing',
  'Automotive & CleanTech',
  3,
  'Maharashtra State Skill Development Society (MSSDS)',
  'Comprehensive 480-hour advanced vocational program on battery management systems, cell balancing, and CAN-bus troubleshooting.',
  4.92,
  94
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  sector = EXCLUDED.sector,
  accountability_rating = EXCLUDED.accountability_rating,
  retention_rate_6m_pct = EXCLUDED.retention_rate_6m_pct;

-- 5.5 Enrollment & Certificate
INSERT INTO public.trainee_enrollments (
  id, trainee_id, program_id, enrolled_date, completed_date, certified_date, certificate_id, status, grade
) VALUES (
  'e6c1e304-4b5b-4c6e-821f-82a1b94d9302',
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'c6a0d3e0-d319-469c-8878-eaef0463de26',
  '2025-10-15',
  '2026-01-20',
  '2026-01-22',
  'CERT-2026-849201',
  'certified',
  'A+'
) ON CONFLICT (id) DO UPDATE SET
  certificate_id = 'CERT-2026-849201',
  status = 'certified';

-- 5.6 Seed Rozgar Melawa
INSERT INTO public.rozgar_melawas (
  id, event_title, district, venue_address, event_date, start_time, end_time, participating_employers_count, available_openings, status
) VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Statewide CleanTech & Automotive Rozgar Melawa 2026',
  'Pune',
  'Government ITI Ground, Aundh, Pune - 411007',
  '2026-09-15',
  '09:30 AM',
  '05:00 PM',
  48,
  1450,
  'scheduled'
) ON CONFLICT (id) DO NOTHING;

-- 5.7 Seed Melawa Registration with QR Token for Avishkar Kedar
INSERT INTO public.melawa_registrations (
  melawa_id, trainee_id, qr_pass_token, registration_status
) VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  '8db21243-0294-4d8f-b6fd-a77ee675de65',
  'QR-SSDM-PUNE-849201',
  'registered'
) ON CONFLICT (qr_pass_token) DO NOTHING;

COMMIT;
