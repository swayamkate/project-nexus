-- 1. Enable Superadmins to INSERT new roles
CREATE POLICY "Superadmins can insert roles" 
ON public.user_roles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);

-- 2. Enable Superadmins to UPDATE roles
CREATE POLICY "Superadmins can update roles" 
ON public.user_roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);

-- 3. Enable Superadmins to DELETE roles (demote admins)
CREATE POLICY "Superadmins can delete roles" 
ON public.user_roles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);
