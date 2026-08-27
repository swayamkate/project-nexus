'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  BookOpen, 
  TrendingUp,
  X
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  const supabase = createClient();

  const fetchAssessmentsData = async () => {
    setLoading(true);
    try {
      const [assessRes, subRes] = await Promise.all([
        supabase.from('skill_assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('assessment_submissions').select('*, trainees(full_name, email, district, trainee_id), skill_assessments(title, trade_sector)').order('completed_at', { ascending: false }).limit(20)
      ]);

      if (assessRes.data) setAssessments(assessRes.data);
      if (subRes.data) setSubmissions(subRes.data);
    } catch (e) {
      console.error('Error loading assessment analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentsData();
  }, []);

  const totalSubmissions = submissions.length;
  const passedCount = submissions.filter(s => s.passed).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 100;
  const avgScore = totalSubmissions > 0 ? Math.round(submissions.reduce((acc, s) => acc + Number(s.score_pct), 0) / totalSubmissions) : 82;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Skill Assessments & Certification Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor candidate skill assessment attempts, passing rates, trade proficiency benchmarks, and verified badge issuance.
        </p>
      </div>

      {/* 3 Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e1628] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Active Question Banks</span>
          </div>
          <div className="text-2xl font-black text-white">{assessments.length} Trade Tests</div>
          <div className="text-[11px] text-slate-500">NSQF Level 3-6 aligned quizzes</div>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Certification Pass Rate</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">{passRate}%</div>
          <div className="text-[11px] text-slate-500">{passedCount} of {totalSubmissions || 1} candidates certified</div>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Average Candidate Score</span>
          </div>
          <div className="text-2xl font-black text-cyan-400">{avgScore}%</div>
          <div className="text-[11px] text-slate-500">Benchmark requirement: 70%</div>
        </div>
      </div>

      {/* Assessment Question Banks Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Active Trade Question Banks</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-xs font-bold">Loading assessments...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {assessments.map((assess) => (
              <div 
                key={assess.id}
                className="bg-[#0e1628] border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                      {assess.trade_sector}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{assess.skill_level}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug">
                    {assess.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{assess.duration_minutes} Mins</span>
                    </span>
                    <span>•</span>
                    <span>{assess.total_questions} Questions</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">Pass: {assess.passing_score_pct}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 font-bold flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{assess.badge_name}</span>
                  </span>

                  <button
                    onClick={() => setSelectedAssessment(assess)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Q&A</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Submissions Table */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Recent Assessment Submissions & Badges</h2>
        
        {submissions.length === 0 ? (
          <div className="bg-[#0e1628] border border-slate-800 p-8 text-center rounded-2xl text-slate-400 text-xs font-bold">
            No candidate submissions recorded yet. Once trainees complete quizzes, attempts and scores will appear here.
          </div>
        ) : (
          <div className="bg-[#0e1628] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070b14] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Trainee Candidate</th>
                  <th className="p-4 font-bold">Trade Assessment</th>
                  <th className="p-4 font-bold">Score</th>
                  <th className="p-4 font-bold">Badge Awarded</th>
                  <th className="p-4 font-bold">Time Taken</th>
                  <th className="p-4 font-bold">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{sub.trainees?.full_name || 'Anonymous Candidate'}</div>
                      <div className="text-[11px] text-slate-500">{sub.trainees?.email || 'N/A'} • {sub.trainees?.district || 'Maharashtra'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-200">{sub.skill_assessments?.title || 'Technical Assessment'}</div>
                      <div className="text-[11px] text-blue-400">{sub.skill_assessments?.trade_sector}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-black ${
                        sub.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {sub.score_pct}% ({sub.passed ? 'PASS' : 'FAIL'})
                      </span>
                    </td>
                    <td className="p-4">
                      {sub.badge_earned ? (
                        <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                          <Award className="w-4 h-4" />
                          <span>{sub.badge_earned}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No Badge</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {Math.floor(sub.time_taken_seconds / 60)}m {sub.time_taken_seconds % 60}s
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(sub.completed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT Q&A MODAL */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">{selectedAssessment.title}</h3>
                <p className="text-xs text-slate-400">{selectedAssessment.trade_sector} • {selectedAssessment.total_questions} Questions</p>
              </div>
              <button onClick={() => setSelectedAssessment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs">
              {selectedAssessment.questions_json?.map((q: any, idx: number) => (
                <div key={q.id || idx} className="p-4 bg-[#070b14] border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-white">
                    <span className="text-blue-400 mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {q.options?.map((opt: string, optIdx: number) => (
                      <div 
                        key={optIdx} 
                        className={`p-2 rounded-lg border ${
                          optIdx === q.correct_index 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correct_index && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg">
                    <span className="font-bold text-slate-300">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
