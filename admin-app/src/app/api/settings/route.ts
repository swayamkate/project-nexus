import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/serverAuth';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  DEFAULT_SETTINGS,
  categoryOf,
  validateSettingsPatch,
  type SettingKey,
  type SettingsMap,
} from '@/lib/platformSettings';

/**
 * GET /api/settings
 * Returns the full settings map (defaults merged with stored overrides).
 * Requires any authenticated admin role.
 */
export async function GET(request: NextRequest) {
  const caller = await verifyAdminSession(request);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized: admin session required.' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('platform_settings')
      .select('key, value');

    if (error) throw error;

    const settings: SettingsMap = { ...DEFAULT_SETTINGS };
    for (const row of data ?? []) {
      if (Object.prototype.hasOwnProperty.call(settings, row.key)) {
        (settings as Record<string, unknown>)[row.key] = row.value;
      }
    }

    return NextResponse.json({ success: true, settings, updatedBy: caller.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load settings.';
    // Missing table (migration not applied yet) must not hard-crash the page.
    if (message.includes('does not exist') || message.includes('schema cache')) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS, migrationPending: true });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/settings
 * Upserts a validated patch of settings. Only admin/superadmin may write.
 * Every change is recorded in audit_logs.
 */
export async function PUT(request: NextRequest) {
  const caller = await verifyAdminSession(request);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized: admin session required.' }, { status: 401 });
  }
  if (caller.role !== 'admin' && caller.role !== 'superadmin') {
    return NextResponse.json(
      { error: 'Forbidden: only admins and superadmins can modify platform settings.' },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const patch = (body as { settings?: Record<string, unknown> })?.settings;
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return NextResponse.json({ error: 'Body must be { settings: { key: value, ... } }.' }, { status: 400 });
  }

  const { valid, errors } = validateSettingsPatch(patch);
  if (Object.keys(valid).length === 0) {
    return NextResponse.json({ error: 'No valid settings to save.', validationErrors: errors }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const rows = (Object.entries(valid) as [SettingKey, unknown][]).map(([key, value]) => ({
      key,
      value,
      category: categoryOf(key),
      updated_by: caller.userId,
    }));

    const { error: upsertError } = await supabaseAdmin
      .from('platform_settings')
      .upsert(rows, { onConflict: 'key' });

    if (upsertError) throw upsertError;

    const changedKeys = Object.keys(valid);
    await supabaseAdmin.from('audit_logs').insert({
      admin_email: caller.email,
      action: 'UPDATE_SYSTEM_SETTINGS',
      target_entity: 'PLATFORM_SETTINGS',
      details: `Updated settings: ${changedKeys.join(', ')}${errors.length ? ` (rejected: ${errors.join('; ')})` : ''}`,
      status: 'Success',
    });

    return NextResponse.json({
      success: true,
      savedKeys: changedKeys,
      validationErrors: errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save settings.';
    if (message.includes('does not exist') || message.includes('schema cache')) {
      return NextResponse.json(
        { error: 'platform_settings table is missing. Apply src/db/migrations/006_platform_settings.sql first.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
