'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ChevronRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { mutateDb } from '@/lib/traineeApi';

export const SkillAssessmentModule: React.FC = () => {
  const { profile } = useUser();
  const supabase = createClient();

  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchAssessmentsAndSubmissions = async () => {
    setLoading(true);
    try {
      const [assessRes, subRes] = await Promise.all([
        supabase.from('skill_assessments').select('*').eq('is_active', true),
        profile?.id 
          ? supabase.from('assessment_submissions').select('*, skill_assessments(title, badge_name, trade_sector)').eq('trainee_id', profile.id)
          : Promise.resolve({ data: [] })
      ]);

      if (assessRes.data) setAssessments(assessRes.data);
      if (subRes.data) setSubmissions(subRes.data);
    } catch (e) {
      console.error('Error loading assessments:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (assessment: any) => {
    setActiveQuiz(assessment);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds((assessment.duration_minutes || 15) * 60);
    setQuizResult(null);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);

    const questions = activeQuiz.questions_json || [];
    let correctCount = 0;

    questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.correct_index) {
        correctCount++;
      }
    });

    const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = scorePct >= (activeQuiz.passing_score_pct || 70);
    const badgeEarned = passed ? activeQuiz.badge_name : null;

    const resultPayload = {
      assessment_id: activeQuiz.id,
      score_pct: scorePct,
      passed,
      correctCount,
      totalCount: questions.length,
      badge_earned: badgeEarned,
      time_taken_seconds: ((activeQuiz.duration_minutes || 15) * 60) - Math.max(0, timeLeftSeconds),
      questions
    };

    setQuizResult(resultPayload);

    // Save to database if trainee logged in
    if (profile?.id) {
      try {
        await mutateDb({
          action: 'insert',
          table: 'assessment_submissions',
          payload: {
            trainee_id: profile.id,
            assessment_id: activeQuiz.id,
            score_pct: scorePct,
            passed,
            answers_json: userAnswers,
            time_taken_seconds: resultPayload.time_taken_seconds,
            badge_earned: badgeEarned
          }
        });

        await fetchAssessmentsAndSubmissions();
      } catch (err) {
        console.error('Error recording assessment score:', err);
      }
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchAssessmentsAndSubmissions();
  }, [profile]);

  // Countdown timer for active quiz
  useEffect(() => {
    if (!activeQuiz || quizResult) return;

    if (timeLeftSeconds <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, timeLeftSeconds, quizResult]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading State Assessment Question Banks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-cyan-200">
              <Award className="w-3.5 h-3.5 text-cyan-300" />
              <span>Standardized Technical Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Skill Level Assessments
            </h1>
            <p className="text-sm text-slate-200/90 mt-1 max-w-2xl">
              Take timed trade quizzes to test and certify your competency level. Passing scores earn verified state skill badges that boost employer readiness.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 text-center min-w-[130px] shrink-0">
            <div className="text-2xl font-black text-emerald-400">
              {submissions.filter(s => s.passed).length}
            </div>
            <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mt-0.5">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {activeQuiz ? (
        quizResult ? (
          /* QUIZ SCORE REPORT & RATIONALE */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
            {/* Score Header */}
            <div className={`p-6 rounded-2xl text-center space-y-3 ${
              quizResult.passed 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}>
              <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm">
                {quizResult.passed ? (
                  <ShieldCheck className="w-10 h-10 text-emerald-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-rose-600" />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {quizResult.passed ? 'Congratulations! You Passed!' : 'Assessment Incomplete'}
                </h2>
                <p className="text-xs font-semibold opacity-80 mt-1">
                  {quizResult.passed 
                    ? `You scored ${quizResult.score_pct}% (${quizResult.correctCount}/${quizResult.totalCount} correct) and earned a verified skill badge!`
                    : `You scored ${quizResult.score_pct}% (${quizResult.correctCount}/${quizResult.totalCount} correct). A minimum score of ${activeQuiz.passing_score_pct}% is required.`
                  }
                </p>
              </div>

              {quizResult.passed && (
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Badge Awarded: {quizResult.badge_earned}</span>
                </div>
              )}
            </div>

            {/* Answer Explanations */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Technical Question Review & Explanations</span>
              </h3>

              <div className="space-y-4">
                {quizResult.questions.map((q: any, idx: number) => {
                  const userChoice = userAnswers[q.id];
                  const isCorrect = userChoice === q.correct_index;

                  return (
                    <div key={q.id} className={`p-4 sm:p-5 rounded-2xl border ${
                      isCorrect ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                    }`}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-bold text-xs text-slate-800">
                          <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                          {q.question}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isUserPick = userChoice === optIdx;
                          const isRealCorrect = q.correct_index === optIdx;

                          let style = 'bg-white border-slate-200 text-slate-600';
                          if (isRealCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          else if (isUserPick) style = 'bg-rose-100 border-rose-300 text-rose-900 line-through';

                          return (
                            <div key={optIdx} className={`p-2.5 rounded-xl border text-[11px] ${style}`}>
                              {opt} {isRealCorrect && '✓ (Correct)'} {isUserPick && !isRealCorrect && '✗ (Your pick)'}
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[11px] bg-white/80 p-3 rounded-xl border border-slate-200 text-slate-600">
                        <span className="font-bold text-slate-800">Technical Rationale: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Assessment Catalog</span>
            </button>
          </div>
        ) : (
          /* ACTIVE QUIZ QUESTION SCREEN */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            {/* Top Bar: Progress & Timer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                  {activeQuiz.trade_sector} • {activeQuiz.skill_level}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">{activeQuiz.title}</h3>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-mono font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
              {activeQuiz.questions_json?.map((q: any, idx: number) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Active Question Box */}
            {activeQuiz.questions_json?.[currentQIndex] && (() => {
              const currentQ = activeQuiz.questions_json[currentQIndex];
              const selectedOpt = userAnswers[currentQ.id];

              return (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">
                      Question {currentQIndex + 1} of {activeQuiz.questions_json.length}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {currentQ.question}
                    </h4>
                    <span className="inline-block text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1">
                      Skill Tested: {currentQ.skill_tag}
                    </span>
                  </div>

                  {/* 4 Options */}
                  <div className="space-y-2.5">
                    {currentQ.options?.map((option: string, optIdx: number) => {
                      const isSelected = selectedOpt === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center space-x-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-xs">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentQIndex < (activeQuiz.questions_json?.length - 1) ? (
                <button
                  type="button"
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Evaluating Score...' : 'Submit & Finish Quiz'}</span>
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* ASSESSMENT CATALOG VIEW */
        <div className="space-y-8">
          
          {/* Active Skill Badges Earned Section */}
          {submissions.filter(s => s.passed).length > 0 && (
            <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Your Verified Skill Badges</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {submissions.filter(s => s.passed).map((sub) => (
                  <div key={sub.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{sub.badge_earned || sub.skill_assessments?.badge_name}</div>
                      <div className="text-[10px] text-emerald-200 mt-0.5">Score: {sub.score_pct}% • Verified</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assess) => {
              const previousSub = submissions.find(s => s.assessment_id === assess.id);

              return (
                <div 
                  key={assess.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold rounded-md uppercase">
                        {assess.trade_sector}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                        {assess.skill_level}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {assess.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{assess.duration_minutes} Mins</span>
                      </span>
                      <span>•</span>
                      <span>{assess.total_questions} Questions</span>
                      <span>•</span>
                      <span>Pass: {assess.passing_score_pct}%</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2 text-xs text-slate-700">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-medium line-clamp-1">Award: {assess.badge_name}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {previousSub && (
                      <div className="flex justify-between text-xs font-bold text-slate-500 px-1">
                        <span>Previous Score:</span>
                        <span className={previousSub.passed ? 'text-emerald-600' : 'text-rose-600'}>
                          {previousSub.score_pct}% ({previousSub.passed ? 'Passed' : 'Needs Retake'})
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleStartQuiz(assess)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{previousSub ? 'Retake Assessment' : 'Start 15-Min Quiz'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
