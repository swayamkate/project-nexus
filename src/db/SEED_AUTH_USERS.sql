CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert or update priya.sharma@mahaskill.in
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'authenticated',
    'authenticated',
    'priya.sharma@mahaskill.in',
    crypt('priya123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Priya Sharma","username":"priya_sharma"}',
    NOW(),
    NOW(),
    ''
) ON CONFLICT (id) DO UPDATE SET 
    email = 'priya.sharma@mahaskill.in',
    encrypted_password = crypt('priya123456', gen_salt('bf')),
    email_confirmed_at = NOW(),
    raw_user_meta_data = '{"full_name":"Priya Sharma","username":"priya_sharma"}';

-- Insert or update admin@nexus.com
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'authenticated',
    'authenticated',
    'admin@nexus.com',
    crypt('adminpassword2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Super Administrator","username":"superadmin"}',
    NOW(),
    NOW(),
    ''
) ON CONFLICT (id) DO UPDATE SET 
    email = 'admin@nexus.com',
    encrypted_password = crypt('adminpassword2026', gen_salt('bf')),
    email_confirmed_at = NOW(),
    raw_user_meta_data = '{"full_name":"Super Administrator","username":"superadmin"}';

-- Ensure user_roles has admin entry
INSERT INTO public.user_roles (user_id, email, username, role)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'admin@nexus.com',
    'superadmin',
    'superadmin'
) ON CONFLICT (email) DO UPDATE SET
    role = 'superadmin',
    username = 'superadmin';
