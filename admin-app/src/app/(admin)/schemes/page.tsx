'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { mutateAdminDb } from '@/lib/adminApi';
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
  Clock,
  Trash2
} from 'lucide-react';
import { logAdminAction } from '@/lib/auditLogger';

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schemes' | 'applications'>('schemes');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    department: 'MSME & Industry Department',
    subsidy_pct: 35,
    max_loan_limit: 2500000,
    allocated_budget: 50000000,
    description: '',
    target_sectors: ['Apparel & Fashion', 'Renewable Energy', 'Automotive & EV'],
    is_active: true
  });

  const supabase = createClient();

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await mutateAdminDb({
        action: 'insert',
        table: 'government_schemes',
        payload: {
          ...formData,
          disbursed_budget: 0,
          beneficiaries_count: 0
        }
      });
      if (error) throw error;

      await logAdminAction(
        'CREATE_GOVERNMENT_SCHEME',
        'GOVERNMENT_SCHEMES',
        null,
        `Launched ${formData.name} with ₹${(formData.allocated_budget / 10000000).toFixed(2)} Cr budget`
      );

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
      const { error } = await mutateAdminDb({
        action: 'update',
        table: 'scheme_applications',
        payload: { 
          status: newStatus,
          sanctioned_amount: newStatus === 'rejected' ? 0 : app.requested_amount,
          updated_at: new Date().toISOString()
        },
        match: { id: appId }
      });

      if (error) throw error;

      // If disbursed, update scheme stats
      if (newStatus === 'disbursed' && app.scheme_id) {
        const sch = schemes.find(s => s.id === app.scheme_id);
        if (sch) {
          await mutateAdminDb({
            action: 'update',
            table: 'government_schemes',
            payload: {
              disbursed_budget: Number(sch.disbursed_budget || 0) + Number(app.requested_amount),
              beneficiaries_count: Number(sch.beneficiaries_count || 0) + 1
            },
            match: { id: app.scheme_id }
          });
        }
      }

      // Notify trainee
      await mutateAdminDb({
        action: 'insert',
        table: 'trainee_notifications',
        payload: {
          trainee_id: app.trainee_id,
          title: `Grant Application ${newStatus.toUpperCase()}`,
          message: `Your application ${app.application_no || 'Grant Request'} for ${app.government_schemes?.name || 'Grant Scheme'} has been marked as ${newStatus}.`,
          type: 'scheme'
        }
      });

      // Audit log
      await logAdminAction(
        `SCHEME_APP_${newStatus.toUpperCase()}`,
        'SCHEME_APPLICATIONS',
        appId,
        `Application updated to ${newStatus} (₹${Number(app.requested_amount).toLocaleString()})`
      );

      setToastMsg(`Application updated to ${newStatus}!`);
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
            <span className="font-mono uppercase text-[10px]">Beneficiaries Funded</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono">{totalBeneficiaries.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500">Self-employed enterprise graduates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'schemes'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Government Schemes ({schemes.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'applications'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Candidate Grant Applications ({applications.length})</span>
          {applications.filter(a => a.status === 'submitted' || a.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-900 text-[10px] font-black rounded-full">
              {applications.filter(a => a.status === 'submitted' || a.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Scheme Cards Grid */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map(sch => (
            <div key={sch.id} className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-md uppercase">
                    {sch.subsidy_pct}% Capital Subsidy
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Max ₹{(Number(sch.max_loan_limit || 0) / 100000).toFixed(0)} Lakhs</span>
                </div>
                <h3 className="font-bold text-white text-base">{sch.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{sch.description}</p>
                <div className="text-[11px] text-slate-500">Dept: {sch.department}</div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Disbursed:</span>
                  <span className="text-white font-mono font-bold">₹{Number(sch.disbursed_budget || 0).toLocaleString()} / ₹{(Number(sch.allocated_budget || 0) / 10000000).toFixed(1)} Cr</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.round((Number(sch.disbursed_budget || 0) / Math.max(1, Number(sch.allocated_budget || 1))) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Table */}
      {activeTab === 'applications' && (
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          {applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No grant applications submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="py-3 px-4">Applicant / Enterprise</th>
                    <th className="py-3 px-4">Scheme</th>
                    <th className="py-3 px-4">Requested (₹)</th>
                    <th className="py-3 px-4">Bank & IFSC</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-900/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{app.trainees?.full_name || 'Candidate'}</div>
                        <div className="text-[11px] text-slate-500">{app.business_name || 'Micro Unit'} • {app.trainees?.district || 'MH'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{app.government_schemes?.name || 'Grant Scheme'}</div>
                        <div className="text-[10px] text-blue-400 font-bold">{app.government_schemes?.subsidy_pct}% Subsidy Tier</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ₹{Number(app.requested_amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>{app.bank_account_no || '—'}</div>
                        <div className="text-slate-500 text-[10px]">{app.ifsc_code || '—'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'disbursed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'sanctioned'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : app.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {app.status === 'submitted' || app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'sanctioned', app)}
                              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                            >
                              Sanction
                            </button>
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'rejected', app)}
                              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : app.status === 'sanctioned' ? (
                          <button
                            onClick={() => handleUpdateAppStatus(app.id, 'disbursed', app)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Disburse Funds
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Scheme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Launch State Micro-Grant / Credit Subsidy</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Scheme Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mahaswayam Boutique Micro-Grant"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Capital Subsidy (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={formData.subsidy_pct}
                    onChange={e => setFormData({ ...formData, subsidy_pct: Number(e.target.value) })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Max Loan Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.max_loan_limit}
                    onChange={e => setFormData({ ...formData, max_loan_limit: Number(e.target.value) })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Allocated Budget Pool (₹)</label>
                <input
                  type="number"
                  value={formData.allocated_budget}
                  onChange={e => setFormData({ ...formData, allocated_budget: Number(e.target.value) })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description & Eligibility Criteria</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide scheme guidelines, eligible vocational trades, and required documentation..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Publish Scheme</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
