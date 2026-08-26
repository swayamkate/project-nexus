'use client';

import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  ArrowRight, 
  Building2, 
  DollarSign, 
  MapPin, 
  Download, 
  Compass, 
  FileText, 
  Sparkles,
  Bell,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

interface TraineeHomeDashboardProps {
  onNavigate: (section: string) => void;
}

export const TraineeHomeDashboard: React.FC<TraineeHomeDashboardProps> = ({ onNavigate }) => {
  const { user, profile, employment, enrollments, followups } = useUser();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data } = await supabase
        .from('recommended_opportunities')
        .select('*')
        .eq('is_active', true)
        .limit(3);
      if (data && data.length > 0) {
        setOpportunities(data);
      }
    };
    fetchOpportunities();
  }, [supabase]);

  // Derived Real Calculations
  const completedTrainingsCount = enrollments.filter(e => e.status === 'completed' || e.status === 'certified').length;
  const certificationsCount = enrollments.filter(e => !!e.certificate_id || e.status === 'certified').length;
  
  const employmentStatusLabel = employment?.status 
    ? employment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Not Recorded';

  const isSelfEmployed = employment?.status === 'self_employed';
  const hasBusinessDetails = isSelfEmployed && employment?.business_name;

  // Real Milestone Timeline
  const accountCreatedDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
  const primaryEnrollment = enrollments[0];

  const journeySteps = [
    {
      title: 'Portal Enrolled',
      date: accountCreatedDate,
      completed: true
    },
    {
      title: primaryEnrollment?.training_programs?.title || 'Skilling Course',
      date: primaryEnrollment?.enrolled_date ? new Date(primaryEnrollment.enrolled_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'In Progress',
      completed: !!primaryEnrollment
    },
    {
      title: 'Certified',
      date: primaryEnrollment?.certified_date ? new Date(primaryEnrollment.certified_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending Assessment',
      completed: certificationsCount > 0
    },
    {
      title: employmentStatusLabel,
      date: employment?.establishment_date || employment?.joining_date || 'Status Active',
      completed: !!employment?.status
    },
    {
      title: 'Next Follow-up',
      date: followups[0]?.due_date || 'Scheduled in 90 Days',
      completed: followups.some(f => f.status === 'completed')
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner with Profile Completion */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#0e1628] border border-blue-500/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Trainee Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {profile?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your certifications, wage growth, longitudinal milestones, and official verification proofs in real-time.
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 min-w-[240px]">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeDasharray={`${profile?.profile_completion_pct || 40}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">
                {profile?.profile_completion_pct || 40}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Profile Readiness</p>
              <button 
                onClick={() => onNavigate('my-profile')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold mt-0.5 flex items-center"
              >
                <span>Edit Profile</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Training Completed */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Training Programs</span>
              <p className="text-2xl font-black text-white">{completedTrainingsCount}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('training-details')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Certifications */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Verified Certifications</span>
              <p className="text-2xl font-black text-white">{certificationsCount}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('certifications')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Employment Status */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Outcome Status</span>
              <p className="text-base font-extrabold text-white truncate max-w-[150px]">
                {employmentStatusLabel}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(isSelfEmployed ? 'self-employment' : 'employment-status')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Update Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Follow-up */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Longitudinal Survey</span>
              <p className="text-sm font-black text-amber-400">
                {followups[0]?.milestone ? followups[0].milestone.replace('_', ' ').toUpperCase() : 'M+3 Milestone'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Survey Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Step Stepper Journey Timeline */}
      <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Longitudinal Career Stepper</h3>
          <span className="text-xs text-slate-400">Phase 1 Lifecycle Tracking</span>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-2 sm:px-6">
          <div className="hidden md:block absolute left-12 right-12 top-5 h-0.5 bg-slate-800 z-0" />

          {journeySteps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                step.completed 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                <p className="text-[11px] text-slate-400">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Self-Employment Details OR Setup Prompt */}
      {hasBusinessDetails ? (
        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{employment.business_name}</h3>
                <p className="text-xs text-slate-400">{employment.business_type || 'Micro-Enterprise'}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg uppercase">
              {employment.business_status || 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Monthly Revenue</span>
              <p className="text-lg font-black text-white mt-1">
                ₹{Number(employment.monthly_revenue || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Udyam Registration</span>
              <p className="text-sm font-mono font-bold text-blue-400 mt-1 truncate">
                {employment.udyam_number || 'Pending Submission'}
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">District / Location</span>
              <p className="text-sm font-bold text-white mt-1">
                {profile?.district || 'Maharashtra'}, India
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('self-employment')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl border border-slate-800 text-xs transition flex items-center justify-center space-x-2"
          >
            <span>Update Business & Upload GST/Udyam Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-950/40 via-[#0e1628] to-[#0e1628] border border-purple-500/30 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Record Your Employment or Self-Employment</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Register your business, start-up details, or job placement to begin measuring your real-time wage progression and unlock government MSME benefits.
            </p>
          </div>
          <button
            onClick={() => onNavigate('self-employment')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center space-x-2 text-xs flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Setup Business Details</span>
          </button>
        </div>
      )}

      {/* Recommended Opportunities from Real Database */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Government Schemes & Upskilling Opportunities</h3>
          <span className="text-xs text-blue-400 font-semibold">Matched to Your Sector</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp, idx) => (
            <div key={opp.id || idx} className="bg-[#0e1628] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-md uppercase">
                  {opp.category}
                </span>
                <h4 className="font-bold text-white text-sm leading-snug">{opp.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{opp.description}</p>
              </div>

              <a 
                href={opp.link_url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 pt-2 border-t border-slate-800"
              >
                <span>Apply / Learn More</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
