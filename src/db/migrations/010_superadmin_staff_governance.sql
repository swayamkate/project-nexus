-- Migration 010: Superadmin Staff Governance, Password Resets & Administrative Privileges
-- Nexus Platform (SSDM 2026 - Problem Statement 135)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- 1. Extend user_roles table with governance columns
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{"can_edit_schemes":true,"can_edit_courses":true,"can_edit_assessments":true,"can_verify_trainees":true,"can_manage_users":true,"can_publish_analytics":true}'::jsonb;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS department text DEFAULT 'State Skill Development Mission';
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS district text DEFAULT 'Maharashtra HQ';
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Upsert Guaranteed Primary Superadmin Account in auth.users
-- Password: SuperAdmin@2026!
DO $$
DECLARE
  superadmin_id uuid := 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e';
  admin_id uuid := 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f';
  hashed_pass text := crypt('SuperAdmin@2026!', gen_salt('bf'));
  hashed_admin_pass text := crypt('AdminPassword@2026!', gen_salt('bf'));
BEGIN
  -- Superadmin Account 1: admin@nexus.com
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = superadmin_id OR email = 'admin@nexus.com') THEN
    UPDATE auth.users
    SET 
      encrypted_password = hashed_pass,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"superadmin"}',
      raw_user_meta_data = '{"role":"superadmin","username":"superadmin","full_name":"State Superadmin"}'
    WHERE id = superadmin_id OR email = 'admin@nexus.com';
  ELSE
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      role, aud, confirmation_token
    ) VALUES (
      superadmin_id, '00000000-0000-0000-0000-000000000000', 'admin@nexus.com', hashed_pass, now(),
      '{"provider":"email","providers":["email"],"role":"superadmin"}', '{"role":"superadmin","username":"superadmin","full_name":"State Superadmin"}', now(), now(),
      'authenticated', 'authenticated', ''
    );
  END IF;

  -- Superadmin Account 2: superadmin@nexus.gov.in
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@nexus.gov.in') THEN
    UPDATE auth.users
    SET 
      encrypted_password = hashed_pass,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      email_change = '',
      confirmation_token = '',
      recovery_token = '',
      email_change_token_new = '',
      email_change_token_current = '',
      phone_change = '',
      phone_change_token = '',
      reauthentication_token = '',
      raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"superadmin"}',
      raw_user_meta_data = '{"role":"superadmin","username":"superadmin","full_name":"State Superadmin"}'
    WHERE email = 'superadmin@nexus.gov.in';
  ELSE
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      email_change, confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      role, aud
    ) VALUES (
      'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', '00000000-0000-0000-0000-000000000000', 'superadmin@nexus.gov.in', hashed_pass, now(),
      '', '', '', '', '', '', '', '',
      '{"provider":"email","providers":["email"],"role":"superadmin"}', '{"role":"superadmin","username":"superadmin","full_name":"State Superadmin"}', now(), now(),
      'authenticated', 'authenticated'
    );
  END IF;

  -- District Admin Account: admin@nexus.gov.in
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nexus.gov.in') THEN
    UPDATE auth.users
    SET 
      encrypted_password = hashed_admin_pass,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      email_change = '',
      confirmation_token = '',
      recovery_token = '',
      email_change_token_new = '',
      email_change_token_current = '',
      phone_change = '',
      phone_change_token = '',
      reauthentication_token = '',
      raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"admin"}',
      raw_user_meta_data = '{"role":"admin","username":"admin","full_name":"District Administrator"}'
    WHERE email = 'admin@nexus.gov.in';
  ELSE
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      email_change, confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      role, aud
    ) VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'admin@nexus.gov.in', hashed_admin_pass, now(),
      '', '', '', '', '', '', '', '',
      '{"provider":"email","providers":["email"],"role":"admin"}', '{"role":"admin","username":"admin","full_name":"District Administrator"}', now(), now(),
      'authenticated', 'authenticated'
    );
  END IF;

  -- Sync GoTrue Identities
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES 
    ('d4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', json_build_object('sub', 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', 'email', 'superadmin@nexus.gov.in', 'email_verified', true, 'phone_verified', false), 'email', now(), now()),
    ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', json_build_object('sub', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'email', 'admin@nexus.gov.in', 'email_verified', true, 'phone_verified', false), 'email', now(), now())
  ON CONFLICT (provider, provider_id) DO UPDATE SET 
    identity_data = EXCLUDED.identity_data;

END $$;

-- 3. Sync Roles in public.user_roles
INSERT INTO public.user_roles (user_id, email, username, role, is_active, department, district)
VALUES 
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'admin@nexus.com', 'superadmin', 'superadmin', true, 'Maharashtra State Skill Mission HQ', 'Statewide'),
  ('d4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f90', 'superadmin@nexus.gov.in', 'superadmin', 'superadmin', true, 'Maharashtra State Skill Mission HQ', 'Statewide'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'admin@nexus.gov.in', 'admin', 'admin', true, 'District Skill Administration', 'Pune')
ON CONFLICT (email) DO UPDATE SET 
  role = EXCLUDED.role,
  username = EXCLUDED.username,
  is_active = true,
  department = EXCLUDED.department,
  district = EXCLUDED.district;

-- 4. Secure Password Reset Stored Procedure for Superadmins
CREATE OR REPLACE FUNCTION public.admin_reset_user_password(
  target_user_email text,
  new_plain_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF new_plain_password IS NULL OR length(trim(new_plain_password)) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters.';
  END IF;

  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_plain_password, gen_salt('bf')),
    updated_at = now()
  WHERE email = trim(lower(target_user_email));

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found.', target_user_email;
  END IF;

  RETURN true;
END;
$$;

COMMIT;
