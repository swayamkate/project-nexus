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
  TrendingUp
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const SelfEmploymentModule: React.FC = () => {
  const { profile, employment, updateEmployment } = useUser();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docType, setDocType] = useState('udyam');
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      fetchDocuments(profile.id);
    }
  }, [employment, profile]);

  const fetchDocuments = async (traineeId: string) => {
    const { data } = await supabase
      .from('verifications')
      .select('*')
      .eq('trainee_id', traineeId)
      .order('created_at', { ascending: false });
    if (data) setDocuments(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    const success = await updateEmployment(formData);
    setSaving(false);
    if (success) {
      setSuccessMsg('Business details saved and synchronized successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setUploading(true);
    try {
      const docName = file.name;
      const fakeUrl = `https://storage.nexus.gov.in/proofs/${profile.id}/${encodeURIComponent(docName)}`;

      const { error: insertErr } = await supabase
        .from('verifications')
        .insert({
          trainee_id: profile.id,
          document_type: docType,
          document_name: docName,
          document_url: fakeUrl,
          status: 'pending'
        });

      if (insertErr) throw insertErr;
      await fetchDocuments(profile.id);
      setToastMsg('Document submitted successfully for Administrator verification!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg('Upload failed: ' + (err.message || 'Error uploading file.'));
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Self-Employment & Enterprise Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Micro-Enterprise Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Record business metrics, monthly income, and manage Udyam/GST proofs.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Verification Status:</span>
            {employment?.verified_by_admin ? (
              <span className="text-emerald-700 text-xs font-bold flex items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> Verified
              </span>
            ) : (
              <span className="text-amber-700 text-xs font-bold flex items-center bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Active (Self-Reported)
              </span>
            )}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-2xl flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Business Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Enterprise Details */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Enterprise Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Business / Trade Name</label>
              <input
                type="text"
                required
                value={formData.business_name || ''}
                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                placeholder="e.g. Omkar Electricals & Solar / Swastik Apparel"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Business Sector / Trade</label>
              <select
                value={formData.business_type || 'Tailoring Services'}
                onChange={e => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              >
                <option value="Tailoring Services">Tailoring Services</option>
                <option value="Solar & Electrical Services">Solar & Electrical Services</option>
                <option value="Automotive & EV Maintenance">Automotive & EV Repair</option>
                <option value="Beauty & Wellness">Beauty & Wellness Salon</option>
                <option value="IT & Freelancing">IT Services & Digital Center</option>
                <option value="Food & Catering">Food Processing & Catering</option>
                <option value="Other Micro-Enterprise">Other Trade</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Date Established</label>
              <input
                type="date"
                value={formData.establishment_date || ''}
                onChange={e => setFormData({ ...formData, establishment_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Operating Status</label>
              <select
                value={formData.business_status || 'active'}
                onChange={e => setFormData({ ...formData, business_status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              >
                <option value="active">Active & Generating Steady Income</option>
                <option value="scaling">Scaling & Hiring Employees</option>
                <option value="struggling">Struggling / Needs Support</option>
                <option value="closed">Temporarily Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financials & Registrations */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Monthly Revenue & Government Registrations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Estimated Monthly Revenue (₹)</label>
              <input
                type="number"
                value={formData.monthly_revenue || 0}
                onChange={e => setFormData({ ...formData, monthly_revenue: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Net Monthly Profit (₹)</label>
              <input
                type="number"
                value={formData.monthly_profit || 0}
                onChange={e => setFormData({ ...formData, monthly_profit: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyam_number || ''}
                onChange={e => setFormData({ ...formData, udyam_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
                placeholder="UDYAM-MH-XX-XXXXXXX"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Staff / Apprentices Count</label>
              <input
                type="number"
                min="0"
                value={formData.employees_count || 1}
                onChange={e => setFormData({ ...formData, employees_count: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Enterprise Details</span>
          </button>
        </div>

      </form>

    </div>
  );
};
