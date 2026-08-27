import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputIdentifier = (body.email || body.username || body.identifier || '').trim();
    const inputPassword = (body.password || '').trim();

    if (!inputIdentifier || !inputPassword) {
      return NextResponse.json({ error: 'Username/email and password are required.' }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const dbClient = serviceKey
      ? createClient(SUPABASE_URL, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
      : supabase;

    // 1. Resolve email if a username was provided
    let loginEmail = inputIdentifier;
    if (!loginEmail.includes('@')) {
      const { data: userRole } = await dbClient
        .from('user_roles')
        .select('email')
        .eq('username', inputIdentifier.toLowerCase())
        .in('role', ['admin', 'superadmin', 'evaluator'])
        .maybeSingle();

      if (userRole?.email) {
        loginEmail = userRole.email;
      }
    }

    // 2. Authenticate through Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: inputPassword,
    });

    if (authError || !authData.user || !authData.session) {
      return NextResponse.json({ error: 'Invalid executive credentials or unconfirmed account.' }, { status: 401 });
    }

    // 3. Verify user has administrative privileges in database
    const { data: roleRecord, error: roleError } = await dbClient
      .from('user_roles')
      .select('role, username, email')
      .or(`user_id.eq.${authData.user.id},email.eq.${loginEmail}`)
      .in('role', ['superadmin', 'admin', 'evaluator'])
      .maybeSingle();

    if (roleError || !roleRecord) {
      return NextResponse.json({ error: 'Access Denied: Account lacks administrative privileges.' }, { status: 403 });
    }

    // 4. Issue secure HttpOnly session cookies
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: authData.user.id,
        email: authData.user.email || roleRecord.email, 
        username: roleRecord.username || authData.user.email?.split('@')[0], 
        role: roleRecord.role 
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at
      }
    });

    const isProd = process.env.NODE_ENV === 'production';

    response.cookies.set({
      name: 'nexus_admin_session',
      value: authData.session.access_token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    response.cookies.set({
      name: 'sb_access_token',
      value: authData.session.access_token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed.' }, { status: 500 });
  }
}
