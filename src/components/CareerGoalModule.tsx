'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  ArrowRight, 
  Save, 
  RefreshCw, 
  Compass, 
  Layers, 
  Zap,
  BookOpen
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { diagnoseSkillGap, ROLE_BENCHMARKS, SkillGapDiagnosis } from '@/lib/aiCareerEngine';

interface CareerGoalModuleProps {
  onNavigate?: (section: string) => void;
}

export const CareerGoalModule: React.FC<CareerGoalModuleProps> = ({ onNavigate }) => {
  const { profile, refreshData } = useUser();
  const supabase = createClient();

  const [targetRole, setTargetRole] = useState<string>('Senior Apparel Quality Specialist & Boutique Entrepreneur');
  const [targetDays, setTargetDays] = useState<number>(90);
  const [targetSalary, setTargetSalary] = useState<number>(35000);
  const [currentLevel, setCurrentLevel] = useState<string>('Intermediate');
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');
  
  const [diagnosis, setDiagnosis] = useState<SkillGapDiagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick select roles
  const availableRoles = Object.keys(ROLE_BENCHMARKS);

  const loadGoal = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('trainee_career_goals')
        .select('*')
        .eq('trainee_id', profile.id)
        .maybeSingle();

      if (data) {
        setTargetRole(data.target_role || targetRole);
        setTargetDays(data.target_days || 90);
        setTargetSalary(data.target_salary || 35000);
        setCurrentLevel(data.current_level || 'Intermediate');
        setWeeklyHours(data.weekly_hours || 10);
        setNotes(data.notes || '');
      }
    } catch (e) {
      console.error('Error loading career goal:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoal();
  }, [profile]);

  useEffect(() => {
    // Recompute AI skill gap whenever role, salary, or profile skills change
    const diag = diagnoseSkillGap(profile?.skills || [], targetRole, targetSalary);
    setDiagnosis(diag);
  }, [targetRole, targetSalary, profile?.skills]);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !diagnosis) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('trainee_career_goals')
        .upsert({
          trainee_id: profile.id,
          target_role: targetRole,
          target_days: targetDays,
          target_salary: targetSalary,
          current_level: currentLevel,
          weekly_hours: weeklyHours,
          skills_acquired: diagnosis.matchedSkills,
          skills_gap: diagnosis.missingSkills,
          readiness_pct: diagnosis.readinessScore,
          wage_multiplier: diagnosis.wageMultiplier,
          notes: notes,
          updated_at: new Date().toISOString()
        }, { onConflict: 'trainee_id' });

      if (error) throw error;
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      await refreshData();
    } catch (err) {
      console.error('Error saving career goal:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading Career Intelligence Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Career Engine & Diagnostic Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Target Career Goal & Skill Gap Analysis
            </h1>
            <p className="text-sm text-blue-100/80 mt-1 max-w-2xl">
              Define your career aim, target timeline in <span className="font-bold text-cyan-300">{targetDays} Days</span>, and analyze industry skill benchmarks to unlock higher wage multipliers.
            </p>
          </div>

          {diagnosis && (
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center px-2">
                <div className="text-3xl font-black text-white">{diagnosis.readinessScore}%</div>
                <div className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider mt-0.5">Readiness Score</div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center px-2">
                <div className="text-3xl font-black text-emerald-300">{diagnosis.wageMultiplier}x</div>
                <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider mt-0.5">Wage Lift</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Goal Setting Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Goal Configuration</h3>
                <p className="text-xs text-slate-400">Set target role, duration & salary</p>
              </div>
            </div>
            {savedSuccess && (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold flex items-center space-x-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveGoal} className="space-y-5">
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Dream Role / Business Aim
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Target Days Selector (N Days) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Target Timeline (N Days)</span>
                </label>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-md border border-indigo-200">
                  {targetDays} Days
                </span>
              </div>
              
              {/* Pill selection for standard intervals */}
              <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                {[30, 60, 90, 180, 365].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTargetDays(days)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      targetDays === days
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="15"
                max="365"
                step="5"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>15 Days (Sprint)</span>
                <span>90 Days (Quarter)</span>
                <span>365 Days (1 Year)</span>
              </div>
            </div>

            {/* Target Monthly Salary / Earnings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Target Monthly Income</span>
                </label>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-md border border-emerald-200">
                  ₹{targetSalary.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="100000"
                step="2500"
                value={targetSalary}
                onChange={(e) => setTargetSalary(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Weekly Study Commitment & Experience Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Weekly Study
                </label>
                <select
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={5}>5 Hours / week</option>
                  <option value={10}>10 Hours / week</option>
                  <option value={15}>15 Hours / week</option>
                  <option value={20}>20+ Hours / week</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Beginner">Beginner (Level 1)</option>
                  <option value="Intermediate">Intermediate (Level 2)</option>
                  <option value="Advanced">Advanced (Level 3)</option>
                </select>
              </div>
            </div>

            {/* Notes / Aspirations */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Personal Career Notes / Milestones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Aiming to expand boutique export orders and clear AQL 2.5 quality certification..."
                rows={2}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing Goal to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Career Goal & Recalculate Roadmap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Skill Gap Visualizations & AI Diagnostics (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Diagnostic Callout Box */}
          {diagnosis && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md border border-indigo-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Compass className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold tracking-wide uppercase">
                  <Zap className="w-4 h-4" />
                  <span>AI Skill Gap Diagnostic</span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  {diagnosis.aiDiagnosticSummary}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {diagnosis.priorityActions.map((action, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Skill Gap Deficiency Bar Analysis */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Competency Benchmark Matrix</h3>
                  <p className="text-xs text-slate-400">Current verified proficiency vs target industry standard</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {diagnosis?.matchedSkills.length || 0} / {diagnosis?.competencyScores.length || 0} Competencies
              </span>
            </div>

            <div className="space-y-4">
              {diagnosis?.competencyScores.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      {item.gap <= 10 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span>{item.skill}</span>
                    </span>
                    <span className={`font-mono font-bold ${item.gap <= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.gap <= 10 ? 'Ready (Verified)' : `${item.gap}% Gap`}
                    </span>
                  </div>

                  {/* Dual Bar (Current vs Required) */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative flex">
                    <div 
                      className={`h-full transition-all duration-700 rounded-full ${
                        item.gap <= 10 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.current}%` }}
                    />
                    <div 
                      className="h-full bg-indigo-200/50 border-r-2 border-indigo-600 relative"
                      style={{ width: `${item.gap}%` }}
                      title={`Target Standard: ${item.required}%`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Current Mastery: {item.current}%</span>
                    <span>Target Requirement: {item.required}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons to Bridge Gaps */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('career-roadmap')}
                    className="w-full sm:w-1/2 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>View {targetDays}-Day Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="w-full sm:w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Browse NPTEL/Coursera Courses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
