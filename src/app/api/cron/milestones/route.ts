import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.k_sample_key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const startTime = Date.now();
  let surveysProcessed = 0;
  let notificationsDispatched = 0;

  try {
    // 1. Fetch upcoming followups in next 15 days that are scheduled
    const today = new Date().toISOString().split('T')[0];
    const { data: dueFollowups, error: fError } = await supabase
      .from('trainee_followups')
      .select('id, trainee_id, milestone, due_date, status')
      .lte('due_date', today)
      .eq('status', 'scheduled');

    if (fError) throw fError;

    if (dueFollowups && dueFollowups.length > 0) {
      for (const f of dueFollowups) {
        // Mark as pending action
        await supabase
          .from('trainee_followups')
          .update({ status: 'pending' })
          .eq('id', f.id);

        // Dispatch in-app trainee notification
        await supabase.from('trainee_notifications').insert({
          trainee_id: f.trainee_id,
          title: `Action Required: Longitudinal Survey (${f.milestone.replace('_', ' ')}) Due`,
          message: `Your mandatory career check-in is now due. Please complete the quick survey to verify your employment and maintain grant eligibility.`,
          type: 'survey'
        });

        surveysProcessed++;
        notificationsDispatched++;
      }
    }

    // 2. Log cron execution to audit_logs
    await supabase.from('audit_logs').insert({
      admin_email: 'system.cron@nexus.in',
      action: 'CRON_LONGITUDINAL_SCHEDULER',
      target_entity: 'TRAINEE_FOLLOWUPS',
      details: `Processed ${surveysProcessed} due milestones and dispatched ${notificationsDispatched} survey notifications.`,
      status: 'Success'
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      executionTimeMs: Date.now() - startTime,
      processed: {
        surveysDue: surveysProcessed,
        notificationsDispatched
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Cron execution failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
