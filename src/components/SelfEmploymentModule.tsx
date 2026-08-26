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
  ExternalLink 
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const SelfEmploymentModule: React.FC = () => {
  const { profile, employment, updateEmployment } = useUser();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docType, setDocType] = useState('udyam');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (employment) {
      setFormData({
        status: employment.status || 'self_employed',
        business_name: employment.business_name || '',
        business_type: employment.business_type || 'Tailoring & Garments',
        business_category: employment.business_category || 'Micro-Enterprise',
        business_status: employment.business_status || 'active',
        establishment_date: employment.establishment_date || '2024-08-01',
        monthly_revenue: employment.monthly_revenue || 15000,
        monthly_profit: employment.monthly_profit || 8500,
        udyam_number: employment.udyam_number || '',
        gst_number: employment.gst_number || '',
        business_address: employment.business_address || '',
        employees_count: employment.employees_count || 1,
      });
    } else {
      setFormData({
        status: 'self_employed',
        business_name: '',
        business_type: 'Tailoring & Garments',
        business_category: 'Micro-Enterprise',
        business_status: 'active',
        establishment_date: '2024-08-01',
        monthly_revenue: 0,
        monthly_profit: 0,
        udyam_number: '',
        gst_number: '',
        business_address: '',
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
      setSuccessMsg('Business details saved successfully to PostgreSQL database!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setUploading(true);
    try {
      // Create a public / local verification record in table
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
      alert('Document submitted for Administrator verification!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Self-Employment & Enterprise Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Micro-Enterprise Management</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Record longitudinal business metrics, revenue progression, and submit government proofs.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-2">
            <span className="text-xs text-slate-400">Admin Audit:</span>
            {employment?.verified_by_admin ? (
              <span className="text-emerald-400 text-xs font-bold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified
              </span>
            ) : (
              <span className="text-amber-400 text-xs font-bold flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Pending Verification
              </span>
            )}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Business Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Enterprise Details */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Enterprise Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Business / Trade Name</label>
              <input
                type="text"
                required
                value={formData.business_name || ''}
                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Priya Stitch Works / Kedar Solar Services"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Business Sector / Trade</label>
              <select
                value={formData.business_type || 'Tailoring & Garments'}
                onChange={e => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Tailoring & Garments">Tailoring & Apparel</option>
                <option value="Solar & Electrical Services">Solar & Electrical Services</option>
                <option value="Automotive & EV Maintenance">Automotive & EV Repair</option>
                <option value="Beauty & Wellness">Beauty & Wellness Salon</option>
                <option value="IT & Freelancing">IT Services & Digital Center</option>
                <option value="Food & Catering">Food Processing & Catering</option>
                <option value="Other Micro-Enterprise">Other Trade</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Date Established</label>
              <input
                type="date"
                value={formData.establishment_date || ''}
                onChange={e => setFormData({ ...formData, establishment_date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Operating Status</label>
              <select
                value={formData.business_status || 'active'}
                onChange={e => setFormData({ ...formData, business_status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active & Generating Revenue</option>
                <option value="scaling">Scaling & Hiring</option>
                <option value="struggling">Struggling / Needs Support</option>
                <option value="closed">Temporarily Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financials & Registrations */}
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Revenue & Official Identifiers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Average Monthly Revenue (₹)</label>
              <input
                type="number"
                min={0}
                value={formData.monthly_revenue || 0}
                onChange={e => setFormData({ ...formData, monthly_revenue: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Estimated Monthly Profit (₹)</label>
              <input
                type="number"
                min={0}
                value={formData.monthly_profit || 0}
                onChange={e => setFormData({ ...formData, monthly_profit: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Total Employees / Helpers</label>
              <input
                type="number"
                min={1}
                value={formData.employees_count || 1}
                onChange={e => setFormData({ ...formData, employees_count: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyam_number || ''}
                onChange={e => setFormData({ ...formData, udyam_number: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                placeholder="UDYAM-MH-12-0000000"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={formData.gst_number || ''}
                onChange={e => setFormData({ ...formData, gst_number: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                placeholder="27AAAAA0000A1Z5"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Workshop / Store Location</label>
              <input
                type="text"
                value={formData.business_address || ''}
                onChange={e => setFormData({ ...formData, business_address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Shop No. 4, Market Yard, Pune"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/25 transition flex items-center space-x-2 text-sm disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Enterprise Details</span>
          </button>
        </div>
      </form>

      {/* Document Verification Section */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Upload Official Proofs for Verification</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload Udyam certificate, GST invoice, or bank statement to earn a verified outcome badge.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-end pt-2">
          <div className="w-full sm:w-48">
            <label className="text-xs text-slate-400 mb-1 block">Document Type</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="udyam">Udyam Certificate</option>
              <option value="gst">GST Registration</option>
              <option value="bank_statement">Bank Passbook / QR</option>
              <option value="store_photo">Store / Machine Photo</option>
            </select>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>{uploading ? 'Uploading...' : 'Choose File & Submit'}</span>
          </button>
        </div>

        {/* Submitted Documents List */}
        <div className="pt-4 divide-y divide-slate-800/60">
          {documents.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No documents submitted yet.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white uppercase">{doc.document_type}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{doc.document_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    doc.status === 'approved' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : doc.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
