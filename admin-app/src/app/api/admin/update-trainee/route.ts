import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// PUT /api/admin/update-trainee - Edit every data point of a candidate profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainee_id, profile, employment, verification } = body;

    if (!trainee_id) {
      return NextResponse.json({ error: 'trainee_id is required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Update public.trainees
    if (profile) {
      const traineeUpdates: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (profile.full_name !== undefined) traineeUpdates.full_name = profile.full_name;
      if (profile.email !== undefined) traineeUpdates.email = profile.email;
      if (profile.phone !== undefined) traineeUpdates.phone = profile.phone;
      if (profile.dob !== undefined) traineeUpdates.dob = profile.dob?.trim() ? profile.dob.trim() : null;
      if (profile.gender !== undefined) traineeUpdates.gender = profile.gender;
      if (profile.aadhaar_masked !== undefined) traineeUpdates.aadhaar_masked = profile.aadhaar_masked;
      if (profile.address !== undefined) traineeUpdates.address = profile.address;
      if (profile.district !== undefined) traineeUpdates.district = profile.district;
      if (profile.state !== undefined) traineeUpdates.state = profile.state;
      if (profile.pincode !== undefined) traineeUpdates.pincode = profile.pincode;
      if (profile.about_me !== undefined) traineeUpdates.about_me = profile.about_me;
      if (profile.skills !== undefined) traineeUpdates.skills = profile.skills;
      if (profile.highest_education !== undefined) traineeUpdates.highest_education = profile.highest_education;
      if (profile.board_university !== undefined) traineeUpdates.board_university = profile.board_university;
      if (profile.year_of_passing !== undefined) traineeUpdates.year_of_passing = profile.year_of_passing;
      if (profile.education_percentage !== undefined) traineeUpdates.education_percentage = profile.education_percentage;
      if (profile.avatar_url !== undefined) traineeUpdates.avatar_url = profile.avatar_url;
      if (profile.is_verified !== undefined) traineeUpdates.is_verified = profile.is_verified;
      if (profile.verification_notes !== undefined) traineeUpdates.verification_notes = profile.verification_notes;
      if (profile.verified_by !== undefined) traineeUpdates.verified_by = profile.verified_by;
      if (profile.verified_at !== undefined) traineeUpdates.verified_at = profile.verified_at?.trim() ? profile.verified_at.trim() : null;

      const { error: tErr } = await supabase
        .from('trainees')
        .update(traineeUpdates)
        .eq('id', trainee_id);

      if (tErr) throw tErr;
    }

    // 2. Update or Insert public.trainee_employment
    if (employment) {
      const empPayload: Record<string, any> = {
        trainee_id,
        status: employment.status || 'not_employed',
        company_name: employment.company_name || null,
        designation: employment.designation || null,
        joining_date: employment.joining_date?.trim() ? employment.joining_date.trim() : null,
        monthly_salary: employment.monthly_salary ? Number(employment.monthly_salary) : null,
        pf_esic_number: employment.pf_esic_number || null,
        work_location: employment.work_location || null,
        appreciation_details: employment.appreciation_details || null,
        business_name: employment.business_name || null,
        business_type: employment.business_type || null,
        business_category: employment.business_category || null,
        monthly_revenue: employment.monthly_revenue ? Number(employment.monthly_revenue) : null,
        monthly_profit: employment.monthly_profit ? Number(employment.monthly_profit) : null,
        udyam_number: employment.udyam_number || null,
        gst_number: employment.gst_number || null,
        employees_count: employment.employees_count ? Number(employment.employees_count) : null,
        unemployed_reason: employment.unemployed_reason || null,
        unemployed_perspective: employment.unemployed_perspective || null,
        target_workforce_timeline: employment.target_workforce_timeline || null,
        support_needed: employment.support_needed || null,
        verified_by_admin: Boolean(employment.verified_by_admin),
        verified_at: employment.verified_at?.trim() ? employment.verified_at.trim() : null,
        updated_at: new Date().toISOString()
      };

      const { data: existingEmp } = await supabase
        .from('trainee_employment')
        .select('id')
        .eq('trainee_id', trainee_id)
        .maybeSingle();

      if (existingEmp?.id) {
        const { error: empErr } = await supabase
          .from('trainee_employment')
          .update(empPayload)
          .eq('id', existingEmp.id);
        if (empErr) throw empErr;
      } else {
        const { error: empErr } = await supabase
          .from('trainee_employment')
          .insert(empPayload);
        if (empErr) throw empErr;
      }
    }

    // 3. Log to audit trail
    await supabase.from('audit_logs').insert({
      admin_email: 'ADMIN_DESK',
      action: 'UPDATE_TRAINEE_RECORD',
      target_entity: 'TRAINEES',
      details: `Full profile and employment modification applied to candidate ${trainee_id}`,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      message: 'Candidate profile and occupational records successfully updated in PostgreSQL database.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update trainee record' }, { status: 500 });
  }
}
