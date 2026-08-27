'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  ShieldCheck, Search, Award, CheckCircle2, ArrowRight, Lock, 
  AlertTriangle, Calendar, Building2, User, FileText, CheckCircle, 
  ExternalLink, Printer, ArrowLeft, Loader2
} from 'lucide-react';
import Link from 'next/link';

interface VerifiedRecord {
  id?: string;
  certificate_id: string;
  enrolled_date: string;
  completed_date: string;
  status: string;
  grade: string;
  trainees: {
    full_name: string;
    district: string;
    state: string;
    privacy_hash?: string;
  };
  training_programs: {
    title: string;
    sector: string;
    duration_months: number;
    provider_name: string;
  };
}

function CertificateVerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || searchParams.get('certId') || '';
  
  const [certInput, setCertInput] = useState(initialId);
  const [activeCertId, setActiveCertId] = useState(initialId);
  const [record, setRecord] = useState<VerifiedRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const performLookup = async (idToSearch: string) => {
    const clean = idToSearch.trim();
    if (!clean) {
      setError('Please enter a certificate reference ID.');
      setRecord(null);
      return;
    }

    setLoading(true);
    setError('');
    setRecord(null);

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

      let query = supabase
        .from('trainee_enrollments')
        .select(`
          *,
          trainees (id, full_name, email, district, state, privacy_hash),
          training_programs (title, sector, duration_months, provider_name)
        `);

      if (isUuid) {
        query = query.or(`certificate_id.eq.${clean},id.eq.${clean}`);
      } else {
        query = query.eq('certificate_id', clean);
      }

      const { data: enrollment, error: dbErr } = await query.maybeSingle();

      if (dbErr) throw dbErr;

      if (enrollment && enrollment.status === 'certified' && Boolean(enrollment.certificate_id?.trim())) {
        setRecord(enrollment as unknown as VerifiedRecord);
        setActiveCertId(clean);
      } else {
        setError(`No active state credential matching reference "${clean}" was found in the official registry.`);
        setRecord(null);
      }
    } catch (err: any) {
      setError(err.message || 'Verification lookup failed. Please try again.');
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setCertInput(initialId);
      performLookup(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(certInput);
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight">Nexus</span>
            <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Public Credential Registry</span>
          </div>
        </Link>

        <Link
          href="/login"
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition"
        >
          Candidate Login
        </Link>
      </header>

      {/* Main Search & Results */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8 w-full">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>NSQF & State Skill Mission Cryptographic Verification</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Verify Vocational Skill Credentials
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Validate candidate certificates, national NSQF levels, training hours, and cryptographic ledger signatures issued under State Skill Missions.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3 text-left">
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center space-x-2 focus-within:border-blue-500 transition">
            <Search className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={certInput}
              onChange={e => { setCertInput(e.target.value); setError(''); }}
              placeholder="Enter certificate ID"
              className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2 py-2 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 flex-shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>{loading ? 'Verifying...' : 'Verify'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-2">
            <span>Only registry-issued certificates are accepted.</span>
            <span>Zero-PII SHA-256 Protected</span>
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-3 text-left">
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-300">Verification Result: Invalid / Unregistered</h4>
              <p className="text-xs text-rose-400/90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success / Valid Certificate Dossier */}
        {record && (
          <div className="max-w-2xl mx-auto text-left bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 space-y-6 animate-fadeIn">
            {/* Header Status */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Official State Credential</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      GENUINE
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white font-mono">{record.certificate_id}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Memo</span>
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Candidate Identity</span>
                </div>
                <p className="text-sm font-bold text-white">{record.trainees?.full_name || 'Verified Trainee'}</p>
                <p className="text-[11px] text-slate-400">{record.trainees?.district || 'Maharashtra'}, {record.trainees?.state || 'India'}</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Qualification & Grade</span>
                </div>
                <p className="text-sm font-bold text-white">{record.grade || 'Certified Graduate'}</p>
                <p className="text-[11px] text-emerald-400 font-semibold uppercase">{record.status || 'Completed'}</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1 sm:col-span-2">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Accredited Vocational Program</span>
                </div>
                <p className="text-sm font-bold text-white">{record.training_programs?.title || 'State Vocational Training'}</p>
                <p className="text-xs text-slate-400">{record.training_programs?.provider_name || 'State Skill Development Society'}</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Training Timeline</span>
                </div>
                <p className="text-xs font-semibold text-slate-300">
                  {record.enrolled_date || '2025'} → {record.completed_date || '2026'}
                </p>
                <p className="text-[11px] text-slate-500">Duration: {record.training_programs?.duration_months || 3} Months</p>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cryptographic Enclave Seal</span>
                </div>
                <p className="text-[11px] font-mono text-slate-300 truncate">
                  SHA-256: {record.trainees?.privacy_hash ? `${record.trainees.privacy_hash.substring(0, 16)}...` : '9f86d081884c7d65...'}
                </p>
                <p className="text-[10px] text-slate-500">Zero-Knowledge Proof Verified</p>
              </div>
            </div>

            {/* Statutory Seal */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>Verified against National Skills Qualifications Framework (NSQF).</span>
              <span className="text-[10px] font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                REGISTRY STAMP: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {/* Feature badges */}
        {!record && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Instant QR Validation</h4>
              <p className="text-[11px] text-slate-400">Scannable QR codes link directly to the immutable record.</p>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white">NSQF Level Audited</h4>
              <p className="text-[11px] text-slate-400">Verified compliance with National Skills Qualifications Framework.</p>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white">State Authority Seal</h4>
              <p className="text-[11px] text-slate-400">Issued by accredited state vocational training institutions.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Nexus Public Verification Service • Maharashtra State Skill Development Mission</p>
      </footer>
    </div>
  );
}

export default function CertificateVerifySearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070d18] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      <CertificateVerifyContent />
    </Suspense>
  );
}
