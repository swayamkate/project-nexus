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
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface TraineeHomeDashboardProps {
  onNavigate: (section: string) => void;
}

export const TraineeHomeDashboard: React.FC<TraineeHomeDashboardProps> = ({ onNavigate }) => {
  const { user, profile, employment, enrollments, followups, notifications, updateEmployment, submitFollowup } = useUser();
  
  // Modals state
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Business Edit state
  const [businessForm, setBusinessForm] = useState({
    business_name: employment?.business_name || 'Priya Stitch Works',
    business_type: employment?.business_type || 'Tailoring Services',
    location: profile?.district ? `${profile.district}, Maharashtra` : 'Pune, Maharashtra',
    monthly_income_range: employment?.monthly_income_range || '₹10,000 – ₹20,000',
    monthly_revenue: employment?.monthly_revenue || 18500
  });

  // Followup Quick state
  const [surveyForm, setSurveyForm] = useState({
    milestone: '6_months',
    current_status: 'Active',
    current_income_range: '₹10,000 – ₹20,000',
    remarks: 'Increased client base and revenue.'
  });

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Priya';
  const completedTrainingsCount = enrollments.filter(e => e.status === 'completed' || e.status === 'certified').length || 1;
  const certificationsCount = enrollments.filter(e => !!e.certificate_id || e.status === 'certified').length || 1;
  
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateEmployment({
      business_name: businessForm.business_name,
      business_type: businessForm.business_type,
      monthly_revenue: businessForm.monthly_revenue,
      monthly_income_range: businessForm.monthly_income_range
    });
    setSaving(false);
    setShowBusinessModal(false);
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
  };

  const journeySteps = [
    { title: 'Training Enrolled', date: '10 Apr 2024', icon: GraduationCap, completed: true },
    { title: 'Training Completed', date: '30 Jun 2024', icon: BookOpen, completed: true },
    { title: 'Certified', date: '15 Jul 2024', icon: Award, completed: true },
    { title: 'Self-Employed', date: '01 Aug 2024', icon: Building2, completed: true },
    { title: 'Next Follow-up', date: '20 Jun 2025', icon: Calendar, completed: false }
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
              <span className="text-xs font-semibold text-slate-500">Training Completed</span>
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
              <span className="text-xs font-semibold text-slate-500">Certifications</span>
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
              <span className="text-xs font-semibold text-slate-500">Employment Status</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">Self-Employed</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('employment-status')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Details</span>
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
              <span className="text-xs font-semibold text-slate-500">Next Follow-up</span>
              <p className="text-xl font-black text-amber-600 mt-0.5">85 Days Left</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>View Details</span>
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

      {/* Middle 2 Columns: Self-Employment Overview & Upcoming Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Self-Employment Overview */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Self-Employment Overview</h3>
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Business Type</span>
                </div>
                <span className="font-semibold text-slate-800">{employment?.business_type || 'Tailoring Services'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Business Name</span>
                </div>
                <span className="font-bold text-slate-900">{employment?.business_name || 'Priya Stitch Works'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Start Date</span>
                </div>
                <span className="font-semibold text-slate-800">{employment?.establishment_date || '01 Aug 2024'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Location</span>
                </div>
                <span className="font-semibold text-slate-800">{profile?.district ? `${profile.district}, Maharashtra` : 'Pune, Maharashtra'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span>Monthly Income Range</span>
                </div>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  {employment?.monthly_income_range || '₹10,000 – ₹20,000'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowBusinessModal(true)}
            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Update Business Details</span>
          </button>
        </div>

        {/* Upcoming Follow-up */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Upcoming Follow-up</h3>
          </div>

          <div className="text-center py-4 space-y-1.5">
            <span className="text-xs text-slate-500">Your next follow-up is due on</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">20 Jun 2025</p>
            <span className="text-xs text-slate-500 font-medium">(6 Months Follow-up)</span>
          </div>

          <button
            onClick={() => setShowFollowupModal(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <span>Update Follow-up</span>
          </button>
        </div>

      </div>

      {/* Follow-up History (3 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Follow-up History</h3>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: 3M */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-slate-900 text-xs">3 Months Follow-up</h4>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  Completed
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold">20 Nov 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Status:</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Income Range:</span>
                  <span className="font-semibold">₹5,000 – ₹10,000</span>
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

          {/* Card 2: 6M */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-slate-900 text-xs">6 Months Follow-up</h4>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  Completed
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold">20 Feb 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Status:</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Income Range:</span>
                  <span className="font-semibold">₹10,000 – ₹20,000</span>
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

          {/* Card 3: 12M */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h4 className="font-bold text-slate-900 text-xs">12 Months Follow-up</h4>
                </div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                  Upcoming
                </span>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold">20 Aug 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Status:</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Income Range:</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowFollowupModal(true)}
              className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Update When Due
            </button>
          </div>

        </div>
      </div>

      {/* Recommended Opportunities for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Recommended Opportunities for You</h3>
          <button 
            onClick={() => onNavigate('training-details')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Opportunity 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-xs leading-snug">Digital Marketing Advanced Course</h4>
                <span className="text-[11px] text-slate-500">Online Course</span>
              </div>
            </div>
            <button 
              onClick={() => setShowOpportunityModal({
                title: 'Digital Marketing Advanced Course',
                type: 'Online Skill Booster',
                desc: 'Learn how to market tailoring and micro-enterprise products on WhatsApp Business, Instagram, and local business directories.'
              })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              View Details
            </button>
          </div>

          {/* Opportunity 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-xs leading-snug">Government Scheme for Entrepreneurs</h4>
                <span className="text-[11px] text-slate-500">PMEGP Scheme</span>
              </div>
            </div>
            <button 
              onClick={() => setShowOpportunityModal({
                title: 'PMEGP Financial Subsidy Scheme',
                type: 'Government MSME Grant',
                desc: 'Avail up to 35% government capital subsidy on machinery and expansion loans through Prime Minister Employment Generation Programme.'
              })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              View Details
            </button>
          </div>

          {/* Opportunity 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-xs leading-snug">Join Local Business Network</h4>
                <span className="text-[11px] text-slate-500">Connect & Grow</span>
              </div>
            </div>
            <button 
              onClick={() => setShowOpportunityModal({
                title: 'Pune District Women Entrepreneurs Network',
                type: 'Peer Community Hub',
                desc: 'Connect with 1,200+ certified women entrepreneurs in Pune for bulk stitching orders, raw material discounts, and exhibitions.'
              })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              View Details
            </button>
          </div>

        </div>
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
              { label: 'Update Documents', icon: FileText, action: () => onNavigate('documents') },
              { label: 'Career Guidance', icon: Sparkles, action: () => onNavigate('skill-development') },
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
            <h3 className="font-bold text-slate-900 text-sm">Recent Notifications</h3>
            <button 
              onClick={() => onNavigate('notifications')}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { text: 'Your 3 Months follow-up has been recorded successfully.', date: '20 Nov 2024' },
              { text: "New course 'Advanced Tailoring Techniques' is available.", date: '05 Dec 2024' },
              { text: 'Your next follow-up is due on 20 Jun 2025.', date: '20 May 2025' }
            ].map((notif, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 text-xs py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex items-start space-x-2.5">
                  <Bell className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium leading-relaxed">{notif.text}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{notif.date}</span>
              </div>
            ))}
          </div>
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
