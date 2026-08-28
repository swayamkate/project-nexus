import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// GET /api/admin/staff - List all administrative accounts
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { data: staff, error } = await supabase
      .from('user_roles')
      .select('*')
      .in('role', ['superadmin', 'admin', 'evaluator'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, staff: staff || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch staff directory' }, { status: 500 });
  }
}

// POST /api/admin/staff - Provision new Superadmin / Admin / Evaluator
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();
    const username = (body.username || '').trim().toLowerCase() || email.split('@')[0];
    const role = body.role || 'admin';
    const department = body.department || 'State Skill Mission';
    const district = body.district || 'Maharashtra HQ';
    const permissions = body.permissions || {
      can_edit_schemes: true,
      can_edit_courses: true,
      can_edit_assessments: true,
      can_verify_trainees: true,
      can_manage_users: true,
      can_publish_analytics: true
    };

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email and password (min 6 chars) are required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Create or update in auth.users using Supabase Admin
    const { data: userData, error: createAuthErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        username,
        full_name: body.fullName || username
      }
    });

    let userId = userData?.user?.id;

    if (createAuthErr) {
      // If user already exists in auth.users, update their password and role
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const match = existingUser?.users?.find(u => u.email?.toLowerCase() === email);
      if (match) {
        userId = match.id;
        await supabase.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
          user_metadata: { role, username, full_name: body.fullName || username }
        });
      } else {
        throw createAuthErr;
      }
    }

    // 2. Upsert in public.user_roles
    const { error: roleErr } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        email,
        username,
        role,
        is_active: true,
        department,
        district,
        permissions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (roleErr) throw roleErr;

    // 3. Log audit event
    await supabase.from('audit_logs').insert({
      admin_email: 'SUPERADMIN_DESK',
      action: 'PROVISION_STAFF',
      target_entity: 'USER_ROLES',
      details: `Provisioned ${role} account for ${email} (@${username}) in district ${district}`,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: `Staff account for ${email} (${role}) provisioned successfully!`,
      user_id: userId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to provision staff account' }, { status: 500 });
  }
}

// PUT /api/admin/staff - Update staff status, password, role, and permissions
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, action, newPassword, role, is_active, permissions, department, district } = body;

    if (!email) {
      return NextResponse.json({ error: 'Target staff email is required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Password Reset Action
    if (action === 'RESET_PASSWORD' && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
      }

      // Find user ID
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (userRole?.user_id) {
        const { error: resetErr } = await supabase.auth.admin.updateUserById(userRole.user_id, {
          password: newPassword
        });
        if (resetErr) throw resetErr;
      } else {
        // Fallback to direct SQL function
        const { error: rpcErr } = await supabase.rpc('admin_reset_user_password', {
          target_user_email: email.trim().toLowerCase(),
          new_plain_password: newPassword
        });
        if (rpcErr) throw rpcErr;
      }

      await supabase.from('audit_logs').insert({
        admin_email: 'SUPERADMIN_DESK',
        action: 'STAFF_PASSWORD_RESET',
        target_entity: 'AUTH_USERS',
        details: `SuperAdmin reset password for staff member ${email}`,
        status: 'Success'
      });

      return NextResponse.json({ success: true, message: `Password for ${email} updated successfully.` });
    }

    // 2. Status / Role / Permissions Update
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (typeof is_active === 'boolean') updatePayload.is_active = is_active;
    if (role) updatePayload.role = role;
    if (permissions) updatePayload.permissions = permissions;
    if (department) updatePayload.department = department;
    if (district) updatePayload.district = district;

    const { error: updateErr } = await supabase
      .from('user_roles')
      .update(updatePayload)
      .eq('email', email.trim().toLowerCase());

    if (updateErr) throw updateErr;

    await supabase.from('audit_logs').insert({
      admin_email: 'SUPERADMIN_DESK',
      action: 'UPDATE_STAFF_GOVERNANCE',
      target_entity: 'USER_ROLES',
      details: `Updated administrative governance metadata for ${email}`,
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: `Staff governance updated for ${email}.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update staff account' }, { status: 500 });
  }
}

// DELETE /api/admin/staff - Purge staff administrative privileges
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Target email is required.' }, { status: 400 });
    }

    if (email === 'admin@nexus.com' || email === 'superadmin@nexus.gov.in') {
      return NextResponse.json({ error: 'Cannot delete primary root superadmin account.' }, { status: 403 });
    }

    const supabase = getAdminClient();

    // 1. Get user_id
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    // 2. Remove role
    await supabase.from('user_roles').delete().eq('email', email);

    // 3. Remove auth account if user_id exists
    if (userRole?.user_id) {
      await supabase.auth.admin.deleteUser(userRole.user_id);
    }

    await supabase.from('audit_logs').insert({
      admin_email: 'SUPERADMIN_DESK',
      action: 'PURGE_STAFF_PRIVILEGES',
      target_entity: 'USER_ROLES',
      details: `Permanently purged administrative privileges for ${email}`,
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: `Staff record ${email} removed.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to remove staff privileges' }, { status: 500 });
  }
}
