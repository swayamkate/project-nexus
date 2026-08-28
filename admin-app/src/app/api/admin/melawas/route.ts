import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// GET /api/admin/melawas - List all state job fairs and unplaced candidates queue
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    // 1. Fetch Melawas
    const { data: melawas, error: mErr } = await supabase
      .from('rozgar_melawas')
      .select('*')
      .order('event_date', { ascending: true });

    if (mErr) throw mErr;

    // 2. Fetch Second-Chance Re-Engagement Candidate Queue (Feature 22)
    const { data: unplacedTrainees } = await supabase
      .from('trainee_employment')
      .select('*, trainees(id, full_name, email, district, skills, phone)')
      .eq('status', 'not_employed')
      .order('created_at', { ascending: false });

    // 3. Fetch Melawa Registrations
    const { data: registrations } = await supabase
      .from('melawa_registrations')
      .select('*, trainees(full_name, email, phone, district), rozgar_melawas(event_title, district, event_date)')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      melawas: melawas || [],
      secondChanceQueue: unplacedTrainees || [],
      registrations: registrations || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch Melawa data' }, { status: 500 });
  }
}

// POST /api/admin/melawas - Schedule New Rozgar Melawa or Register Trainee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    if (body.action === 'REGISTER_CANDIDATE') {
      const { melawa_id, trainee_id } = body;
      const qrPassToken = `QR-SSDM-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const { data, error } = await supabase
        .from('melawa_registrations')
        .insert({
          melawa_id,
          trainee_id,
          qr_pass_token: qrPassToken,
          registration_status: 'registered'
        })
        .select()
        .single();

      if (error) throw error;

      // Increment registered count
      try {
        await supabase.rpc('increment_melawa_count', { row_id: melawa_id });
      } catch (_) {}

      return NextResponse.json({ success: true, message: 'Candidate enrolled with QR Pass', registration: data });
    }

    // Schedule New Event
    const {
      event_title,
      district,
      venue_address,
      event_date,
      start_time,
      end_time,
      participating_employers_count,
      target_trades,
      available_openings
    } = body;

    if (!event_title || !district || !venue_address || !event_date) {
      return NextResponse.json({ error: 'Title, district, venue, and date are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rozgar_melawas')
      .insert({
        event_title,
        district,
        venue_address,
        event_date,
        start_time: start_time || '09:00 AM',
        end_time: end_time || '05:00 PM',
        participating_employers_count: participating_employers_count ? Number(participating_employers_count) : 10,
        target_trades: target_trades || [],
        available_openings: available_openings ? Number(available_openings) : 100,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('audit_logs').insert({
      admin_email: 'ADMIN_DESK',
      action: 'SCHEDULE_ROZGAR_MELAWA',
      target_entity: 'ROZGAR_MELAWAS',
      details: `Scheduled ${event_title} in ${district} for ${event_date}`,
      status: 'Success'
    });

    return NextResponse.json({ success: true, message: `Rozgar Melawa "${event_title}" published successfully!`, event: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to schedule Rozgar Melawa' }, { status: 500 });
  }
}
