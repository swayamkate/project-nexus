import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Download, Trash2, Mail, Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Deletion | MahaSkill Track',
  description: 'Official Privacy Policy, Zero-PII Enclave Guarantees & Data Deletion Process for Maharashtra Skilling Registry.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#040812] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MahaSkill Track Portal</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Privacy Policy & Data Rights</h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-0.5">Government of Maharashtra • Zero-PII Enclave</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-8 border-b border-slate-800 pb-4">
          Last Updated: August 27, 2026 | Effective for all 36 Maharashtra Districts
        </p>

        <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>1. Zero-PII Architecture & Cryptographic Tokenization</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              MahaSkill Track operates under a strict **Zero-PII (Personally Identifiable Information) Enclave**. Sensitive data attributes—such as Aadhaar identification numbers and primary contact identifiers—are transformed using one-way SHA-256 cryptographic hashing prior to storage. Government executive dashboards and district evaluators only interact with masked representations and aggregated k-anonymity statistical views (\(k \ge 5\)).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. Information Collected & Purpose</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Vocational Credentials:</strong> NSQF course completion records, trainer assessment scores, and practical skill proficiencies.</li>
              <li><strong className="text-slate-200">Longitudinal Career Milestones:</strong> 3, 6, 12, 18, and 24-month post-training employment status and verified wage progression curves.</li>
              <li><strong className="text-slate-200">MSME & Enterprise Data:</strong> Udyam registration numbers, GSTIN identifiers, employee headcount, and business establishment records for PMEGP/Mudra grant compliance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Data Sharing & Inter-Departmental Protocols</h2>
            <p className="text-slate-400">
              Your skilling and employment data is never sold, leased, or monetized. Data access is restricted strictly to authorized government agencies (MSSDS, Directorate of Vocational Education & Training, and verified hiring partners) under verified Row Level Security (RLS) policies.
            </p>
          </section>

          {/* Dedicated Data Deletion & Privacy Dossier Section */}
          <section id="data-deletion" className="bg-blue-950/20 border border-blue-900/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">4. User Rights: Data Export & Complete Deletion Instructions</h2>
            </div>

            <p className="text-slate-300">
              In compliance with India's Digital Personal Data Protection Act (DPDPA 2023), every trainee holds the fundamental right to access, export, or permanently erase their personal data dossier.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                  <Download className="w-4 h-4" />
                  <span>Instant Dossier Download</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Log into your Trainee Dashboard, navigate to <strong>Settings & Security</strong>, and click <strong>"Export Zero-PII Data Dossier (JSON)"</strong> to download a full portable copy of all your records.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-xs">
                  <Trash2 className="w-4 h-4" />
                  <span>Right to Be Forgotten (Purge)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  To request complete deletion of your profile, email <strong className="text-slate-200">privacy@mahaskill.gov.in</strong> or use the in-app support widget with subject <em>"Data Purge Request"</em>. Requests are executed within 48 hours.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-800 pt-6">
            <h2 className="text-base font-bold text-white mb-2">5. Data Protection Officer (DPO) Contact</h2>
            <p className="text-slate-400">
              For any privacy inquiries or grievance redressals:
            </p>
            <div className="mt-2 text-xs text-slate-300 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
              Grievance Officer: Office of the Chief Technology Officer, MSSDS<br />
              Email: grievance@mahaskill.gov.in | Phone: 1800-120-8040 (Toll-Free)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
