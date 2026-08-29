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

function extractRawToken(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let token = raw.trim();

  // If header has Bearer prefix
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  // Handle base64 encoded strings
  if (token.startsWith('base64-')) {
    try {
      token = Buffer.from(token.replace('base64-', ''), 'base64').toString('utf-8');
    } catch {}
  }

  // Handle JSON encoded cookie values (e.g. Supabase auth cookie: ["access_token", "refresh_token"] or { access_token: "..." })
  if (token.startsWith('[') || token.startsWith('{') || token.startsWith('%5B') || token.startsWith('%7B')) {
    try {
      const decoded = decodeURIComponent(token);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'string') {
        token = parsed[0];
      } else if (parsed.access_token && typeof parsed.access_token === 'string') {
        token = parsed.access_token;
      }
    } catch {}
  }

  return token.length > 10 ? token : null;
}

export async function verifyAdminSession(request?: NextRequest): Promise<VerifiedAdminUser | null> {
  try {
    let token: string | null = null;

    // 1. Check Request Headers
    if (request) {
      const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
      if (authHeader) {
        token = extractRawToken(authHeader);
      }
      if (!token) {
        token = extractRawToken(request.headers.get('x-admin-token'));
      }
    }

    // 2. Check Next.js CookieStore and Request Cookies
    if (!token) {
      try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        
        // Priority cookie names
        const priorityNames = [
          'careerloop_admin_session',
          'nexus_admin_session',
          'sb_access_token',
          'sb-access-token',
          'supabase-auth-token'
        ];

        for (const name of priorityNames) {
          const cookieVal = cookieStore.get(name)?.value;
          if (cookieVal) {
            token = extractRawToken(cookieVal);
            if (token) break;
          }
        }

        // Search for any supabase auth token cookie (e.g. sb-*-auth-token)
        if (!token) {
          for (const c of allCookies) {
            if (c.name.includes('auth-token') || c.name.includes('admin_session') || c.name.includes('sb_')) {
              const extracted = extractRawToken(c.value);
              if (extracted) {
                token = extracted;
                break;
              }
            }
          }
        }
      } catch {
        // Fallback to request cookies if cookieStore throws
        if (request) {
          const cVal = request.cookies.get('careerloop_admin_session')?.value ||
                       request.cookies.get('nexus_admin_session')?.value ||
                       request.cookies.get('sb_access_token')?.value;
          token = extractRawToken(cVal);
        }
      }
    }

    if (!token) return null;

    // 3. Connect to Supabase Auth using Service Role key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const supabase = createClient(SUPABASE_URL, serviceKey || SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return null;

    // 4. Query user_roles table in database
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role, username, email, is_active')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (userRole && userRole.is_active !== false) {
      if (['superadmin', 'admin', 'evaluator', 'employer'].includes(userRole.role)) {
        return {
          userId: user.id,
          email: user.email || userRole.email,
          username: userRole.username || user.email?.split('@')[0],
          role: userRole.role as 'superadmin' | 'admin' | 'evaluator' | 'employer'
        };
      }
    }

    // 5. Fallback for recognized root superadmins
    const superadminEmails = ['admin@avishkark.in', 'avishkarkedar@gmail.com', 'admin@nexus.com', 'admin@nexus.gov.in'];
    if (user.email && superadminEmails.includes(user.email.toLowerCase())) {
      return {
        userId: user.id,
        email: user.email,
        username: user.email.split('@')[0],
        role: 'superadmin'
      };
    }

    return null;
  } catch (err) {
    console.error('verifyAdminSession error:', err);
    return null;
  }
}
