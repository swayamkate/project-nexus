'use client';

import React from 'react';
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
  Bell
} from 'lucide-react';

interface TraineeHomeDashboardProps {
  onNavigate: (section: string) => void;
}

export const TraineeHomeDashboard: React.FC<TraineeHomeDashboardProps> = ({ onNavigate }) => {
  const journeySteps = [
    { title: 'Training Enrolled', date: '10 Apr 2024', status: 'completed' },
    { title: 'Training Completed', date: '30 Jun 2024', status: 'completed' },
    { title: 'Certified', date: '15 Jul 2024', status: 'completed' },
    { title: 'Self-Employed', date: '01 Aug 2024', status: 'completed' },
    { title: 'Next Follow-up', date: '20 Jun 2025', status: 'upcoming' },
  ];

  const followUpCards = [
    {
      title: '3 Months Follow-up',
      status: 'Completed',
      date: '20 Nov 2024',
      bizStatus: 'Active',
      income: '₹5,000 – ₹10,000',
      actionText: 'View Details'
    },
    {
      title: '6 Months Follow-up',
      status: 'Completed',
      date: '20 Feb 2025',
      bizStatus: 'Active',
      income: '₹10,000 – ₹20,000',
      actionText: 'View Details'
    },
    {
      title: '12 Months Follow-up',
      status: 'Upcoming',
      date: '20 Aug 2025',
      bizStatus: '-',
      income: '-',
      actionText: 'Update When Due'
    },
  ];

  const opportunities = [
    {
      title: 'Digital Marketing Advanced Course',
      type: 'Online Course',
      icon: 'course',
      tag: 'Online Course'
    },
    {
      title: 'Government Scheme for Entrepreneurs',
      type: 'PMEGP Scheme',
      icon: 'scheme',
      tag: 'PMEGP Scheme'
    },
    {
      title: 'Join Local Business Network',
      type: 'Connect & Grow',
      icon: 'network',
      tag: 'Connect & Grow'
    },
  ];

  const notifications = [
    { text: 'Your 3 Months follow-up has been recorded successfully.', date: '20 Nov 2024' },
    { text: "New course 'Advanced Tailoring Techniques' is available.", date: '05 Dec 2024' },
    { text: 'Your next follow-up is due on 20 Jun 2025.', date: '20 May 2025' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Training Completed */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Training Completed</span>
              <p className="text-2xl font-black text-white">1</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('training-details')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Details</span>
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
              <span className="text-xs text-slate-400 font-medium">Certifications</span>
              <p className="text-2xl font-black text-white">1</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('certifications')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Details</span>
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
              <span className="text-xs text-slate-400 font-medium">Employment Status</span>
              <p className="text-lg font-black text-white">Self-Employed</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('employment-status')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Details</span>
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
              <span className="text-xs text-slate-400 font-medium">Next Follow-up</span>
              <p className="text-xl font-black text-amber-400">85 Days Left</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* My Journey (5-Step Stepper Timeline) */}
      <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-white text-base">My Journey</h3>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-2 sm:px-6">
          {/* Connector Line behind steps */}
          <div className="hidden md:block absolute left-12 right-12 top-5 h-0.5 bg-slate-800 z-0" />

          {journeySteps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                    : 'bg-blue-600/20 border-blue-400 text-blue-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                  <p className="text-[11px] text-slate-400">{step.date}</p>
                </div>

                {isCompleted && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Grid: Self-Employment Overview & Upcoming Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Self-Employment Overview (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Self-Employment Overview</h3>
            <span className="text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Business Type</span>
              </span>
              <span className="font-bold text-slate-200">Tailoring Services</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span>Business Name</span>
              </span>
              <span className="font-bold text-slate-200">Priya Stitch Works</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Start Date</span>
              </span>
              <span className="font-bold text-slate-200">01 Aug 2024</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Location</span>
              </span>
              <span className="font-bold text-slate-200">Pune, Maharashtra</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span>Monthly Income Range</span>
              </span>
              <span className="font-bold text-emerald-400">₹10,000 – ₹20,000</span>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onNavigate('self-employment')}
              className="w-full py-2.5 rounded-xl border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs font-bold transition text-center block"
            >
              Update Business Details
            </button>
          </div>
        </div>

        {/* Upcoming Follow-up Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center space-x-2 text-blue-400">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Upcoming Follow-up</h3>
          </div>

          <div className="text-center space-y-2 py-4">
            <p className="text-xs text-slate-400">Your next follow-up is due on</p>
            <p className="text-2xl font-black text-slate-100">20 Jun 2025</p>
            <span className="text-xs text-blue-400 font-medium block">(6 Months Follow-up)</span>
          </div>

          <button 
            onClick={() => onNavigate('follow-ups')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20"
          >
            Update Follow-up
          </button>
        </div>

      </div>

      {/* Follow-up History (Cards Grid) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Follow-up History</h3>
          <span 
            onClick={() => onNavigate('follow-ups')}
            className="text-xs text-blue-400 font-semibold cursor-pointer"
          >
            View All
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followUpCards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-sm">{card.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    card.status === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    {card.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <strong className="text-slate-200">{card.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Status:</span>
                    <span className={card.bizStatus === 'Active' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {card.bizStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Range:</span>
                    <strong className="text-slate-200">{card.income}</strong>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('follow-ups')}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition ${
                  card.status === 'Completed'
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                {card.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Opportunities for You */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base">Recommended Opportunities for You</h3>
          <span className="text-xs text-blue-400 font-semibold cursor-pointer">View All</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp, idx) => (
            <div 
              key={idx}
              className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs leading-snug">{opp.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">{opp.tag}</span>
                </div>
              </div>

              <button 
                onClick={() => alert(`Details opened for: ${opp.title}`)}
                className="w-full py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid: Quick Links & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Links */}
        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm">Quick Links</h3>
          <div className="space-y-2">
            {[
              { label: 'Download Certificate', icon: Download },
              { label: 'Explore Courses', icon: Compass },
              { label: 'Update Documents', icon: FileText },
              { label: 'Career Guidance', icon: Sparkles },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={() => alert(`Navigating to: ${link.label}`)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-200 text-xs font-semibold transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Recent Notifications</h3>
            <span className="text-xs text-blue-400 font-semibold cursor-pointer">View All</span>
          </div>

          <div className="space-y-3">
            {notifications.map((notif, idx) => (
              <div 
                key={idx}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs gap-3"
              >
                <div className="flex items-start space-x-2.5">
                  <Bell className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-snug">{notif.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 whitespace-nowrap">{notif.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
