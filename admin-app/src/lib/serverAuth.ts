import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

export interface VerifiedAdminUser {
  userId: string;
  email: string;
  username?: string;
  role: 'superadmin' | 'admin' | 'evaluator' | 'employer';
}

export async function verifyAdminSession(request?: NextRequest): Promise<VerifiedAdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('careerloop_admin_session')?.value ||
                  cookieStore.get('sb_access_token')?.value || 
                  cookieStore.get('nexus_admin_session')?.value ||
                  request?.cookies.get('careerloop_admin_session')?.value ||
                  request?.cookies.get('sb_access_token')?.value ||
                  request?.cookies.get('nexus_admin_session')?.value ||
                  request?.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) return null;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return null;

    // Check user_roles table in database
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const dbClient = serviceKey
      ? createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
      : supabase;

    const { data: userRole, error: roleError } = await dbClient
      .from('user_roles')
      .select('role, username, email')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleError || !userRole) {
      if (user.email) {
        const { data: emailRole } = await dbClient
          .from('user_roles')
          .select('role, username, email')
          .eq('email', user.email)
          .maybeSingle();
        if (emailRole && ['superadmin', 'admin', 'evaluator', 'employer'].includes(emailRole.role)) {
          return {
            userId: user.id,
            email: user.email,
            username: emailRole.username,
            role: emailRole.role as 'superadmin' | 'admin' | 'evaluator' | 'employer'
          };
        }
      }
      return null;
    }

    if (!['superadmin', 'admin', 'evaluator', 'employer'].includes(userRole.role)) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || userRole.email,
      username: userRole.username,
      role: userRole.role as 'superadmin' | 'admin' | 'evaluator' | 'employer'
    };
  } catch (err) {
    console.error('verifyAdminSession error:', err);
    return null;
  }
}
