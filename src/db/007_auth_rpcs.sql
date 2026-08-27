-- 007_auth_rpcs.sql
-- Enables public username resolution and availability checks for /login and signup under Zero-Trust RLS

CREATE OR REPLACE FUNCTION public.get_trainee_email_by_username(p_username TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT email FROM public.trainees WHERE LOWER(username) = LOWER(p_username) LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.get_trainee_email_by_username(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.trainees WHERE LOWER(username) = LOWER(p_username));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO anon, authenticated;
