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

  const handleEnroll = async (programId: string) => {
    if (!profile?.id) {
      alert('Please complete your trainee profile first.');
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
      alert('Enrolled in program successfully! You can now track your progress.');
    } catch (err: any) {
      alert('Enrollment failed: ' + err.message);
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-2" />
        <span>Loading Training Programs & Skill Gap Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum & Sector Trajectory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Training Programs & Skill Gap Engine</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          National and state sponsored skilling certifications with real-time labor market gap analytics.
        </p>
      </div>

      {/* Available Programs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Official Government Training Programs</h2>
          <span className="text-xs text-slate-400">{programs.length} Programs Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map(prog => {
            const isEnrolled = enrollments.some(e => e.program_id === prog.id);

            return (
              <div key={prog.id} className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-md uppercase">
                      {prog.sector}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {prog.duration_months} Months
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{prog.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{prog.description}</p>
                  <p className="text-[11px] text-slate-500 pt-1">Provider: {prog.provider_name}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  {isEnrolled ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Enrolled & Tracking
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(prog.id)}
                      disabled={enrollingId === prog.id}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition disabled:opacity-60"
                    >
                      {enrollingId === prog.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      <span>Enroll in Course</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labor Market Skill Gap Analytics */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>State High-Priority Skill Gaps</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live industry demand vs supply deficits across Maharashtra industrial clusters.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase">
            Updated Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillGaps.map(gap => (
            <div key={gap.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  gap.priority_level === 'Critical' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {gap.priority_level} Deficit
                </span>
                <span className="text-xs font-black text-white">{gap.gap_percentage}%</span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">{gap.skill_name}</h4>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Industry Demand:</span>
                  <span className="text-white font-bold">{gap.demand_count} jobs</span>
                </div>
                <div className="flex justify-between">
                  <span>Certified Supply:</span>
                  <span className="text-slate-300">{gap.supply_count} trainees</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full" 
                  style={{ width: `${Math.min(100, (gap.supply_count / gap.demand_count) * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
