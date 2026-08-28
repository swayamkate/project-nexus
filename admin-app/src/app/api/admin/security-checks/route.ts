import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();

    // 1. Scan for Duplicate Identity & Dual-Enrollment (Feature 35)
    const { data: trainees } = await supabase
      .from('trainees')
      .select('id, full_name, email, phone, aadhaar_masked, district, created_at');

    const duplicateFlags: any[] = [];
    const phoneMap: Record<string, string[]> = {};
    const emailPrefixMap: Record<string, string[]> = {};
    const aadhaarMap: Record<string, string[]> = {};

    (trainees || []).forEach((t: any) => {
      // Check phone duplication
      if (t.phone && t.phone.trim().length > 5) {
        const cleanPhone = t.phone.trim();
        if (!phoneMap[cleanPhone]) phoneMap[cleanPhone] = [];
        phoneMap[cleanPhone].push(t.id);
      }

      // Check Masked Aadhaar duplication
      if (t.aadhaar_masked && t.aadhaar_masked !== 'XXXX-XXXX-XXXX' && t.aadhaar_masked.length > 8) {
        if (!aadhaarMap[t.aadhaar_masked]) aadhaarMap[t.aadhaar_masked] = [];
        aadhaarMap[t.aadhaar_masked].push(t.id);
      }
    });

    // Collate duplicate alerts
    Object.entries(phoneMap).forEach(([phone, ids]) => {
      if (ids.length > 1) {
        duplicateFlags.push({
          type: 'DUPLICATE_PHONE',
          identifier: phone,
          severity: 'High',
          matched_candidates_count: ids.length,
          candidate_ids: ids,
          description: `Multiple candidate accounts sharing phone identifier ${phone}`
        });
      }
    });

    Object.entries(aadhaarMap).forEach(([aadhaar, ids]) => {
      if (ids.length > 1) {
        duplicateFlags.push({
          type: 'DUPLICATE_AADHAAR_HASH',
          identifier: aadhaar,
          severity: 'Critical',
          matched_candidates_count: ids.length,
          candidate_ids: ids,
          description: `Potential identity collusion with identical masked Aadhaar pattern ${aadhaar}`
        });
      }
    });

    // 2. Fetch Document Tamper / Fraud Scans (Feature 38)
    const { data: fraudScans } = await supabase
      .from('document_fraud_checks')
      .select('*, trainees(full_name, email, district)')
      .order('scanned_at', { ascending: false });

    // 3. Fetch Profile Audit Logs (Feature 40)
    const { data: auditLogs } = await supabase
      .from('trainee_profile_audit_logs')
      .select('*, trainees(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      success: true,
      duplicateFlags,
      fraudScans: fraudScans || [],
      profileAuditLogs: auditLogs || [],
      totalCandidatesScanned: trainees?.length || 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to execute security audit scan' }, { status: 500 });
  }
}
