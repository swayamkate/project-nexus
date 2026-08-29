import { createClient } from '@/lib/supabaseBrowser';

/**
 * Universally resolves the real acting administrator email
 * from either the active Supabase session or the /api/auth/me endpoint.
 */
export async function getAdminActorEmail(explicitEmail?: string): Promise<string> {
  if (explicitEmail && explicitEmail !== 'admin@nexus.com') {
    return explicitEmail;
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) return user.email;

    const meRes = await fetch('/api/auth/me');
    if (meRes.ok) {
      const meData = await meRes.json();
      if (meData?.user?.email) return meData.user.email;
    }
  } catch (err) {
    console.error('Failed to resolve admin actor email:', err);
  }

  return 'admin@avishkark.in';
}

/**
 * Inserts a structured, immutable audit log entry into public.audit_logs
 * with the real administrator's email.
 */
export async function logAdminAction(
  action: string,
  targetEntity: string,
  targetId: string | null,
  details: string,
  explicitEmail?: string,
  status: 'Success' | 'Failed' = 'Success'
) {
  try {
    const supabase = createClient();
    const actorEmail = await getAdminActorEmail(explicitEmail);

    await supabase.from('audit_logs').insert({
      admin_email: actorEmail,
      action,
      target_entity: targetEntity,
      target_id: targetId,
      details,
      status
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}
