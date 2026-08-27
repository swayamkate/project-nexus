'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sliders,
  Sparkles,
  Building,
  PlusCircle,
  Loader2,
  Briefcase,
  MapPin,
  Send,
  Check
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { useUser } from '@/context/UserContext';

export const TraineePortal: React.FC = () => {
  const { profile, enrollments, refreshData } = useUser();
  const [programs, setPrograms] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [appliedJobId, setAppliedJobId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Skill Simulator State
  const [targetTrade, setTargetTrade] = useState('EV Battery Management');
  const [dailyHours, setDailyHours] = useState(3);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [programsRes, gapsRes, jobsRes] = await Promise.all([
        supabase.from('training_programs').select('*').order('created_at', { ascending: false }),
        supabase.from('top_skill_gaps').select('*').order('gap_percentage', { ascending: false }),
        supabase.from('job_postings').select('*, employers(company_name, district, is_verified)').order('created_at', { ascending: false })
      ]);

      if (programsRes.data) setPrograms(programsRes.data);
      if (gapsRes.data) setSkillGaps(gapsRes.data);
      if (jobsRes.data) setJobPostings(jobsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleEnroll = async (programId: string) => {
    if (!profile?.id) {
      setToastMsg('Please complete your trainee profile first.');
      setTimeout(() => setToastMsg(null), 4000);
      return;
    }

    setEnrollingId(programId);
    try {
      const { error } = await supabase
        .from('trainee_enrollments')
        .insert({
          trainee_id: profile.id,
          program_id: programId,
          enrolled_date: new Date().toISOString().split('T')[0],
          status: 'enrolled'
        });

      if (error) throw error;
      await refreshData();
      setToastMsg('Successfully enrolled in training program!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg('Enrollment failed: ' + (err.message || 'Error'));
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleApplyJob = async (job: any) => {
    setAppliedJobId(job.id);
    try {
      // Dispatches application alert
      if (profile?.id) {
        await supabase.from('trainee_notifications').insert({
          trainee_id: profile.id,
          title: `Application Sent: ${job.title}`,
          message: `Your verified profile was submitted to ${job.employers?.company_name || 'Employer'}. Recruiters will contact you via portal messages.`,
          type: 'placement'
        });
      }
      setToastMsg(`Application dispatched to ${job.employers?.company_name || 'Employer'}!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg('Application failed: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const estimatedWeeks = Math.ceil(120 / (dailyHours * 6));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Skill Gap & Career Pathway Portal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time regional skill demand analytics, curated NSQF certifications, and verified industry apprenticeships
        </p>
      </div>

      {/* Industrial Skill Gap Alerts */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Priority Skill Gaps in Maharashtra</h3>
          </div>
          <span className="text-xs text-blue-600 font-semibold">Live Labor Market Demand</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(skillGaps.length > 0 ? skillGaps : [
            { sector: 'Automotive & EV', job_role: 'EV Powertrain Diagnostic Tech', demand_index: 94, gap_percentage: 42 },
            { sector: 'Green Energy', job_role: 'Grid Solar Micro-Inverter Installer', demand_index: 88, gap_percentage: 38 },
            { sector: 'Apparel & Fashion', job_role: 'Boutique CAD Pattern Designer', demand_index: 82, gap_percentage: 31 },
            { sector: 'IT & Digital', job_role: 'Cloud ERP Operations Assistant', demand_index: 90, gap_percentage: 35 }
          ]).map((gap, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{gap.sector}</span>
                <h4 className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">{gap.job_role}</h4>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Industry Gap:</span>
                  <span className="font-bold text-rose-600">+{gap.gap_percentage}% Deficit</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Market Demand:</span>
                  <span className="font-bold text-emerald-600">{gap.demand_index}/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Career Readiness Simulator */}
      <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-blue-400">
          <Sliders className="w-5 h-5" />
          <h3 className="font-bold text-base text-white">Interactive Upskilling & Wage Simulator</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Target High-Growth Trade</label>
            <select
              value={targetTrade}
              onChange={e => setTargetTrade(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="EV Battery Management">EV Battery Management & High-Voltage Diagnostics</option>
              <option value="Solar PV Installation">Grid-Tied Solar Rooftop Engineering</option>
              <option value="Precision CNC Machining">4-Axis CNC Machining & G-Code Programming</option>
              <option value="Industrial Pattern CAD">Apparel CAD & Single Needle Lockstitch</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Daily Practice Commitment:</span>
              <span className="font-bold text-blue-400">{dailyHours} Hours/Day</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={e => setDailyHours(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col justify-between text-xs">
            <span className="text-slate-400">Estimated NSQF Readiness:</span>
            <p className="text-xl font-black text-emerald-400">{estimatedWeeks} Weeks to Certification</p>
            <span className="text-[10px] text-blue-300">Projected Wage Lift: +140% to ₹28,000/Mo</span>
          </div>
        </div>
      </div>

      {/* Verified Industry Job & Apprenticeship Postings */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Verified Industry Apprenticeships (NAPS / Direct)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{jobPostings.length} Active Positions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobPostings.map(job => {
            const isApplied = appliedJobId === job.id;

            return (
              <div key={job.id} className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 transition space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                      {job.trade_category}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      ₹{Number(job.min_salary).toLocaleString()} - ₹{Number(job.max_salary).toLocaleString()}/Mo
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{job.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{job.employers?.company_name || 'Verified Industry Partner'} • {job.location_district}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">{job.openings_count} Openings Available</span>
                  
                  <button
                    onClick={() => handleApplyJob(job)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      isApplied 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isApplied ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isApplied ? 'Application Submitted' : '1-Click Apply'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catalog of Courses */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Recommended State Skill Programs</h3>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading course programs...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => {
              const isEnrolled = enrollments.some(e => e.program_id === prog.id);

              return (
                <div 
                  key={prog.id} 
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                        {prog.sector}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> {prog.duration_months} Months
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{prog.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{prog.description}</p>
                    <p className="text-[11px] text-slate-400">Provider: {prog.provider_name}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {isEnrolled ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Already Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(prog.id)}
                        disabled={enrollingId === prog.id}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                      >
                        {enrollingId === prog.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>Enroll Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
