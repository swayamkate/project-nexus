'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  ThumbsUp, 
  Building2, 
  X, 
  Loader2, 
  ShieldCheck,
  HelpCircle,
  Clock
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';

export default function AdminInterviewsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'approved' | 'pending'>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState<any | null>(null);
  const [qToDelete, setQToDelete] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    trade_sector: 'Apparel & Fashion',
    target_role: '',
    company_name: 'Tata Motors',
    question_text: '',
    sample_answer: '',
    key_points: '',
    difficulty: 'Medium',
    category: 'Technical',
    is_approved: true
  });

  const supabase = createClient();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setQuestions(data);
    } catch (e) {
      console.error('Error fetching questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenCreate = () => {
    setEditingQ(null);
    setFormData({
      trade_sector: 'Apparel & Fashion',
      target_role: '',
      company_name: 'Tata Motors',
      question_text: '',
      sample_answer: '',
      key_points: '',
      difficulty: 'Medium',
      category: 'Technical',
      is_approved: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q: any) => {
    setEditingQ(q);
    setFormData({
      trade_sector: q.trade_sector,
      target_role: q.target_role,
      company_name: q.company_name,
      question_text: q.question_text,
      sample_answer: q.sample_answer,
      key_points: (q.key_points || []).join(', '),
      difficulty: q.difficulty,
      category: q.category,
      is_approved: q.is_approved
    });
    setShowModal(true);
  };

  const handleToggleApproval = async (q: any) => {
    const newStatus = !q.is_approved;
    setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, is_approved: newStatus } : item));
    try {
      const { error } = await supabase
        .from('interview_questions')
        .update({ is_approved: newStatus })
        .eq('id', q.id);
      if (error) throw error;
      setToastMsg({ type: 'success', text: `Question ${newStatus ? 'approved & published' : 'marked pending'}.` });
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Approval toggle failed' });
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMsg(null);

    const pointsArray = formData.key_points
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const payload = {
      trade_sector: formData.trade_sector,
      target_role: formData.target_role || `${formData.trade_sector} Specialist`,
      company_name: formData.company_name,
      question_text: formData.question_text,
      sample_answer: formData.sample_answer,
      key_points: pointsArray,
      difficulty: formData.difficulty,
      category: formData.category,
      is_approved: formData.is_approved
    };

    try {
      if (editingQ) {
        const { error } = await supabase
          .from('interview_questions')
          .update(payload)
          .eq('id', editingQ.id);
        if (error) throw error;
        setToastMsg({ type: 'success', text: 'Interview question updated successfully.' });
      } else {
        const { error } = await supabase
          .from('interview_questions')
          .insert({
            ...payload,
            submitted_by_name: 'Executive Admin Verified',
            upvotes: 5
          });
        if (error) throw error;
        setToastMsg({ type: 'success', text: 'New verified question published to community.' });
      }

      setShowModal(false);
      await fetchQuestions();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!qToDelete) return;
    try {
      const { error } = await supabase
        .from('interview_questions')
        .delete()
        .eq('id', qToDelete.id);
      if (error) throw error;
      setToastMsg({ type: 'success', text: 'Question removed from question bank.' });
      setQToDelete(null);
      await fetchQuestions();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const sectors = ['All', 'Apparel & Fashion', 'Renewable Energy', 'Automotive & EV', 'IT & Digital', 'Retail & Commerce', 'Healthcare & Caregiving'];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = search === '' || 
      q.question_text.toLowerCase().includes(search.toLowerCase()) ||
      q.company_name.toLowerCase().includes(search.toLowerCase()) ||
      q.target_role.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'All' || q.trade_sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'approved' && q.is_approved) ||
      (selectedStatus === 'pending' && !q.is_approved);

    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className={`p-4 rounded-2xl flex items-center space-x-2 text-xs font-bold ${
          toastMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Interview Questions Moderation Desk</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review user-submitted questions, verify model answers, and publish trade-specific questions for candidates.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0e1628] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by keyword, company, or target role..."
            className="w-full pl-10 pr-4 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full md:w-48 px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
        >
          {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="w-full md:w-44 px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved / Live</option>
          <option value="pending">Pending Moderation</option>
        </select>
      </div>

      {/* Questions Table / List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-xs font-bold">Loading interview question records...</span>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Questions Found"
          description="No questions match the current filter selection."
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => (
            <div 
              key={q.id}
              className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase">
                      {q.trade_sector}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {q.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' :
                      q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-xs font-semibold flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{q.company_name}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    {q.question_text}
                  </h3>

                  <div className="p-3 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-slate-300 font-medium">
                    <span className="font-bold text-slate-200">Model Answer: </span>
                    {q.sample_answer}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span>Role: <strong className="text-slate-300">{q.target_role}</strong></span>
                    <span>•</span>
                    <span>Submitter: <strong className="text-slate-300">{q.submitted_by_name}</strong></span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-300">
                      <ThumbsUp className="w-3 h-3 text-blue-400" />
                      <span>{q.upvotes || 0} Upvotes</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <button
                    onClick={() => handleToggleApproval(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      q.is_approved 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {q.is_approved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{q.is_approved ? 'Approved' : 'Pending'}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Edit Question"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setQToDelete(q)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">
                {editingQ ? 'Edit Interview Question' : 'Add Verified Trade Question'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trade Sector</label>
                  <select
                    value={formData.trade_sector}
                    onChange={(e) => setFormData({ ...formData, trade_sector: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  >
                    {sectors.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company / Enterprise</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. Tata Motors, Raymond, Infosys"
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Role</label>
                <input
                  type="text"
                  required
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  placeholder="e.g. Senior Quality Control Lead"
                  className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Question Text</label>
                <textarea
                  required
                  rows={2}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="What is the interview question?"
                  className="w-full p-3 bg-[#070b14] border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Model Answer</label>
                <textarea
                  required
                  rows={3}
                  value={formData.sample_answer}
                  onChange={(e) => setFormData({ ...formData, sample_answer: e.target.value })}
                  placeholder="Comprehensive technical answer..."
                  className="w-full p-3 bg-[#070b14] border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Key Concepts (Comma separated)</label>
                <input
                  type="text"
                  value={formData.key_points}
                  onChange={(e) => setFormData({ ...formData, key_points: e.target.value })}
                  placeholder="e.g. AQL 2.5 defect limit, 12 SPI, Megger 1000V test"
                  className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Question Type</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Practical / Workshop">Practical / Workshop</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingQ ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <DestructiveConfirmModal
        isOpen={!!qToDelete}
        onClose={() => setQToDelete(null)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question?"
        itemName={qToDelete?.question_text || 'Interview Question'}
        warningMessage="It will be removed from the community question bank."
      />

    </div>
  );
}
