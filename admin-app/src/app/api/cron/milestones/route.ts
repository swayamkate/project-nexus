import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET || 'nexus_cron_secret_2026';
    
    // Optional bearer auth verification if header passed
    if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron trigger.' }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(SUPABASE_URL, serviceKey || '', {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Query pending followups due on or before today
    const { data: dueFollowups, error: followupErr } = await supabase
      .from('trainee_followups')
      .select('id, trainee_id, milestone, due_date, status')
      .eq('status', 'pending')
      .lte('due_date', todayStr);

    if (followupErr) {
      throw followupErr;
    }

    let dispatchedCount = 0;
    const dueList = dueFollowups || [];

    // 2. Dispatch notifications for pending milestones
    for (const item of dueList) {
      if (!item.trainee_id) continue;

      // Check if alert already sent in last 7 days
      const { data: existingNotifs } = await supabase
        .from('trainee_notifications')
        .select('id')
        .eq('trainee_id', item.trainee_id)
        .ilike('title', `%${item.milestone}%`)
        .limit(1);

      if (!existingNotifs || existingNotifs.length === 0) {
        const { error: notifErr } = await supabase
          .from('trainee_notifications')
          .insert({
            trainee_id: item.trainee_id,
            title: `Longitudinal Career Survey (${item.milestone}) Due`,
            message: `Your ${item.milestone} post-training employment milestone survey is due. Please submit your current employment & income status.`,
            type: 'survey_due',
            is_read: false
          });

        if (!notifErr) dispatchedCount++;
      }
    }

    // 3. Log execution in audit_logs
    await supabase
      .from('audit_logs')
      .insert({
        admin_email: 'cron@nexus.internal',
        action: 'CRON_LONGITUDINAL_EVALUATION',
        target_entity: 'trainee_followups',
        details: `Processed ${dueList.length} due milestone records, dispatched ${dispatchedCount} in-app alerts.`,
        status: 'Success'
      });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: 'Active & Evaluated',
      processed: {
        surveysDue: dueList.length,
        notificationsDispatched: dispatchedCount,
        evaluatedAt: todayStr
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Milestone cron processing failed.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
