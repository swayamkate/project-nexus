'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building, 
  Award, 
  PlusCircle,
  Loader2,
  X,
  AlertCircle,
  Sparkles,
  Check,
  FileText,
  Layers,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { useUser } from '@/context/UserContext';
import { EmptyState } from '@/components/EmptyState';
import { mutateDb } from '@/lib/traineeApi';

const SECTORS = [
  'Apparel & Fashion',
  'Automotive & EV',
  'Renewable Energy & Solar',
  'IT & Digital Technologies',
  'Healthcare & Allied Services',
  'Electronics & Hardware',
  'Manufacturing & Capital Goods',
  'Construction & Infrastructure',
  'Beauty & Wellness',
  'Retail & Logistics',
  'Agriculture & Food Processing',
  'Tourism & Hospitality',
  'Other Vocational Trade'
];

const FALLBACK_ACCREDITED_PROGRAMS = [
  {
    id: 'f-1',
    title: 'Advanced Tailoring & Garment Manufacturing',
    sector: 'Apparel & Fashion',
    duration_months: 3,
    provider_name: 'Maharashtra State Skill Development Society (MSSDS)',
    description: 'Comprehensive industrial stitching, pattern design, and boutique entrepreneurship.'
  },
  {
    id: 'f-2',
    title: 'Solar PV Rooftop Technician',
    sector: 'Renewable Energy',
    duration_months: 4,
    provider_name: 'National Institute of Solar Energy (NISE)',
    description: 'Grid-connected solar system design, inverter configuration, and safety compliance.'
  },
  {
    id: 'f-3',
    title: 'Full-Stack Web Development & Cloud Deployment',
    sector: 'IT & Digital Technologies',
    duration_months: 6,
    provider_name: 'National Skill Development Corporation (NSDC)',
    description: 'Modern enterprise web architecture, database design, and cloud scalability.'
  },
  {
    id: 'f-4',
    title: 'Automotive Electric Vehicle (EV) Maintenance',
    sector: 'Automotive & EV',
    duration_months: 4,
    provider_name: 'Automotive Skills Development Council (ASDC)',
    description: 'EV battery diagnostics, motor controllers, and regenerative braking repair.'
  },
  {
    id: 'f-5',
    title: 'CNC Milling & Precision Machining Operator',
    sector: 'Manufacturing & Capital Goods',
    duration_months: 6,
    provider_name: 'Directorate of Vocational Education & Training (DVET)',
    description: 'Computer numerical control programming, G-code simulation, and precision tooling.'
  },
  {
    id: 'f-6',
    title: 'Healthcare Assistant & Emergency First Responder',
    sector: 'Healthcare & Allied Services',
    duration_months: 4,
    provider_name: 'Healthcare Sector Skill Council (HSSC)',
    description: 'Patient vital monitoring, emergency trauma response, and hospital ward assistance.'
  }
];

export const TrainingDetailsPage: React.FC = () => {
  const { profile, enrollments, refreshData, t } = useUser();
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'catalog' | 'custom'>('custom');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Catalog Form Fields
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [catalogStatus, setCatalogStatus] = useState<'enrolled' | 'in_progress' | 'completed' | 'certified'>('enrolled');
  const [catalogEnrolledDate, setCatalogEnrolledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [catalogCompletedDate, setCatalogCompletedDate] = useState<string>('');
  const [catalogCertifiedDate, setCatalogCertifiedDate] = useState<string>('');
  const [catalogCertificateId, setCatalogCertificateId] = useState<string>('');
  const [catalogGrade, setCatalogGrade] = useState<string>('');

  // Custom Course Form Fields
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customSector, setCustomSector] = useState<string>(SECTORS[0]);
  const [customProvider, setCustomProvider] = useState<string>('Maharashtra State Skill Development Society (MSSDS)');
  const [customDuration, setCustomDuration] = useState<number>(3);
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customStatus, setCustomStatus] = useState<'enrolled' | 'in_progress' | 'completed' | 'certified'>('completed');
  const [customEnrolledDate, setCustomEnrolledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customCompletedDate, setCustomCompletedDate] = useState<string>('');
  const [customCertifiedDate, setCustomCertifiedDate] = useState<string>('');
  const [customCertificateId, setCustomCertificateId] = useState<string>('');
  const [customGrade, setCustomGrade] = useState<string>('A');

  const supabase = createClient();

  const loadCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('training_programs').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setAllCourses(data);
      } else {
        setAllCourses(FALLBACK_ACCREDITED_PROGRAMS);
      }
    } catch {
      setAllCourses(FALLBACK_ACCREDITED_PROGRAMS);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4500);
  };

  const handleEnroll = async (programId: string) => {
    let effectiveTraineeId = profile?.id;
    if (!effectiveTraineeId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data: tData } = await supabase
          .from('trainees')
          .select('id')
          .eq('email', session.user.email)
          .maybeSingle();
        effectiveTraineeId = tData?.id;
      }
    }

    if (!effectiveTraineeId) {
      showToast('Please sign in or complete your candidate profile before enrolling.', 'error');
      return;
    }

    const course = allCourses.find(c => c.id === programId);
    const isAlreadyEnrolled = enrollments.some(
      e => e.program_id === programId || 
      (course?.title && e.training_programs?.title?.toLowerCase() === course.title.toLowerCase())
    );

    if (isAlreadyEnrolled) {
      showToast('You are already enrolled in this training program.', 'info');
      return;
    }

    setEnrollingId(programId);
    try {
      let targetProgramId = programId;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(programId);

      // If program is from static fallback and not yet in database, look up by title or provision it
      if (!isUUID && course) {
        const { data: existingProg } = await supabase
          .from('training_programs')
          .select('id')
          .ilike('title', course.title.trim())
          .maybeSingle();

        if (existingProg?.id) {
          targetProgramId = existingProg.id;
        } else {
          const { data: progData, error: progErr } = await mutateDb({
            action: 'insert',
            table: 'training_programs',
            payload: {
              title: course.title.trim(),
              sector: course.sector,
              duration_months: Number(course.duration_months) || 3,
              provider_name: course.provider_name || '',
              description: course.description || ''
            }
          });
          if (progErr || !progData?.[0]?.id) {
            throw progErr || new Error('Failed to register training program in database');
          }
          targetProgramId = progData[0].id;
        }
      }

      // Check if enrollment already exists for this trainee and program
      const { data: existingEnr } = await supabase
        .from('trainee_enrollments')
        .select('id')
        .eq('trainee_id', effectiveTraineeId)
        .eq('program_id', targetProgramId)
        .maybeSingle();

      if (existingEnr?.id) {
        await mutateDb({
          action: 'update',
          table: 'trainee_enrollments',
          payload: { status: 'enrolled', enrolled_date: new Date().toISOString().split('T')[0] },
          match: { id: existingEnr.id }
        });
      } else {
        const { error } = await mutateDb({
          action: 'insert',
          table: 'trainee_enrollments',
          payload: {
            trainee_id: effectiveTraineeId,
            program_id: targetProgramId,
            enrolled_date: new Date().toISOString().split('T')[0],
            status: 'enrolled'
          }
        });
        if (error) throw error;
      }

      await refreshData();
      await loadCourses();
      showToast('Enrolled in training program successfully!', 'success');
    } catch (err: any) {
      showToast('Enrollment failed: ' + (err.message || 'Unknown database error'), 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let effectiveTraineeId = profile?.id;
    if (!effectiveTraineeId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data: tData } = await supabase
          .from('trainees')
          .select('id')
          .eq('email', session.user.email)
          .maybeSingle();
        effectiveTraineeId = tData?.id;
      }
    }

    if (!effectiveTraineeId) {
      setFormError('Candidate profile session is required. Please ensure you are logged in.');
      return;
    }

    setSubmitting(true);

    try {
      if (modalMode === 'catalog') {
        if (!selectedCatalogId) {
          setFormError('Please select a training program from the accredited catalog.');
          setSubmitting(false);
          return;
        }

        const selectedCourse = allCourses.find(c => c.id === selectedCatalogId);
        const isAlreadyEnrolled = enrollments.some(
          e => e.program_id === selectedCatalogId ||
          (selectedCourse?.title && e.training_programs?.title?.toLowerCase() === selectedCourse.title.toLowerCase())
        );

        if (isAlreadyEnrolled) {
          setFormError('You are already enrolled in this training program.');
          setSubmitting(false);
          return;
        }

        let targetProgramId = selectedCatalogId;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedCatalogId);

        if (!isUUID && selectedCourse) {
          const { data: existingProg } = await supabase
            .from('training_programs')
            .select('id')
            .ilike('title', selectedCourse.title.trim())
            .maybeSingle();

          if (existingProg?.id) {
            targetProgramId = existingProg.id;
          } else {
            const { data: progData, error: progErr } = await mutateDb({
              action: 'insert',
              table: 'training_programs',
              payload: {
                title: selectedCourse.title.trim(),
                sector: selectedCourse.sector,
                duration_months: Number(selectedCourse.duration_months) || 3,
                provider_name: selectedCourse.provider_name || '',
                description: selectedCourse.description || ''
              }
            });
            if (progErr || !progData?.[0]?.id) {
              throw progErr || new Error('Failed to register training program');
            }
            targetProgramId = progData[0].id;
          }
        }

        const enrollmentPayload: Record<string, any> = {
          trainee_id: effectiveTraineeId,
          program_id: targetProgramId,
          enrolled_date: catalogEnrolledDate || new Date().toISOString().split('T')[0],
          status: catalogStatus,
          completed_date: (catalogStatus === 'completed' || catalogStatus === 'certified') && catalogCompletedDate?.trim() ? catalogCompletedDate.trim() : null,
          certified_date: catalogStatus === 'certified' && catalogCertifiedDate?.trim() ? catalogCertifiedDate.trim() : null,
          certificate_id: (catalogStatus === 'certified' || catalogStatus === 'completed') && catalogCertificateId?.trim() ? catalogCertificateId.trim() : null,
          grade: catalogGrade?.trim() ? catalogGrade.trim().slice(0, 10) : null
        };

        const { data: existingEnr } = await supabase
          .from('trainee_enrollments')
          .select('id')
          .eq('trainee_id', effectiveTraineeId)
          .eq('program_id', targetProgramId)
          .maybeSingle();

        if (existingEnr?.id) {
          const { error: enrErr } = await mutateDb({
            action: 'update',
            table: 'trainee_enrollments',
            payload: enrollmentPayload,
            match: { id: existingEnr.id }
          });
          if (enrErr) throw enrErr;
        } else {
          const { error: enrErr } = await mutateDb({
            action: 'insert',
            table: 'trainee_enrollments',
            payload: enrollmentPayload
          });
          if (enrErr) throw enrErr;
        }

      } else {
        // Custom Course Mode
        if (!customTitle.trim()) {
          setFormError('Please enter the Course / Program Title.');
          setSubmitting(false);
          return;
        }
        if (!customProvider.trim()) {
          setFormError('Please enter the Training Provider or ITI Institute name.');
          setSubmitting(false);
          return;
        }

        const isDuplicate = enrollments.some(
          e => e.training_programs?.title?.trim().toLowerCase() === customTitle.trim().toLowerCase()
        );

        if (isDuplicate) {
          setFormError(`You already have a training program recorded titled "${customTitle.trim()}".`);
          setSubmitting(false);
          return;
        }

        // 1. Check if program with same title already exists in training_programs
        let targetProgramId: string | null = null;
        const { data: existingProg } = await supabase
          .from('training_programs')
          .select('id')
          .ilike('title', customTitle.trim())
          .maybeSingle();

        if (existingProg?.id) {
          targetProgramId = existingProg.id;
        } else {
          const { data: progData, error: progErr } = await mutateDb({
            action: 'insert',
            table: 'training_programs',
            payload: {
              title: customTitle.trim(),
              sector: customSector.trim(),
              duration_months: Math.max(1, Number(customDuration) || 3),
              provider_name: customProvider.trim(),
              description: customDescription.trim() || `${customSector} vocational training program certified by ${customProvider.trim()}.`
            }
          });

          if (progErr || !progData?.[0]?.id) {
            throw progErr || new Error('Failed to create training program record');
          }
          targetProgramId = progData[0].id;
        }

        // 2. Link in trainee_enrollments with candidate details
        const enrollmentPayload: Record<string, any> = {
          trainee_id: effectiveTraineeId,
          program_id: targetProgramId,
          enrolled_date: customEnrolledDate || new Date().toISOString().split('T')[0],
          status: customStatus,
          completed_date: (customStatus === 'completed' || customStatus === 'certified') && customCompletedDate?.trim() ? customCompletedDate.trim() : null,
          certified_date: customStatus === 'certified' && customCertifiedDate?.trim() ? customCertifiedDate.trim() : null,
          certificate_id: (customStatus === 'certified' || customStatus === 'completed') && customCertificateId?.trim() ? customCertificateId.trim() : null,
          grade: customGrade?.trim() ? customGrade.trim().slice(0, 10) : null
        };

        const { data: existingEnr } = await supabase
          .from('trainee_enrollments')
          .select('id')
          .eq('trainee_id', effectiveTraineeId)
          .eq('program_id', targetProgramId)
          .maybeSingle();

        if (existingEnr?.id) {
          const { error: enrErr } = await mutateDb({
            action: 'update',
            table: 'trainee_enrollments',
            payload: enrollmentPayload,
            match: { id: existingEnr.id }
          });
          if (enrErr) throw enrErr;
        } else {
          const { error: enrErr } = await mutateDb({
            action: 'insert',
            table: 'trainee_enrollments',
            payload: enrollmentPayload
          });
          if (enrErr) throw enrErr;
        }
      }

      // Refresh context and program catalog
      await refreshData();
      await loadCourses();

      // Reset modal and show success toast
      setIsAddModalOpen(false);
      resetModalForm();
      showToast('Training course and credentials recorded successfully!', 'success');
    } catch (err: any) {
      console.error('Course addition error:', err);
      setFormError(err.message || 'Failed to save training details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModalForm = () => {
    setSelectedCatalogId('');
    setCatalogStatus('enrolled');
    setCatalogEnrolledDate(new Date().toISOString().split('T')[0]);
    setCatalogCompletedDate('');
    setCatalogCertifiedDate('');
    setCatalogCertificateId('');
    setCatalogGrade('');
    setCustomTitle('');
    setCustomSector(SECTORS[0]);
    setCustomProvider('Maharashtra State Skill Development Society (MSSDS)');
    setCustomDuration(3);
    setCustomDescription('');
    setCustomStatus('completed');
    setCustomEnrolledDate(new Date().toISOString().split('T')[0]);
    setCustomCompletedDate('');
    setCustomCertifiedDate('');
    setCustomCertificateId('');
    setCustomGrade('A');
    setFormError(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed top-20 right-6 z-50 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300 ${
          toastMsg.type === 'error'
            ? 'bg-rose-950/95 border-rose-800 text-rose-100'
            : toastMsg.type === 'info'
            ? 'bg-blue-950/95 border-blue-800 text-blue-100'
            : 'bg-slate-900/95 border-slate-800 text-white'
        }`}>
          {toastMsg.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : toastMsg.type === 'info' ? (
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="font-semibold">{toastMsg.text}</span>
        </div>
      )}
      
      {/* Header with Add Course Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('training.title', 'Training & Course Details')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            {t('training.subtitle', 'Enrolled NSQF-aligned vocational skilling programs, ITI trade certifications, and modular syllabus.')}
          </p>
        </div>

        <button
          onClick={() => {
            resetModalForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-200 transition active:scale-95 cursor-pointer flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Training & Course Details</span>
        </button>
      </div>

      {/* Active Enrolled Program Cards or Empty State */}
      {enrollments.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm text-center">
          <EmptyState
            icon={GraduationCap}
            title="No Enrolled Programs Recorded"
            description="You have not yet added any vocational training or course enrollments. Click the button below to record past ITI credentials or explore accredited programs."
          />
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                resetModalForm();
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Course / ITI Credential</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Enrolled Vocational Programs ({enrollments.length})
            </h2>
            <span className="text-xs text-slate-400">Authenticated Registry Records</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {enrollments.map((enr) => {
              const prog = enr.training_programs;
              const isCertified = enr.status === 'certified';
              const isCompleted = enr.status === 'completed';

              return (
                <div key={enr.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 hover:border-slate-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
                          isCertified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : isCompleted
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {enr.status?.replace('_', ' ') || 'enrolled'}
                        </span>
                        {prog?.sector && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                            {prog.sector}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{prog?.title || 'Program title not recorded'}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prog?.provider_name || 'Provider not recorded'}</span>
                      </p>
                      {prog?.description && (
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">{prog.description}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 sm:self-start bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Performance</span>
                        <span className="text-base font-black text-emerald-600">{enr.grade || 'Enrolled'}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Metric Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[11px] font-medium block">Duration</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                        {prog?.duration_months == null ? 'Not recorded' : `${prog.duration_months} Months`}
                      </p>
                    </div>

                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[11px] font-medium block">Enrolled Date</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                        {enr.enrolled_date || 'Active'}
                      </p>
                    </div>

                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[11px] font-medium block">Completion Date</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                        {enr.completed_date || (isCertified || isCompleted ? 'Completed' : 'In Progress')}
                      </p>
                    </div>

                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[11px] font-medium block">Certificate ID</span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-blue-600 truncate mt-0.5" title={enr.certificate_id || 'In Progress'}>
                        {enr.certificate_id || 'In Progress'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Secondary Courses */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Explore Secondary Upskilling Opportunities</h3>
            <p className="text-xs text-slate-500">Accredited state vocational skilling modules to enhance market readiness</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            {allCourses.length} Programs Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCourses.map(course => {
            const isEnrolled = enrollments.some(
              e => e.program_id === course.id ||
              (e.training_programs?.title && e.training_programs.title.toLowerCase() === course.title.toLowerCase())
            );

            return (
              <div key={course.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">
                      {course.sector}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{course.duration_months} Months</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{course.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{course.description}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>Provider: {course.provider_name}</span>
                  </p>
                </div>

                <div className="pt-2">
                  {isEnrolled ? (
                    <div className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Already Enrolled</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {enrollingId === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      <span>Enroll in Program</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Training & Course Details Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Add Training & Course Details</h2>
                  <p className="text-xs text-slate-500">Record state vocational training, ITI credentials, or catalog courses</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!submitting) setIsAddModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="p-6 space-y-6">
              
              {/* Error Banner */}
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Validation Error</p>
                    <p className="text-rose-700 mt-0.5">{formError}</p>
                  </div>
                </div>
              )}

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setModalMode('custom')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                    modalMode === 'custom'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enter Custom / ITI Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('catalog')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                    modalMode === 'catalog'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Select from Accredited Catalog</span>
                </button>
              </div>

              {/* MODE 1: Catalog Selection */}
              {modalMode === 'catalog' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Select Accredited Training Program *
                    </label>
                    <select
                      value={selectedCatalogId}
                      onChange={(e) => setSelectedCatalogId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">-- Choose a course from catalog --</option>
                      {allCourses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.sector} - {c.duration_months} Mo)
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCatalogId && (
                    <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs space-y-1.5">
                      {(() => {
                        const selected = allCourses.find(c => c.id === selectedCatalogId);
                        if (!selected) return null;
                        return (
                          <>
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{selected.title}</span>
                              <span className="text-blue-600">{selected.duration_months} Months</span>
                            </div>
                            <p className="text-slate-600">{selected.description}</p>
                            <p className="text-slate-500 font-medium">Provider: {selected.provider_name}</p>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Enrollment Status
                      </label>
                      <select
                        value={catalogStatus}
                        onChange={(e: any) => setCatalogStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="enrolled">Enrolled (Active)</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="certified">Certified (With Certificate ID)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Enrollment Date
                      </label>
                      <input
                        type="date"
                        value={catalogEnrolledDate}
                        onChange={(e) => setCatalogEnrolledDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {(catalogStatus === 'completed' || catalogStatus === 'certified') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Completion Date
                        </label>
                        <input
                          type="date"
                          value={catalogCompletedDate}
                          onChange={(e) => setCatalogCompletedDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Grade / Score Achieved
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. A+, Distinction, 85%"
                          value={catalogGrade}
                          onChange={(e) => setCatalogGrade(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {catalogStatus === 'certified' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Certificate ID / Serial No.
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. MSDE-CERT-2024-98124"
                          value={catalogCertificateId}
                          onChange={(e) => setCatalogCertificateId(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Certified Date
                        </label>
                        <input
                          type="date"
                          value={catalogCertifiedDate}
                          onChange={(e) => setCatalogCertifiedDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: Custom / Past ITI Details */}
              {modalMode === 'custom' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Course / Program Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Electrician & Wireman Trade, Advanced CNC Milling, Solar Rooftop Technician"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Sector / Trade Domain *
                      </label>
                      <select
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {SECTORS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Duration in Months *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Training Provider / ITI / Institute Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Government ITI Aundh Pune, MSSDS Skilling Center, Don Bosco Tech"
                      value={customProvider}
                      onChange={(e) => setCustomProvider(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Course Description / Key Modules (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of the practical syllabus, machines used, or specialized trade tools covered..."
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Enrollment Status *
                      </label>
                      <select
                        value={customStatus}
                        onChange={(e: any) => setCustomStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="enrolled">Enrolled (Currently Active)</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="certified">Certified (Credentials Issued)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Enrollment Date *
                      </label>
                      <input
                        type="date"
                        value={customEnrolledDate}
                        onChange={(e) => setCustomEnrolledDate(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {(customStatus === 'completed' || customStatus === 'certified') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Completion Date
                        </label>
                        <input
                          type="date"
                          value={customCompletedDate}
                          onChange={(e) => setCustomCompletedDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Grade / Final Performance
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. A+, Distinction, 88%"
                          value={customGrade}
                          onChange={(e) => setCustomGrade(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {customStatus === 'certified' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Certificate ID / Registration Roll No.
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. NCVT-ITI-2024-55102"
                          value={customCertificateId}
                          onChange={(e) => setCustomCertificateId(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Certified Date
                        </label>
                        <input
                          type="date"
                          value={customCertifiedDate}
                          onChange={(e) => setCustomCertifiedDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm shadow-blue-200 transition flex items-center space-x-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Training Details...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Record Course</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
