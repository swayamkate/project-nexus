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
  PieChart,
  FileCheck,
  Check,
  Ban,
  Clock
} from 'lucide-react';

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schemesRes, appsRes] = await Promise.all([
        supabase.from('government_schemes').select('*').order('created_at', { ascending: false }),
        supabase.from('scheme_applications').select('*, trainees(full_name, email, district), government_schemes(name, subsidy_pct)').order('applied_at', { ascending: false })
      ]);

      if (schemesRes.data) setSchemes(schemesRes.data);
      if (appsRes.data) setApplications(appsRes.data);
    } catch (e) {
      console.error('Failed to load schemes:', e);
    } finally {
      setLoading(false);
    }
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
      await fetchData();
    } catch (err: any) {
      setToastMsg('Failed: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: 'sanctioned' | 'disbursed' | 'rejected', app: any) => {
    try {
      const { error } = await supabase
        .from('scheme_applications')
        .update({ 
          status: newStatus,
          sanctioned_amount: newStatus === 'rejected' ? 0 : app.requested_amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', appId);

      if (error) throw error;

      // If disbursed, update scheme stats
      if (newStatus === 'disbursed' && app.scheme_id) {
        const sch = schemes.find(s => s.id === app.scheme_id);
        if (sch) {
          await supabase.from('government_schemes').update({
            disbursed_budget: Number(sch.disbursed_budget || 0) + Number(app.requested_amount),
            beneficiaries_count: Number(sch.beneficiaries_count || 0) + 1
          }).eq('id', app.scheme_id);
        }
      }

      // Notify trainee
      await supabase.from('trainee_notifications').insert({
        trainee_id: app.trainee_id,
        title: `Grant Application ${newStatus.toUpperCase()}`,
        message: `Your application ${app.application_no} for ${app.government_schemes?.name || 'Grant Scheme'} has been marked as ${newStatus}.`,
        type: 'scheme'
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: `SCHEME_APP_${newStatus.toUpperCase()}`,
        target_entity: 'SCHEME_APPLICATIONS',
        target_id: appId,
        details: `Application ${app.application_no} updated to ${newStatus} (₹${Number(app.requested_amount).toLocaleString()})`,
        status: 'Success'
      });

      setToastMsg(`Application ${app.application_no} updated to ${newStatus}!`);
      setTimeout(() => setToastMsg(null), 3500);
      fetchData();
    } catch (err: any) {
      setToastMsg('Update error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const totalAllocated = schemes.reduce((sum, s) => sum + Number(s.allocated_budget || 0), 0);
  const totalDisbursed = schemes.reduce((sum, s) => sum + Number(s.disbursed_budget || 0), 0);
  const totalBeneficiaries = schemes.reduce((sum, s) => sum + Number(s.beneficiaries_count || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Government Schemes & Micro-Grant Allocations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer PMEGP, Mudra, and CMEGP credit linked capital subsidies, review candidate applications, and track fund disbursements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Scheme</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0a1020] border border-slate-800/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px]">Total State Budget Pool</span>
            <Landmark className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">₹{(totalAllocated / 10000000).toFixed(2)} Cr</p>
          <p className="text-[11px] text-slate-500">Across {schemes.length} active government initiatives</p>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px]">Subsidies Disbursed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">₹{(totalDisbursed / 10000000).toFixed(2)} Cr</p>
          <p className="text-[11px] text-slate-500">{totalAllocated > 0 ? ((totalDisbursed / totalAllocated) * 100).toFixed(1) : 0}% utilization rate</p>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase text-[10px]">Trainee Beneficiaries</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono">{totalBeneficiaries.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Self-employed enterprise incubations</p>
        </div>
      </div>

      {/* SECTION: Incoming Candidate Grant Applications Queue */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Candidate Grant Applications Review Queue</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{applications.length} Applications</span>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-500 text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading application queue...
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">App Ref</th>
                  <th className="py-3 px-4">Candidate & Enterprise</th>
                  <th className="py-3 px-4">Scheme</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Bank Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-mono text-blue-400 font-bold">{app.application_no}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{app.trainees?.full_name || 'Trainee'}</p>
                      <p className="text-[11px] text-slate-400">{app.business_name || 'Micro-Enterprise'} • {app.trainees?.district || 'Pune'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{app.government_schemes?.name || 'Grant Scheme'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{Number(app.requested_amount).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {app.bank_account_no ? `${app.bank_account_no} (${app.ifsc_code})` : 'Pending Entry'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'disbursed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        app.status === 'sanctioned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.status === 'submitted' || app.status === 'under_review' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'sanctioned', app)}
                            className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-[10px] font-bold border border-blue-500/30 transition cursor-pointer"
                          >
                            Sanction
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'disbursed', app)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold border border-emerald-500/30 transition cursor-pointer"
                          >
                            Disburse
                          </button>
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'rejected', app)}
                            className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                            title="Reject"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No grant applications submitted yet.</p>
        )}
      </div>

      {/* SECTION: Active Government Schemes Directory */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">Active Government Grant Schemes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map(sch => {
            const pctUsed = sch.allocated_budget > 0 ? ((sch.disbursed_budget / sch.allocated_budget) * 100).toFixed(1) : 0;

            return (
              <div key={sch.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                      {sch.nodal_agency}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {sch.subsidy_pct}% Capital Subsidy
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{sch.name}</h3>
                  <p className="text-xs text-slate-400">Max Grant / Loan: <strong>₹{Number(sch.max_grant_amount).toLocaleString()}</strong></p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Budget Disbursed ({pctUsed}%)</span>
                    <span className="font-mono text-white">₹{(sch.disbursed_budget / 100000).toFixed(1)}L / ₹{(sch.allocated_budget / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${Math.min(Number(pctUsed), 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Scheme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Launch New State Grant Scheme</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Scheme Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chief Minister Employment Generation Programme (CMEGP)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subsidy Rate (%)</label>
                  <input
                    type="number"
                    value={formData.subsidy_pct}
                    onChange={e => setFormData({ ...formData, subsidy_pct: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Max Grant Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.max_grant_amount}
                    onChange={e => setFormData({ ...formData, max_grant_amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Allocated Budget Pool (₹)</label>
                <input
                  type="number"
                  value={formData.allocated_budget}
                  onChange={e => setFormData({ ...formData, allocated_budget: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
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

    </div>
  );
}
