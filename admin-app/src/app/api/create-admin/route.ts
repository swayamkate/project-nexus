import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.6dcfM62ZyvbxTPcLxYpCTVA9Tw0C_ueCORR7PqwDr9s';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, role = 'admin' } = await request.json();

    const cookieStore = await cookies();
    const isSuperadmin = cookieStore.get('nexus_superadmin')?.value === 'true';

    if (!isSuperadmin) {
      return NextResponse.json({ error: 'Forbidden: Only Superadmins can provision new Admin accounts.' }, { status: 403 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const cleanUsername = username || email.split('@')[0];

    // 1. Create User in Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username: cleanUsername,
        full_name: `Admin (${cleanUsername})`,
        role: role
      }
    });

    if (createError) throw createError;

    // 2. Assign Role in public.user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: newUser.user.id,
        email: email,
        username: cleanUsername,
        role: role as any
      }, { onConflict: 'email' });

    if (roleError) throw roleError;

    // 3. Log Action in Audit Logs
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        admin_email: 'admin@nexus.com',
        action: `Created new ${role}: ${email}`,
        target_entity: 'user_roles',
        target_id: newUser.user.id,
        status: 'Success'
      });

    return NextResponse.json({ 
      success: true, 
      message: `Admin account (${email}) created and confirmed successfully.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error creating admin.' }, { status: 500 });
  }
}
