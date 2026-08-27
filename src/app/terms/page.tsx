import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MahaSkill Track',
  description: 'Terms of service, statutory compliance, and verification rules for the Maharashtra Skilling Registry.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#040812] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MahaSkill Track Portal</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Terms of Service & Usage Governance</h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-0.5">Maharashtra State Skill Development Society</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-8 border-b border-slate-800 pb-4">
          Last Updated: August 27, 2026 • Statutory Terms for Vocational Tracking & Enterprise Grants
        </p>

        <div className="space-y-8 text-xs sm:text-sm leading-relaxed">
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>1. Acceptance & Statutory Framework</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              By registering on or accessing MahaSkill Track, you agree to comply with these terms, the National Skills Qualification Framework (NSQF) guidelines, and the rules framed under the Maharashtra State Skill Development Mission. If you do not agree, you may not use the services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. Trainee Responsibilities & Account Security</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>You agree to provide true, accurate, and verifiable information regarding your vocational training background, current employment status, and earnings.</li>
              <li>You are solely responsible for maintaining the confidentiality of your authentication credentials (password and 6-digit OTP codes).</li>
              <li>Impersonation of another trainee or fraudulent claim of certifications is strictly prohibited and subject to legal prosecution under the IT Act 2000.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Document Uploads, Udyam & GST Verification</h2>
            <p className="text-slate-400">
              When submitting salary slips, offer letters, Udyam registration certificates, or GST returns for employment verification or PMEGP grant eligibility, you certify under penalty of perjury that all uploaded artifacts are authentic and unaltered. All uploads are digitally stamped and subject to random field audit by District Skill Officers.
            </p>
          </section>

          <section id="data-retention" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>4. Data Retention & Longitudinal Survey Obligations</span>
            </h2>
            <p className="text-slate-400">
              To measure the longitudinal socioeconomic return of government skilling expenditure, trainees agree to participate in brief milestone surveys at 3, 6, 12, 18, and 24 months post-completion. Anonymized statistical records are preserved in audit ledgers for 7 years to facilitate state policy planning.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Disclaimer & System Availability</h2>
            <p className="text-slate-400">
              While MSSDS maintains high-availability cloud infrastructure with automated daily backups, access is provided on an "as available" basis during scheduled state maintenance windows.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
