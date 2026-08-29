import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

export async function GET() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });

  const { count } = await supabase
    .from('trainee_followups')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return NextResponse.json({
    success: true,
    engine: 'CareerLoop Longitudinal AI Survey Worker',
    endpoint: 'https://administrator.avishkark.in/api/cron/milestones',
    status: 'Operational',
    registeredPendingSurveys: count || 0,
    timestamp: new Date().toISOString()
  });
}
