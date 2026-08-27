-- Migration 008: enforce real trainee outcomes only
-- Run once in Supabase SQL Editor after the hardened RLS migration.
-- This removes schema defaults that made an enrollment look certified before
-- an evaluator issued a credential. It does not delete any user records.

ALTER TABLE IF EXISTS public.trainee_enrollments
  ALTER COLUMN certificate_id DROP DEFAULT;

ALTER TABLE IF EXISTS public.trainee_enrollments
  ALTER COLUMN grade DROP DEFAULT;

-- Profile defaults must be empty/unknown, never plausible-looking personal
-- facts. The database-generated trainee_id remains the sole identifier default.
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN dob DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN gender DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN aadhaar_masked DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN state DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN year_of_passing DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainees ALTER COLUMN profile_completion_pct SET DEFAULT 0;

ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN status DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN business_category DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN business_status DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN establishment_date DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN monthly_income_range DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_employment ALTER COLUMN employees_count DROP DEFAULT;

ALTER TABLE IF EXISTS public.trainee_followups ALTER COLUMN current_status DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_followups ALTER COLUMN current_income_range DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_followups ALTER COLUMN job_satisfaction_score DROP DEFAULT;
ALTER TABLE IF EXISTS public.trainee_followups ALTER COLUMN skill_utilization_score DROP DEFAULT;

-- A certificate is valid only when an administrator/evaluator has supplied all
-- three authoritative fields. In-progress rows must never retain a generated
-- certificate reference or grade.
UPDATE public.trainee_enrollments
SET certificate_id = NULL,
    certified_date = NULL,
    grade = NULL
WHERE status IS DISTINCT FROM 'certified';

-- Certified rows missing an authoritative certificate ID are not certified.
-- Keep the enrollment for auditability, but return it to an explicit completed
-- state so the trainee UI cannot present a credential.
UPDATE public.trainee_enrollments
SET status = 'completed',
    certified_date = NULL,
    grade = NULL
WHERE status = 'certified'
  AND NULLIF(BTRIM(certificate_id), '') IS NULL;

-- Prevent future inconsistent writes at the database boundary.
ALTER TABLE public.trainee_enrollments
  DROP CONSTRAINT IF EXISTS trainee_enrollments_certification_fields_check;

ALTER TABLE public.trainee_enrollments
  ADD CONSTRAINT trainee_enrollments_certification_fields_check
  CHECK (
    (status = 'certified'
      AND NULLIF(BTRIM(certificate_id), '') IS NOT NULL
      AND certified_date IS NOT NULL)
    OR status <> 'certified'
  );

COMMENT ON COLUMN public.trainee_enrollments.certificate_id IS
  'Issued only by an authorized evaluator after a verified assessment; NULL until then.';

COMMENT ON COLUMN public.trainee_enrollments.grade IS
  'Authoritative evaluator grade; NULL until certification is issued.';
