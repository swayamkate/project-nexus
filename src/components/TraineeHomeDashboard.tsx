'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Building2, 
  MapPin, 
  Download, 
  Compass, 
  FileText, 
  Sparkles,
  Bell,
  Clock,
  TrendingUp,
  ExternalLink,
  BookOpen,
  DollarSign,
  Users,
  Megaphone,
  X,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { EmptyState } from '@/components/EmptyState';

interface TraineeHomeDashboardProps {
  onNavigate: (section: string) => void;
}

export const TraineeHomeDashboard: React.FC<TraineeHomeDashboardProps> = ({ onNavigate }) => {
  const { user, profile, employment, enrollments, followups, notifications, opportunities, updateEmployment, submitFollowup, t } = useUser();
  
  // Modals state
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Business Edit state
  const [businessForm, setBusinessForm] = useState({
    business_name: employment?.business_name || '',
    business_type: employment?.business_type || '',
    location: profile?.district ? `${profile.district}, Maharashtra` : 'Maharashtra',
    monthly_income_range: employment?.monthly_income_range || '',
    monthly_revenue: employment?.monthly_revenue || 0
  });

  // Followup Quick state
  const [surveyForm, setSurveyForm] = useState({
    milestone: '6_months',
    current_status: 'self_employed',
    current_income_range: '₹20,000 – ₹35,000',
    remarks: 'Consistent growth and regular client orders.'
  });

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Trainee';
  const completedTrainingsCount = enrollments.filter(e => e.status === 'completed' || e.status === 'certified').length;
  const certificationsCount = enrollments.filter(e => e.status === 'certified' && Boolean(e.certificate_id?.trim())).length;
  
  const employmentStatusLabel = employment?.status 
    ? (employment.status === 'self_employed' ? 'Self-Employed' : employment.status === 'employed' ? 'Employed' : employment.status === 'apprenticeship' ? 'Apprentice' : 'Job Seeking')
    : 'Not Registered';

  const nextPendingFollowup = followups.find(f => f.status !== 'completed');
  const nextFollowupLabel = nextPendingFollowup 
    ? `${nextPendingFollowup.milestone.replace('_', ' ')}` 
    : (followups.length > 0 ? 'All Completed' : 'Pending');

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateEmployment({
      business_name: businessForm.business_name,
      business_type: businessForm.business_type,
      monthly_revenue: Number(businessForm.monthly_revenue) || 0,
      monthly_income_range: businessForm.monthly_income_range
    });
    setSaving(false);
    setShowBusinessModal(false);
    setToastMsg('Business profile successfully updated.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await submitFollowup(surveyForm.milestone, {
      current_status: surveyForm.current_status,
      current_income_range: surveyForm.current_income_range,
      remarks: surveyForm.remarks
    });
    setSaving(false);
    setShowFollowupModal(false);
    setToastMsg('Milestone followup survey submitted.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const firstEnrollment = enrollments[0];
  const journeySteps = [
    { 
      title: 'Training Enrolled', 
      date: firstEnrollment?.enrolled_date || (firstEnrollment ? 'Enrolled' : 'Not Enrolled'), 
      icon: GraduationCap, 
      completed: !!firstEnrollment 
    },
    { 
      title: 'Training Completed', 
      date: firstEnrollment?.completed_date || (firstEnrollment?.status === 'completed' || firstEnrollment?.status === 'certified' ? 'Completed' : 'In Progress'), 
      icon: BookOpen, 
      completed: !!firstEnrollment?.completed_date || firstEnrollment?.status === 'completed' || firstEnrollment?.status === 'certified' 
    },
    { 
      title: 'Certified', 
      date: firstEnrollment?.certified_date || (firstEnrollment?.certificate_id ? 'Certified' : 'Pending Exam'), 
      icon: Award, 
      completed: firstEnrollment?.status === 'certified' && Boolean(firstEnrollment?.certificate_id?.trim())
    },
    { 
      title: employmentStatusLabel, 
      date: employment?.establishment_date || employment?.joining_date || (employment ? 'Active' : 'Unregistered'), 
      icon: Building2, 
      completed: !!employment 
    },
    { 
      title: nextPendingFollowup ? `${nextPendingFollowup.milestone.replace('_', ' ')} Milestone` : 'Longitudinal Tracking', 
      date: nextPendingFollowup?.due_date || (followups.length > 0 ? 'Completed' : 'Scheduled at M+3'), 
      icon: Calendar, 
      completed: followups.length > 0 && !nextPendingFollowup 
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}
      
      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* Training Completed */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">{t('dash.trainingsCompleted', 'Completed Courses')}</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{completedTrainingsCount}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('training-details')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Certifications */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">{t('dash.verifiedCerts', 'Verified Certificates')}</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{certificationsCount}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('certifications')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Employment Status */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">{t('dash.employmentStatus', 'Employment Status')}</span>
              <p className="text-sm font-black text-slate-900 mt-1">{employmentStatusLabel}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('self-employment')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Enterprise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Follow-up */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">{t('dash.nextFollowup', 'Next Milestone Follow-up')}</span>
              <p className="text-sm font-black text-slate-900 mt-1">{nextFollowupLabel}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* My Journey Stepper */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-base">My Journey</h3>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 px-2 sm:px-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-14 right-14 top-6 h-0.5 bg-slate-200 z-0" />

          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.completed 
                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-slate-50 border-slate-300 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                  <p className="text-[11px] text-slate-500">{step.date}</p>
                </div>

                {step.completed && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Career Engine & Upskilling Accelerator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Career Goal & Upskilling Accelerator</h3>
              <p className="text-xs text-slate-300">Target role diagnosis, N-day roadmaps, accredited courses, and interview simulation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('career-goal')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 shadow-md cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Configure Goal & Skill Gap</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Feature Accelerator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div 
            onClick={() => onNavigate('career-goal')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition cursor-pointer group space-y-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition">Skill Gap Matrix</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Benchmark current skills vs target role requirements</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('career-roadmap')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition cursor-pointer group space-y-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition">N-Day Action Roadmap</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Step-by-step milestone checklist to reach target role</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('courses')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition cursor-pointer group space-y-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition">NPTEL & Coursera</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Search and enroll in accredited courses with progress tracking</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('skill-assessments')}
            className="bg-white/10 hover:bg-white/15 p-4 rounded-2xl border border-white/10 transition cursor-pointer group space-y-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition">Skill Level Quizzes</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Timed assessments to earn verified skill badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle 2 Columns: Self-Employment Overview & Upcoming Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Self-Employment Overview */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Self-Employment & Enterprise</h3>
              <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                employment?.verified_by_admin 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : employment 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                {employment?.business_status ? employment.business_status.toUpperCase() : (employment ? 'ACTIVE' : 'UNREGISTERED')}
              </span>
            </div>

            {employment ? (
              <div className="space-y-3 pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Business Type</span>
                  </div>
                  <span className="font-semibold text-slate-800">{employment.business_type || employment.business_category || 'Micro-Enterprise'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Enterprise Name</span>
                  </div>
                  <span className="font-bold text-slate-900">{employment.business_name || employment.company_name || 'Registered Unit'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Established Date</span>
                  </div>
                  <span className="font-semibold text-slate-800">{employment.establishment_date || employment.joining_date || 'Active'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location</span>
                  </div>
                  <span className="font-semibold text-slate-800">{employment.business_address || (profile?.district ? `${profile.district}, Maharashtra` : 'Maharashtra')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>Monthly Revenue / Income</span>
                  </div>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    {employment.monthly_revenue ? `₹${employment.monthly_revenue.toLocaleString('en-IN')}` : (employment.monthly_income_range || '₹15,000 – ₹25,000')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <EmptyState
                  icon={Building2}
                  title="No Enterprise Registered"
                  description="Add your micro-enterprise, shop, or freelance practice to track monthly income growth and qualify for MUDRA & PMEGP subsidies."
                  actionLabel="Register Enterprise"
                  onAction={() => setShowBusinessModal(true)}
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowBusinessModal(true)}
            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer mt-4"
          >
            <span>{employment ? 'Update Business Details' : 'Register New Enterprise'}</span>
          </button>
        </div>

        {/* Upcoming Follow-up */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Longitudinal Tracking Status</h3>
          </div>

          <div className="text-center py-4 space-y-1.5">
            <span className="text-xs text-slate-500">
              {nextPendingFollowup ? 'Your next milestone survey is due on' : 'Longitudinal Outcome Verification'}
            </span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {nextPendingFollowup ? nextPendingFollowup.due_date : 'All Milestones Up-to-Date'}
            </p>
            <span className="text-xs text-slate-500 font-medium">
              {nextPendingFollowup ? `(${nextPendingFollowup.milestone.replace('_', ' ')} Milestone)` : `${followups.length} completed longitudinal records`}
            </span>
          </div>

          <button
            onClick={() => setShowFollowupModal(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <span>{nextPendingFollowup ? 'Submit Milestone Survey' : 'Log New Update'}</span>
          </button>
        </div>

      </div>

      {/* Follow-up History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Longitudinal Follow-up History</h3>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            View All ({followups.length})
          </button>
        </div>

        {followups.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6">
            <EmptyState
              icon={Calendar}
              title="No Follow-up Surveys Logged"
              description="Longitudinal surveys track your employment and income outcomes at 3, 6, 12, 18, and 24 months post-training."
              actionLabel="Submit Initial Follow-up"
              onAction={() => setShowFollowupModal(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {followups.slice(0, 3).map((fol) => (
              <div key={fol.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className={`w-4 h-4 ${fol.status === 'completed' ? 'text-emerald-500' : 'text-blue-500'}`} />
                      <h4 className="font-bold text-slate-900 text-xs capitalize">{fol.milestone.replace('_', ' ')} Follow-up</h4>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize ${
                      fol.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {fol.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-semibold">{fol.completed_date || fol.due_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-semibold text-emerald-600 capitalize">{fol.current_status ? fol.current_status.replace('_', ' ') : 'Active'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Income Range:</span>
                      <span className="font-semibold">{fol.current_income_range || '₹15,000 – ₹25,000'}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('follow-ups')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Opportunities for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Recommended Opportunities for You</h3>
          <button 
            onClick={() => onNavigate('training-details')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            View All ({opportunities.length})
          </button>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6">
            <EmptyState
              icon={Sparkles}
              title="No Opportunities Catalogued"
              description="Government subsidies, MUDRA loans, and upskilling courses for your district will appear here."
              actionLabel="Explore Programs"
              onAction={() => onNavigate('training-details')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{opp.title}</h4>
                    <span className="text-[11px] text-slate-500">{opp.category} • {opp.provider}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {opp.description || 'Verified government skilling and micro-enterprise grant opportunity.'}
                </p>
                <button 
                  onClick={() => setShowOpportunityModal({
                    title: opp.title,
                    type: opp.category,
                    desc: opp.description || `Offered by ${opp.provider}. Connect with your District Mission Officer to apply.`
                  })}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom 2 Columns: Quick Links & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Links */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Quick Links</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { label: 'Download Certificate', icon: Download, action: () => onNavigate('certifications') },
              { label: 'Explore Courses', icon: BookOpen, action: () => onNavigate('training-details') },
              { label: 'Update Documents Vault', icon: FileText, action: () => onNavigate('documents') },
              { label: 'Career Progression & Skills', icon: Sparkles, action: () => onNavigate('skill-development') },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={link.action}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-600 transition group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Official Notifications</h3>
            <button 
              onClick={() => onNavigate('notifications')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
            >
              View All ({notifications.length})
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No recent notifications logged.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start justify-between gap-4 text-xs py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-start space-x-2.5">
                    <Bell className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block">{notif.title}</span>
                      <span className="text-slate-600 font-normal leading-relaxed">{notif.message}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString('en-IN') : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Business Update Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Update Business Information</h3>
              <button onClick={() => setShowBusinessModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessForm.business_name}
                  onChange={e => setBusinessForm({ ...businessForm, business_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Business Type</label>
                <input
                  type="text"
                  required
                  value={businessForm.business_type}
                  onChange={e => setBusinessForm({ ...businessForm, business_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Monthly Income Range</label>
                <select
                  value={businessForm.monthly_income_range}
                  onChange={e => setBusinessForm({ ...businessForm, monthly_income_range: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                  <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                  <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                  <option value="₹35,000+">₹35,000+</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBusinessModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {saving ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Followup Update Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Follow-up Check-in</h3>
              <button onClick={() => setShowFollowupModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Milestone</label>
                <select
                  value={surveyForm.milestone}
                  onChange={e => setSurveyForm({ ...surveyForm, milestone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="6_months">6 Months Follow-up</option>
                  <option value="12_months">12 Months Follow-up</option>
                  <option value="18_months">18 Months Follow-up</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Current Operating Status</label>
                <select
                  value={surveyForm.current_status}
                  onChange={e => setSurveyForm({ ...surveyForm, current_status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="Active">Active (Generating steady income)</option>
                  <option value="Scaling">Scaling (Expanding workshop/shop)</option>
                  <option value="Needs Support">Struggling / Needs Guidance</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Current Monthly Income</label>
                <select
                  value={surveyForm.current_income_range}
                  onChange={e => setSurveyForm({ ...surveyForm, current_income_range: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                  <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                  <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                  <option value="₹35,000+">₹35,000+</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Remarks & Feedback</label>
                <textarea
                  rows={2}
                  value={surveyForm.remarks}
                  onChange={e => setSurveyForm({ ...surveyForm, remarks: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  placeholder="e.g. Business is going well. Getting regular clients."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFollowupModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {saving ? 'Submitting...' : 'Submit Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Opportunity Details Modal */}
      {showOpportunityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase text-blue-600">{showOpportunityModal.type}</span>
                <h3 className="text-base font-bold text-slate-900">{showOpportunityModal.title}</h3>
              </div>
              <button onClick={() => setShowOpportunityModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{showOpportunityModal.desc}</p>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setShowOpportunityModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setToastMsg('Application submitted! Our district coordinator will contact you.');
                  setTimeout(() => setToastMsg(null), 4000);
                  setShowOpportunityModal(null);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
