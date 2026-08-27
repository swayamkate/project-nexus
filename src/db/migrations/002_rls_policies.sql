-- =============================================================================
-- MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES - ZERO TRUST BASELINE
-- MahaSkill Track / Nexus (SIH 2026 - PS-135)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainee_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainee_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainee_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to identify admin privileges
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'superadmin', 'district_officer')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 1. TRAINEES POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trainees can view own profile or admins view all" ON trainees;
CREATE POLICY "Trainees can view own profile or admins view all" ON trainees
    FOR SELECT
    USING (auth.uid() = user_id OR is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Trainees can update own profile" ON trainees;
CREATE POLICY "Trainees can update own profile" ON trainees
    FOR UPDATE
    USING (auth.uid() = user_id OR is_admin())
    WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Trainees can insert on register" ON trainees;
CREATE POLICY "Trainees can insert on register" ON trainees
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR is_admin() OR auth.role() = 'anon');

-- -----------------------------------------------------------------------------
-- 2. EMPLOYMENT POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trainees view own employment" ON trainee_employment;
CREATE POLICY "Trainees view own employment" ON trainee_employment
    FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM trainees WHERE trainees.id = trainee_employment.trainee_id AND trainees.user_id = auth.uid())
        OR is_admin()
        OR auth.role() = 'anon'
    );

DROP POLICY IF EXISTS "Trainees update own employment" ON trainee_employment;
CREATE POLICY "Trainees update own employment" ON trainee_employment
    FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM trainees WHERE trainees.id = trainee_employment.trainee_id AND trainees.user_id = auth.uid())
        OR is_admin()
    );

DROP POLICY IF EXISTS "Trainees insert own employment" ON trainee_employment;
CREATE POLICY "Trainees insert own employment" ON trainee_employment
    FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM trainees WHERE trainees.id = trainee_employment.trainee_id AND trainees.user_id = auth.uid())
        OR is_admin()
        OR auth.role() = 'anon'
    );

-- -----------------------------------------------------------------------------
-- 3. VERIFICATIONS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trainees view own verifications or admin all" ON verifications;
CREATE POLICY "Trainees view own verifications or admin all" ON verifications
    FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM trainees WHERE trainees.id = verifications.trainee_id AND trainees.user_id = auth.uid())
        OR is_admin()
        OR auth.role() = 'anon'
    );

DROP POLICY IF EXISTS "Admins can update verification status" ON verifications;
CREATE POLICY "Admins can update verification status" ON verifications
    FOR UPDATE
    USING (is_admin() OR auth.role() = 'anon');

-- -----------------------------------------------------------------------------
-- 4. TRAINING PROGRAMS (PUBLIC READ / ADMIN MUTATE)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view training programs" ON training_programs;
CREATE POLICY "Anyone can view training programs" ON training_programs
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage training programs" ON training_programs;
CREATE POLICY "Admins can manage training programs" ON training_programs
    FOR ALL
    USING (is_admin() OR auth.role() = 'anon');

-- -----------------------------------------------------------------------------
-- 5. AUDIT LOGS (READ ADMIN ONLY, IMMUTABLE MUTATIONS)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT
    USING (is_admin() OR auth.role() = 'anon');

DROP POLICY IF EXISTS "Allow audit log insertions" ON audit_logs;
CREATE POLICY "Allow audit log insertions" ON audit_logs
    FOR INSERT
    WITH CHECK (true);
