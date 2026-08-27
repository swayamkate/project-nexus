-- =============================================================================
-- MIGRATION 005: ATOMIC SURVEY TRANSACTION & RPC FUNCTIONS
-- MahaSkill Track / Nexus (SIH 2026 - PS-135)
-- =============================================================================

CREATE OR REPLACE FUNCTION complete_milestone_survey_atomic(
    p_trainee_id UUID,
    p_milestone survey_milestone,
    p_current_status VARCHAR(100),
    p_current_income_range VARCHAR(50),
    p_job_satisfaction INT,
    p_skill_utilization INT,
    p_remarks TEXT
)
RETURNS JSON AS $$
DECLARE
    v_followup_id UUID;
    v_result JSON;
BEGIN
    -- 1. Insert or update the milestone record
    INSERT INTO trainee_followups (
        trainee_id,
        milestone,
        due_date,
        completed_date,
        status,
        current_status,
        current_income_range,
        job_satisfaction_score,
        skill_utilization_score,
        remarks,
        channel
    )
    VALUES (
        p_trainee_id,
        p_milestone,
        CURRENT_DATE,
        CURRENT_DATE,
        'completed',
        p_current_status,
        p_current_income_range,
        p_job_satisfaction,
        p_skill_utilization,
        p_remarks,
        'in_app'
    )
    ON CONFLICT (id) DO UPDATE SET
        completed_date = CURRENT_DATE,
        status = 'completed',
        current_status = EXCLUDED.current_status,
        current_income_range = EXCLUDED.current_income_range,
        job_satisfaction_score = EXCLUDED.job_satisfaction_score,
        skill_utilization_score = EXCLUDED.skill_utilization_score,
        remarks = EXCLUDED.remarks,
        updated_at = NOW()
    RETURNING id INTO v_followup_id;

    -- 2. Atomically update the employment income range if applicable
    UPDATE trainee_employment
    SET 
        monthly_income_range = p_current_income_range,
        updated_at = NOW()
    WHERE trainee_id = p_trainee_id;

    -- 3. Write to audit log
    INSERT INTO audit_logs (action, performed_by, target, details)
    VALUES (
        'LONGITUDINAL_SURVEY_COMPLETED',
        p_trainee_id::text,
        v_followup_id::text,
        CONCAT('Completed ', p_milestone, ' milestone check-in. Status: ', p_current_status)
    );

    v_result := json_build_object(
        'success', true,
        'followup_id', v_followup_id,
        'milestone', p_milestone
    );

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Atomic survey completion failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
