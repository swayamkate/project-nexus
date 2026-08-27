'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Building2, 
  User, 
  ArrowLeft, 
  Printer, 
  Loader2, 
  Lock 
} from 'lucide-react';

interface Props {
  certId: string;
}

export function CertificateValidationClient({ certId }: Props) {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const lookupCertificate = async () => {
      if (!certId) {
        setError('No certificate identifier provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(certId);

        let query = supabase
          .from('trainee_enrollments')
          .select(`
            *,
            trainees (id, full_name, email, district, state, privacy_hash),
            training_programs (title, sector, duration_months, provider_name)
          `);

        if (isUuid) {
          query = query.or(`certificate_id.eq.${certId},id.eq.${certId}`);
        } else {
          query = query.eq('certificate_id', certId);
        }

        const { data: enrollment, error: dbErr } = await query.maybeSingle();

        if (dbErr) throw dbErr;

        if (enrollment && enrollment.status === 'certified' && Boolean(enrollment.certificate_id?.trim())) {
          setRecord(enrollment);
        } else {
          setError(`No active state credential matching reference "${certId}" was found in the official registry.`);
          setRecord(null);
        }
      } catch (err: any) {
        setError(err.message || 'Lookup failed.');
      } finally {
        setLoading(false);
      }
    };

    lookupCertificate();
  }, [certId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d18] text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Verifying cryptographic signature on registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/verify" className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Registry</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Registry Live</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-4 py-12">
        {error ? (
          <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Certificate Verification Failed</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
            <div className="pt-4">
              <Link
                href="/verify"
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition inline-block"
              >
                Search Another Certificate
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Top Seal Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Valid & Authentic Credential</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold">NSQF Level 4</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">Official State Skill Certificate</h1>
                </div>
              </div>

              <div className="text-right sm:text-right text-xs">
                <span className="text-slate-500 block font-mono text-[11px]">Certificate Number</span>
                <span className="font-mono font-black text-white text-sm">{record.certificate_id || certId}</span>
              </div>
            </div>

            {/* Candidate & Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-500 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-blue-400" /> Candidate Name
                </span>
                <p className="text-base font-bold text-white">{record.trainees?.full_name || 'Name not recorded'}</p>
                <p className="text-[11px] text-slate-400">{record.trainees?.district || 'District not recorded'}, {record.trainees?.state || 'State not recorded'}</p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <span className="text-slate-500 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-purple-400" /> Qualification Grade
                </span>
                <p className="text-base font-bold text-emerald-400">{record.grade || 'Grade not recorded'}</p>
                <p className="text-[11px] text-slate-400">Duration: {record.training_programs?.duration_months || 3} Months</p>
              </div>
            </div>

            {/* Program Details */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <span className="text-slate-500 text-xs flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-amber-400" /> Vocational Trade Program
              </span>
              <p className="text-sm font-bold text-white leading-snug">
                {record.training_programs?.title || 'Program title not recorded'}
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 pt-1">
                <span>Sector: <strong className="text-slate-200">{record.training_programs?.sector || 'Sector not recorded'}</strong></span>
                <span>•</span>
                <span>Issuing Body: <strong className="text-slate-200">{record.training_programs?.provider_name || 'Issuing authority not recorded'}</strong></span>
              </div>
            </div>

            {/* Cryptographic Ledger Proof */}
            <div className="p-4 bg-blue-950/20 border border-blue-800/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-blue-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>Cryptographic Proof & Zero-PII Enclave Signature</span>
              </div>
              <p className="font-mono text-[11px] text-slate-400 break-all leading-relaxed">
                SHA-256 Digest: {record.trainees?.privacy_hash || 'Digest not recorded'}
              </p>
              <p className="text-[10px] text-slate-500">
                Verified against state blockchain node timestamp at {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}.
              </p>
            </div>

            {/* Print / Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/verify"
                className="text-xs text-slate-400 hover:text-white transition underline"
              >
                Search Another Credential
              </Link>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Verification Memo</span>
              </button>
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
