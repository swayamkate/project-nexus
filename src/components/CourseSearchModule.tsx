'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  GraduationCap, 
  Filter, 
  Star, 
  Clock, 
  Award, 
  CheckCircle2, 
  Plus, 
  Layers, 
  Globe, 
  Sparkles,
  Sliders,
  X
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const CourseSearchModule: React.FC = () => {
  const { profile } = useUser();
  const supabase = createClient();

  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, { id: string; status: string; progress_pct: number }>>({});
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [onlyFree, setOnlyFree] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'enrolled'>('catalog');

  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const platforms = ['All', 'NPTEL', 'Coursera', 'Swayam', 'Skill India', 'MSSDS'];
  const sectors = ['All', 'Apparel & Fashion', 'Renewable Energy', 'Automotive & EV', 'IT & Digital', 'Retail & Commerce', 'Healthcare & Caregiving'];

  const fetchCoursesAndEnrollments = async () => {
    setLoading(true);
    try {
      // 1. Fetch courses
      const { data: coursesData } = await supabase
        .from('external_courses')
        .select('*')
        .order('rating', { ascending: false });

      if (coursesData) setCourses(coursesData);

      // 2. Fetch trainee's enrollments if logged in
      if (profile?.id) {
        const { data: enrollData } = await supabase
          .from('trainee_course_enrollments')
          .select('*')
          .eq('trainee_id', profile.id);

        if (enrollData) {
          const map: Record<string, { id: string; status: string; progress_pct: number }> = {};
          enrollData.forEach(e => {
            map[e.course_id] = { id: e.id, status: e.status, progress_pct: e.progress_pct };
          });
          setEnrolledCourses(map);
        }
      }
    } catch (e) {
      console.error('Error loading course search:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [profile]);

  const handleEnrollCourse = async (courseId: string) => {
    if (!profile?.id) {
      setToastMsg('Please sign in to track course progress.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    setEnrollingId(courseId);
    try {
      const { error } = await supabase
        .from('trainee_course_enrollments')
        .insert({
          trainee_id: profile.id,
          course_id: courseId,
          status: 'in_progress',
          progress_pct: 10
        });

      if (error) throw error;
      setEnrolledCourses(prev => ({
        ...prev,
        [courseId]: { id: 'temp', status: 'in_progress', progress_pct: 10 }
      }));
      setToastMsg('Enrolled successfully! Added to your learning roadmap.');
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    if (!profile?.id) return;
    const isComplete = newProgress >= 100;
    
    setEnrolledCourses(prev => ({
      ...prev,
      [courseId]: { 
        ...prev[courseId], 
        progress_pct: newProgress,
        status: isComplete ? 'completed' : 'in_progress'
      }
    }));

    try {
      await supabase
        .from('trainee_course_enrollments')
        .update({
          progress_pct: newProgress,
          status: isComplete ? 'completed' : 'in_progress',
          completed_at: isComplete ? new Date().toISOString() : null
        })
        .eq('trainee_id', profile.id)
        .eq('course_id', courseId);
    } catch (e) {
      console.error('Failed to update course progress:', e);
    }
  };

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch = search === '' || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.skill_tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
    const matchesSector = selectedSector === 'All' || c.sector === selectedSector;
    const matchesFree = !onlyFree || c.is_free;

    return matchesSearch && matchesPlatform && matchesSector && matchesFree;
  });

  const enrolledCourseList = courses.filter(c => !!enrolledCourses[c.id]);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-slate-700 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-cyan-200">
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>Unified Course Discovery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              NPTEL, Coursera & Swayam Course Search
            </h1>
            <p className="text-sm text-cyan-100/90 mt-1 max-w-2xl">
              Search top technical courses across IIT NPTEL, Coursera, Swayam, and Skill India to close your skill gaps and prepare for state certifications.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center space-x-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Browse Catalog ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('enrolled')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'enrolled' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-cyan-500" />
              <span>My Enrolled ({Object.keys(enrolledCourses).length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course title, skill (e.g. Industrial Stitching, Solar PV, Next.js, CNC)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sector Dropdown */}
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full md:w-56 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Trade Sectors' : s}</option>
                ))}
              </select>

              {/* Free Only Toggle */}
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition shrink-0">
                <input
                  type="checkbox"
                  checked={onlyFree}
                  onChange={(e) => setOnlyFree(e.target.checked)}
                  className="accent-blue-600 rounded"
                />
                <span>Free Courses Only</span>
              </label>
            </div>

            {/* Platform Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
                Platform:
              </span>
              {platforms.map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedPlatform === plat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3 text-slate-500 font-medium">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Searching course catalogs...</span>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No courses match your active search filters.</div>
              <p className="text-xs text-slate-400">Try broadening your search term or clearing platform filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = !!enrolledCourses[course.id];
                const enrollment = enrolledCourses[course.id];

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Platform & Sector Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          course.platform === 'NPTEL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          course.platform === 'Coursera' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          course.platform === 'Swayam' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {course.platform}
                        </span>

                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{course.rating || 4.8}</span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Provider & Duration Info */}
                      <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-slate-700">{course.provider}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.duration_weeks} Wks ({course.estimated_hours}h)</span>
                        </span>
                      </div>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.skill_tags?.map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Slider or Enroll Button */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      {isEnrolled ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-600 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Enrolled ({enrollment.progress_pct}%)</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Slide to Update</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={enrollment.progress_pct}
                            onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                            className="w-full accent-emerald-600 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnrollCourse(course.id)}
                          disabled={enrollingId === course.id}
                          className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{enrollingId === course.id ? 'Adding...' : 'Add to My Roadmap'}</span>
                        </button>
                      )}

                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                      >
                        <span>Open Course Syllabus</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Enrolled Courses View */
        <div className="space-y-6">
          {enrolledCourseList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-base">You have not enrolled in any courses yet.</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore the catalog above and click "Add to My Roadmap" to track your progress and bridge skill gaps.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Browse Course Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourseList.map((course) => {
                const enrollment = enrolledCourses[course.id];
                return (
                  <div key={course.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md uppercase">
                          {course.platform}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base mt-2">{course.title}</h4>
                        <p className="text-xs text-slate-500">{course.provider}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        enrollment.progress_pct >= 100 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {enrollment.progress_pct >= 100 ? 'Completed' : 'In Progress'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Learning Progress</span>
                        <span>{enrollment.progress_pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progress_pct}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={enrollment.progress_pct}
                        onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer mt-1"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
                      >
                        <span>Continue on {course.platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
