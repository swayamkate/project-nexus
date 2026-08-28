'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function ApiDocumentationPage() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('public');

  const copyToClipboard = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const endpoints = [
    {
      group: 'Public Credential Verification & Health',
      id: 'public',
      items: [
        {
          method: 'GET',
          path: '/api/health',
          desc: 'System health, database latency, and zero-PII enclave diagnostics',
          response: `{\n  "status": "healthy",\n  "app": "Nexus",\n  "version": "2.0.0",\n  "services": {\n    "database": { "status": "operational", "provider": "Supabase PostgreSQL 17" },\n    "zero_pii_enclave": { "status": "operational", "algorithm": "SHA-256" }\n  }\n}`
        },
        {
          method: 'GET',
          path: '/verify/[certId]',
          desc: 'Public verification endpoint for QR code scan validation',
          response: `{\n  "certificate_id": "CERT-2026-849201",\n  "status": "VALID & AUTHENTIC",\n  "nsqf_level": 4,\n  "candidate_name": "Avishkar Kedar",\n  "issuing_authority": "Maharashtra State Skill Development Society"\n}`
        }
      ]
    },
    {
      group: 'Longitudinal Tracking & Automation Cron',
      id: 'cron',
      items: [
        {
          method: 'GET',
          path: '/api/cron/milestones',
          desc: 'Automated scheduler calculating M+3 to M+24 due surveys and dispatching alerts',
          response: `{\n  "success": true,\n  "processed": {\n    "surveysDue": 4,\n    "notificationsDispatched": 4\n  }\n}`
        }
      ]
    },
    {
      group: 'Government Schemes & MSME Subsidies',
      id: 'schemes',
      items: [
        {
          method: 'POST',
          path: '/api/schemes/apply',
          desc: 'Submit application for PMEGP, Mudra, or CMEGP capital subsidy grants',
          response: `{\n  "application_no": "SCH-2026-58291",\n  "status": "submitted",\n  "requested_amount": 100000,\n  "subsidy_pct": 35\n}`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight">Nexus API</span>
            <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">OpenAPI 3.0 Specification</span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-mono font-bold">
            v2.0.0 Production
          </span>
          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition"
          >
            Back to Portal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-4 py-12 space-y-8">
        
        {/* Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>State Digital Public Infrastructure (DPI) API Gateway</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Developer API & Gateway Documentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Standardized REST endpoints for third-party government state portals, employer recruitment management systems, and longitudinal survey workers.
          </p>
        </div>

        {/* Base URL Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Base Production URL:</span>
            <code className="bg-slate-950 px-3 py-1 rounded-lg text-emerald-400 font-mono font-bold">
              https://sih2026.avishkark.in
            </code>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>TLS 1.3 • Bearer JWT Authenticated</span>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-6">
          {endpoints.map((group) => (
            <div key={group.id} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{group.group}</span>
              </h2>

              <div className="space-y-4">
                {group.items.map((ep, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-black ${
                          ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-xs font-mono font-bold text-white">{ep.path}</code>
                      </div>

                      <button
                        onClick={() => copyToClipboard(`https://sih2026.avishkark.in${ep.path}`, ep.path)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedPath === ep.path ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPath === ep.path ? 'Copied' : 'Copy Endpoint'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{ep.desc}</p>

                    {/* Code Sample */}
                    <div className="bg-[#050912] rounded-xl p-3 border border-slate-800/60 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <div className="text-slate-500 text-[10px] pb-1 uppercase font-bold">Sample Response</div>
                      <pre>{ep.response}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Nexus Open API Gateway • Maharashtra State Skill Development Mission</p>
      </footer>
    </div>
  );
}
