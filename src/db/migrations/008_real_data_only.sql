-- Migration 008: enforce real trainee outcomes only (schema-compatible)
--
-- Some historical installations do not have trainee_employment.monthly_income_range
-- or employees_count. Every optional column is checked before ALTER/UPDATE.
-- For a one-shot repair that also creates missing portal tables/settings, run
-- src/db/COMPLETE_SUPABASE_REPAIR.sql instead.

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
    ('trainee_followups','skill_utilization_score')
  ) AS x(table_name, column_name)
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns c
               WHERE c.table_schema='public' AND c.table_name=r.table_name AND c.column_name=r.column_name) THEN
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP DEFAULT', r.table_name, r.column_name);
    END IF;
  END LOOP;
END $$;

-- Do not erase enrollment history. Clear only credential fields that are not
-- backed by a certified status; this prevents UI-only/fake certificates.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='status')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='certificate_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='certified_date')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='grade') THEN
    EXECUTE 'UPDATE public.trainee_enrollments
      SET certificate_id=NULL, certified_date=NULL, grade=NULL
      WHERE status IS DISTINCT FROM ''certified''';
    EXECUTE 'UPDATE public.trainee_enrollments
      SET status=''completed'', certified_date=NULL, grade=NULL
      WHERE status=''certified'' AND NULLIF(btrim(certificate_id),'''') IS NULL';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='certificate_id') THEN
    COMMENT ON COLUMN public.trainee_enrollments.certificate_id IS
      'Issued only by an authorized evaluator after a verified assessment; NULL until then.';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trainee_enrollments' AND column_name='grade') THEN
    COMMENT ON COLUMN public.trainee_enrollments.grade IS
      'Authoritative evaluator grade; NULL until certification is issued.';
  END IF;
END $$;
