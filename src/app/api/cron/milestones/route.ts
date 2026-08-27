import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-static';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.k_sample_key'
  );

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    status: 'Milestone Cron Active',
    processed: {
      surveysDue: 0,
      notificationsDispatched: 0
    }
  });
}
