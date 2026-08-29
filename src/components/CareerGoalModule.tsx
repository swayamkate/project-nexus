'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  ArrowRight, 
  Save, 
  RefreshCw,
  Compass,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Edit3,
  Layers,
  Building2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { diagnoseSkillGap, ROLE_BENCHMARKS, SkillGapDiagnosis } from '@/lib/aiCareerEngine';
import { mutateDb } from '@/lib/traineeApi';

interface CareerGoalModuleProps {
  onNavigate?: (section: string) => void;
}

export const CareerGoalModule: React.FC<CareerGoalModuleProps> = ({ onNavigate }) => {
  const { profile, refreshData } = useUser();
  const supabase = createClient();

  const [isCustomRole, setIsCustomRole] = useState(false);
  const [selectedPresetRole, setSelectedPresetRole] = useState<string>('Senior Apparel Quality Specialist & Boutique Entrepreneur');
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  
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
        const savedRole = data.target_role || targetRole;
        setTargetRole(savedRole);
        if (ROLE_BENCHMARKS[savedRole]) {
          setSelectedPresetRole(savedRole);
          setIsCustomRole(false);
        } else {
          setIsCustomRole(true);
          setCustomRoleInput(savedRole);
          setSelectedPresetRole('custom');
        }
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

  const activeRoleName = isCustomRole && customRoleInput.trim() ? customRoleInput.trim() : targetRole;

  useEffect(() => {
    // Recompute dynamic skill gap whenever active role, salary, profile skills, or level change
    const diag = diagnoseSkillGap(profile?.skills || [], activeRoleName, targetSalary, currentLevel);
    setDiagnosis(diag);
  }, [activeRoleName, targetSalary, profile?.skills, currentLevel]);

  const handleRolePresetChange = (roleValue: string) => {
    if (roleValue === 'custom') {
      setIsCustomRole(true);
      setSelectedPresetRole('custom');
      if (customRoleInput.trim()) {
        setTargetRole(customRoleInput.trim());
      }
    } else {
      setIsCustomRole(false);
      setSelectedPresetRole(roleValue);
      setTargetRole(roleValue);
      if (ROLE_BENCHMARKS[roleValue]) {
        setTargetSalary(ROLE_BENCHMARKS[roleValue].targetSalary);
      }
    }
  };

  const handleCustomRoleChange = (text: string) => {
    setCustomRoleInput(text);
    if (text.trim()) {
      setTargetRole(text.trim());
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !diagnosis) return;

    const finalRoleToSave = isCustomRole && customRoleInput.trim() ? customRoleInput.trim() : targetRole;

    setSaving(true);
    try {
      const { error } = await mutateDb({
        action: 'upsert',
        table: 'trainee_career_goals',
        payload: {
          trainee_id: profile.id,
          target_role: finalRoleToSave,
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
        },
        onConflict: 'trainee_id'
      });

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
    <div className="space-y-8 animate-fadeIn text-slate-800 pb-12">
      
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
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Dream Role / Business Aim
                </label>
                <button
                  type="button"
                  onClick={() => handleRolePresetChange(isCustomRole ? availableRoles[0] : 'custom')}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer flex items-center space-x-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isCustomRole ? 'Pick from Presets' : '+ Enter Custom Dream Role'}</span>
                </button>
              </div>

              {!isCustomRole ? (
                <select
                  value={selectedPresetRole}
                  onChange={(e) => handleRolePresetChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                >
                  <optgroup label="22+ NSQF Certified Industry Tracks">
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </optgroup>
                  <option value="custom">+ Custom Dream Role / Venture Entry...</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drone Precision Agriculture Specialist, Smart IoT Solar Lead..."
                    value={customRoleInput}
                    onChange={(e) => handleCustomRoleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-blue-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                  <p className="text-[11px] text-slate-400">
                    The AI Career Engine will dynamically synthesize domain skills, required certifications, and wage trajectories for your custom role.
                  </p>
                </div>
              )}
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
              <input
                type="range"
                min="30"
                max="365"
                step="15"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>30 Days (Fast-Track)</span>
                <span>90 Days (Quarter)</span>
                <span>180 Days (6 Mo)</span>
                <span>365 Days (1 Yr)</span>
              </div>
            </div>

            {/* Target Monthly Salary / Revenue Aim */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Target Monthly Income Aim</span>
                </label>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-md border border-emerald-200 font-mono">
                  ₹{targetSalary.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="100000"
                step="5000"
                value={targetSalary}
                onChange={(e) => setTargetSalary(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹15,000</span>
                <span>₹45,000</span>
                <span>₹75,000</span>
                <span>₹1,00,000+</span>
              </div>
            </div>

            {/* Current Experience Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Trade Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Beginner">Beginner (Level 3-4)</option>
                  <option value="Intermediate">Intermediate (Level 4-5)</option>
                  <option value="Advanced">Advanced (Level 5-6)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Weekly Upskilling
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="2"
                    max="40"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-center"
                  />
                  <span className="text-xs text-slate-500 font-medium">Hrs/Wk</span>
                </div>
              </div>
            </div>

            {/* Notes / Special Focus */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Personal Aim or District Priorities
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Planning to open a micro-enterprise in Pune district or apply for Surya Mitra certification..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
              />
            </div>

            {/* Save Goal Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating & Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Goal & Synchronize Roadmap</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Diagnostic Matrix & Skill Gap Breakdown (7 Cols) */}
        {diagnosis && (
          <div className="lg:col-span-7 space-y-6">
            
            {/* AI Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AI Skill Diagnostic Summary</h3>
                  <p className="text-xs text-slate-400">Target Role: <strong className="text-slate-700">{diagnosis.targetRole}</strong></p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {diagnosis.aiDiagnosticSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                  <span className="text-[11px] text-blue-700 font-bold block">Verified Acquired Skills</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {diagnosis.matchedSkills.length > 0 ? (
                      diagnosis.matchedSkills.map((s) => (
                        <span key={s} className="px-2.5 py-0.5 bg-white text-blue-700 font-bold rounded-lg text-[10px] border border-blue-200 shadow-2xs">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">No exact matches in profile yet. Add your verified skills in Profile tab.</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[11px] text-amber-800 font-bold block">Identified Skill Deficits</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {diagnosis.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 bg-white text-amber-800 font-bold rounded-lg text-[10px] border border-amber-200 shadow-2xs">
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Granular Competency Gap Radar / Bars */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm">Required Competency Gap Matrix</h4>
                <span className="text-[11px] text-slate-400 font-semibold">Standard NSQF Level Target: 90%</span>
              </div>

              <div className="space-y-3.5">
                {diagnosis.competencyScores.map((item) => (
                  <div key={item.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.skill}</span>
                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        <span className="text-slate-500">Current: <strong className="text-blue-600 font-bold">{item.current}%</strong></span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500">Target: <strong className="text-slate-800">{item.required}%</strong></span>
                        {item.gap > 0 && (
                          <span className="px-1.5 py-0.2 bg-red-50 text-red-600 font-bold rounded text-[10px]">
                            -{item.gap}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.current}%` }}
                      />
                      {item.gap > 0 && (
                        <div 
                          className="bg-amber-400 opacity-60 h-full transition-all duration-500"
                          style={{ width: `${item.gap}%` }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Priority Action Step Links */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Priority Steps:</h5>
                <ul className="space-y-2">
                  {diagnosis.priorityActions.map((action, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation Action */}
              {onNavigate && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate('career_roadmap')}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <span>View {targetDays}-Day Milestone Pathway</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
