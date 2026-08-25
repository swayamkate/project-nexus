import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Verify caller is a Superadmin (using cookies/session)
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {}
        }
      }
    );

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check role in user_roles table
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!roleData || roleData.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden: Only Superadmins can create Admins.' }, { status: 403 });
    }

    // 2. Initialize Supabase Admin Client using SERVICE_ROLE_KEY
    // This securely bypasses all restrictions to create a user directly
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Create the new Admin User in auth.users
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // auto-verify their email since superadmin is creating them
    });

    if (createError) throw createError;

    // 4. Assign 'admin' role in user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'admin'
      });

    if (roleError) throw roleError;

    return NextResponse.json({ success: true, message: 'Admin user created successfully.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
