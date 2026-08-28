import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k';

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// Cross-Sector Translatability Rules Matrix (Feature 7)
const TRANS_MATRIX: Record<string, { target_sector: string; translatability_score_pct: number; shared_competencies: string[]; bridging_hours: number }[]> = {
  'Automotive & EV': [
    { target_sector: 'Renewable Energy & Solar', translatability_score_pct: 82, shared_competencies: ['High-Voltage DC Circuits', 'Inverter Wiring', 'Battery Safety'], bridging_hours: 45 },
    { target_sector: 'Industrial Robotics', translatability_score_pct: 78, shared_competencies: ['CAN-Bus Diagnostics', 'Pneumatic Actuators', 'Sensor Calibration'], bridging_hours: 60 }
  ],
  'Manufacturing & CNC': [
    { target_sector: 'Aerospace Components', translatability_score_pct: 88, shared_competencies: ['Precision G-Code Programming', 'Micrometer Metrology', 'Tolerance Quality'], bridging_hours: 30 },
    { target_sector: 'Medical Device Tooling', translatability_score_pct: 84, shared_competencies: ['Surface Roughness Testing', 'Cleanroom Operation', 'CNC Turning'], bridging_hours: 40 }
  ],
  'Electrical & Electronics': [
    { target_sector: 'EV Charging Infrastructure', translatability_score_pct: 91, shared_competencies: ['Three-Phase Power Distribution', 'Earthing Testing', 'Circuit Breakers'], bridging_hours: 25 },
    { target_sector: 'Solar Microgrids', translatability_score_pct: 89, shared_competencies: ['Net Metering', 'Inverter Sync', 'Surge Protection'], bridging_hours: 30 }
  ]
};

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'all';

    // 1. Fetch Real Vacancies (Feature 8)
    const { data: vacancies } = await supabase
      .from('job_market_vacancies')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // 2. Fetch Real 5-Year Forecasts (Feature 10)
    const { data: forecasts } = await supabase
      .from('trade_demand_forecasts')
      .select('*')
      .order('growth_rate_pct', { ascending: false });

    // 3. Fetch Real Curriculum Gap Analyses (Feature 3)
    const { data: curriculumGaps } = await supabase
      .from('curriculum_gap_analyses')
      .select('*')
      .order('industry_demand_pct', { ascending: false });

    // 4. Compute Placement Probabilities & Attrition Early Warnings (Features 4, 11)
    const [
      { data: trainees },
      { data: employmentList },
      { data: followupsList }
    ] = await Promise.all([
      supabase.from('trainees').select('id, full_name, email, district, skills, is_verified'),
      supabase.from('trainee_employment').select('*'),
      supabase.from('trainee_followups').select('*')
    ]);

    const scoredCandidates = (trainees || []).map((t: any) => {
      const emp = (employmentList || []).find((e: any) => e.trainee_id === t.id);
      const followups = (followupsList || []).filter((f: any) => f.trainee_id === t.id);
      const skillCount = (t.skills || []).length;
      
      // Calculate placement probability (Feature 11)
      let probability = 50 + (skillCount * 8);
      if (t.is_verified) probability += 15;
      if (emp?.status === 'employed') probability += 20;
      probability = Math.min(98, Math.max(35, probability));

      // Calculate 3M Attrition Risk (Feature 4)
      let attritionRisk: 'Low' | 'Moderate' | 'High' = 'Low';
      let riskFactor = 'Stable wage progression & local placement';

      if (emp?.status === 'employed') {
        const salary = Number(emp.monthly_salary || 0);
        if (salary > 0 && salary < 15000) {
          attritionRisk = 'High';
          riskFactor = 'Starting wage below district living cost threshold';
        } else if (followups.some((f: any) => f.job_satisfaction_score && f.job_satisfaction_score < 3)) {
          attritionRisk = 'Moderate';
          riskFactor = 'Low job satisfaction reported in recent follow-up';
        }
      } else if (emp?.status === 'not_employed') {
        attritionRisk = 'High';
        riskFactor = emp.unemployed_reason ? emp.unemployed_reason.replace(/_/g, ' ') : 'Awaiting placement';
      }

      return {
        id: t.id,
        full_name: t.full_name,
        email: t.email,
        district: t.district || 'Pune',
        placement_probability_pct: probability,
        attrition_risk: attritionRisk,
        risk_factor: riskFactor,
        verified: t.is_verified,
        status: emp?.status || 'not_employed'
      };
    });

    return NextResponse.json({
      success: true,
      vacancies: vacancies || [],
      forecasts: forecasts || [],
      curriculumGaps: curriculumGaps || [],
      translatabilityMatrix: TRANS_MATRIX,
      scoredCandidates
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to compute AI workforce metrics' }, { status: 500 });
  }
}
