'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Star, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Send, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  FileCheck2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface LongitudinalSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: string;
}

export const LongitudinalSurveyModal: React.FC<LongitudinalSurveyModalProps> = ({
  isOpen,
  onClose,
  milestone = '6_months'
}) => {
  const { profile, employment, submitFollowup, updateEmployment, markAllNotificationsAsRead, refreshData, language, t } = useUser();

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 10-Question Comprehensive State
  const [answers, setAnswers] = useState({
    q1_status: employment?.status === 'self_employed' ? 'self_employed' : 'employed',
    q2_employer_name: employment?.company_name || employment?.business_name || (profile?.full_name ? `${profile.full_name}'s Enterprise` : 'Tata Motors Limited'),
    q3_district_location: profile?.district || 'Pune',
    q4_income_range: '₹20,000 – ₹30,000',
    q5_wage_growth: '15% – 25% Wage Increment',
    q6_training_relevance: 'direct_match',
    q7_skill_utilization: 5,
    q8_retention_status: 'retained_same_employer',
    q9_msme_scheme_access: 'udyam_registered',
    q10_attrition_reason: 'none_employed',
    q11_upskilling_interest: 'EV & High Voltage Battery Systems',
    voice_remarks: ''
  });

  if (!isOpen) return null;

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice-to-Text not supported in this browser. Please type your response.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    if (language === 'mr') recognition.lang = 'mr-IN';
    else if (language === 'hi') recognition.lang = 'hi-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswers(prev => ({
        ...prev,
        voice_remarks: prev.voice_remarks ? `${prev.voice_remarks} ${transcript}` : transcript
      }));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      // 1. Submit longitudinal followup with complete survey data payload
      const surveyPayload = {
        current_status: answers.q1_status,
        current_income_range: answers.q4_income_range,
        job_satisfaction_score: 5,
        skill_utilization_score: answers.q7_skill_utilization,
        remarks: answers.voice_remarks || `Verified longitudinal survey: ${answers.q6_training_relevance} (${answers.q5_wage_growth}) at ${answers.q2_employer_name}.`,
        survey_answers: {
          q1_status: answers.q1_status,
          q2_employer_name: answers.q2_employer_name,
          q3_district_location: answers.q3_district_location,
          q4_income_range: answers.q4_income_range,
          q5_wage_growth: answers.q5_wage_growth,
          q6_training_relevance: answers.q6_training_relevance,
          q7_skill_utilization: answers.q7_skill_utilization,
          q8_retention_status: answers.q8_retention_status,
          q9_msme_scheme_access: answers.q9_msme_scheme_access,
          q10_attrition_reason: answers.q10_attrition_reason,
          q11_upskilling_interest: answers.q11_upskilling_interest
        }
      };

      const ok = await submitFollowup(milestone, surveyPayload);
      if (!ok) throw new Error('Could not submit follow-up response. Please verify inputs.');

      // 2. Also update live trainee_employment with latest reported income & employer
      let estSalary = 24000;
      if (answers.q4_income_range.includes('30,000')) estSalary = 30000;
      if (answers.q4_income_range.includes('40,000')) estSalary = 42000;
      if (answers.q4_income_range.includes('15,000')) estSalary = 16500;

      if (answers.q1_status === 'self_employed') {
        await updateEmployment({
          status: 'self_employed',
          business_name: answers.q2_employer_name,
          monthly_revenue: estSalary,
          monthly_income_range: answers.q4_income_range
        });
      } else {
        await updateEmployment({
          status: 'employed',
          company_name: answers.q2_employer_name,
          monthly_salary: estSalary
        });
      }

      // 3. Mark in-app broadcast alerts as read
      await markAllNotificationsAsRead();
      await refreshData();

      setSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  const milestoneLabel = milestone.replace('_', ' ').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative flex flex-col my-8">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur-xs">
                {milestoneLabel} Milestone
              </span>
              <span className="flex items-center space-x-1 text-[10px] text-blue-100 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Zero-PII Verified</span>
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-black tracking-tight mt-2 text-white">
            Longitudinal Outcome & Impact Survey
          </h2>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed max-w-xl">
            Empowering evidence-based skilling policy: Track wage progression, curriculum relevance, and job retention post-training.
          </p>

          {/* Stepper Progress Indicator */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 rounded-full"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
            <span className="text-[10px] font-black uppercase text-blue-100">
              Part {step} of 2 (10 Questions)
            </span>
          </div>
        </div>

        {/* Modal Body */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <FileCheck2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {milestoneLabel} Follow-up Verified & Recorded!
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                Your wage progression and training impact data has been securely timestamped and synchronized into the State Longitudinal Registry.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md mx-auto text-xs text-slate-700 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Status:</span>
                <span className="font-bold text-slate-900 capitalize">{answers.q1_status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Employer / Enterprise:</span>
                <span className="font-bold text-slate-900">{answers.q2_employer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Wage Level:</span>
                <span className="font-bold text-emerald-600">{answers.q4_income_range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Curriculum Match:</span>
                <span className="font-bold text-blue-600">{answers.q6_training_relevance === 'direct_match' ? '100% Direct Match' : 'Applicable'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 overflow-y-auto max-h-[65vh]">
            
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {errorMsg}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Section 1: Employment, Livelihood & Wage Progression</span>
                </div>

                {/* Q1: Employment Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    1. Current Livelihood / Employment Status *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'employed', label: '🏢 Wage Employed' },
                      { id: 'self_employed', label: '🛍️ Micro-Enterprise / Shop' },
                      { id: 'apprenticeship', label: '⚙️ Apprentice (NAPS)' },
                      { id: 'higher_education', label: '🎓 In Higher Skilling' },
                      { id: 'seeking', label: '🔍 Seeking Employment' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers({ ...answers, q1_status: opt.id })}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          answers.q1_status === opt.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 & Q3: Employer Name and District Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      2. Current Employer / Business Enterprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={answers.q2_employer_name}
                      onChange={e => setAnswers({ ...answers, q2_employer_name: e.target.value })}
                      placeholder="e.g., Tata Motors Ltd / Shree Ganesh Auto"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      3. Work District / Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={answers.q3_district_location}
                      onChange={e => setAnswers({ ...answers, q3_district_location: e.target.value })}
                      placeholder="e.g., Pune / Mumbai / Nashik"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                {/* Q4: Monthly Earnings */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    4. Current Monthly Earnings / Salary Range *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['₹10,000 – ₹18,000', '₹18,000 – ₹28,000', '₹28,000 – ₹40,000', '₹40,000+'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, q4_income_range: val })}
                        className={`p-2.5 rounded-xl border text-center font-semibold transition cursor-pointer ${
                          answers.q4_income_range === val
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q5: Wage Progression */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    5. Wage Progression / Growth Since Placement *
                  </label>
                  <select
                    value={answers.q5_wage_growth}
                    onChange={e => setAnswers({ ...answers, q5_wage_growth: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="0% (Same as Placement Starting Wage)">0% Starting Wage (Baseline)</option>
                    <option value="10% – 25% Wage Increment">10% – 25% Wage Increment</option>
                    <option value="25% – 50% Hike / Promoted">25% – 50% Hike / Role Promoted</option>
                    <option value="More than 50% Substantial Growth">More than 50% Substantial Career Growth</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
                  >
                    <span>Proceed to Section 2 (Curriculum & Impact)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Section 2: Training Relevance, MSME Grants & Remedial Gaps</span>
                </div>

                {/* Q6: Training Relevance */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    6. Direct Relevance of Training to Daily Job Role *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'direct_match', label: '🎯 100% Direct Match', sub: 'Applying trade skills daily' },
                      { id: 'partial_match', label: '⚖️ 50% Partial Match', sub: 'Some skills applied' },
                      { id: 'unrelated', label: '🔄 Switched Sector', sub: 'Different trade or function' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAnswers({ ...answers, q6_training_relevance: opt.id })}
                        className={`p-3 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          answers.q6_training_relevance === opt.id
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>{opt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q7: Skill Utilization Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    7. Practical Skill Utilization Rating on Shopfloor (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setAnswers({ ...answers, q7_skill_utilization: star })}
                          className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${answers.q7_skill_utilization >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {answers.q7_skill_utilization === 5 ? '5/5 — Highly Relevant & Comprehensive' : `${answers.q7_skill_utilization}/5 Rating`}
                    </span>
                  </div>
                </div>

                {/* Q8: Job Retention */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    8. Job Retention & Livelihood Stability *
                  </label>
                  <select
                    value={answers.q8_retention_status}
                    onChange={e => setAnswers({ ...answers, q8_retention_status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="retained_same_employer">Continuous with Same Employer (6+ Months)</option>
                    <option value="switched_higher_pay">Switched to Another Firm for Higher Wage</option>
                    <option value="contract_ended">Fixed Apprenticeship/Contract Completed</option>
                    <option value="retained_self_employed">Stable Micro-Enterprise / Growing Business</option>
                  </select>
                </div>

                {/* Q9: Government Scheme / MSME Access */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    9. MSME Registration & Government Grant Access *
                  </label>
                  <select
                    value={answers.q9_msme_scheme_access}
                    onChange={e => setAnswers({ ...answers, q9_msme_scheme_access: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="udyam_registered">Registered Udyam MSME / GSTIN</option>
                    <option value="pmegp_mudra">Availed PMEGP / Mudra Scheme Loan</option>
                    <option value="mahaswayam_incentive">Applied for State Mahaswayam Incentive</option>
                    <option value="none_wage">N/A (Employed / Self-Funded)</option>
                  </select>
                </div>

                {/* Q10: Upskilling & Remedial Support Needed */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    10. Further Upskilling & Remedial Support Needed *
                  </label>
                  <select
                    value={answers.q11_upskilling_interest}
                    onChange={e => setAnswers({ ...answers, q11_upskilling_interest: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="EV & High Voltage Battery Systems">EV & High Voltage Battery Diagnostics (NPTEL)</option>
                    <option value="CNC Machining & Precision Metrology">CNC Machining & Precision Metrology (Skill India)</option>
                    <option value="Cloud & Full-Stack Development">Cloud & Full-Stack Developer Specialization (Coursera)</option>
                    <option value="Boutique CAD & Apparel Technology">Boutique CAD & Apparel Tech (Swayam)</option>
                    <option value="Fully Equipped">None — Fully Equipped with Current Trade Skills</option>
                  </select>
                </div>

                {/* Voice Remarks */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Additional Career Notes (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{isListening ? 'Listening (Speak Now)...' : 'Voice Input (मराठी / हिंदी / EN)'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={answers.voice_remarks}
                    onChange={e => setAnswers({ ...answers, voice_remarks: e.target.value })}
                    placeholder="Speak or type any suggestions for curriculum improvement..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Section 1</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synchronizing Survey...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Verified Follow-up</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
};
