'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Loader2,
  DollarSign,
  Award,
  X,
  FileCheck,
  Eye,
  Check,
  XCircle,
  AlertCircle,
  BookOpen,
  Send,
  ExternalLink,
  GraduationCap,
  ChevronRight,
  Filter
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

interface TraineeCandidate {
  id: string;
  trainee_id: string;
  full_name: string;
  email: string;
  phone?: string;
  district: string;
  highest_education: string;
  skills: string[];
  profile_completion_pct: number;
  is_verified: boolean;
  is_active: boolean;
  avatar_url?: string;
}

export default function EmployerRecruitmentPortal() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs' | 'companies'>('candidates');
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<TraineeCandidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [candidateCertificates, setCandidateCertificates] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  // Decline with Feedback Modal
  const [declineCandidate, setDeclineCandidate] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState('Lack of Hands-on Practical Lab Experience');
  const [selectedMissingSkills, setSelectedMissingSkills] = useState<string[]>([]);
  const [customMissingSkill, setCustomMissingSkill] = useState('');
  const [suggestedCourse, setSuggestedCourse] = useState('NPTEL: Electric Vehicles and Powertrains (IIT Madras)');
  const [employerNotes, setEmployerNotes] = useState('');
  const [submittingDecline, setSubmittingDecline] = useState(false);

  // Shortlist Modal / Offer
  const [offeringCandidate, setOfferingCandidate] = useState<any | null>(null);
  const [offeredRole, setOfferedRole] = useState('Junior Technical Apprentice');
  const [offeredSalary, setOfferedSalary] = useState('22000');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    employer_id: '',
    title: '',
    trade_category: 'Automotive',
    min_salary: 18000,
    max_salary: 26000,
    location_district: 'Pune',
    openings_count: 5,
    type: 'full_time'
  });
  const [savingJob, setSavingJob] = useState(false);

  // New Employer Form State
  const [empForm, setEmpForm] = useState({
    company_name: '',
    industry: 'Automotive & EV',
    contact_email: '',
    contact_phone: '',
    district: 'Pune',
    website: ''
  });
  const [registeringEmp, setRegisteringEmp] = useState(false);

  const supabase = createClient();

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [jobsRes, empRes, candidatesRes] = await Promise.all([
        supabase.from('job_postings').select('*, employers(company_name, district, is_verified)').order('created_at', { ascending: false }),
        supabase.from('employers').select('*').order('created_at', { ascending: false }),
        supabase.from('trainees').select('*').order('created_at', { ascending: false }).limit(30)
      ]);

      if (jobsRes.data) setJobPostings(jobsRes.data);
      if (empRes.data) {
        setEmployers(empRes.data);
        if (empRes.data.length > 0) {
          setJobForm(prev => ({ ...prev, employer_id: empRes.data[0].id }));
        }
      }
      if (candidatesRes.data) setCandidates(candidatesRes.data);
    } catch (e) {
      console.error('Error loading employer portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const openCandidateDossier = async (candidate: any) => {
    setSelectedCandidate(candidate);
    setLoadingCerts(true);
    setCandidateCertificates([]);
    try {
      const { data } = await supabase
        .from('trainee_enrollments')
        .select('*, training_programs(title, sector, provider_name)')
        .eq('trainee_id', candidate.id);
      if (data) setCandidateCertificates(data);
    } catch (e) {
      console.error('Error loading candidate certs:', e);
    } finally {
      setLoadingCerts(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.employer_id || !jobForm.title) return;

    setSavingJob(true);
    try {
      const { error } = await supabase.from('job_postings').insert({
        ...jobForm,
        status: 'active'
      });
      if (error) throw error;

      showToast('success', `Job vacancy "${jobForm.title}" posted successfully!`);
      setShowPostModal(false);
      fetchPortalData();
    } catch (err: any) {
      showToast('error', 'Failed to post job: ' + err.message);
    } finally {
      setSavingJob(false);
    }
  };

  const handleRegisterEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.company_name || !empForm.contact_email) return;

    setRegisteringEmp(true);
    try {
      const { error } = await supabase.from('employers').insert({
        ...empForm,
        is_verified: true
      });
      if (error) throw error;

      showToast('success', `Company "${empForm.company_name}" registered on CareerLoop!`);
      setShowRegisterModal(false);
      fetchPortalData();
    } catch (err: any) {
      showToast('error', 'Registration error: ' + err.message);
    } finally {
      setRegisteringEmp(false);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringCandidate) return;
    setSubmittingOffer(true);
    try {
      // Send notification to candidate
      await supabase.from('trainee_notifications').insert({
        trainee_id: offeringCandidate.id,
        title: `🎉 Apprenticeship Offer: ${offeredRole}`,
        message: `Congratulations! An accredited industry partner has reviewed your verified credentials and offered you a position as ${offeredRole} with an estimated stipend/salary of ₹${Number(offeredSalary).toLocaleString('en-IN')}/mo. Check your dashboard to accept.`,
        type: 'placement_offer',
        is_read: false
      });

      showToast('success', `Placement offer sent to ${offeringCandidate.full_name || offeringCandidate.trainee_id}!`);
      setOfferingCandidate(null);
    } catch (err: any) {
      showToast('error', 'Failed to send offer: ' + err.message);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleDeclineWithFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineCandidate) return;
    setSubmittingDecline(true);

    try {
      const allSkills = [...selectedMissingSkills];
      if (customMissingSkill.trim()) allSkills.push(customMissingSkill.trim());

      const skillsStr = allSkills.length > 0 ? allSkills.join(', ') : 'Specialized Technical Skills';

      // Send actionable constructive notification to trainee
      await supabase.from('trainee_notifications').insert({
        trainee_id: declineCandidate.id,
        title: '💼 Application Evaluation & Skill Gap Feedback',
        message: `An industry partner evaluated your candidate profile. While your application was not selected at this time (Reason: ${declineReason}), they provided direct skill guidance: You are recommended to strengthen "${skillsStr}" by taking "${suggestedCourse}". ${employerNotes ? `Employer Note: "${employerNotes}"` : ''}`,
        type: 'skill_feedback',
        is_read: false
      });

      showToast('success', `Constructive skill gap feedback dispatched to ${declineCandidate.full_name || declineCandidate.trainee_id}!`);
      setDeclineCandidate(null);
      setSelectedMissingSkills([]);
      setCustomMissingSkill('');
      setEmployerNotes('');
    } catch (err: any) {
      showToast('error', 'Failed to submit feedback: ' + err.message);
    } finally {
      setSubmittingDecline(false);
    }
  };

  const toggleMissingSkill = (skill: string) => {
    setSelectedMissingSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredCandidates = candidates.filter(c => {
    const matchSearch = searchQuery === '' || 
      (c.full_name && c.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.trainee_id && c.trainee_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.skills && c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    const matchTrade = selectedTrade === 'All' || (c.skills && c.skills.some(s => s.toLowerCase().includes(selectedTrade.toLowerCase())));
    return matchSearch && matchDistrict && matchTrade;
  });

  const popularSkillsPool = [
    'CNC G-Code Machining',
    'EV Battery Management System (BMS)',
    'React Native / Mobile App Arch',
    'PLC & SCADA Industrial Automation',
    'Solar Inverter Grid Synchronization',
    'CAD Pattern Grading & Lockstitch',
    'Python & Machine Learning Fundamentals',
    'AWS Cloud Architecture & Docker'
  ];

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 border text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top ${
          toastMsg.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-200' : 'bg-rose-950 border-rose-800 text-rose-200'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span className="font-semibold">{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight">CareerLoop</span>
            <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Industry & Employer Desk</span>
          </div>
        </Link>

        {/* Tab Navigation */}
        <div className="hidden md:flex bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs font-bold space-x-1">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'candidates' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Evaluation & Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Vacancies ({jobPostings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'companies' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Enterprises ({employers.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer hidden sm:block"
          >
            Register Enterprise
          </button>

          <button
            onClick={() => setShowPostModal(true)}
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Vacancy</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified State Skilling Outcome Pipeline (PS-135)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Industry Evaluation & Placement Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Evaluate verified vocational candidates, inspect authenticated state credentials with QR verification, extend job offers, or provide constructive feedback to eliminate industry skill gaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Registered Partners</span>
              <p className="text-2xl font-black text-white mt-1">{employers.length}</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Active Openings</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{jobPostings.length}</p>
            </div>
          </div>
        </div>

        {/* TAB 1: CANDIDATE PIPELINE & VERIFICATION */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            
            {/* Search & Filters */}
            <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or skill tag..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                >
                  <option value="All">All 36 Districts</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Aurangabad">Chhatrapati Sambhajinagar</option>
                  <option value="Thane">Thane</option>
                </select>

                <select
                  value={selectedTrade}
                  onChange={e => setSelectedTrade(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                >
                  <option value="All">All Trade Sectors</option>
                  <option value="EV">EV & Automotive</option>
                  <option value="CNC">CNC & Precision Machining</option>
                  <option value="Solar">Solar & Green Energy</option>
                  <option value="Apparel">Apparel & Garments</option>
                  <option value="Web">Web & Cloud Development</option>
                </select>
              </div>
            </div>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map((cand) => (
                <div 
                  key={cand.id} 
                  className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                          {(cand.full_name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition">
                            {cand.full_name || 'Candidate'}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 block">{cand.trainee_id}</span>
                        </div>
                      </div>

                      {cand.is_verified ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider flex items-center space-x-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>State Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-bold">
                          Pending Audit
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center text-slate-400 text-[11px]">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        <span>{cand.highest_education || 'Vocational Certified'}</span>
                      </div>
                      <div className="flex items-center text-slate-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        <span>{cand.district || 'Maharashtra'}</span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(cand.skills && cand.skills.length > 0 ? cand.skills : ['Apparel', 'Lockstitch', 'Quality']).slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] text-slate-300 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <button
                      onClick={() => openCandidateDossier(cand)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-800"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Inspect Dossier & Verify Certificate</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setOfferingCandidate(cand);
                          setOfferedRole('Junior Technical Trainee');
                          setOfferedSalary('22000');
                        }}
                        className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Offer Placement</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeclineCandidate(cand);
                          setSelectedMissingSkills([]);
                          setCustomMissingSkill('');
                        }}
                        className="py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>Decline w/ Feedback</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE JOB OPENINGS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span>Active Industry Postings</span>
              </h2>
              <button
                onClick={() => setShowPostModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post New Vacancy</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobPostings.map(job => (
                <div key={job.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                        {job.trade_category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {job.openings_count} Openings
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug">{job.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>{job.employers?.company_name || 'Verified Industry Partner'}</span>
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Stipend / Salary</span>
                      <span className="font-bold text-slate-200">₹{Number(job.min_salary).toLocaleString()} - ₹{Number(job.max_salary).toLocaleString()}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {job.location_district}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED ENTERPRISES */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Registered Industry Employers</span>
              </h2>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register Company</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employers.map(emp => (
                <div key={emp.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                      {emp.industry}
                    </span>
                    {emp.is_verified && (
                      <span className="text-emerald-400 text-[10px] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>State Approved</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{emp.company_name}</h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" /> {emp.district}, Maharashtra</p>
                    <p className="font-mono text-slate-400">{emp.contact_email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: INSPECT CANDIDATE DOSSIER & CERTIFICATE */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center">
                  {(selectedCandidate.full_name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCandidate.full_name}</h3>
                  <span className="text-xs font-mono text-blue-400">ID: {selectedCandidate.trainee_id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Education</span>
                <span className="font-bold text-white">{selectedCandidate.highest_education || 'ITI / Vocational'}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] block">District</span>
                <span className="font-bold text-white">{selectedCandidate.district || 'Pune'}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <span className="text-slate-400 text-xs font-bold block mb-1.5">Acquired Technical Competencies</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedCandidate.skills || ['EV Diagnostics', 'Safety Protocols', 'CNC Machining']).map((s: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* State Certificates */}
            <div className="space-y-2">
              <span className="text-slate-400 text-xs font-bold flex items-center justify-between">
                <span>Verified State Certificates</span>
                <span className="font-mono text-amber-400 text-[11px]">{candidateCertificates.length} Recorded</span>
              </span>

              {loadingCerts ? (
                <div className="py-4 text-center text-xs text-slate-500">Loading verified credentials...</div>
              ) : candidateCertificates.length === 0 ? (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                  No state certifications issued yet for this trainee.
                </div>
              ) : (
                <div className="space-y-2">
                  {candidateCertificates.map(c => (
                    <div key={c.id} className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.training_programs?.title || 'Vocational Credential'}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          {c.grade || 'Grade A'}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-amber-400">Certificate ID: {c.certificate_id}</p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Issued: {c.certified_date || 'Recent'}</span>
                        <a 
                          href={`/verify/${c.certificate_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center space-x-0.5 font-bold"
                        >
                          <span>Verify Public Registry</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: DECLINE CANDIDATE WITH CONSTRUCTIVE SKILL FEEDBACK */}
      {declineCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-rose-900/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Decline with Constructive Feedback</h3>
                  <p className="text-[11px] text-slate-400">Target: {declineCandidate.full_name || declineCandidate.trainee_id}</p>
                </div>
              </div>
              <button onClick={() => setDeclineCandidate(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeclineWithFeedback} className="space-y-4 text-xs">
              
              {/* Primary Decline Reason */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Primary Reason for Rejection *</label>
                <select
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
                >
                  <option value="Lack of Hands-on Practical Lab Experience">Lack of Hands-on Practical Lab Experience</option>
                  <option value="Missing Specific Technical Framework / Tool">Missing Specific Technical Framework / Tool</option>
                  <option value="Trade Assessment Score Below 75% Threshold">Trade Assessment Score Below 75% Threshold</option>
                  <option value="Shift & Industrial Location Constraints">Shift & Industrial Location Constraints</option>
                  <option value="Salary Expectation Out of Budget">Salary Expectation Out of Budget</option>
                  <option value="Communication & Technical English Skills Needed">Communication & Technical English Skills Needed</option>
                </select>
              </div>

              {/* Missing Skills Checkboxes */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">Missing Skills / Competencies Needed (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                  {popularSkillsPool.map(skill => {
                    const isSelected = selectedMissingSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleMissingSkill(skill)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' 
                            : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span className="truncate">{skill}</span>
                        {isSelected && <Check className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Missing Skill Input */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Add Specific Missing Skill (Custom)</label>
                <input
                  type="text"
                  value={customMissingSkill}
                  onChange={e => setCustomMissingSkill(e.target.value)}
                  placeholder="e.g. Mastercam 5-Axis Milling, Kubernetes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600"
                />
              </div>

              {/* Recommended Course / Bridge Action */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Recommended Upskilling Course *</label>
                <select
                  value={suggestedCourse}
                  onChange={e => setSuggestedCourse(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none"
                >
                  <option value="NPTEL: Electric Vehicles and Powertrains (IIT Madras)">NPTEL: Electric Vehicles and Powertrains (IIT Madras)</option>
                  <option value="Swayam: CNC Machining and Precision Metrology (IIT Kanpur)">Swayam: CNC Machining and Precision Metrology (IIT Kanpur)</option>
                  <option value="NPTEL: Solar Energy Engineering and Technology (IIT Delhi)">NPTEL: Solar Energy Engineering (IIT Delhi)</option>
                  <option value="NPTEL: Cloud Computing and Distributed Systems (IIT Roorkee)">NPTEL: Cloud Computing & Systems (IIT Roorkee)</option>
                  <option value="Retake Trade Skill Quiz on CareerLoop with 85%+ score">Retake Trade Skill Quiz on CareerLoop with 85%+ score</option>
                </select>
              </div>

              {/* Constructive Employer Notes */}
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Constructive Message to Trainee</label>
                <textarea
                  rows={2}
                  value={employerNotes}
                  onChange={e => setEmployerNotes(e.target.value)}
                  placeholder="e.g. We encourage you to complete the recommended course above and reapply for our next quarter intake."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeclineCandidate(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDecline}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingDecline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Dispatch Feedback to Trainee</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SEND PLACEMENT / APPRENTICESHIP OFFER */}
      {offeringCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-emerald-800/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Extend Placement Offer</h3>
              </div>
              <button onClick={() => setOfferingCandidate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Candidate</label>
                <p className="font-bold text-white text-sm">{offeringCandidate.full_name} ({offeringCandidate.trainee_id})</p>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Offered Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={offeredRole}
                  onChange={e => setOfferedRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Monthly Stipend / Salary (₹) *</label>
                <input
                  type="number"
                  required
                  value={offeredSalary}
                  onChange={e => setOfferedSalary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOfferingCandidate(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                >
                  {submittingOffer ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Dispatch Official Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: REGISTER EMPLOYER */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register Employer Enterprise</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterEmployer} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={empForm.company_name}
                  onChange={e => setEmpForm({ ...empForm, company_name: e.target.value })}
                  placeholder="e.g. Cummins India Industrial Division"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={empForm.industry}
                    onChange={e => setEmpForm({ ...empForm, industry: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Operating District</label>
                  <input
                    type="text"
                    value={empForm.district}
                    onChange={e => setEmpForm({ ...empForm, district: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Official HR / Recruitment Email</label>
                <input
                  type="email"
                  required
                  value={empForm.contact_email}
                  onChange={e => setEmpForm({ ...empForm, contact_email: e.target.value })}
                  placeholder="careers@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registeringEmp}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                >
                  {registeringEmp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>Register Company</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: POST VACANCY */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Post New Job / Apprenticeship Opening</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Solar PV Rooftop Stringing Lead"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Trade Category</label>
                  <select
                    value={jobForm.trade_category}
                    onChange={e => setJobForm({ ...jobForm, trade_category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Green Energy">Green Energy / Solar</option>
                    <option value="Automotive">Automotive / EV</option>
                    <option value="Manufacturing">Manufacturing / CNC</option>
                    <option value="Apparel">Apparel & Garments</option>
                    <option value="Electrical">Electrical Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Number of Openings</label>
                  <input
                    type="number"
                    value={jobForm.openings_count}
                    onChange={e => setJobForm({ ...jobForm, openings_count: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Min Salary (₹)</label>
                  <input
                    type="number"
                    value={jobForm.min_salary}
                    onChange={e => setJobForm({ ...jobForm, min_salary: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Max Salary (₹)</label>
                  <input
                    type="number"
                    value={jobForm.max_salary}
                    onChange={e => setJobForm({ ...jobForm, max_salary: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                >
                  {savingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Briefcase className="w-3.5 h-3.5" />}
                  <span>Publish Vacancy</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 CareerLoop Industry Placement Portal • Maharashtra State Skill Development Mission</p>
      </footer>
    </div>
  );
}
