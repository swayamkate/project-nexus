import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ALLOWED_TABLES = new Set([
  'trainees',
  'trainee_employment',
  'trainee_enrollments',
  'trainee_course_enrollments',
  'training_programs',
  'verifications',
  'trainee_followups',
  'trainee_career_goals',
  'career_roadmaps',
  'scheme_applications',
  'assessment_submissions',
  'support_tickets',
  'trainee_notifications',
  'enterprise_ledger',
  'interview_questions',
  'external_courses',
  'recommended_opportunities',
  'user_roles'
]);

function sanitizePayload(table: string, payload: any): any {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(table, item));
  }

  const clean = { ...payload };

  // Sanitize empty date strings to null for Postgres date columns
  const dateFields = [
    'dob',
    'enrolled_date',
    'completed_date',
    'certified_date',
    'joining_date',
    'establishment_date',
    'start_date',
    'due_date',
    'submitted_date',
    'verified_at',
    'reviewed_at',
    'target_completion_date',
    'completed_at'
  ];

  dateFields.forEach(f => {
    if (f in clean) {
      if (typeof clean[f] === 'string') {
        const trimmed = clean[f].trim();
        clean[f] = trimmed.length > 0 ? trimmed : null;
      }
    }
  });

  // Protect VARCHAR(10) column in trainee_enrollments
  if (table === 'trainee_enrollments' && clean.grade && typeof clean.grade === 'string') {
    clean.grade = clean.grade.trim().slice(0, 10);
  }

  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { table, action, payload, match, onConflict, select = '*' } = body;

    if (!table || !ALLOWED_TABLES.has(table)) {
      return NextResponse.json(
        { error: `Unauthorized or invalid table: "${table}"` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    payload = sanitizePayload(table, payload);

    if (action === 'insert') {
      const { data, error } = await supabase.from(table).insert(payload).select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'upsert') {
      try {
        const { data, error } = await supabase
          .from(table)
          .upsert(payload, onConflict ? { onConflict } : undefined)
          .select(select);
        
        if (!error) {
          return NextResponse.json({ success: true, data });
        }
        
        // If error is 42P10 (no unique constraint for ON CONFLICT), fallback to find-then-update/insert
        if (error.code === '42P10' || error.message?.includes('ON CONFLICT') || error.message?.includes('constraint')) {
          console.warn(`Upsert ON CONFLICT fallback for table "${table}":`, error.message);
          return await executeFallbackUpsert(supabase, table, payload, onConflict, select);
        }
        throw error;
      } catch (err: any) {
        if (err.code === '42P10' || err.message?.includes('ON CONFLICT') || err.message?.includes('constraint')) {
          return await executeFallbackUpsert(supabase, table, payload, onConflict, select);
        }
        throw err;
      }
    }

    if (action === 'update') {
      if (!match || Object.keys(match).length === 0) {
        return NextResponse.json({ error: 'Update requires match criteria' }, { status: 400 });
      }
      let query = supabase.from(table).update(payload);
      Object.entries(match).forEach(([col, val]) => {
        query = query.eq(col, val);
      });
      const { data, error } = await query.select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete') {
      if (!match || Object.keys(match).length === 0) {
        return NextResponse.json({ error: 'Delete requires match criteria' }, { status: 400 });
      }
      let query = supabase.from(table).delete();
      Object.entries(match).forEach(([col, val]) => {
        query = query.eq(col, val);
      });
      const { data, error } = await query.select(select);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: `Invalid action: "${action}"` }, { status: 400 });
  } catch (err: any) {
    console.error('Server Mutation Error:', err);
    return NextResponse.json(
      { error: err.message || 'Database mutation failed', details: err.details, code: err.code },
      { status: 500 }
    );
  }
}

async function executeFallbackUpsert(supabase: any, table: string, payload: any, onConflict: string | undefined, select: string) {
  const item = Array.isArray(payload) ? payload[0] : payload;
  
  let matchCriteria: Record<string, any> = {};
  if (item.id) {
    matchCriteria = { id: item.id };
  } else if (onConflict) {
    const cols = onConflict.split(',').map((c: string) => c.trim());
    cols.forEach((col: string) => {
      if (item[col] !== undefined) matchCriteria[col] = item[col];
    });
  }
  
  if (Object.keys(matchCriteria).length === 0 && item.trainee_id) {
    matchCriteria = { trainee_id: item.trainee_id };
    if (table === 'trainee_enrollments' && item.program_id) {
      matchCriteria.program_id = item.program_id;
    }
    if (table === 'trainee_course_enrollments' && item.course_id) {
      matchCriteria.course_id = item.course_id;
    }
  }

  if (Object.keys(matchCriteria).length > 0) {
    let checkQuery = supabase.from(table).select('id');
    Object.entries(matchCriteria).forEach(([k, v]) => {
      checkQuery = checkQuery.eq(k, v);
    });
    const { data: existing } = await checkQuery.maybeSingle();

    if (existing && existing.id) {
      const { data: updated, error: updateErr } = await supabase
        .from(table)
        .update(item)
        .eq('id', existing.id)
        .select(select);
      if (updateErr) throw updateErr;
      return NextResponse.json({ success: true, data: updated });
    }
  }

  const { data: inserted, error: insertErr } = await supabase
    .from(table)
    .insert(item)
    .select(select);
  if (insertErr) throw insertErr;
  return NextResponse.json({ success: true, data: inserted });
}
