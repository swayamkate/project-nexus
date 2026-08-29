'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  ThumbsUp, 
  MessageSquarePlus, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Building2, 
  HelpCircle, 
  User, 
  Award, 
  Plus, 
  X,
  RefreshCw
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { evaluateMockInterviewAnswer, MockInterviewEvaluation } from '@/lib/aiCareerEngine';
import { mutateDb } from '@/lib/traineeApi';

export const InterviewPrepModule: React.FC = () => {
  const { profile } = useUser();
  const supabase = createClient();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  
  // Accordion state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // User Question Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    trade_sector: 'Apparel & Fashion',
    target_role: '',
    company_name: '',
    question_text: '',
    sample_answer: '',
    key_points: '',
    difficulty: 'Medium',
    category: 'Technical'
  });
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AI Mock Interview Mode
  const [activeTab, setActiveTab] = useState<'questions' | 'mock_ai'>('questions');
  const [mockRole, setMockRole] = useState('Senior Apparel Quality Specialist & Boutique Entrepreneur');
  const [mockQuestion, setMockQuestion] = useState('What standard inspection methodology (e.g. AQL 2.5) do you follow when checking finished garments before export packing?');
  const [mockKeyPoints, setMockKeyPoints] = useState<string[]>([
    'AQL 2.5 defect threshold',
    'Critical vs Major vs Minor defect classification',
    'Seam puckering & SPI verification',
    'Lot rejection & 100% re-inspection protocol'
  ]);
  const [userMockAnswer, setUserMockAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [mockEvaluation, setMockEvaluation] = useState<MockInterviewEvaluation | null>(null);

  const sectors = ['All', 'Apparel & Fashion', 'Renewable Energy', 'Automotive & EV', 'IT & Digital', 'Retail & Commerce', 'Healthcare & Caregiving'];
  const categories = ['All', 'Technical', 'Practical / Workshop', 'Behavioral', 'HR'];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('interview_questions')
        .select('*')
        .order('upvotes', { ascending: false });

      if (data) setQuestions(data);
    } catch (e) {
      console.error('Error loading interview questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleUpvote = async (id: string, currentUpvotes: number) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, upvotes: currentUpvotes + 1 } : q));
    try {
      await mutateDb({
        action: 'update',
        table: 'interview_questions',
        payload: { upvotes: currentUpvotes + 1 },
        match: { id }
      });
    } catch (e) {
      console.error('Error upvoting:', e);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.question_text || !submitForm.sample_answer) {
      alert('Please fill out both the question text and sample answer.');
      return;
    }

    setSubmitting(true);
    try {
      const pointsArray = submitForm.key_points 
        ? submitForm.key_points.split(',').map(p => p.trim()).filter(Boolean)
        : [];

      const { error } = await mutateDb({
        action: 'insert',
        table: 'interview_questions',
        payload: {
          trade_sector: submitForm.trade_sector,
          target_role: submitForm.target_role || `${submitForm.trade_sector} Specialist`,
          company_name: submitForm.company_name || 'Industry Candidate Experienced',
          question_text: submitForm.question_text,
          sample_answer: submitForm.sample_answer,
          key_points: pointsArray,
          difficulty: submitForm.difficulty,
          category: submitForm.category,
          submitted_by_trainee_id: profile?.id || null,
          submitted_by_name: profile?.full_name || 'Community Candidate',
          is_approved: true,
          upvotes: 1
        }
      });

      if (error) throw error;
      setShowSubmitModal(false);
      setSubmitForm({
        trade_sector: 'Apparel & Fashion',
        target_role: '',
        company_name: '',
        question_text: '',
        sample_answer: '',
        key_points: '',
        difficulty: 'Medium',
        category: 'Technical'
      });
      setToastMsg('Thank you! Your interview question was added to the community desk.');
      setTimeout(() => setToastMsg(null), 4000);
      await fetchQuestions();
    } catch (err: any) {
      alert('Failed to submit question: ' + (err.message || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEvaluateMock = () => {
    if (!userMockAnswer.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      const result = evaluateMockInterviewAnswer(mockQuestion, userMockAnswer, mockKeyPoints);
      setMockEvaluation(result);
      setEvaluating(false);
    }, 600);
  };

  const handleLoadNewMockQuestion = () => {
    // Pick another question from active catalog
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    if (randomQ) {
      setMockRole(randomQ.target_role || mockRole);
      setMockQuestion(randomQ.question_text);
      setMockKeyPoints(randomQ.key_points || []);
      setUserMockAnswer('');
      setMockEvaluation(null);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = search === '' || 
      q.question_text.toLowerCase().includes(search.toLowerCase()) ||
      q.company_name.toLowerCase().includes(search.toLowerCase()) ||
      q.target_role.toLowerCase().includes(search.toLowerCase());

    const matchesSector = selectedSector === 'All' || q.trade_sector === selectedSector;
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesSector && matchesCat && matchesDiff;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-indigo-200">
              <Briefcase className="w-3.5 h-3.5 text-cyan-300" />
              <span>Industry Question Bank & AI Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interview Preparation & Q&A Desk
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Study real technical and HR questions asked by top companies (Tata Motors, Raymond, Infosys, Adani), contribute your own questions, or practice with the AI Mock Coach.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Contribute Question</span>
            </button>

            {/* Tab switch */}
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 flex">
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'questions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Questions ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mock_ai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                  activeTab === 'mock_ai' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Mock Practice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'questions' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions, company name, or role..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Sector Filter */}
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Trade Sectors' : s}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Question Types' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Accordion List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3 text-slate-500 font-medium">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading trade questions...</span>
              </div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No questions found matching your filter criteria.</div>
              <p className="text-xs text-slate-400">Be the first to contribute a question from your recent interview!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedId === q.id;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:border-indigo-200 transition-all overflow-hidden"
                  >
                    {/* Question Header Card */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase">
                            {q.trade_sector}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {q.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' :
                            q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-600 text-xs flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{q.company_name}</span>
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {q.question_text}
                        </h3>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
                          <span>Target Role: <strong className="text-slate-600">{q.target_role}</strong></span>
                          <span>•</span>
                          <span>Shared by: <strong className="text-slate-600">{q.submitted_by_name}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        {/* Upvote Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(q.id, q.upvotes || 0);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{q.upvotes || 0}</span>
                        </button>

                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Sample Answer & Key Points */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fadeIn">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5 text-indigo-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Model Technical Answer</span>
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-200">
                            {q.sample_answer}
                          </p>
                        </div>

                        {q.key_points && q.key_points.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Must-Mention Interview Key Concepts:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {q.key_points.map((pt: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-[11px] font-medium flex items-center space-x-1">
                                  <span>✓</span>
                                  <span>{pt}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* AI MOCK INTERVIEW SIMULATOR */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">CareerLoop AI Mock Interview Coach</h3>
                <p className="text-xs text-slate-400">Real-time technical response scoring and concept evaluation</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadNewMockQuestion}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Question</span>
            </button>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Role: {mockRole}
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              {mockQuestion}
            </h4>
          </div>

          {/* User Answer Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Type or Dictate Your Answer:
            </label>
            <textarea
              rows={4}
              value={userMockAnswer}
              onChange={(e) => setUserMockAnswer(e.target.value)}
              placeholder="Explain your approach, specific calibration tolerances, safety precautions, and quality validation steps..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleEvaluateMock}
            disabled={evaluating || userMockAnswer.trim().length < 5}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
            <span>{evaluating ? 'Analyzing Answer Concepts...' : 'Evaluate Answer with AI Coach'}</span>
          </button>

          {/* Evaluation Results Box */}
          {mockEvaluation && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl font-black text-blue-600">{mockEvaluation.score}%</div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Verdict: {mockEvaluation.verdict}</div>
                    <div className="text-[10px] text-slate-400">Evaluated on keyword coverage & industry SOPs</div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  mockEvaluation.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                  mockEvaluation.score >= 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {mockEvaluation.score >= 80 ? 'Interview Ready' : 'Needs Polish'}
                </span>
              </div>

              {/* Feedback Summary */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Coach Feedback:</span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  {mockEvaluation.actionableFeedback}
                </p>
              </div>

              {/* Strong vs Missing Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="font-extrabold text-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Concepts Covered:</span>
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-emerald-900 text-[11px]">
                    {mockEvaluation.strongPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                  <span className="font-extrabold text-amber-800 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing Technical Terms:</span>
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-900 text-[11px]">
                    {mockEvaluation.missingPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Answer Recommendation */}
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1 text-xs">
                <span className="font-bold text-indigo-900">Recommended Model Answer Structure:</span>
                <p className="text-indigo-950 font-medium leading-relaxed text-[11px]">
                  {mockEvaluation.modelAnswer}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBMIT QUESTION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Contribute an Interview Question</h3>
                  <p className="text-xs text-slate-400">Share questions you faced to help fellow candidates</p>
                </div>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Trade Sector
                  </label>
                  <select
                    value={submitForm.trade_sector}
                    onChange={(e) => setSubmitForm({ ...submitForm, trade_sector: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    {sectors.filter(s => s !== 'All').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={submitForm.company_name}
                    onChange={(e) => setSubmitForm({ ...submitForm, company_name: e.target.value })}
                    placeholder="e.g. Raymond, Tata Motors, Local Enterprise"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interview Question
                </label>
                <textarea
                  required
                  rows={2}
                  value={submitForm.question_text}
                  onChange={(e) => setSubmitForm({ ...submitForm, question_text: e.target.value })}
                  placeholder="What was the exact question asked by the interviewer?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sample Answer / How you answered
                </label>
                <textarea
                  required
                  rows={3}
                  value={submitForm.sample_answer}
                  onChange={(e) => setSubmitForm({ ...submitForm, sample_answer: e.target.value })}
                  placeholder="Provide the ideal technical or behavioral response..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Question Type
                  </label>
                  <select
                    value={submitForm.category}
                    onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Practical / Workshop">Practical / Workshop</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={submitForm.difficulty}
                    onChange={(e) => setSubmitForm({ ...submitForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Post to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
