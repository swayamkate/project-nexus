-- =============================================================================
-- NEXUS (PS-135) SUPABASE POSTGRESQL COMPLETE TEARDOWN & RESET SCRIPT
-- WARNING: This will drop ALL tables, triggers, functions, policies, and types.
-- =============================================================================

-- 1. Drop all triggers on auth.users if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users CASCADE;

-- 2. Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- 3. Drop all tables with CASCADE
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.verifications CASCADE;
DROP TABLE IF EXISTS public.ai_policy_insights CASCADE;
DROP TABLE IF EXISTS public.trainee_notifications CASCADE;
DROP TABLE IF EXISTS public.recommended_opportunities CASCADE;
DROP TABLE IF EXISTS public.district_employment_stats CASCADE;
DROP TABLE IF EXISTS public.top_skill_gaps CASCADE;
DROP TABLE IF EXISTS public.trainee_followups CASCADE;
DROP TABLE IF EXISTS public.trainee_employment CASCADE;
DROP TABLE IF EXISTS public.trainee_enrollments CASCADE;
DROP TABLE IF EXISTS public.training_programs CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.trainees CASCADE;

-- 4. Drop all custom enum types
DROP TYPE IF EXISTS public.business_status_type CASCADE;
DROP TYPE IF EXISTS public.followup_status_type CASCADE;
DROP TYPE IF EXISTS public.followup_milestone_type CASCADE;
DROP TYPE IF EXISTS public.employment_status_type CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Teardown Complete confirmation notice
DO $$ BEGIN
    RAISE NOTICE 'NEXUS Database completely reset and cleaned.';
END $$;
