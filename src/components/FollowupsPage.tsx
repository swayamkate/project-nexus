'use client';

import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

export const FollowupsPage: React.FC = () => {
  const { followups, submitFollowup } = useUser();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [viewDetailsItem, setViewDetailsItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [surveyState, setSurveyState] = useState({
    current_status: 'Active',
    current_income_range: '₹10,000 – ₹20,000',
    job_satisfaction_score: 5,
    skill_utilization_score: 5,
    remarks: 'Business is running smoothly with steady customer flow.'
  });

  const schedules = [
    {
      milestone: '3_months',
      title: '3 Months Follow-up',
      status: 'completed',
      scheduledDate: '20 Nov 2024',
      submittedDate: '20 Nov 2024',
      businessStatus: 'Active',
      incomeRange: '₹5,000 – ₹10,000',
      remarks: 'Business is going well. Getting regular customers.'
    },
    {
      milestone: '6_months',
      title: '6 Months Follow-up',
      status: 'completed',
      scheduledDate: '20 Feb 2025',
      submittedDate: '20 Feb 2025',
      businessStatus: 'Active',
      incomeRange: '₹10,000 – ₹20,000',
      remarks: 'Increased client base and income.'
    },
    {
      milestone: '12_months',
      title: '12 Months Follow-up',
      status: 'upcoming',
      scheduledDate: '20 Aug 2025',
      submittedDate: '-',
      businessStatus: 'Pending',
      incomeRange: '-',
      remarks: 'Pending'
    }
  ];

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setSubmitting(true);
    const success = await submitFollowup(selectedMilestone, surveyState);
    setSubmitting(false);
    if (success) {
      setToastMsg(`Follow-up survey for ${selectedMilestone.replace('_', ' ')} recorded successfully!`);
      setSelectedMilestone(null);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Follow-ups</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track your progress and update your status in scheduled follow-ups.
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
            <p className="text-xl font-black text-slate-900 mt-0.5">3</p>
            <span className="text-[11px] text-slate-400 font-medium">Scheduled</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Completed</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">2</p>
            <span className="text-[11px] text-slate-400 font-medium">Follow-ups</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Upcoming</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">1</p>
            <span className="text-[11px] text-slate-400 font-medium">Follow-up</span>
          </div>
        </div>

        {/* Next Follow-up Due */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Next Follow-up Due On</span>
            <p className="text-base font-black text-slate-900 mt-0.5">20 Jun 2025</p>
            <span className="text-[11px] text-slate-400 font-medium">6 Months Follow-up</span>
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
                    <span className="text-slate-400 block mb-0.5">Business Status</span>
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

      {/* Update Survey Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {selectedMilestone.replace('_', ' ').toUpperCase()} Survey Submission
              </h3>
              <button onClick={() => setSelectedMilestone(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSurveySubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Current Operating Status</label>
                <select
                  value={surveyState.current_status}
                  onChange={e => setSurveyState({ ...surveyState, current_status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="Active">Active (Generating steady income)</option>
                  <option value="Scaling">Scaling (Expanding customer base)</option>
                  <option value="Needs Support">Struggling / Needs Training Support</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Current Monthly Income</label>
                <select
                  value={surveyState.current_income_range}
                  onChange={e => setSurveyState({ ...surveyState, current_income_range: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                >
                  <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                  <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                  <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                  <option value="₹35,000+">₹35,000+</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Remarks & Details</label>
                <textarea
                  rows={3}
                  value={surveyState.remarks}
                  onChange={e => setSurveyState({ ...surveyState, remarks: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  placeholder="Share details about your work progress..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {submitting ? 'Saving...' : 'Submit Survey'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
