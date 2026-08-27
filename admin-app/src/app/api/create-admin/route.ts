import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { verifyAdminSession } from '@/lib/serverAuth';

const CreateAdminSchema = z.object({
  email: z.string().email('Valid email address is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  username: z.string().min(2).max(50).optional(),
  role: z.enum(['admin', 'evaluator', 'superadmin']).default('admin')
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify caller has superadmin role
    const caller = await verifyAdminSession(request);
    if (!caller || caller.role !== 'superadmin') {
      return NextResponse.json({ 
        error: 'Forbidden: Only verified Superadmins can provision new administrative accounts.' 
      }, { status: 403 });
    }

    // 2. Validate input body
    const body = await request.json();
    const parseResult = CreateAdminSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ 
        error: parseResult.error.issues[0]?.message || 'Invalid input payload.' 
      }, { status: 400 });
    }

    const { email, password, username, role } = parseResult.data;

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!serviceKey) {
      return NextResponse.json({ 
        error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required on server.' 
      }, { status: 500 });
    }

    const supabaseAdmin = createSupabaseClient(SUPABASE_URL, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const cleanUsername = (username || email.split('@')[0]).toLowerCase().trim().replace(/[^a-z0-9_.]/g, '');

    // 3. Create User in Supabase Auth
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

    // 4. Assign Role in public.user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: newUser.user.id,
        email: email,
        username: cleanUsername,
        role: role
      }, { onConflict: 'email' });

    if (roleError) throw roleError;

    // 5. Log Action in Audit Logs
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        admin_email: caller.email,
        action: `PROVISION_ADMIN_${role.toUpperCase()}`,
        target_entity: 'user_roles',
        target_id: newUser.user.id,
        details: `Superadmin ${caller.email} created new ${role} account for ${email}`,
        status: 'Success'
      });

    return NextResponse.json({ 
      success: true, 
      message: `Admin account (${email}) created successfully with role '${role}'.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error creating admin.' }, { status: 500 });
  }
}
