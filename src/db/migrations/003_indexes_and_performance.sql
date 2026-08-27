-- =============================================================================
-- MIGRATION 003: PERFORMANCE INDEXES & QUERY PATH OPTIMIZATION
-- MahaSkill Track / Nexus (SIH 2026 - PS-135)
-- =============================================================================

-- Trainees Indexing
CREATE INDEX IF NOT EXISTS idx_trainees_district ON trainees(district);
CREATE INDEX IF NOT EXISTS idx_trainees_privacy_hash ON trainees(privacy_hash);
CREATE INDEX IF NOT EXISTS idx_trainees_email ON trainees(email);
CREATE INDEX IF NOT EXISTS idx_trainees_trainee_id ON trainees(trainee_id);
CREATE INDEX IF NOT EXISTS idx_trainees_deleted_at ON trainees(deleted_at) WHERE deleted_at IS NULL;

-- Employment Indexing
CREATE INDEX IF NOT EXISTS idx_trainee_employment_trainee_id ON trainee_employment(trainee_id);
CREATE INDEX IF NOT EXISTS idx_trainee_employment_status ON trainee_employment(status);
CREATE INDEX IF NOT EXISTS idx_trainee_employment_biz_status ON trainee_employment(business_status);
CREATE INDEX IF NOT EXISTS idx_trainee_employment_udyam ON trainee_employment(udyam_reg_number);

-- Verifications Indexing
CREATE INDEX IF NOT EXISTS idx_verifications_trainee_id ON verifications(trainee_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at DESC);

-- Followups & Surveys Indexing
CREATE INDEX IF NOT EXISTS idx_trainee_followups_trainee_id ON trainee_followups(trainee_id);
CREATE INDEX IF NOT EXISTS idx_trainee_followups_due_date ON trainee_followups(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_trainee_followups_milestone ON trainee_followups(milestone);
CREATE INDEX IF NOT EXISTS idx_trainee_followups_status ON trainee_followups(status);

-- Enrollments Indexing
CREATE INDEX IF NOT EXISTS idx_trainee_enrollments_trainee_id ON trainee_enrollments(trainee_id);
CREATE INDEX IF NOT EXISTS idx_trainee_enrollments_program_id ON trainee_enrollments(program_id);

-- Audit Logs Indexing
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
