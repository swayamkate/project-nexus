import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nexus',
  description: 'Detailed privacy policy for the Nexus Skilling Platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Last Updated: August 26, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you use the Nexus platform (the "Service"), we collect information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device ("Personal Information"). We collect this information from you directly when you provide it to us, and automatically when you use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, maintain, and improve our longitudinal tracking services.</li>
              <li>To verify self-employment and generate accurate wage progression graphs.</li>
              <li>To communicate with you, including sending WhatsApp webhook surveys and notifications.</li>
              <li>To enforce our terms, conditions, and policies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Zero-PII & K-Anonymity Data Sharing</h2>
            <p>
              We prioritize your privacy. All analytical data shared with government bodies or administrative dashboards is anonymized using k-anonymity protocols ($k \ge 5$). Personally Identifiable Information (PII) such as your Aadhaar number is heavily masked and stored using secure cryptographic hashes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Security of Your Data</h2>
            <p>
              We implement industry-standard security measures including Row Level Security (RLS) in our PostgreSQL databases and TLS encryption for data in transit to protect your Personal Information from unauthorized access, use, or disclosure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
