'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  DollarSign, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Loader2, 
  ShieldCheck, 
  Calendar, 
  Users, 
  MapPin, 
  ExternalLink,
  TrendingUp,
  Landmark,
  Calculator,
  Plus,
  Receipt,
  Printer,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { validateUdyam, validateGSTIN, validateIFSC, calculateSchemeEligibility } from '@/lib/validators';

export const SelfEmploymentModule: React.FC = () => {
  const { profile, employment, updateEmployment } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'schemes' | 'ledger' | 'invoice' | 'calculator'>('profile');
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Scheme Application Modal
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [appForm, setAppForm] = useState({
    requested_amount: 100000,
    bank_account_no: '',
    ifsc_code: '',
    remarks: ''
  });
  const [submittingApp, setSubmittingApp] = useState(false);

  // New Ledger Form
  const [ledgerForm, setLedgerForm] = useState({
    entry_month: new Date().toISOString().substring(0, 7),
    revenue_amount: '',
    expense_amount: '',
    notes: ''
  });
  const [savingLedger, setSavingLedger] = useState(false);

  // Digital Invoice Generator State
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    items: [{ desc: 'Custom Tailored Garments & Alterations', qty: 2, rate: 1200 }]
  });

  const supabase = createClient();

  useEffect(() => {
    if (employment) {
      setFormData({
        status: employment.status || 'self_employed',
        business_name: employment.business_name || '',
        business_type: employment.business_type || '',
        business_category: employment.business_category || 'Micro-Enterprise',
        business_status: employment.business_status || 'active',
        establishment_date: employment.establishment_date || '',
        monthly_revenue: employment.monthly_revenue || 0,
        monthly_profit: employment.monthly_profit || 0,
        monthly_income_range: employment.monthly_income_range || '',
        udyam_number: employment.udyam_number || '',
        gst_number: employment.gst_number || '',
        business_address: employment.business_address || '',
        employees_count: employment.employees_count || 1,
      });
    } else {
      setFormData({
        status: 'self_employed',
        business_name: '',
        business_type: '',
        business_category: 'Micro-Enterprise',
        business_status: 'active',
        establishment_date: new Date().toISOString().split('T')[0],
        monthly_revenue: 0,
        monthly_profit: 0,
        monthly_income_range: '₹15,000 – ₹25,000',
        udyam_number: '',
        gst_number: '',
        business_address: profile?.district ? `${profile.district}, Maharashtra` : '',
        employees_count: 1,
      });
    }

    if (profile?.id) {
      loadUserData(profile.id);
    }
  }, [employment, profile]);

  const loadUserData = async (traineeId: string) => {
    setLoadingData(true);
    try {
      const [docRes, schemeRes, appRes, ledgerRes] = await Promise.all([
        supabase.from('verifications').select('*').eq('trainee_id', traineeId).order('created_at', { ascending: false }),
        supabase.from('government_schemes').select('*').order('created_at', { ascending: false }),
        supabase.from('scheme_applications').select('*, government_schemes(name, subsidy_pct)').eq('trainee_id', traineeId).order('applied_at', { ascending: false }),
        supabase.from('enterprise_ledger').select('*').eq('trainee_id', traineeId).order('entry_month', { ascending: false })
      ]);

      if (docRes.data) setDocuments(docRes.data);
      if (schemeRes.data) setSchemes(schemeRes.data);
      if (appRes.data) setApplications(appRes.data);
      if (ledgerRes.data) setLedgerEntries(ledgerRes.data);
    } catch (e) {
      console.error('Error loading self-employment data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.udyam_number) {
      const udyamCheck = validateUdyam(formData.udyam_number);
      if (!udyamCheck.valid) {
        setToastMsg(udyamCheck.error || 'Invalid Udyam Number');
        setTimeout(() => setToastMsg(null), 4000);
        return;
      }
    }

    if (formData.gst_number) {
      const gstCheck = validateGSTIN(formData.gst_number);
      if (!gstCheck.valid) {
        setToastMsg(gstCheck.error || 'Invalid GSTIN');
        setTimeout(() => setToastMsg(null), 4000);
        return;
      }
    }

    setSaving(true);
    setSuccessMsg(null);

    const success = await updateEmployment(formData);
    setSaving(false);
    if (success) {
      setSuccessMsg('Business profile saved and synchronized successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !selectedScheme) return;

    if (appForm.ifsc_code) {
      const ifscCheck = validateIFSC(appForm.ifsc_code);
      if (!ifscCheck.valid) {
        setToastMsg(ifscCheck.error || 'Invalid IFSC Code');
        setTimeout(() => setToastMsg(null), 4000);
        return;
      }
    }

    setSubmittingApp(true);
    try {
      const { error } = await supabase.from('scheme_applications').insert({
        trainee_id: profile.id,
        scheme_id: selectedScheme.id,
        business_name: formData.business_name || `${profile.full_name}'s Enterprise`,
        requested_amount: Number(appForm.requested_amount),
        bank_account_no: appForm.bank_account_no,
        ifsc_code: appForm.ifsc_code.toUpperCase(),
        remarks: appForm.remarks,
        status: 'submitted'
      });

      if (error) throw error;

      setToastMsg(`Application for "${selectedScheme.name}" submitted successfully!`);
      setSelectedScheme(null);
      setTimeout(() => setToastMsg(null), 4000);
      if (profile.id) loadUserData(profile.id);
    } catch (err: any) {
      setToastMsg('Application failed: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleSaveLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    const rev = Number(ledgerForm.revenue_amount) || 0;
    const exp = Number(ledgerForm.expense_amount) || 0;
    const net = rev - exp;

    setSavingLedger(true);
    try {
      const { error } = await supabase.from('enterprise_ledger').insert({
        trainee_id: profile.id,
        entry_month: ledgerForm.entry_month,
        revenue_amount: rev,
        expense_amount: exp,
        net_profit: net,
        notes: ledgerForm.notes
      });

      if (error) throw error;

      setToastMsg(`Cashbook entry for ${ledgerForm.entry_month} recorded!`);
      setLedgerForm({
        entry_month: new Date().toISOString().substring(0, 7),
        revenue_amount: '',
        expense_amount: '',
        notes: ''
      });
      setTimeout(() => setToastMsg(null), 3500);
      if (profile.id) loadUserData(profile.id);
    } catch (err: any) {
      setToastMsg('Ledger entry failed: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSavingLedger(false);
    }
  };

  const eligibility = calculateSchemeEligibility({
    trade: formData.business_type || 'Tailoring',
    monthlyRevenue: Number(formData.monthly_revenue || 0),
    hasUdyam: Boolean(formData.udyam_number),
    monthsActive: 8
  });

  const invoiceSubtotal = invoice.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const invoiceGst = Math.round(invoiceSubtotal * 0.18);
  const invoiceTotal = invoiceSubtotal + invoiceGst;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Self-Employment & Enterprise Incubation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register your micro-enterprise, track monthly profits, apply for state credit subsidies, and generate digital invoices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {employment?.verified_by_admin ? (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>State Verified Enterprise</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KYC Verification Pending</span>
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600 max-w-2xl">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'profile' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Enterprise Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'schemes' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Government Schemes ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'ledger' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Cashbook Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('invoice')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'invoice' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Digital Invoice</span>
        </button>
      </div>

      {/* TAB 1: ENTERPRISE PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Business Registration & Formalization Details</span>
            </h3>
            {successMsg && <span className="text-xs text-emerald-600 font-bold">{successMsg}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-600 font-bold block mb-1">Business / Trade Name</label>
              <input
                type="text"
                value={formData.business_name || ''}
                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                placeholder="e.g. Sharma Designer Boutique"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Vocational Trade Category</label>
              <input
                type="text"
                value={formData.business_type || ''}
                onChange={e => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                placeholder="e.g. Apparel & Fashion Designing"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyam_number || ''}
                onChange={e => setFormData({ ...formData, udyam_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono uppercase"
                placeholder="UDYAM-MH-12-0034567"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={formData.gst_number || ''}
                onChange={e => setFormData({ ...formData, gst_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono uppercase"
                placeholder="27AAAPL1234F1Z5"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Estimated Monthly Revenue (₹)</label>
              <input
                type="number"
                value={formData.monthly_revenue || 0}
                onChange={e => setFormData({ ...formData, monthly_revenue: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="text-slate-600 font-bold block mb-1">Number of Employees Supported</label>
              <input
                type="number"
                value={formData.employees_count || 1}
                onChange={e => setFormData({ ...formData, employees_count: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-slate-600 font-bold block mb-1">Registered Workshop / Store Address</label>
              <input
                type="text"
                value={formData.business_address || ''}
                onChange={e => setFormData({ ...formData, business_address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium"
                placeholder="Shop No. 4, MG Road, Pune, Maharashtra"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Enterprise Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: GOVERNMENT SCHEMES & APPLICATION TRACKER */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Eligibility Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 bg-blue-400/20 text-blue-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Automated Credit Assessment
              </span>
              <h3 className="text-lg font-black mt-1">Eligible under {eligibility.mudraCategory}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Estimated Sanction: Up to ₹{eligibility.estimatedMaxSanction.toLocaleString()} • Government Subsidy: {eligibility.subsidyPct}% (~₹{eligibility.estimatedSubsidyAmount.toLocaleString()})
              </p>
            </div>
          </div>

          {/* User Submitted Applications */}
          {applications.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Your Active Scheme Applications</h3>
              <div className="divide-y divide-slate-100">
                {applications.map(app => (
                  <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-blue-600">{app.application_no}</span>
                      <p className="font-bold text-slate-800">{app.government_schemes?.name || 'Grant Scheme'}</p>
                      <p className="text-[11px] text-slate-400">Requested: ₹{Number(app.requested_amount).toLocaleString()} • Applied: {new Date(app.applied_at).toLocaleDateString('en-GB')}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      app.status === 'disbursed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      app.status === 'sanctioned' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available State Schemes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map(sch => (
              <div key={sch.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                      {sch.nodal_agency || 'State Govt'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {sch.subsidy_pct}% Capital Subsidy
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{sch.name}</h4>
                  <p className="text-xs text-slate-500">Max Grant Amount: <strong>₹{Number(sch.max_grant_amount || 500000).toLocaleString()}</strong></p>
                </div>

                <button
                  onClick={() => {
                    setSelectedScheme(sch);
                    setAppForm({ ...appForm, requested_amount: Math.min(sch.max_grant_amount || 100000, 200000) });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply for This Scheme</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MONTHLY CASHBOOK LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Add Entry Card */}
          <form onSubmit={handleSaveLedger} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Record Monthly Enterprise Cashflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1">Month</label>
                <input
                  type="month"
                  value={ledgerForm.entry_month}
                  onChange={e => setLedgerForm({ ...ledgerForm, entry_month: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Revenue / Sales (₹)</label>
                <input
                  type="number"
                  value={ledgerForm.revenue_amount}
                  onChange={e => setLedgerForm({ ...ledgerForm, revenue_amount: e.target.value })}
                  placeholder="e.g. 35000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Expenses / Costs (₹)</label>
                <input
                  type="number"
                  value={ledgerForm.expense_amount}
                  onChange={e => setLedgerForm({ ...ledgerForm, expense_amount: e.target.value })}
                  placeholder="e.g. 12000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-rose-600 font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={savingLedger || !ledgerForm.revenue_amount}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {savingLedger ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Add Ledger Entry</span>
                </button>
              </div>
            </div>
          </form>

          {/* Historical Ledger Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Verified Enterprise Profit & Loss History</h3>
            {ledgerEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Gross Revenue</th>
                      <th className="py-2.5 px-3">Operating Expense</th>
                      <th className="py-2.5 px-3">Net Profit</th>
                      <th className="py-2.5 px-3">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {ledgerEntries.map(entry => {
                      const margin = entry.revenue_amount > 0 ? Math.round((entry.net_profit / entry.revenue_amount) * 100) : 0;
                      return (
                        <tr key={entry.id}>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{entry.entry_month}</td>
                          <td className="py-3 px-3 text-emerald-600 font-bold">₹{Number(entry.revenue_amount).toLocaleString()}</td>
                          <td className="py-3 px-3 text-rose-600 font-bold">₹{Number(entry.expense_amount).toLocaleString()}</td>
                          <td className="py-3 px-3 font-black text-slate-900">₹{Number(entry.net_profit).toLocaleString()}</td>
                          <td className="py-3 px-3 text-blue-600 font-bold">{margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No cashbook records added yet. Record your monthly revenue above to track wage growth.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL INVOICE GENERATOR */}
      {activeTab === 'invoice' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Customer Quotation & Tax Invoice</h3>
              <p className="text-xs text-slate-400">Generate professional GST bills for your boutique or trade customers.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Customer Full Name</label>
              <input
                type="text"
                value={invoice.customerName}
                onChange={e => setInvoice({ ...invoice, customerName: e.target.value })}
                placeholder="e.g. Ramesh Kulkarni"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="text-slate-500 font-bold block mb-1">Customer Contact Number</label>
              <input
                type="text"
                value={invoice.customerPhone}
                onChange={e => setInvoice({ ...invoice, customerPhone: e.target.value })}
                placeholder="+91 98XXX XXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Invoice Summary Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Item: {invoice.items[0].desc}</span>
              <span className="font-bold">₹{(invoice.items[0].qty * invoice.items[0].rate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST (18% SGST + CGST)</span>
              <span className="font-bold text-slate-700">₹{invoiceGst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
              <span>Total Invoice Payable</span>
              <span className="text-blue-600 font-mono">₹{invoiceTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Application Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Apply for {selectedScheme.name}</h3>
              <button onClick={() => setSelectedScheme(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Requested Loan / Grant Amount (₹)</label>
                <input
                  type="number"
                  value={appForm.requested_amount}
                  onChange={e => setAppForm({ ...appForm, requested_amount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  max={selectedScheme.max_grant_amount || 500000}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={appForm.bank_account_no}
                  onChange={e => setAppForm({ ...appForm, bank_account_no: e.target.value })}
                  placeholder="e.g. 02341010002345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  required
                  value={appForm.ifsc_code}
                  onChange={e => setAppForm({ ...appForm, ifsc_code: e.target.value })}
                  placeholder="e.g. SBIN0001234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Project Purpose / Remarks</label>
                <textarea
                  value={appForm.remarks}
                  onChange={e => setAppForm({ ...appForm, remarks: e.target.value })}
                  placeholder="Describe tools or machinery to be purchased with the grant..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 h-16"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedScheme(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
                >
                  {submittingApp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Submit Grant Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
