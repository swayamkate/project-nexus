'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building, 
  Award, 
  Download, 
  ArrowRight,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { useUser } from '@/context/UserContext';
import { EmptyState } from '@/components/EmptyState';

export const TrainingDetailsPage: React.FC = () => {
  const { profile, enrollments, refreshData, t } = useUser();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('training_programs').select('*');
      if (data) setAllCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, [supabase]);

  const handleEnroll = async (programId: string) => {
    if (!profile?.id) return;
    setEnrollingId(programId);
    try {
      const { error } = await supabase.from('trainee_enrollments').insert({
        trainee_id: profile.id,
        program_id: programId,
        enrolled_date: new Date().toISOString().split('T')[0],
        status: 'enrolled'
      });
      if (error) throw error;
      await refreshData();
      setToastMsg('Enrolled in training program successfully!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg('Enrollment failed: ' + (err.message || 'Error'));
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('training.title', 'Training & Course Details')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t('training.subtitle', 'Enrolled NSQF-aligned vocational skilling programs and modular syllabus.')}</p>
      </div>

      {/* Active Enrolled Program Card or Empty State */}
      {enrollments.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <EmptyState
            icon={GraduationCap}
            title="No Enrolled Programs"
            description="You are not yet enrolled in any skill certification courses. Browse the catalog below and enroll to begin your longitudinal career tracking."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enr) => {
            const prog = enr.training_programs;
            return (
              <div key={enr.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                      enr.status === 'certified' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {enr.status}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{prog?.title || 'Program title not recorded'}</h2>
                    <p className="text-xs text-slate-500">{prog?.provider_name || 'Provider not recorded'} • Sector: {prog?.sector || 'Sector not recorded'}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Grade</span>
                      <span className="text-lg font-black text-emerald-600">{enr.grade || 'Not recorded'}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Metric Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Duration</span>
                    <p className="text-base font-bold text-slate-800 mt-0.5">{prog?.duration_months == null ? 'Not recorded' : `${prog.duration_months} Months`}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Enrolled Date</span>
                    <p className="text-base font-bold text-slate-800 mt-0.5">{enr.enrolled_date || 'Active'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-xs block">Certificate ID</span>
                    <p className="text-base font-mono font-bold text-blue-600 mt-0.5">{enr.certificate_id || 'In Progress'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Secondary Courses */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Explore Secondary Upskilling Opportunities</h3>
          <span className="text-xs text-slate-500">{allCourses.length} Programs Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCourses.map(course => (
            <div key={course.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">
                    {course.sector}
                  </span>
                  <span className="text-xs text-slate-400">{course.duration_months} Months</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{course.description}</p>
                <p className="text-[11px] text-slate-400">Provider: {course.provider_name}</p>
              </div>

              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrollingId === course.id}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {enrollingId === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                <span>Enroll in Course</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
