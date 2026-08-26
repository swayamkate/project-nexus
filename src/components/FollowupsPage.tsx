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
  Star,
  Sparkles 
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

export const FollowupsPage: React.FC = () => {
  const { followups, submitFollowup } = useUser();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Survey Form State
  const [surveyState, setSurveyState] = useState({
    current_status: 'self_employed',
    current_income_range: '₹15,000 – ₹25,000',
    job_satisfaction_score: 5,
    skill_utilization_score: 5,
    additional_support_needed: '',
  });

  const milestoneDefinitions = [
    { key: '3_months', label: '3 Months Check-in', desc: 'Initial placement, business setup, and income baseline.' },
    { key: '6_months', label: '6 Months Check-in', desc: 'Revenue growth, customer acquisition, and stability.' },
    { key: '12_months', label: '12 Months Check-in', desc: 'Long-term enterprise sustainability and wage escalation.' },
    { key: '18_months', label: '18 Months Check-in', desc: 'Scaling, hiring employees, and secondary upskilling.' },
    { key: '24_months', label: '24 Months Check-in', desc: 'Final longitudinal evaluation and career trajectory audit.' }
  ];

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setSubmitting(true);
    setSuccessMsg(null);

    const success = await submitFollowup(selectedMilestone, surveyState);
    setSubmitting(false);
    if (success) {
      setSuccessMsg(`Survey for ${selectedMilestone.replace('_', ' ')} recorded successfully!`);
      setSelectedMilestone(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Longitudinal Outcome Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Periodic Skilling Surveys</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          National framework policy requires periodic checks at 3, 6, 12, 18, and 24 months to measure wage progression and provide government financial assistance.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Survey Modal / Form */}
      {selectedMilestone && (
        <div className="bg-[#0e1628] border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-400 font-bold uppercase">Active Survey</span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {selectedMilestone.replace('_', ' ').toUpperCase()} Survey Submission
              </h2>
            </div>
            <button
              onClick={() => setSelectedMilestone(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSurveySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Current Employment Status</label>
                <select
                  value={surveyState.current_status}
                  onChange={e => setSurveyState({ ...surveyState, current_status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="self_employed">Self-Employed (Running Business)</option>
                  <option value="employed">Employed (Salaried Job)</option>
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="job_seeking">Looking for Work / Transitioning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Current Monthly Income Bracket</label>
                <select
                  value={surveyState.current_income_range}
                  onChange={e => setSurveyState({ ...surveyState, current_income_range: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                  <option value="₹10,000 – ₹20,000">₹10,000 – ₹20,000</option>
                  <option value="₹20,000 – ₹35,000">₹20,000 – ₹35,000</option>
                  <option value="₹35,000 – ₹50,000">₹35,000 – ₹50,000</option>
                  <option value="₹50,000+">₹50,000+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Job / Business Satisfaction (1 to 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={surveyState.job_satisfaction_score}
                  onChange={e => setSurveyState({ ...surveyState, job_satisfaction_score: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Skill Utilization Score (1 to 5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={surveyState.skill_utilization_score}
                  onChange={e => setSurveyState({ ...surveyState, skill_utilization_score: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Government Support or Upskilling Needed?</label>
              <textarea
                rows={2}
                value={surveyState.additional_support_needed}
                onChange={e => setSurveyState({ ...surveyState, additional_support_needed: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Need Mudra loan guidance, advanced machine training, or digital marketing support..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Survey Response</span>
            </button>
          </form>
        </div>
      )}

      {/* Milestones List */}
      <div className="grid grid-cols-1 gap-4">
        {milestoneDefinitions.map((m, idx) => {
          const completedRecord = followups.find(f => f.milestone === m.key && f.status === 'completed');
          const isDone = !!completedRecord;

          return (
            <div key={m.key} className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{m.label}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {isDone ? 'Recorded in DB' : 'Available'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  {isDone && (
                    <p className="text-xs text-emerald-400 font-semibold mt-1">
                      Reported Income: {completedRecord.current_income_range || 'Active'}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedMilestone(m.key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 ${
                  isDone 
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <span>{isDone ? 'Update Response' : 'Fill Survey'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
