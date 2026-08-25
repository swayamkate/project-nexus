-- 1. Create User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'trainee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Superadmins can read all roles
CREATE POLICY "Superadmins can read all roles" 
ON public.user_roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);

-- 2. Secure the `trainees` table so only Admins/Superadmins can modify others, but Trainees can only edit themselves.
-- (We will replace the permissive prototype policies with secure ones)
DROP POLICY IF EXISTS "Allow public update access trainees" ON public.trainees;
CREATE POLICY "Secure update for trainees"
ON public.trainees FOR UPDATE
USING (
  -- Trainee updating their own profile
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR 
  -- Admin/Superadmin updating any profile
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- 3. Superadmin Seed Script
-- Instructions: The user must run this in Supabase Studio SQL Editor AFTER they create an account with email 'superadmin@nexus.com'

-- UPDATE public.user_roles 
-- SET role = 'superadmin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'superadmin@nexus.com');
