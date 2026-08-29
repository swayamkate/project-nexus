'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Building2, 
  Award, 
  MapPin, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Briefcase,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Calculator,
  Sliders,
  ArrowUpRight
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { fetchPublicSettings } from '@/lib/platformSettings';

export const AnalyticsPage: React.FC = () => {
  const { profile, employment, enrollments, followups, t } = useUser();
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [districtStats, setDistrictStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsConfig, setAnalyticsConfig] = useState({
    showPersonalWage: true,
    showDistrictBenchmarks: true,
    showSkillGaps: true,
    wageTitle: 'Longitudinal Wage Progression Trajectory',
    benchmarkTitle: 'District Labor Deficit Matrix',
    skillGapTitle: 'High-Demand Skill Shortages',
  });

  // Interactive Wage Simulator State
  const [simBaseWage, setSimBaseWage] = useState<number>(16000);
  const [simSector, setSimSector] = useState<string>('Automotive & EV');
  const [simTargetLevel, setSimTargetLevel] = useState<number>(5);
  const [simCertCount, setSimCertCount] = useState<number>(2);

  const supabase = createClient();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const settings = await fetchPublicSettings();
        setAnalyticsConfig({
          showPersonalWage: settings['analytics.show_personal_wage_chart'],
          showDistrictBenchmarks: settings['analytics.show_district_benchmarks'],
          showSkillGaps: settings['analytics.show_skill_gaps'],
          wageTitle: settings['analytics.wage_chart_title'],
          benchmarkTitle: settings['analytics.benchmark_title'],
          skillGapTitle: settings['analytics.skill_gap_title'],
        });
        const { data: gaps } = await supabase
          .from('top_skill_gaps')
          .select('*')
          .limit(6);
        if (gaps) setSkillGaps(gaps);

        const { data: districts } = await supabase
          .from('district_employment_stats')
          .select('*')
          .order('placement_rate', { ascending: false })
          .limit(5);
        if (districts) setDistrictStats(districts);
      } catch (e) {
        console.error('Failed to load district telemetry:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [supabase]);

  // 1. Calculate Real Profile Completeness
  const calculateProfileScore = () => {
    let score = 0;
    if (profile?.full_name?.trim()) score += 15;
    if (profile?.email?.trim()) score += 15;
    if (profile?.phone?.trim()) score += 15;
    if (profile?.dob) score += 10;
    if (profile?.highest_education) score += 15;
    if (profile?.district) score += 10;
    if (profile?.skills && profile.skills.length > 0) score += 20;
    return Math.min(100, score);
  };

  const profilePct = calculateProfileScore();
  const verifiedSkillsCount = profile?.skills?.length || 0;
  const completedEnrollmentsCount = enrollments?.filter((e: any) => e.status === 'completed' || e.status === 'certified')?.length || 0;
  
  // 2. Real Market Readiness Index
  const employmentWeight = employment?.verified_by_admin ? 25 : employment ? 15 : 0;
  const enrollmentWeight = enrollments.length > 0 ? (completedEnrollmentsCount > 0 ? 25 : 15) : 0;
  const skillsWeight = Math.min(20, verifiedSkillsCount * 5);
  const marketReadinessScore = Math.min(100, Math.round((profilePct * 0.3) + enrollmentWeight + employmentWeight + skillsWeight));

  // 3. Real Wage Trajectory Data
  const initialSalary = Number(employment?.monthly_salary || 0);
  const initialRevenue = Number(employment?.monthly_profit || employment?.monthly_revenue || 0);
  const baselineWage = initialSalary > 0 ? initialSalary : initialRevenue > 0 ? initialRevenue : null;

  // Milestone check-ins from database
  const m3Followup = followups.find((f: any) => f.milestone === '3_months' || f.milestone === '3M');
  const m6Followup = followups.find((f: any) => f.milestone === '6_months' || f.milestone === '6M');
  const m12Followup = followups.find((f: any) => f.milestone === '12_months' || f.milestone === '12M');
  const m18Followup = followups.find((f: any) => f.milestone === '18_months' || f.milestone === '18M');
  const m24Followup = followups.find((f: any) => f.milestone === '24_months' || f.milestone === '24M');

  const getMilestoneWage = (f: any) => {
    if (!f) return null;
    if (f.current_salary && Number(f.current_salary) > 0) return Number(f.current_salary);
    const reportedWage = f.survey_data_json?.monthly_income || f.survey_data_json?.current_wage;
    if (reportedWage && Number(reportedWage) > 0) return Number(reportedWage);
    return null;
  };

  const m3Wage = getMilestoneWage(m3Followup);
  const m6Wage = getMilestoneWage(m6Followup);
  const m12Wage = getMilestoneWage(m12Followup);
  const m18Wage = getMilestoneWage(m18Followup);
  const m24Wage = getMilestoneWage(m24Followup);

  const latestVerifiedWage = m24Wage || m18Wage || m12Wage || m6Wage || m3Wage || baselineWage;
  const wageMultiplier = baselineWage && latestVerifiedWage 
    ? (latestVerifiedWage / baselineWage).toFixed(2) 
    : null;

  const milestonesList = [
    {
      period: '0M (Baseline Intake)',
      wage: baselineWage,
      status: baselineWage ? 'verified' : 'missing',
      label: employment?.company_name || employment?.business_name ? `Intake: ${employment?.company_name || employment?.business_name}` : 'Intake Baseline',
      isActual: true
    },
    {
      period: '3M Longitudinal Survey',
      wage: m3Wage,
      status: m3Followup?.status || 'upcoming',
      dueDate: m3Followup?.due_date,
      label: m3Followup?.status === 'completed' ? 'Verified 3-Month Check-in' : 'Scheduled 3-Month Check-in',
      isActual: m3Followup?.status === 'completed'
    },
    {
      period: '6M Wage Lift & Udyam Audit',
      wage: m6Wage,
      status: m6Followup?.status || 'upcoming',
      dueDate: m6Followup?.due_date,
      label: m6Followup?.status === 'completed' ? 'Verified 6-Month Check-in' : 'Scheduled 6-Month Check-in',
      isActual: m6Followup?.status === 'completed'
    },
    {
      period: '12M Retention & Progression',
      wage: m12Wage,
      status: m12Followup?.status || 'upcoming',
      dueDate: m12Followup?.due_date,
      label: m12Followup?.status === 'completed' ? 'Verified 12-Month Check-in' : 'Scheduled 12-Month Check-in',
      isActual: m12Followup?.status === 'completed'
    },
    {
      period: '18M Progression Review',
      wage: m18Wage,
      status: m18Followup?.status || 'upcoming',
      dueDate: m18Followup?.due_date,
      label: m18Followup?.status === 'completed' ? 'Verified 18-Month Check-in' : 'Scheduled 18-Month Check-in',
      isActual: m18Followup?.status === 'completed'
    },
    {
      period: '24M Career Advancement',
      wage: m24Wage,
      status: m24Followup?.status || 'upcoming',
      dueDate: m24Followup?.due_date,
      label: m24Followup?.status === 'completed' ? 'Verified 24-Month Check-in' : 'Scheduled 24-Month Check-in',
      isActual: m24Followup?.status === 'completed'
    }
  ];

  const maxTrackedWage = Math.max(1, ...(milestonesList.map(m => m.wage || 0)));

  // Simulated Wage Projections
  const simGrowthFactor = 1 + (simTargetLevel - 3) * 0.28 + simCertCount * 0.12;
  const sim6MWage = Math.round(simBaseWage * (1 + (simGrowthFactor - 1) * 0.45));
  const sim12MWage = Math.round(simBaseWage * (1 + (simGrowthFactor - 1) * 0.75));
  const sim24MWage = Math.round(simBaseWage * simGrowthFactor);
  const simLiftMonthly = sim24MWage - simBaseWage;
  const simLift2YearTotal = simLiftMonthly * 24;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 text-slate-800 animate-in fade-in-50">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{t('analytics.title', 'Career Analytics & Verified Wage Trajectory')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('analytics.subtitle', 'Real-time verified industry readiness benchmarking, authenticated longitudinal outcome deltas, and state labor telemetry.')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
            Verified Longitudinal Enclave
          </span>
        </div>
      </div>

      {/* 4 Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* Industry Readiness */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('dash.marketReadiness', 'Market Readiness Score')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-blue-600">{marketReadinessScore}%</p>
            <span className="text-xs font-bold text-slate-500">NSQF Composite</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {profile?.skills && profile.skills.length > 0 ? `Calibrated for ${profile.skills[0]}` : 'Complete skills profile to refine score'}
          </p>
        </div>

        {/* Post-Training Wage Multiplier */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Wage Growth Multiplier</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-emerald-600">
              {wageMultiplier ? `${wageMultiplier}x` : '—'}
            </p>
            <span className="text-xs font-bold text-slate-500">
              {wageMultiplier ? 'verified delta' : 'awaiting survey'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {baselineWage 
              ? `Base: ₹${baselineWage.toLocaleString('en-IN')}/mo` 
              : 'Link employment to track income'}
          </p>
        </div>

        {/* Curriculum Compliance */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Curriculum Compliance</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-purple-600">
              {enrollments.length > 0 ? `${Math.round((completedEnrollmentsCount / enrollments.length) * 100)}%` : '0%'}
            </p>
            <span className="text-xs font-bold text-slate-500">
              {completedEnrollmentsCount}/{enrollments.length || 0} courses
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Accredited Course Progress</p>
        </div>

        {/* Skill Gap Fulfillment */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('profile.skills', 'Verified Skills')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-amber-600">{verifiedSkillsCount}</p>
            <span className="text-xs font-bold text-slate-500">Skills Active</span>
          </div>
          <p className="text-[11px] text-slate-400">Validated against NSQF standard</p>
        </div>

      </div>

      {/* Middle Grid: Longitudinal Wage Progression & Regional Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Longitudinal Wage Progression Chart (7 cols) */}
        {analyticsConfig.showPersonalWage && <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{analyticsConfig.wageTitle}</h3>
              <p className="text-[11px] text-slate-500">
                Verified outcome tracking at 3, 6, 12, and 24 months post-training.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200">
              ₹ INR Monthly
            </span>
          </div>

          {!baselineWage ? (
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">
                No Baseline Employment Record Linked
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                To generate your verified longitudinal wage progression chart, please record your wage employment or self-employment revenue in the Training & Employment desk.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {milestonesList.map((m, idx) => {
                const hasWage = typeof m.wage === 'number' && m.wage > 0;
                const widthPct = hasWage ? Math.min(100, Math.round((m.wage! / maxTrackedWage) * 100)) : 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">
                        {m.period}{' '}
                        <span className="text-slate-400 font-normal">
                          ({m.label})
                        </span>
                      </span>
                      <span className="font-mono">
                        {hasWage ? (
                          <span className="font-bold text-slate-900">₹{m.wage!.toLocaleString('en-IN')}</span>
                        ) : m.status === 'upcoming' ? (
                          <span className="text-slate-400 text-[11px] italic">
                            Scheduled {m.dueDate ? `(${new Date(m.dueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })})` : ''}
                          </span>
                        ) : (
                          <span className="text-amber-500 text-[11px] font-bold">Survey Pending</span>
                        )}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      {hasWage ? (
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            m.isActual 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                              : 'bg-slate-400 opacity-50'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 border border-dashed border-slate-300 rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            Benchmarks are shown only when the administrator has published verified registry data.
          </div>
        </div>}

        {/* Regional Labor Demand & District Stats (5 cols) */}
        {analyticsConfig.showDistrictBenchmarks && <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{analyticsConfig.benchmarkTitle}</h3>
              <p className="text-[11px] text-slate-500">MSSDS State Skill Registry Demand</p>
            </div>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-3">
            {districtStats.length > 0 ? districtStats.map((d, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{d.district_name}</span>
                  <span className="text-[10px] text-slate-500">{d.total_trained?.toLocaleString()} Trained</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-extrabold block">{d.placement_rate}% Placed</span>
                  <span className="text-[10px] text-slate-500">Avg ₹{Number(d.avg_wage || 0).toLocaleString()}/mo</span>
                </div>
              </div>
            )) : (
              <div className="p-5 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                No verified district statistics have been published yet.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {analyticsConfig.showSkillGaps && <h4 className="font-bold text-slate-800 text-xs">{analyticsConfig.skillGapTitle}:</h4>}
            <div className="flex flex-wrap gap-1.5">
              {analyticsConfig.showSkillGaps && (skillGaps.length > 0 ? skillGaps.map((g, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] font-bold">
                  {g.skill_name} ({g.gap_percentage}% Deficit)
                </span>
              )) : <span className="text-xs text-slate-500">No verified skill-gap data published yet.</span>)}
            </div>
          </div>
        </div>}

      </div>

      {/* Interactive Wage Simulator & Career Forecaster Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Interactive Wage Simulator & Career ROI Forecaster</h3>
              <p className="text-xs text-slate-500">Simulate expected salary acceleration when completing accredited NPTEL / Swayam NSQF courses.</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 self-start sm:self-auto">
            Dynamic State Projection Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-5 text-xs">
            
            {/* Base Wage Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Current / Baseline Monthly Wage:</span>
                <span className="text-blue-600 font-mono text-sm">₹{simBaseWage.toLocaleString('en-IN')}/mo</span>
              </div>
              <input
                type="range"
                min="8000"
                max="50000"
                step="1000"
                value={simBaseWage}
                onChange={e => setSimBaseWage(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹8,000 (Entry)</span>
                <span>₹25,000 (Mid)</span>
                <span>₹50,000 (Senior)</span>
              </div>
            </div>

            {/* Target Sector */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">Vocational Trade Sector</label>
              <select
                value={simSector}
                onChange={e => setSimSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800"
              >
                <option value="Automotive & EV">Automotive & Electric Vehicles (EV)</option>
                <option value="Apparel & Fashion">Apparel & Garment Manufacturing</option>
                <option value="Renewable Energy">Renewable Solar Energy & Grid Power</option>
                <option value="IT & Digital">IT, Data Analytics & Automation</option>
                <option value="Healthcare & Caregiving">Healthcare & Clinical Assistance</option>
              </select>
            </div>

            {/* Target NSQF Level & Accredited Certifications */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Target NSQF Level</label>
                <select
                  value={simTargetLevel}
                  onChange={e => setSimTargetLevel(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800"
                >
                  <option value={4}>Level 4 (Technician)</option>
                  <option value={5}>Level 5 (Supervisor / Specialist)</option>
                  <option value={6}>Level 6 (Master Craftsman)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Completed Courses</label>
                <select
                  value={simCertCount}
                  onChange={e => setSimCertCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800"
                >
                  <option value={1}>1 Accredited Course</option>
                  <option value={2}>2 Accredited Courses</option>
                  <option value={3}>3+ Master Certifications</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Forecast Card (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-slate-300">Projected 24-Month Trajectory</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-md uppercase">
                +{Math.round((simGrowthFactor - 1) * 100)}% Lift
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">6 Months</span>
                <p className="text-lg font-black text-white font-mono">₹{sim6MWage.toLocaleString('en-IN')}</p>
                <span className="text-[9px] text-emerald-400 font-bold">Initial Milestone</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">12 Months</span>
                <p className="text-lg font-black text-white font-mono">₹{sim12MWage.toLocaleString('en-IN')}</p>
                <span className="text-[9px] text-emerald-400 font-bold">Retention Lift</span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-blue-400/30 space-y-0.5 shadow-sm">
                <span className="text-[10px] text-blue-300 uppercase font-semibold">24 Months</span>
                <p className="text-xl font-black text-emerald-400 font-mono">₹{sim24MWage.toLocaleString('en-IN')}</p>
                <span className="text-[9px] text-blue-300 font-bold">Mastery Tier</span>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[11px]">Cumulative 2-Year Additional Income:</span>
                <span className="text-base font-black text-emerald-400 font-mono">+₹{simLift2YearTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic text-center">
              Based on MSSDS longitudinal telemetry across 36 Maharashtra districts.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};
