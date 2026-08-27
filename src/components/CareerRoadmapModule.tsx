'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Award, 
  RefreshCw, 
  BookOpen, 
  Briefcase, 
  Target, 
  Bot, 
  Check, 
  Layers
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { generateDynamicRoadmap, RoadmapPhase } from '@/lib/aiCareerEngine';

interface CareerRoadmapModuleProps {
  onNavigate?: (section: string) => void;
}

export const CareerRoadmapModule: React.FC<CareerRoadmapModuleProps> = ({ onNavigate }) => {
  const { profile } = useUser();
  const supabase = createClient();

  const [targetRole, setTargetRole] = useState('Senior Apparel Quality Specialist & Boutique Entrepreneur');
  const [targetDays, setTargetDays] = useState(90);
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [progressPct, setProgressPct] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingTask, setSavingTask] = useState<string | null>(null);

  const calculateProgress = (roadmapPhases: RoadmapPhase[]): number => {
    let totalTasks = 0;
    let completedTasks = 0;

    roadmapPhases.forEach(p => {
      p.tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const saveRoadmapToDB = async (role: string, days: number, currentPhases: RoadmapPhase[], pct: number) => {
    if (!profile?.id) return;
    try {
      await supabase
        .from('career_roadmaps')
        .upsert({
          trainee_id: profile.id,
          target_role: role,
          target_days: days,
          phases_json: currentPhases,
          overall_progress_pct: pct,
          is_ai_generated: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'trainee_id' });
    } catch (err) {
      console.error('Failed to sync roadmap:', err);
    }
  };

  const loadRoadmap = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch user goal to get current target days and role
      const { data: goalData } = await supabase
        .from('trainee_career_goals')
        .select('*')
        .eq('trainee_id', profile.id)
        .maybeSingle();

      const userRole = goalData?.target_role || targetRole;
      const userDays = goalData?.target_days || 90;
      setTargetRole(userRole);
      setTargetDays(userDays);

      // 2. Fetch saved roadmap
      const { data: roadmapData } = await supabase
        .from('career_roadmaps')
        .select('*')
        .eq('trainee_id', profile.id)
        .maybeSingle();

      if (roadmapData && Array.isArray(roadmapData.phases_json) && roadmapData.phases_json.length > 0) {
        setPhases(roadmapData.phases_json);
        setProgressPct(roadmapData.overall_progress_pct || calculateProgress(roadmapData.phases_json));
      } else {
        // Generate initial roadmap
        const initial = generateDynamicRoadmap(userRole, userDays, profile?.skills || [], goalData?.weekly_hours || 10);
        setPhases(initial);
        const pct = calculateProgress(initial);
        setProgressPct(pct);
        saveRoadmapToDB(userRole, userDays, initial, pct);
      }
    } catch (e) {
      console.error('Error loading roadmap:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [profile]);

  const toggleTask = async (phaseIndex: number, taskId: string) => {
    setSavingTask(taskId);
    const updated = [...phases];
    const task = updated[phaseIndex].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      const newPct = calculateProgress(updated);
      setPhases(updated);
      setProgressPct(newPct);
      await saveRoadmapToDB(targetRole, targetDays, updated, newPct);
    }
    setSavingTask(null);
  };

  const handleRegenerateWithAI = async () => {
    setGenerating(true);
    try {
      const generated = generateDynamicRoadmap(targetRole, targetDays, profile?.skills || []);
      setPhases(generated);
      const newPct = calculateProgress(generated);
      setProgressPct(newPct);
      await saveRoadmapToDB(targetRole, targetDays, generated, newPct);
    } catch (e) {
      console.error('Error regenerating roadmap:', e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Generating Dynamic {targetDays}-Day Milestone Pathway...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-indigo-200">
              <Compass className="w-3.5 h-3.5 text-cyan-300" />
              <span>Algorithmic NSQF Milestone Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {targetDays}-Day Career Roadmap: {targetRole}
            </h1>
            <p className="text-sm text-indigo-100/80 mt-1 max-w-2xl">
              Calibrated step-by-step pathway from foundation study to technical assessment, mock interviews, and verified placement.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={handleRegenerateWithAI}
              disabled={generating}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 border border-white/20 cursor-pointer disabled:opacity-50 btn-interactive"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Re-sequencing Path...' : 'Re-sequence Roadmap'}</span>
            </button>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center min-w-[120px]">
              <div className="text-2xl font-black text-white">{progressPct}%</div>
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Completed</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-bold mb-1.5">
            <span>Overall Roadmap Completion</span>
            <span>{progressPct}% towards {targetDays}-Day Goal</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-300 transition-all duration-700 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4-Phase Pathway Accordion / Cards */}
      <div className="space-y-6">
        {phases.map((phase, pIdx) => {
          const phaseTasksCompleted = phase.tasks.filter(t => t.completed).length;
          const phaseTotal = phase.tasks.length;
          const isPhaseComplete = phaseTotal > 0 && phaseTasksCompleted === phaseTotal;

          return (
            <div 
              key={phase.phase_number}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-sm ${
                isPhaseComplete 
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-emerald-500/5' 
                  : 'border-slate-200/80 hover:border-indigo-200'
              }`}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isPhaseComplete
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {isPhaseComplete ? <Check className="w-5 h-5" /> : `0${phase.phase_number}`}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{phase.phase_title}</h3>
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold">
                        {phase.day_range}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{phase.objective}</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-600 shrink-0 self-end sm:self-center">
                  <span className={isPhaseComplete ? 'text-emerald-600 font-extrabold' : 'text-indigo-600'}>
                    {phaseTasksCompleted} / {phaseTotal} Tasks Completed
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(pIdx, task.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer group select-none ${
                      task.completed
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-800'
                        : 'bg-slate-50/70 border-slate-200/60 hover:bg-indigo-50/40 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-indigo-600'
                      }`}>
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-semibold ${
                        task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
                      }`}>
                        {task.task}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200 text-[10px] font-mono font-medium shrink-0">
                      {task.skill_tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Dock */}
      {onNavigate && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">Ready to benchmark your current level?</div>
              <div className="text-xs text-slate-300">Take a 15-minute skill assessment or run an AI mock interview.</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('skill-assessments')}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Take Skill Assessment</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('interview-prep')}
              className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>AI Mock Interview</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
