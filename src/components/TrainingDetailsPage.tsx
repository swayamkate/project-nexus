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

export const TrainingDetailsPage: React.FC = () => {
  const { profile, enrollments, refreshData } = useUser();
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

  const modules = [
    { name: 'Pattern Making & Garment Drafting', hours: 40, status: 'Completed', score: '95%' },
    { name: 'Industrial Single Needle Lockstitch Operation', hours: 60, status: 'Completed', score: '92%' },
    { name: 'Quality Inspection & Fabric Testing', hours: 30, status: 'Completed', score: '88%' },
    { name: 'Advanced Overlock & Flatlock Seaming', hours: 50, status: 'Completed', score: '90%' },
    { name: 'Boutique Management & Digital Invoicing', hours: 20, status: 'Completed', score: '96%' }
  ];

  const handleEnroll = async (programId: string) => {
    if (!profile?.id) return;
    setEnrollingId(programId);
    try {
      await supabase.from('trainee_enrollments').insert({
        trainee_id: profile.id,
        program_id: programId,
        enrolled_date: new Date().toISOString().split('T')[0],
        status: 'enrolled'
      });
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Training & Course Details</h1>
        <p className="text-xs text-slate-500 mt-0.5">Comprehensive syllabus breakdown, attendance history, and course catalog</p>
      </div>

      {/* Active Enrolled Program Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase">
              Completed & Certified
            </span>
            <h2 className="text-xl font-bold text-slate-900">Advanced Tailoring & Garment Manufacturing</h2>
            <p className="text-xs text-slate-500">Government ITI Aundh, Pune • Batch 2024-Q2</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Grade</span>
              <span className="text-lg font-black text-emerald-600">A+ (92%)</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs block">Training Duration</span>
            <p className="text-base font-bold text-slate-800 mt-0.5">360 Hours (3 Months)</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs block">Verified Attendance</span>
            <p className="text-base font-bold text-emerald-600 mt-0.5">96.4% Attendance</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-xs block">Certificate ID</span>
            <p className="text-base font-mono font-bold text-blue-600 mt-0.5">CERT-2024-MH-9482</p>
          </div>
        </div>

        {/* Course Modules Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm">Curriculum Modules & Assessment Scores</h3>
          
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {modules.map((m, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-slate-800">{m.name}</h4>
                    <span className="text-slate-400 text-[11px]">{m.hours} Hours Practical</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-slate-900">{m.score}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
