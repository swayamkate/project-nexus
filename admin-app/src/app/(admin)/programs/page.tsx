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
  Users,
  AlertCircle
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';
import { formatHumanError } from '@/lib/errorUtils';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [programToDelete, setProgramToDelete] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    sector: 'Apparel & Fashion',
    duration_months: 3,
    provider_name: 'Maharashtra State Skill Development Society (MSSDS)',
    description: ''
  });

  const supabase = createClient();

  const fetchPrograms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('training_programs')
      .select('*, trainee_enrollments(count)')
      .order('created_at', { ascending: false });

    if (data) setPrograms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSaving(true);
    try {
      if (editingProgram) {
        // Update
        const { error } = await supabase
          .from('training_programs')
          .update({
            title: formData.title,
            sector: formData.sector,
            duration_months: formData.duration_months,
            provider_name: formData.provider_name,
            description: formData.description
          })
          .eq('id', editingProgram.id);

        if (error) throw error;
        setToastMsg({ type: 'success', text: `Course "${formData.title}" updated successfully.` });
      } else {
        // Insert
        const { error } = await supabase
          .from('training_programs')
          .insert({
            title: formData.title,
            sector: formData.sector,
            duration_months: formData.duration_months,
            provider_name: formData.provider_name,
            description: formData.description
          });

        if (error) throw error;
        setToastMsg({ type: 'success', text: `New course "${formData.title}" created.` });
      }

      setShowModal(false);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPrograms();
    } catch (err: any) {
      setToastMsg({ type: 'error', text: formatHumanError(err) });
      setTimeout(() => setToastMsg(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!programToDelete) return;
    try {
      const { error } = await supabase.from('training_programs').delete().eq('id', programToDelete.id);
      if (error) throw error;
      setToastMsg({ type: 'success', text: `Course "${programToDelete.title}" removed.` });
      setTimeout(() => setToastMsg(null), 3500);
      await fetchPrograms();
    } catch (err: any) {
      setToastMsg({ type: 'error', text: formatHumanError(err) });
      setTimeout(() => setToastMsg(null), 5000);
    } finally {
      setProgramToDelete(null);
    }
  };

  const filteredPrograms = programs.filter(p => 
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.provider_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top ${
          toastMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-xs font-bold">{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Training Programs Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Manage accredited vocational courses, duration, and associated curriculum across sectors.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
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
        <EmptyState
          icon={GraduationCap}
          title="No Vocational Programs Found"
          description={search ? `No accredited courses match the query "${search}". Try searching for another sector or title.` : "No training programs currently registered in the State catalog."}
          actionLabel="Create First Training Program"
          onAction={handleOpenCreate}
          badge="0 Courses"
        />
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
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg transition cursor-pointer"
                        title="Edit course"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProgramToDelete(program)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-lg transition cursor-pointer"
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-black text-white text-base">
                {editingProgram ? 'Edit Training Course' : 'Create New Training Program'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course Title *</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Electric Vehicle (EV) Diagnostic & Service Technician"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vocational Sector</label>
                  <select
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Apparel & Fashion">Apparel & Fashion</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                    <option value="Green Energy & Solar">Green Energy & Solar</option>
                    <option value="IT & Electronics">IT & Electronics</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Healthcare">Healthcare & Paramedical</option>
                    <option value="Construction & Plumbing">Construction & Plumbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Months)</label>
                  <input 
                    type="number"
                    min="1"
                    max="36"
                    value={formData.duration_months}
                    onChange={e => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Accredited Training Provider</label>
                <input 
                  type="text"
                  value={formData.provider_name}
                  onChange={e => setFormData({ ...formData, provider_name: e.target.value })}
                  placeholder="e.g. Tata Community Training Center, Pune"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Practical Competency Scope</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key practical skills learned, NSQF level mapping..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center space-x-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{editingProgram ? 'Save Changes' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destructive Deletion Friction Safeguard */}
      <DestructiveConfirmModal
        isOpen={Boolean(programToDelete)}
        onClose={() => setProgramToDelete(null)}
        onConfirm={handleExecuteDelete}
        title="Expunge Training Program"
        itemName={programToDelete?.title || 'Selected Course'}
        warningMessage="Deleting this course will detach it from the active course catalog and state enrollment metrics. This operation is permanently recorded in the administrative audit logs."
        requiredWord="DELETE"
      />

    </div>
  );
}
