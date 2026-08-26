'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  X,
  Search,
  Building,
  Users
} from 'lucide-react';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    sector: 'Apparel & Fashion',
    duration_months: 3,
    provider_name: 'Maharashtra State Skill Development Society (MSSDS)',
    description: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('training_programs')
      .select('*, trainee_enrollments(count)')
      .order('created_at', { ascending: false });

    if (data) setPrograms(data);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      sector: 'Apparel & Fashion',
      duration_months: 3,
      provider_name: 'Maharashtra State Skill Development Society (MSSDS)',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (program: any) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      sector: program.sector,
      duration_months: program.duration_months,
      provider_name: program.provider_name,
      description: program.description || ''
    });
    setShowModal(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('training_programs')
          .update(formData)
          .eq('id', editingProgram.id);
        if (error) throw error;
        setToastMsg('Program updated successfully!');
      } else {
        const { error } = await supabase
          .from('training_programs')
          .insert(formData);
        if (error) throw error;
        setToastMsg('New NSQF Training Program launched!');
      }

      setShowModal(false);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPrograms();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the course "${title}"?`)) return;
    try {
      const { error } = await supabase.from('training_programs').delete().eq('id', id);
      if (error) throw error;
      setToastMsg(`Course "${title}" removed.`);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPrograms();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filteredPrograms = programs.filter(p => 
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.provider_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Training & Course Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Configure vocational qualifications, duration benchmarks, and accredited providers.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Course</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses by sector, title, or provider..."
          className="w-full bg-[#0a1020] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Program Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" /> Loading training programs...
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          No training programs found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrograms.map((program) => {
            const enrollmentsCount = program.trainee_enrollments?.[0]?.count || 0;

            return (
              <div 
                key={program.id}
                className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                      {program.sector}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> {program.duration_months} Months Duration
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{program.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{program.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Accredited Provider:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[220px]">{program.provider_name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
                      <Users className="w-4 h-4" />
                      <span>{enrollmentsCount} Active Enrollees</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(program)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg transition"
                        title="Edit course"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(program.id, program.title)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-lg transition"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Program Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingProgram ? 'Edit Training Course' : 'Create New NSQF Course'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Solar PV Micro-Inverter Grid Technician"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Sector</label>
                  <input
                    type="text"
                    required
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={formData.duration_months}
                    onChange={e => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Accredited Provider Name</label>
                <input
                  type="text"
                  required
                  value={formData.provider_name}
                  onChange={e => setFormData({ ...formData, provider_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Curriculum Summary / Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline practical hours, tools covered, and NSQF standards..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  {saving ? 'Saving...' : editingProgram ? 'Save Changes' : 'Launch Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
