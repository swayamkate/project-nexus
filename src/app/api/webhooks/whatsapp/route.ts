import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AttritionReason, EmploymentType } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // WhatsApp webhook verification challenge handshake
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'nexus_sih_2026_webhook_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: 'active', service: 'Nexus WhatsApp Automated Followup Webhook' });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // 1. Audit Log in Supabase
    try {
      await supabaseAdmin.from('webhook_events_log').insert({
        provider: 'whatsapp',
        event_type: payload.event_type || 'message_received',
        payload: payload,
        processed_status: 'processed'
      });
    } catch (e) {
      console.warn('Database audit logging skipped (offline/demo mode):', e);
    }

    // 2. Extract Message details
    // Format could be simulated test payload OR Meta WhatsApp Cloud API format
    const fromPhone = payload.from || payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || '+919876543210';
    const messageText = payload.text || payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || '';

    // 3. Intelligent Intent & Keyword Parser for Longitudinal Outcome Updates
    const textLower = messageText.toLowerCase();

    let detectedStatus: EmploymentType | null = null;
    let detectedWage: number | null = null;
    let detectedAttritionReason: AttritionReason | null = null;

    // Check employment conditions
    if (textLower.includes('permanent') || textLower.includes('full time') || textLower.includes('still working') || textLower.includes('working')) {
      detectedStatus = 'permanent';
    } else if (textLower.includes('temporary') || textLower.includes('contract') || textLower.includes('intern')) {
      detectedStatus = 'temporary';
    } else if (textLower.includes('self employ') || textLower.includes('freelance') || textLower.includes('own business')) {
      detectedStatus = 'self_employed';
    } else if (textLower.includes('unemployed') || textLower.includes('lost job') || textLower.includes('left') || textLower.includes('removed') || textLower.includes('looking for job')) {
      detectedStatus = 'unemployed';
    }

    // Check attrition reason
    if (textLower.includes('removed for no reason') || textLower.includes('no reason') || textLower.includes('abruptly removed')) {
      detectedAttritionReason = 'removed_no_reason';
    } else if (textLower.includes('layoff') || textLower.includes('downsizing') || textLower.includes('fired')) {
      detectedAttritionReason = 'layoff';
    } else if (textLower.includes('contract expired') || textLower.includes('contract over')) {
      detectedAttritionReason = 'contract_expired';
    } else if (textLower.includes('salary') || textLower.includes('low pay') || textLower.includes('compensation')) {
      detectedAttritionReason = 'compensation';
    }

    // Extract numbers representing salary (e.g., 38000, 42k, 45,000)
    const salaryMatch = textLower.match(/(?:salary|wage|pay|rs|inr)?\s*[:=]?\s*(\d{2,3}(?:,\d{3})+|\d{4,6}|\d{2}k)/i);
    if (salaryMatch) {
      let rawNum = salaryMatch[1].replace(/,/g, '');
      if (rawNum.toLowerCase().endsWith('k')) {
        detectedWage = parseFloat(rawNum) * 1000;
      } else {
        detectedWage = parseFloat(rawNum);
      }
    }

    // 4. Return processed diagnostic response
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      parsed_data: {
        from_phone: fromPhone,
        raw_message: messageText,
        detected_status: detectedStatus,
        detected_wage: detectedWage,
        detected_attrition_reason: detectedAttritionReason,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
