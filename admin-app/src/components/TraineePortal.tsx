'use client';

import React, { useState } from 'react';
import { 
  mockRoles, 
  mockSkills, 
  mockCourses, 
  mockTraineeProfile 
} from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
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
  Building
} from 'lucide-react';

export const TraineePortal: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(mockRoles[0]);
  const [targetCompany, setTargetCompany] = useState('Tata Technologies / Infosys');
  const [dailyHours, setDailyHours] = useState(2.5);

  // User's current self-assessed skill levels (1-5)
  const [userSkillLevels, setUserSkillLevels] = useState<{ [key: string]: number }>({
    'react-nextjs': 2,
    'typescript': 2,
    'postgresql': 1,
    'solar-pv-install': 1,
    'ev-battery-diag': 1,
    'cnc-machining': 1,
    'python-data-analytics': 1,
  });

  // Calculate skill gap
  const requiredSkills = selectedRole.skills || [];
  let totalRequiredPoints = 0;
  let totalEarnedPoints = 0;
  let missingLearningHours = 0;

  requiredSkills.forEach((req) => {
    const userProf = userSkillLevels[req.skill.slug] || 1;
    const requiredProf = req.required_proficiency;
    
    totalRequiredPoints += requiredProf;
    totalEarnedPoints += Math.min(userProf, requiredProf);

    if (userProf < requiredProf) {
      const gapLevel = requiredProf - userProf;
      missingLearningHours += gapLevel * 25; // 25 hours estimated per skill level
    }
  });

  const skillGapPct = totalRequiredPoints > 0 
    ? Math.max(0, Math.round(((totalRequiredPoints - totalEarnedPoints) / totalRequiredPoints) * 100))
    : 0;

  // Estimated Days Formula: Missing Hours / Daily Study Hours
  const estimatedDays = dailyHours > 0 ? Math.ceil(missingLearningHours / dailyHours) : 60;

  const handleSkillChange = (slug: string, level: number) => {
    setUserSkillLevels(prev => ({ ...prev, [slug]: level }));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Trainee Metadata & Privacy Token */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img 
              src={mockTraineeProfile.avatar_url} 
              alt={mockTraineeProfile.full_name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{mockTraineeProfile.full_name}</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 rounded-md border border-blue-500/30">
                  {mockTraineeProfile.education_level}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                Location: <span className="text-slate-200">{mockTraineeProfile.district}, {mockTraineeProfile.state}</span> • Baseline: <span className="text-emerald-400 font-semibold">{formatCurrency(mockTraineeProfile.baseline_income)}/mo</span>
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Hash: <strong className="text-slate-300">{mockTraineeProfile.privacy_hash.slice(0, 16)}...</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs font-medium">Skill Readiness</span>
              <p className="text-2xl font-black text-blue-400 mt-1">{100 - skillGapPct}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs font-medium">Est. Days to Goal</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{estimatedDays} <span className="text-xs text-slate-400 font-normal">days</span></p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-xs font-medium">Target Avg Salary</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(selectedRole.average_starting_salary)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Career & Skill Mapping Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Role Selector & Study Velocity */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <Target className="w-5 h-5" />
              <h2 className="font-bold text-white text-base">Select Target Role & Company</h2>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-400 block">Target Job Profile</label>
              <div className="space-y-2">
                {mockRoles.map((role) => {
                  const isSelected = selectedRole.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-100">{role.title}</span>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          +{role.growth_rate_pct}% YoY
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{role.industry}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium text-slate-400 block mb-1.5 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Employer / Sector</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Tata Motors, Infosys, L&T Solar"
                className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Study Velocity Slider */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Daily Study Commitment:</span>
                </span>
                <span className="font-bold text-blue-400">{dailyHours} hours/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.5h (Part-time)</span>
                <span>4h (Focused)</span>
                <span>8h (Full-time)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Real-time Skill Gap Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Skill Gap Matrix:</span>
                  <span className="text-blue-400">{selectedRole.title}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust your current proficiency (1-5) to recalculate timeline and recommended modules.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Goal Time</span>
                  <span className="text-sm font-black text-amber-300">{estimatedDays} Days ({Math.ceil(estimatedDays / 30)} Months)</span>
                </div>
              </div>
            </div>

            {/* Interactive Skills Matrix List */}
            <div className="space-y-4">
              {requiredSkills.map((req) => {
                const currentLevel = userSkillLevels[req.skill.slug] || 1;
                const requiredLevel = req.required_proficiency;
                const isMet = currentLevel >= requiredLevel;

                return (
                  <div 
                    key={req.skill.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-200 text-sm">{req.skill.name}</span>
                          {req.is_mandatory && (
                            <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.2 rounded">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{req.skill.description}</p>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <span className="text-xs text-slate-400">Target Level: <strong>L{requiredLevel}</strong></span>
                        {isMet ? (
                          <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Gap: {requiredLevel - currentLevel} Level{requiredLevel - currentLevel > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Level Selector Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">Your Current Proficiency:</span>
                      <div className="flex space-x-1.5">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleSkillChange(req.skill.slug, lvl)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                              currentLevel === lvl
                                ? 'bg-blue-600 text-white shadow-md'
                                : lvl <= currentLevel
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            L{lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verified Certifications & Badge Pathways */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Recommended Verified Badges & Certifications</h3>
                </div>
                <span className="text-xs text-slate-400">NSDC Aligned Standards</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {course.verification_standard}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{course.duration_hours} Hours</span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-xs mt-2 leading-relaxed">{course.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{course.provider_name}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Badge: {course.badge_hash}
                      </span>
                      <button 
                        onClick={() => alert(`Enrolled in ${course.title}! Badge tracking activated.`)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
