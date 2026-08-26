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
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { useUser } from '@/context/UserContext';

export const TraineePortal: React.FC = () => {
  const { profile, enrollments, refreshData } = useUser();
  const [programs, setPrograms] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [dailyHours, setDailyHours] = useState(2.5);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [programsRes, gapsRes] = await Promise.all([
        supabase.from('training_programs').select('*').order('created_at', { ascending: false }),
        supabase.from('top_skill_gaps').select('*').order('gap_percentage', { ascending: false })
      ]);

      if (programsRes.data) setPrograms(programsRes.data);
      if (gapsRes.data) setSkillGaps(gapsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
          Real-time regional skill demand analytics, curated NSQF certifications, and career forecasting
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
