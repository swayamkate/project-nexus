'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { mutateAdminDb } from '@/lib/adminApi';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Clock, 
  Award, 
  X, 
  Loader2, 
  Globe,
  Users
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';
import { logAdminAction } from '@/lib/auditLogger';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    platform: 'NPTEL',
    provider: 'IIT Bombay',
    sector: 'Apparel & Fashion',
    duration_weeks: 8,
    estimated_hours: 24,
    nsqf_level: 5,
    skill_tags: '',
    url: '',
    rating: 4.8,
    is_free: true,
    has_certificate: true
  });

  const supabase = createClient();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('external_courses')
        .select('*, trainee_course_enrollments(count)')
        .order('created_at', { ascending: false });

      if (data) setCourses(data);
    } catch (e) {
      console.error('Error fetching courses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      platform: 'NPTEL',
      provider: 'IIT Bombay',
      sector: 'Apparel & Fashion',
      duration_weeks: 8,
      estimated_hours: 24,
      nsqf_level: 5,
      skill_tags: '',
      url: '',
      rating: 4.8,
      is_free: true,
      has_certificate: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      platform: course.platform,
      provider: course.provider,
      sector: course.sector,
      duration_weeks: course.duration_weeks,
      estimated_hours: course.estimated_hours,
      nsqf_level: course.nsqf_level || 4,
      skill_tags: Array.isArray(course.skill_tags) 
        ? course.skill_tags.join(', ') 
        : (typeof course.skill_tags === 'string' ? course.skill_tags.replace(/[\[\]"]/g, '') : ''),
      url: course.url,
      rating: course.rating || 4.8,
      is_free: course.is_free,
      has_certificate: course.has_certificate
    });
    setShowModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMsg(null);

    const tagsArray = formData.skill_tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      platform: formData.platform,
      provider: formData.provider,
      sector: formData.sector,
      duration_weeks: Number(formData.duration_weeks),
      estimated_hours: Number(formData.estimated_hours),
      nsqf_level: Number(formData.nsqf_level),
      skill_tags: tagsArray,
      url: formData.url,
      rating: Number(formData.rating),
      is_free: formData.is_free,
      has_certificate: formData.has_certificate
    };

    try {
      if (editingCourse) {
        const { error } = await mutateAdminDb({
          action: 'update',
          table: 'external_courses',
          payload,
          match: { id: editingCourse.id }
        });
        if (error) throw error;
        await logAdminAction(
          'UPDATE_COURSE',
          'EXTERNAL_COURSES',
          editingCourse.id,
          `Updated course ${payload.title} (${payload.platform})`
        );
        setToastMsg({ type: 'success', text: 'Course catalog record updated successfully.' });
      } else {
        const { data: inserted, error } = await mutateAdminDb({
          action: 'insert',
          table: 'external_courses',
          payload
        });
        if (error) throw error;
        const insertedId = inserted && inserted[0] ? inserted[0].id : null;
        await logAdminAction(
          'CREATE_COURSE',
          'EXTERNAL_COURSES',
          insertedId,
          `Added new accredited course ${payload.title} (${payload.platform})`
        );
        setToastMsg({ type: 'success', text: 'New accredited course added to registry.' });
      }

      setShowModal(false);
      await fetchCourses();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      const { error } = await mutateAdminDb({
        action: 'delete',
        table: 'external_courses',
        match: { id: courseToDelete.id }
      });
      if (error) throw error;
      await logAdminAction(
        'DELETE_COURSE',
        'EXTERNAL_COURSES',
        courseToDelete.id,
        `Removed course ${courseToDelete.title} from catalog`
      );
      setToastMsg({ type: 'success', text: 'Course deleted from catalog.' });
      setCourseToDelete(null);
      await fetchCourses();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const platforms = ['All', 'NPTEL', 'Coursera', 'Swayam', 'Skill India', 'MSSDS'];
  const sectors = ['All', 'Apparel & Fashion', 'Renewable Energy', 'Automotive & EV', 'IT & Digital', 'Retail & Commerce', 'Healthcare & Caregiving'];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = search === '' || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
    const matchesSector = selectedSector === 'All' || c.sector === selectedSector;
    return matchesSearch && matchesPlatform && matchesSector;
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
          <h1 className="text-2xl font-black text-white tracking-tight">Accredited Courses Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage NPTEL, Coursera, Swayam and MSSDS courses available to trainees for skill gap closure.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
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
            placeholder="Search courses by title or provider..."
            className="w-full pl-10 pr-4 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="w-full md:w-44 px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
        >
          {platforms.map(p => <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>)}
        </select>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full md:w-48 px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:outline-none"
        >
          {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</option>)}
        </select>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-xs font-bold">Loading course records...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          description="No course catalog records match your current filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const enrollCount = course.trainee_course_enrollments?.[0]?.count || course.enrolled_count || 0;

            return (
              <div 
                key={course.id}
                className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded uppercase">
                      {course.platform}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating || 4.8}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{course.provider}</span>
                    <span>•</span>
                    <span>{course.duration_weeks} Weeks</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{course.is_free ? 'Free' : 'Paid'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(course.skill_tags) 
                      ? course.skill_tags 
                      : (typeof course.skill_tags === 'string' ? course.skill_tags.replace(/[\[\]"]/g, '').split(',') : [])
                    ).filter(Boolean).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{enrollCount} Trainees</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Edit Course"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCourseToDelete(course)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                      title="Open Syllabus"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">
                {editingCourse ? 'Edit Course Catalog Entry' : 'Add New Accredited Course'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Electric Vehicle Powertrain & BMS Diagnostics"
                  className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  >
                    <option value="NPTEL">NPTEL (IITs)</option>
                    <option value="Coursera">Coursera</option>
                    <option value="Swayam">Swayam (Govt of India)</option>
                    <option value="Skill India">Skill India Digital</option>
                    <option value="MSSDS">MSSDS State Registry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Provider / University</label>
                  <input
                    type="text"
                    required
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g. IIT Madras, Meta, NSDC"
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  >
                    {sectors.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (Wks)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Skill Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skill_tags}
                  onChange={(e) => setFormData({ ...formData, skill_tags: e.target.value })}
                  placeholder="e.g. Pattern Making, Stitching, Quality Inspection"
                  className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Official Course URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://onlinecourses.nptel.ac.in/..."
                  className="w-full px-3 py-2 bg-[#070b14] border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="accent-blue-600"
                  />
                  <span>Free Enrollment</span>
                </label>

                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_certificate}
                    onChange={(e) => setFormData({ ...formData, has_certificate: e.target.checked })}
                    className="accent-blue-600"
                  />
                  <span>Govt / Industry Certificate</span>
                </label>
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
                  {saving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DestructiveConfirmModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteCourse}
        title="Delete Course from Registry?"
        itemName={courseToDelete?.title || 'Course'}
        warningMessage="Trainees will no longer see this in their course search engine."
      />

    </div>
  );
}
