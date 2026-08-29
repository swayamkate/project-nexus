'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Send, 
  Loader2, 
  TrendingUp, 
  Info,
  X,
  FileCheck,
  Building2,
  DollarSign,
  Mic,
  MicOff,
  Volume2,
  Sparkles
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { LongitudinalSurveyModal } from '@/components/LongitudinalSurveyModal';

export const FollowupsPage: React.FC = () => {
  const { profile, followups, submitFollowup, t, language } = useUser();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [viewDetailsItem, setViewDetailsItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isListening, setIsListening] = useState(false);

  // Form State
  const [surveyState, setSurveyState] = useState({
    current_status: '',
    current_income_range: '',
    job_satisfaction_score: null as number | null,
    skill_utilization_score: null as number | null,
    remarks: ''
  });

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToastType('error');
      setToastMsg('Speech-to-Text not supported in this browser.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set speech language based on app language
    if (language === 'mr') recognition.lang = 'mr-IN';
    else if (language === 'hi') recognition.lang = 'hi-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSurveyState(prev => ({
        ...prev,
        remarks: prev.remarks ? `${prev.remarks} ${transcript}` : transcript
      }));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const standardMilestones: Array<{ milestone: '3_months' | '6_months' | '12_months' | '18_months' | '24_months'; title: string; defaultMonths: number }> = [
    { milestone: '3_months', title: '3 Months Follow-up', defaultMonths: 3 },
    { milestone: '6_months', title: '6 Months Follow-up', defaultMonths: 6 },
    { milestone: '12_months', title: '12 Months Follow-up', defaultMonths: 12 },
    { milestone: '18_months', title: '18 Months Follow-up', defaultMonths: 18 },
    { milestone: '24_months', title: '24 Months Follow-up', defaultMonths: 24 },
  ];

  const schedules = standardMilestones.map((m) => {
    const existing = followups.find((f) => f.milestone === m.milestone);
    return {
      milestone: m.milestone,
      title: m.title,
      status: existing?.status || 'upcoming',
      scheduledDate: existing?.due_date || `M+${m.defaultMonths} Post-Training`,
      submittedDate: existing?.completed_date || (existing?.status === 'completed' ? existing.due_date : '-'),
      businessStatus: existing?.current_status ? existing.current_status.replace(/_/g, ' ') : (existing?.status === 'completed' ? 'Reported' : 'Pending'),
      incomeRange: existing?.current_income_range || (existing?.status === 'completed' ? 'Reported' : '-'),
      remarks: existing?.remarks || (existing?.status === 'completed' ? 'Submitted' : 'Pending submission'),
      satisfactionScore: existing?.job_satisfaction_score ?? null,
      skillScore: existing?.skill_utilization_score ?? null,
    };
  });

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    if (!surveyState.current_status) {
      setToastType('error');
      setToastMsg('Please select your current operating or employment status.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    setSubmitting(true);
    const success = await submitFollowup(selectedMilestone, {
      current_status: surveyState.current_status,
      current_income_range: surveyState.current_income_range || '₹0 (Unemployed / In Training)',
      remarks: surveyState.remarks,
      job_satisfaction_score: surveyState.job_satisfaction_score || 5,
      skill_utilization_score: surveyState.skill_utilization_score || 5
    });
    setSubmitting(false);

    if (success) {
      setToastType('success');
      setToastMsg(`Follow-up survey for ${selectedMilestone.replace('_', ' ')} recorded successfully!`);
      setSelectedMilestone(null);
      setSurveyState({
        current_status: '',
        current_income_range: '',
        job_satisfaction_score: null,
        skill_utilization_score: null,
        remarks: ''
      });
      setTimeout(() => setToastMsg(null), 4000);
    } else {
      setToastType('error');
      setToastMsg('Failed to save survey. Please check your connection and try again.');
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-20 right-6 z-50 ${
          toastType === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        } text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top duration-300`}>
          {toastType === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('followups.title', 'Longitudinal Follow-up Surveys')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('followups.subtitle', 'Mandatory 3M, 6M, 12M, 18M, and 24M longitudinal tracking surveys for state outcome verification.')}
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* Total Follow-ups */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Follow-ups</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{schedules.length}</p>
            <span className="text-[11px] text-slate-400 font-medium">Scheduled Milestones</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Completed</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {followups.filter(f => f.status === 'completed').length}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Verified Surveys</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending Check-in</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">
              {schedules.filter(s => s.status !== 'completed').length}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Surveys Remaining</span>
          </div>
        </div>

        {/* Next Follow-up Due */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Next Follow-up Due</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {schedules.find(s => s.status !== 'completed')?.scheduledDate || 'All Completed'}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">
              {schedules.find(s => s.status !== 'completed')?.title || 'Longitudinal Enclave'}
            </span>
          </div>
        </div>

      </div>

      {/* Follow-up Schedule Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Follow-up Schedule</h3>

        <div className="space-y-3">
          {schedules.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            return (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border transition ${
                  isCompleted 
                    ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200' 
                    : 'bg-blue-50/20 border-blue-100 hover:border-blue-200'
                } flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}
              >
                {/* Left: Check Icon + Title + Scheduled Date */}
                <div className="flex items-start space-x-3.5 min-w-[220px]">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    isCompleted ? 'bg-emerald-500 text-white' : 'border-2 border-blue-400 text-transparent'
                  }`}>
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      <span>Scheduled Date</span>
                      <p className="font-bold text-slate-800">{item.scheduledDate}</p>
                    </div>
                  </div>
                </div>

                {/* Middle: Business Status + Income + Remarks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs flex-1 px-0 lg:px-4">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Business / Work Status</span>
                    <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {item.businessStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Income Range</span>
                    <span className="font-bold text-slate-800">{item.incomeRange}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Remarks</span>
                    <span className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{item.remarks}</span>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="w-full lg:w-auto flex justify-end">
                  {isCompleted ? (
                    <button
                      onClick={() => setViewDetailsItem(item)}
                      className="px-4 py-2 bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                    >
                      View Details
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedMilestone(item.milestone)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      Update Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-up History Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Follow-up History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[11px]">
                <th className="py-3 px-4">Follow-up</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Business Status</th>
                <th className="py-3 px-4">Income Range</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schedules.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.title}</td>
                  <td className="py-3 px-4">{row.scheduledDate}</td>
                  <td className="py-3 px-4">{row.submittedDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.businessStatus === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.businessStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{row.incomeRange}</td>
                  <td className="py-3 px-4 text-right">
                    {row.status === 'completed' ? (
                      <button 
                        onClick={() => setViewDetailsItem(row)}
                        className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <span>View</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedMilestone(row.milestone)}
                        className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Update</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why are follow-ups important Banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 flex items-start space-x-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">Why are follow-ups important?</h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            Follow-ups help us understand your career progress, wage growth, and connect you with better opportunities, enterprise schemes, and government financial subsidies.
          </p>
        </div>
      </div>

      {/* 10-Question Longitudinal Outcome Survey Modal */}
      {selectedMilestone && (
        <LongitudinalSurveyModal
          isOpen={Boolean(selectedMilestone)}
          onClose={() => setSelectedMilestone(null)}
          milestone={selectedMilestone}
        />
      )}

      {/* View Details Modal */}
      {viewDetailsItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{viewDetailsItem.title} Record</h3>
              <button onClick={() => setViewDetailsItem(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-slate-800">{viewDetailsItem.scheduledDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Submission Date:</span>
                <span className="font-bold text-slate-800">{viewDetailsItem.submittedDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Reported Status:</span>
                <span className="font-bold text-emerald-600">{viewDetailsItem.businessStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Reported Income:</span>
                <span className="font-bold text-slate-800">{viewDetailsItem.incomeRange}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Remarks:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">{viewDetailsItem.remarks}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewDetailsItem(null)}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
