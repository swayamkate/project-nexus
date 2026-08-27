'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, Award, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CertificateVerifySearchPage() {
  const [certInput, setCertInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = certInput.trim().toUpperCase();
    if (!clean) {
      setError('Please enter a certificate reference ID.');
      return;
    }
    router.push(`/verify/${encodeURIComponent(clean)}`);
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

      {/* Main Search */}
      <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
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

        {/* Form */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-4 text-left">
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center space-x-2 focus-within:border-blue-500 transition">
            <Search className="w-5 h-5 text-slate-500 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={certInput}
              onChange={e => { setCertInput(e.target.value); setError(''); }}
              placeholder="e.g. CERT-2026-849201"
              className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2 py-2 font-mono uppercase"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 flex-shrink-0 cursor-pointer"
            >
              <span>Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {error && <p className="text-xs text-rose-400 font-semibold pl-2">{error}</p>}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-2">
            <span>Sample reference: <button type="button" onClick={() => setCertInput('CERT-2026-849201')} className="text-blue-400 underline font-mono cursor-pointer">CERT-2026-849201</button></span>
            <span>Zero-PII SHA-256 Protected</span>
          </div>
        </form>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 text-left">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Nexus Public Verification Service • Maharashtra State Skill Development Mission</p>
      </footer>
    </div>
  );
}
