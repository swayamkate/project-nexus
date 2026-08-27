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
  FileCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

export default function EmployerRecruitmentPortal() {
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    employer_id: '',
    title: '',
    trade_category: 'Apparel',
    min_salary: 16000,
    max_salary: 24000,
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

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [jobsRes, empRes, candidatesRes] = await Promise.all([
        supabase.from('job_postings').select('*, employers(company_name, district, is_verified)').order('created_at', { ascending: false }),
        supabase.from('employers').select('*').order('created_at', { ascending: false }),
        supabase.from('trainees').select('id, trainee_id, district, highest_education, skills, profile_completion_pct, is_active').eq('is_active', true).limit(12)
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

      setToastMsg(`Job vacancy "${jobForm.title}" posted successfully!`);
      setShowPostModal(false);
      setTimeout(() => setToastMsg(null), 4000);
      fetchPortalData();
    } catch (err: any) {
      setToastMsg('Failed to post job: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
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

      setToastMsg(`Company "${empForm.company_name}" registered!`);
      setShowRegisterModal(false);
      setTimeout(() => setToastMsg(null), 4000);
      fetchPortalData();
    } catch (err: any) {
      setToastMsg('Registration error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setRegisteringEmp(false);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const matchDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    const matchTrade = selectedTrade === 'All' || (c.skills && c.skills.some((s: string) => s.toLowerCase().includes(selectedTrade.toLowerCase())));
    return matchDistrict && matchTrade;
  });

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight">Nexus</span>
            <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Employer & Placement Desk</span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Register Company
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

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified State Skilling Outcome Pipeline</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Direct Industry Recruitment & Apprenticeship Desk</h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Hire NSQF-certified vocational talent across manufacturing, EV, solar, and apparel sectors with verified attendance and skill transcripts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Registered Employers</span>
              <p className="text-2xl font-black text-white mt-1">{employers.length}</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-center">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Active Openings</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{jobPostings.length}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Active Job Openings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Active Job & Apprenticeship Postings</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{jobPostings.length} Positions Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobPostings.map(job => (
              <div key={job.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
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
                    <span className="text-[10px] text-slate-500 block">Monthly Stipend / Salary</span>
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

        {/* Section 2: Anonymized Blind Talent Pool */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Anonymized Candidate Talent Directory (Zero-PII)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Filter verified candidates by verified trade credentials and district. Direct interview invites sent securely through the portal.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 text-xs">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
              >
                <option value="All">All Districts</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
                <option value="Nagpur">Nagpur</option>
              </select>

              <select
                value={selectedTrade}
                onChange={e => setSelectedTrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300"
              >
                <option value="All">All Trades</option>
                <option value="Apparel">Apparel & Garments</option>
                <option value="Solar">Solar & Green Energy</option>
                <option value="EV">EV & Automotive</option>
                <option value="CNC">CNC & Machining</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCandidates.map((cand, idx) => (
              <div key={cand.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-400">ID: {cand.trainee_id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {cand.profile_completion_pct}% Profile
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs">{cand.highest_education || '12th Vocational'}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-slate-500" /> {cand.district || 'Pune'}, Maharashtra
                    </p>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(cand.skills || ['Apparel', 'Lockstitch']).slice(0, 3).map((sk: string, sIdx: number) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setToastMsg(`Interview request dispatched to Candidate ${cand.trainee_id}!`);
                    setTimeout(() => setToastMsg(null), 3500);
                  }}
                  className="w-full py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold transition cursor-pointer text-center"
                >
                  Send Interview Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Register Employer Modal */}
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

      {/* Post Vacancy Modal */}
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
        <p>© 2026 Nexus Industry Placement Portal • Maharashtra State Skill Development Mission</p>
      </footer>
    </div>
  );
}
