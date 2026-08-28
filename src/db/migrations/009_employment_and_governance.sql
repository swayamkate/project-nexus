-- Migration 009: Dynamic Employment Status, Trainee Profile Verification & Feature Delegation
-- Nexus Platform (SIH 2026 - Problem Statement 135)

BEGIN;

-- 1. Extend trainee_employment with granular status-specific fields
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS unemployed_reason text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS unemployed_perspective text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS target_workforce_timeline text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS support_needed text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS appreciation_details text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS pf_esic_number text;
ALTER TABLE public.trainee_employment ADD COLUMN IF NOT EXISTS work_location text;

-- 2. Extend trainees with Evaluator Verification Badge metadata
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS verified_by text;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS verification_notes text;

-- 3. Extend platform_settings with Admin Feature Delegation keys
INSERT INTO public.platform_settings (key, category, description, value) VALUES
 ('permissions.admin_can_edit_schemes', 'permissions', 'Allow regular admins to create and edit government schemes', 'true'::jsonb),
 ('permissions.admin_can_edit_courses', 'permissions', 'Allow regular admins to curate and publish courses', 'true'::jsonb),
 ('permissions.admin_can_edit_assessments', 'permissions', 'Allow regular admins to manage trade skill assessments', 'true'::jsonb),
 ('permissions.admin_can_verify_trainees', 'permissions', 'Allow regular admins to verify trainee profiles and documents', 'true'::jsonb),
 ('permissions.admin_can_manage_users', 'permissions', 'Allow regular admins to activate/deactivate user accounts', 'true'::jsonb),
 ('permissions.admin_can_publish_analytics', 'permissions', 'Allow regular admins to publish district/skill gap evidence', 'true'::jsonb)
ON CONFLICT (key) DO UPDATE SET category = EXCLUDED.category, description = EXCLUDED.description;

COMMIT;
