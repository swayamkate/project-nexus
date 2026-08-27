-- =============================================================================
-- HARDENED PRODUCTION ROW LEVEL SECURITY (RLS) - ZERO-TRUST AUDIT REMEDIATION
-- Platform: Nexus (SIH 2026 - Problem Statement 135)
-- =============================================================================

BEGIN;

-- 1. Security Definer Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin', 'evaluator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_trainee_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM public.trainees WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Drop all legacy permissive / open policies across all 23 tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 3. Ensure Row Level Security is STRICTLY ENABLED on all tables
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_employment_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_policy_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 4. TRAINEES (PII Protected - Only Self or Admin)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees read own profile or admin all" ON public.trainees
  FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Trainees insert own profile" ON public.trainees
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Trainees update own profile" ON public.trainees
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins delete trainees" ON public.trainees
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. TRAINEE EMPLOYMENT & WAGES (Private Financials)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees read own employment" ON public.trainee_employment
  FOR SELECT TO authenticated, anon
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees insert own employment" ON public.trainee_employment
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees update own employment" ON public.trainee_employment
  FOR UPDATE TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins delete employment" ON public.trainee_employment
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. TRAINEE ENROLLMENTS & CERTIFICATE REGISTRY
-- -----------------------------------------------------------------------------
CREATE POLICY "Read enrollments by owner, admin, or valid certificate" ON public.trainee_enrollments
  FOR SELECT TO authenticated, anon
  USING (
    trainee_id = public.get_trainee_id() 
    OR public.is_admin() 
    OR certificate_id IS NOT NULL
  );

CREATE POLICY "Admins insert enrollments" ON public.trainee_enrollments
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins update enrollments" ON public.trainee_enrollments
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins delete enrollments" ON public.trainee_enrollments
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. VERIFICATIONS (Identity / Documents)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees read own verifications or admin all" ON public.verifications
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees insert own verifications" ON public.verifications
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins update verifications" ON public.verifications
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete verifications" ON public.verifications
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. USER ROLES (Privilege Control)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users read own role or admin all" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Superadmins manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

-- -----------------------------------------------------------------------------
-- 9. TRAINEE NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees read own notifications" ON public.trainee_notifications
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Insert notifications" ON public.trainee_notifications
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Trainees update own notifications" ON public.trainee_notifications
  FOR UPDATE TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees delete own notifications" ON public.trainee_notifications
  FOR DELETE TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 10. TRAINEE FOLLOWUPS (Longitudinal Surveys)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees read own followups" ON public.trainee_followups
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees update own followups" ON public.trainee_followups
  FOR UPDATE TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins insert followups" ON public.trainee_followups
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 11. PRIVACY REQUESTS (DPDP Act 2023)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees view own privacy requests" ON public.privacy_requests
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees insert privacy requests" ON public.privacy_requests
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins manage privacy requests" ON public.privacy_requests
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 12. SCHEME APPLICATIONS (Micro-Grants & PMEGP/Mudra)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees view own scheme applications" ON public.scheme_applications
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees insert scheme applications" ON public.scheme_applications
  FOR INSERT TO authenticated
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Admins manage scheme applications" ON public.scheme_applications
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 13. ENTERPRISE LEDGER (Self-Employment Cashbook)
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainees view own ledger" ON public.enterprise_ledger
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Trainees manage own ledger" ON public.enterprise_ledger
  FOR ALL TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin())
  WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 14. SUPPORT TICKETS & FEEDBACK
-- -----------------------------------------------------------------------------
CREATE POLICY "Users read own tickets or admin all" ON public.support_tickets
  FOR SELECT TO authenticated
  USING (trainee_id = public.get_trainee_id() OR public.is_admin());

CREATE POLICY "Anyone insert support tickets" ON public.support_tickets
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins manage support tickets" ON public.support_tickets
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins view feedback" ON public.platform_feedback
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Anyone insert feedback" ON public.platform_feedback
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 15. AUDIT LOGS (Immutable Security Trail)
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins view audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "System and admins insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 16. EMPLOYERS & JOB POSTINGS
-- -----------------------------------------------------------------------------
CREATE POLICY "Public view verified employers" ON public.employers
  FOR SELECT TO authenticated, anon
  USING (is_verified = true OR public.is_admin());

CREATE POLICY "Anyone register unverified employer" ON public.employers
  FOR INSERT TO authenticated, anon
  WITH CHECK (is_verified = false OR public.is_admin());

CREATE POLICY "Admins manage employers" ON public.employers
  FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Public view active job postings" ON public.job_postings
  FOR SELECT TO authenticated, anon
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "Verified employers or admins insert job postings" ON public.job_postings
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin() OR 
    EXISTS (SELECT 1 FROM public.employers WHERE id = employer_id AND is_verified = true)
  );

CREATE POLICY "Admins manage job postings" ON public.job_postings
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 17. PUBLIC CATALOG TABLES (Read: Public, Mutate: Admin)
-- -----------------------------------------------------------------------------
CREATE POLICY "Public read training programs" ON public.training_programs
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write training programs" ON public.training_programs
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read government schemes" ON public.government_schemes
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write government schemes" ON public.government_schemes
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read district stats" ON public.district_employment_stats
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write district stats" ON public.district_employment_stats
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read top skill gaps" ON public.top_skill_gaps
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write top skill gaps" ON public.top_skill_gaps
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read opportunities" ON public.recommended_opportunities
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write opportunities" ON public.recommended_opportunities
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read survey templates" ON public.survey_templates
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write survey templates" ON public.survey_templates
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read promo codes" ON public.promo_codes
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write promo codes" ON public.promo_codes
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins view ai policy insights" ON public.ai_policy_insights
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins write ai policy insights" ON public.ai_policy_insights
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 18. PLATFORM SETTINGS (Read: Public/Anon, Write: Admin)
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read platform settings" ON public.platform_settings
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin write platform settings" ON public.platform_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 19. CAREER INTELLIGENCE & UPSKILLING EXPANSION (Zero-Trust RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.external_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read external courses" ON public.external_courses
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins manage external courses" ON public.external_courses
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE IF EXISTS public.skill_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active skill assessments" ON public.skill_assessments
  FOR SELECT TO authenticated, anon USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage skill assessments" ON public.skill_assessments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE IF EXISTS public.interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read interview questions" ON public.interview_questions
  FOR SELECT TO authenticated, anon USING (is_approved = true OR public.is_admin());
CREATE POLICY "Authenticated users contribute interview questions" ON public.interview_questions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users upvote or admins manage interview questions" ON public.interview_questions
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins delete interview questions" ON public.interview_questions
  FOR DELETE TO authenticated USING (public.is_admin());

ALTER TABLE IF EXISTS public.trainee_career_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainees read own career goals" ON public.trainee_career_goals
  FOR SELECT TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin());
CREATE POLICY "Trainees mutate own career goals" ON public.trainee_career_goals
  FOR ALL TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin()) WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

ALTER TABLE IF EXISTS public.career_roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainees read own career roadmaps" ON public.career_roadmaps
  FOR SELECT TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin());
CREATE POLICY "Trainees mutate own career roadmaps" ON public.career_roadmaps
  FOR ALL TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin()) WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

ALTER TABLE IF EXISTS public.trainee_course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainees read own course enrollments" ON public.trainee_course_enrollments
  FOR SELECT TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin());
CREATE POLICY "Trainees mutate own course enrollments" ON public.trainee_course_enrollments
  FOR ALL TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin()) WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());

ALTER TABLE IF EXISTS public.assessment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainees read own assessment submissions" ON public.assessment_submissions
  FOR SELECT TO authenticated USING (trainee_id = public.get_trainee_id() OR public.is_admin());
CREATE POLICY "Trainees insert own assessment submissions" ON public.assessment_submissions
  FOR INSERT TO authenticated WITH CHECK (trainee_id = public.get_trainee_id() OR public.is_admin());
CREATE POLICY "Admins manage assessment submissions" ON public.assessment_submissions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

COMMIT;
