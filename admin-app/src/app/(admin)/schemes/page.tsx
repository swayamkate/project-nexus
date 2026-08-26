'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Landmark, 
  Plus, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Loader2, 
  Building2, 
  TrendingUp, 
  ArrowUpRight,
  X,
  Send,
  PieChart
} from 'lucide-react';

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [disburseModalScheme, setDisburseModalScheme] = useState<any | null>(null);
  const [disburseAmount, setDisburseAmount] = useState('');
  const [disburseBeneficiary, setDisburseBeneficiary] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Scheme Form State
  const [formData, setFormData] = useState({
    name: '',
    nodal_agency: 'Ministry of MSME / MSSDS',
    subsidy_pct: 35,
    max_grant_amount: 500000,
    allocated_budget: 50000000,
    target_trades: ['Tailoring & Garments', 'Solar & Electrical']
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('government_schemes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setSchemes(data);
    setLoading(false);
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('government_schemes').insert({
        ...formData,
        disbursed_budget: 0,
        beneficiaries_count: 0
      });
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'CREATE_GOVERNMENT_SCHEME',
        target_entity: 'GOVERNMENT_SCHEMES',
        details: `Launched ${formData.name} with ₹${(formData.allocated_budget / 10000000).toFixed(2)} Cr budget`,
        status: 'Success'
      });

      setToastMsg('Government Grant Scheme launched!');
      setShowModal(false);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchSchemes();
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDisburseGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disburseModalScheme || !disburseAmount) return;

    setSaving(true);
    try {
      const amt = Number(disburseAmount);
      const newDisbursed = Number(disburseModalScheme.disbursed_budget || 0) + amt;
      const newCount = Number(disburseModalScheme.beneficiaries_count || 0) + 1;

      const { error } = await supabase
        .from('government_schemes')
        .update({
          disbursed_budget: newDisbursed,
          beneficiaries_count: newCount
        })
        .eq('id', disburseModalScheme.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'DISBURSE_MSME_GRANT',
        target_entity: 'GOVERNMENT_SCHEMES',
        target_id: disburseModalScheme.id,
        details: `Disbursed ₹${amt.toLocaleString()} subsidy grant under ${disburseModalScheme.name} to ${disburseBeneficiary || 'Trainee Micro-Enterprise'}`,
        status: 'Success'
      });

      setToastMsg(`Disbursed grant of ₹${amt.toLocaleString()}!`);
      setDisburseModalScheme(null);
      setDisburseAmount('');
      setDisburseBeneficiary('');
      setTimeout(() => setToastMsg(null), 3500);
      await fetchSchemes();
    } catch (err: any) {
      alert('Disbursement failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalAllocated = schemes.reduce((acc, s) => acc + Number(s.allocated_budget || 0), 0);
  const totalDisbursed = schemes.reduce((acc, s) => acc + Number(s.disbursed_budget || 0), 0);
  const totalBeneficiaries = schemes.reduce((acc, s) => acc + Number(s.beneficiaries_count || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Government Schemes & Subsidy Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor PMEGP, Mudra, and Mahaswayam financial grants, capital subsidies, and district disbursements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Scheme</span>
        </button>
      </div>

      {/* 3 Macro Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Total Allocated State Budget</span>
          <p className="text-2xl font-black text-white">₹{(totalAllocated / 10000000).toFixed(2)} Cr</p>
          <span className="text-[11px] text-blue-400 font-semibold">Across {schemes.length} Active Grant Schemes</span>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Total Disbursed Subsidies</span>
          <p className="text-2xl font-black text-emerald-400">₹{(totalDisbursed / 10000000).toFixed(2)} Cr</p>
          <span className="text-[11px] text-emerald-400/80 font-semibold">
            {totalAllocated > 0 ? ((totalDisbursed / totalAllocated) * 100).toFixed(1) : '0'}% Budget Utilized
          </span>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Total Beneficiaries Funded</span>
          <p className="text-2xl font-black text-purple-400">{totalBeneficiaries.toLocaleString()}</p>
          <span className="text-[11px] text-purple-400/80 font-semibold">Self-Employed Micro-Units</span>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" /> Loading schemes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => {
            const pct = Math.min(100, Math.round((Number(scheme.disbursed_budget || 0) / Number(scheme.allocated_budget || 1)) * 100));

            return (
              <div 
                key={scheme.id}
                className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">
                      {scheme.subsidy_pct}% Capital Subsidy
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">Max ₹{(Number(scheme.max_grant_amount) / 100000).toFixed(1)}L Grant</span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">{scheme.name}</h3>
                  <p className="text-[11px] text-slate-400">Nodal Body: {scheme.nodal_agency}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Disbursed:</span>
                    <span className="font-bold text-white">₹{(Number(scheme.disbursed_budget || 0) / 100000).toFixed(1)}L / ₹{(Number(scheme.allocated_budget || 0) / 10000000).toFixed(2)}Cr</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{pct}% Disbursed</span>
                    <span>{scheme.beneficiaries_count || 0} Beneficiaries</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Direct DB Hook</span>
                  <button
                    onClick={() => setDisburseModalScheme(scheme)}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Disburse Grant</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Scheme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Launch Government Grant Scheme</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Scheme Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chief Minister Employment Generation Scheme (CMEGP)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nodal Department / Agency</label>
                <input
                  type="text"
                  required
                  value={formData.nodal_agency}
                  onChange={e => setFormData({ ...formData, nodal_agency: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subsidy (%)</label>
                  <input
                    type="number"
                    required
                    value={formData.subsidy_pct}
                    onChange={e => setFormData({ ...formData, subsidy_pct: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Max Grant (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.max_grant_amount}
                    onChange={e => setFormData({ ...formData, max_grant_amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Allocated Budget Pool (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.allocated_budget}
                  onChange={e => setFormData({ ...formData, allocated_budget: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  {saving ? 'Creating...' : 'Launch Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disburse Modal */}
      {disburseModalScheme && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Grant Authorization</span>
                <h3 className="font-bold text-white text-base">{disburseModalScheme.name}</h3>
              </div>
              <button onClick={() => setDisburseModalScheme(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisburseGrant} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Beneficiary Enterprise / Trainee Name</label>
                <input
                  type="text"
                  required
                  value={disburseBeneficiary}
                  onChange={e => setDisburseBeneficiary(e.target.value)}
                  placeholder="e.g. Priya Stitch Works (TRN123456)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Grant Subsidy Amount (₹)</label>
                <input
                  type="number"
                  required
                  max={disburseModalScheme.max_grant_amount}
                  value={disburseAmount}
                  onChange={e => setDisburseAmount(e.target.value)}
                  placeholder={`Max ₹${Number(disburseModalScheme.max_grant_amount).toLocaleString()}`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDisburseModalScheme(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  {saving ? 'Disbursing...' : 'Confirm & Disburse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
