-- =============================================================================
-- MIGRATION 004: SOFT DELETES & AUTOMATED IMMUTABLE AUDIT LOG TRIGGERS
-- MahaSkill Track / Nexus (SIH 2026 - PS-135)
-- =============================================================================

-- Soft delete helper function
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verification Status Change Audit Trigger
CREATE OR REPLACE FUNCTION log_verification_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO audit_logs (action, performed_by, target, details)
        VALUES (
            'VERIFICATION_STATUS_CHANGED',
            COALESCE(NEW.verified_by::text, 'System Executive'),
            NEW.id::text,
            CONCAT('Status updated from ', OLD.status, ' to ', NEW.status, '. Note: ', COALESCE(NEW.rejection_reason, 'Approved'))
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_verification_change ON verifications;
CREATE TRIGGER trg_log_verification_change
    AFTER UPDATE OF status ON verifications
    FOR EACH ROW
    EXECUTE FUNCTION log_verification_change();
