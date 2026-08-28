'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  BarChart3, 
  Building2, 
  Compass, 
  Crown,
  PlayCircle
} from 'lucide-react';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleMode?: 'trainee' | 'admin';
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  roleMode = 'admin'
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<'trainee' | 'admin'>(roleMode);

  if (!isOpen) return null;

  const traineeSteps = [
    {
      title: '1. Skill Gap Diagnostic & Career Target Selection',
      icon: GraduationCap,
      color: 'from-blue-600 to-cyan-500',
      description: 'Select your target vocational trade (e.g. EV Battery Diagnostics, Rooftop Solar PV, CNC VMC Machining). The AI Career Engine compares your existing skills with real industry benchmarks to calculate your exact readiness score and missing competencies.',
      actionHint: 'Navigate to "My Profile" or "Training Details" to select your target trade.'
    },
    {
      title: '2. Dynamic Employment & Outcome Recording',
      icon: Briefcase,
      color: 'from-indigo-600 to-purple-600',
      description: 'Log your post-training occupational pathway: Wage Employed (with PF/ESIC UAN and salary), Self-Employed Micro-Enterprise (with Udyam MSME and turnover), or Seeking Placement (with root-cause perspective narrative for SSDM support).',
      actionHint: 'Click "Update Employment Status" on your dashboard to record your career status.'
    },
    {
      title: '3. Skill Assessments & Accredited Certifications',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-500',
      description: 'Take timed, randomized NSQF Level 3-7 competency assessments to earn verified skill badges. Enroll in government-accredited NPTEL, Swayam, and vocational curricula to bridge skill gaps.',
      actionHint: 'Visit "Certifications" to take trade tests and download verified credentials.'
    },
    {
      title: '4. State Rozgar Melawas & Verified QR Passes',
      icon: Building2,
      color: 'from-amber-600 to-orange-500',
      description: 'View scheduled State Job Fairs in your district. Unplaced trainees in the Second-Chance Queue receive automated invitations and cryptographic QR Entry Passes for on-spot employer interviews.',
      actionHint: 'Present your QR token at Rozgar Melawa registration kiosks for instant check-in.'
    },
    {
      title: '5. Longitudinal Milestone Check-ins (3M – 48M)',
      icon: BarChart3,
      color: 'from-pink-600 to-rose-500',
      description: 'Participate in periodic follow-up surveys over WhatsApp or Web at 3, 6, 12, 18, 24, 36, and 48 months to log promotions, wage lifts, and job stability for state impact measurement.',
      actionHint: 'Check the "Follow-ups" tab to submit milestone feedback and view your wage progression.'
    }
  ];

  const adminSteps = [
    {
      title: '1. SuperAdmin Sovereignty & Staff Management',
      icon: Crown,
      color: 'from-amber-500 to-yellow-600',
      description: 'SuperAdmins have 100% unrestricted access: provision new sub-admins and evaluators, directly reset staff passwords via PostgreSQL RPC, suspend accounts, and delegate granular module permissions.',
      actionHint: 'Open "Trainees & Governance" -> "Staff Directory" tab to manage administrators.'
    },
    {
      title: '2. Real-Time AI Workforce & Labor Intelligence',
      icon: Sparkles,
      color: 'from-indigo-600 to-blue-600',
      description: 'Monitor real industrial vacancies across Maharashtra MIDC zones, track 5-year trade demand forecasts (2026-2030), inspect automated curriculum gaps, and review 3-month attrition risk early warnings.',
      actionHint: 'Navigate to "AI Workforce Suite" to analyze vacancies and skill translatability.'
    },
    {
      title: '3. Rozgar Melawa Event Scheduling & Second-Chance Queue',
      icon: Building2,
      color: 'from-emerald-600 to-green-600',
      description: 'Publish district job fairs, set participating corporate recruiter quotas, and automatically match unplaced trainees from the Second-Chance Queue to upcoming hiring drives.',
      actionHint: 'Visit "Rozgar Melawas & Fairs" to schedule events and monitor registered QR passes.'
    },
    {
      title: '4. Candidate KYC, Duplicate Identity & Tamper Radar',
      icon: ShieldCheck,
      color: 'from-rose-600 to-red-600',
      description: 'Inspect uploaded Udyam certificates, salary slips, and trade licenses. Detect duplicate phone/Aadhaar identity collisions and verify SHA-256 digital document authenticity.',
      actionHint: 'Go to "Document Verifications" to audit candidate submissions and run duplicate radars.'
    },
    {
      title: '5. Multi-Vector Longitudinal Impact Analytics',
      icon: BarChart3,
      color: 'from-purple-600 to-indigo-600',
      description: 'View real, database-backed placement analytics across Training Providers, Cohort Years, 36 Districts, and Courses, with non-placement root-cause diagnostic charts.',
      actionHint: 'Explore "Analytics Evidence" for multi-dimensional placement breakdown.'
    }
  ];

  const currentSteps = selectedTrack === 'trainee' ? traineeSteps : adminSteps;
  const current = currentSteps[activeStep] || currentSteps[0];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a1020] border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shadow-lg`}>
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Nexus Control Room Interactive Walkthrough</h3>
              <p className="text-xs text-slate-400">Step-by-step administrator guide</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Selector */}
        <div className="p-4 bg-black/40 border-b border-slate-800/80 flex items-center justify-center gap-2">
          <button
            onClick={() => { setSelectedTrack('admin'); setActiveStep(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              selectedTrack === 'admin' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Administrator & Superadmin Track</span>
          </button>

          <button
            onClick={() => { setSelectedTrack('trainee'); setActiveStep(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              selectedTrack === 'trainee' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Candidate & Learner Track</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Step Progress Indicators */}
          <div className="flex items-center justify-between gap-1.5">
            {currentSteps.map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-500 ring-2 ring-amber-400/40' 
                    : idx < activeStep 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-800'
                }`}
                title={step.title}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base leading-snug">
                {current.title}
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {current.description}
            </p>

            <div className="p-3.5 bg-black/40 border border-slate-800/80 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">How to Execute:</span>
              <p className="text-slate-300 font-medium">{current.actionHint}</p>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-400">
            Step {activeStep + 1} of {currentSteps.length}
          </span>

          {activeStep < currentSteps.length - 1 ? (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ready</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
