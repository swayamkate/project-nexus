import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Nexus',
  description: 'Detailed terms and conditions for using Nexus.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-8">Last Updated: August 26, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Nexus, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. User Accounts & Security</h2>
            <p>
              When you create an account, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Document Uploads and Verification</h2>
            <p>
              When uploading documents for self-employment verification (e.g., GST certificates, Trade Licenses), you affirm that the documents are authentic and legally obtained. Falsifying documents may result in immediate suspension and notification to relevant administrative authorities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p>
              In no event shall Nexus, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
