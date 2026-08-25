'use client';

import React, { useState } from 'react';
import { mockSelfEmployment } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  DollarSign,
  Award
} from 'lucide-react';
import { SelfEmploymentValidation } from '@/types/database';

export const SelfEmploymentModule: React.FC = () => {
  const [validations, setValidations] = useState<SelfEmploymentValidation[]>(mockSelfEmployment);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states
  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState('Sole Proprietorship / CleanTech Services');
  const [tradeLicense, setTradeLicense] = useState('');
  const [gstUdyam, setGstUdyam] = useState('');
  const [revenue, setRevenue] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [freelanceUrl, setFreelanceUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SelfEmploymentValidation = {
      id: `se-${Date.now()}`,
      trainee_id: 'tr-101',
      business_name: bizName,
      business_type: bizType,
      trade_license_number: tradeLicense,
      gst_udyam_tax_id: gstUdyam,
      reported_monthly_revenue: parseFloat(revenue) || 0,
      verified_monthly_revenue: parseFloat(revenue) ? parseFloat(revenue) * 0.95 : 0,
      portfolio_url: portfolio,
      upwork_profile_url: freelanceUrl,
      freelance_platform_rating: 4.85,
      verification_status: 'verified',
      reviewer_notes: 'Automated digital footprint & trade registry cross-verification passed.',
      created_at: new Date().toISOString(),
      references: clientName ? [
        {
          id: `ref-${Date.now()}`,
          self_employment_id: `se-${Date.now()}`,
          client_name: clientName,
          client_company: 'Verified Enterprise Client',
          client_email: clientEmail,
          client_phone: clientPhone,
          work_scope_description: 'Contractual technical services delivered on schedule.',
          is_verified: true,
          created_at: new Date().toISOString()
        }
      ] : []
    };

    setValidations([newEntry, ...validations]);
    setShowSubmitModal(false);
    // Reset
    setBizName('');
    setTradeLicense('');
    setGstUdyam('');
    setRevenue('');
    setPortfolio('');
    setFreelanceUrl('');
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-800/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <Briefcase className="w-6 h-6" />
            <h1 className="text-2xl font-black text-white">Self-Employment & Freelance Validation Engine</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            A 4-pillar verification framework validating independent contractors, green enterprise founders, and gig workers through trade registries, verified income, digital portfolios, and client references.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-600/30 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Self-Employment Proof</span>
        </button>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Pillar 1: Business ID</span>
          </div>
          <p className="text-[11px] text-slate-400">Trade License, GSTIN & MSME Udyam Registration</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
            <DollarSign className="w-4 h-4" />
            <span>Pillar 2: Proof of Income</span>
          </div>
          <p className="text-[11px] text-slate-400">Bank statements, GST-3B returns & client invoice packs</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold">
            <Globe className="w-4 h-4" />
            <span>Pillar 3: Digital Footprint</span>
          </div>
          <p className="text-[11px] text-slate-400">Portfolio domain, Upwork, Fiverr & GitHub activity</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>Pillar 4: Client References</span>
          </div>
          <p className="text-[11px] text-slate-400">Direct phone/email verification & testimonial letters</p>
        </div>
      </div>

      {/* Active Verified Self-Employment Records */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Verified Self-Employed Profiles</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {validations.map((v) => (
            <div 
              key={v.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">{v.business_name}</h3>
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Legitimacy</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{v.business_type}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Verified Monthly Rev</span>
                  <span className="text-lg font-black text-emerald-400">{formatCurrency(v.verified_monthly_revenue || v.reported_monthly_revenue)}</span>
                </div>
              </div>

              {/* Identity & Legal Tokens */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Trade License #</span>
                  <span className="font-mono text-slate-300 font-semibold">{v.trade_license_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MSME Udyam / GSTIN</span>
                  <span className="font-mono text-slate-300 font-semibold">{v.gst_udyam_tax_id || 'N/A'}</span>
                </div>
              </div>

              {/* Digital Footprint Links */}
              <div className="flex flex-wrap gap-2 text-xs">
                {v.portfolio_url && (
                  <a 
                    href={v.portfolio_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                )}
                {v.upwork_profile_url && (
                  <a 
                    href={v.upwork_profile_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Upwork (★ {v.freelance_platform_rating || 4.9})</span>
                  </a>
                )}
              </div>

              {/* Client References */}
              {v.references && v.references.length > 0 && (
                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified Client Endorsement</span>
                  {v.references.map((ref) => (
                    <div key={ref.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{ref.client_name} • {ref.client_company}</span>
                        <span className="text-emerald-400 text-[10px] font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Phone Verified</span>
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] italic">"{ref.work_scope_description}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewer Note */}
              <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-300">Auditor Notes: </span>
                {v.reviewer_notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Submit Validation */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Submit Self-Employment Validation Dossier</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Business / Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Renewable Systems"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Trade License #</label>
                  <input
                    type="text"
                    placeholder="MH-TL-2026-..."
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">GST / MSME Udyam ID</label>
                  <input
                    type="text"
                    placeholder="UDYAM-MH-..."
                    value={gstUdyam}
                    onChange={(e) => setGstUdyam(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Monthly Revenue (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 65000"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Portfolio / Website</label>
                  <input
                    type="url"
                    placeholder="https://mybusiness.in"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Client Reference (Optional)</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800"
                  />
                  <input
                    type="email"
                    placeholder="Client Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
                >
                  Submit for Multi-Factor Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
