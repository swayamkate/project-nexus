'use client';

import React, { useState } from 'react';
import { mockInterviewInsights } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  Building, 
  Search, 
  PlusCircle, 
  Star, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { InterviewInsight } from '@/types/database';

export const CommunityHub: React.FC = () => {
  const [insights, setInsights] = useState<InterviewInsight[]>(mockInterviewInsights);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [questions, setQuestions] = useState('');
  const [review, setReview] = useState('');
  const [skills, setSkills] = useState('');

  const filteredInsights = insights.filter(item => {
    const matchesSearch = item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.role_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'all' || item.difficulty_rating === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleUpvote = (id: string) => {
    setInsights(prev => prev.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: InterviewInsight = {
      id: `int-${Date.now()}`,
      company_name: company,
      role_title: roleTitle,
      author_privacy_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      difficulty_rating: difficulty,
      interview_outcome: 'Offer Accepted',
      questions_asked: questions.split('\n').filter(q => q.trim().length > 0),
      hiring_process_review: review,
      recommended_skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      is_anonymous: true,
      upvotes: 1,
      created_at: new Date().toISOString()
    };

    setInsights([newEntry, ...insights]);
    setShowAddModal(false);
    // Reset
    setCompany('');
    setRoleTitle('');
    setQuestions('');
    setReview('');
    setSkills('');
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-black text-white">Community & Interview Intelligence Hub</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Crowdsourced, privacy-protected interview questions, technical test patterns, and hiring transparency across green energy, tech, and manufacturing sectors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Interview Experience</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by company (Tata, Infosys) or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Difficulty:</span>
          {['all', 1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedDifficulty === lvl
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInsights.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-purple-500/40 transition"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-base">{item.company_name}</h3>
                  <p className="text-xs text-purple-400 font-medium mt-0.5">{item.role_title}</p>
                </div>
                <div className="flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.difficulty_rating}/5 Diff</span>
                </div>
              </div>

              {/* Verified Outcome & Privacy token */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.interview_outcome}
                </span>
                <span className="text-slate-500 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>{item.author_privacy_hash.slice(0, 10)}...</span>
                </span>
              </div>

              {/* Questions Asked */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Real Questions Asked</span>
                </span>
                <ul className="space-y-1.5 pl-2">
                  {item.questions_asked.map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-300 list-disc list-inside leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Review */}
              <p className="text-xs text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800 italic leading-relaxed">
                "{item.hiring_process_review}"
              </p>

              {/* Recommended Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.recommended_skills.map((s, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with upvoting */}
            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500">{formatDate(item.created_at)}</span>
              <button
                onClick={() => handleUpvote(item.id)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-purple-950 text-slate-300 hover:text-purple-300 border border-slate-700 transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({item.upvotes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Experience */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Share Interview Experience (Zero-PII)</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Engineer"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Difficulty (1 = Easy, 5 = Very Tough)</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                >
                  <option value={1}>1 - Very Easy</option>
                  <option value={2}>2 - Easy</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Tough</option>
                  <option value={5}>5 - Extremely Rigorous</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Questions Asked (One per line)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What is MPPT inverter sizing?&#10;Explain React 19 server actions..."
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Interview Process Summary & Advice</label>
                <textarea
                  rows={3}
                  required
                  placeholder="2 technical rounds, emphasis on safety compliance..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Recommended Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Solar PV, TypeScript, Electrical Safety"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
                >
                  Post Anonymously
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
