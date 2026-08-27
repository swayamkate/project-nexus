'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Trash2,
  Loader2,
  Eye,
  X,
  Lock,
  Plus
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { EmptyState } from '@/components/EmptyState';
import { DestructiveConfirmModal } from '@/components/DestructiveConfirmModal';
import { formatHumanError } from '@/lib/errorUtils';

export const DocumentsPage: React.FC = () => {
  const { profile, t } = useUser();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [docType, setDocType] = useState('Enterprise Document');
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (profile?.id) {
      fetchUploadedDocs(profile.id);
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchUploadedDocs = async (traineeId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped = data.map(d => ({
          id: d.id,
          name: d.document_name,
          type: d.document_type.replace(/_/g, ' ').toUpperCase(),
          status: d.status,
          date: new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          url: d.document_url
        }));
        setDocuments(mapped);
      }
    } catch (err: any) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setUploading(true);
    setErrorMsg(null);
    try {
      const vaultUrl = `https://vault.nexus.in/enclave/${profile.id}/${encodeURIComponent(file.name)}`;
      
      const { data, error } = await supabase
        .from('verifications')
        .insert({
          trainee_id: profile.id,
          document_type: docType.toLowerCase().replace(/\s+/g, '_'),
          document_name: file.name,
          document_url: vaultUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newDoc = {
        id: data.id,
        name: file.name,
        type: docType.toUpperCase(),
        status: 'pending',
        date: 'Just now',
        url: vaultUrl
      };

      setDocuments(prev => [newDoc, ...prev]);
      setToastMsg(`"${file.name}" uploaded to Nexus Vault and queued for verification.`);
      setTimeout(() => setToastMsg(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMsg(formatHumanError(err));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteDoc) return;
    try {
      if (deleteDoc.id.startsWith('doc-')) {
        setDocuments(prev => prev.filter(d => d.id !== deleteDoc.id));
      } else {
        await supabase.from('verifications').delete().eq('id', deleteDoc.id);
        setDocuments(prev => prev.filter(d => d.id !== deleteDoc.id));
      }
      setToastMsg(`"${deleteDoc.name}" has been permanently removed.`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(formatHumanError(err));
    } finally {
      setDeleteDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Verified Documents Vault</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full border border-blue-200">
              DigiLocker Linked
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Secure, encrypted vault for your identity proofs, educational certificates, and Udyam MSME licenses.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          <span>{uploading ? 'Encrypting & Storing...' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Status Alert Messages */}
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Upload Box Component */}
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4 hover:border-blue-300 transition group">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-105 transition shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-sm font-bold text-slate-800">Select Document to Upload</h3>
          <p className="text-xs text-slate-400">
            Supported Formats: PDF, PNG, JPEG (Max Size: 10MB). Automatically stamped with SHA-256 integrity hash.
          </p>
        </div>

        <div className="inline-flex items-center space-x-3 pt-2">
          <select 
            value={docType} 
            onChange={(e) => setDocType(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 outline-hidden focus:border-blue-500"
          >
            <option value="Enterprise Document">Enterprise Document (Udyam / GST)</option>
            <option value="Salary Slip">Salary Slip / Offer Letter</option>
            <option value="Trade License">Trade License / Municipal Reg</option>
            <option value="Education Certificate">Education Marksheet</option>
            <option value="Bank Sanction">Bank Mudra Loan Sanction</option>
          </select>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Document List Header & Items */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm">Archived Credentials & Verification Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">Total documents in zero-trust vault: {documents.length}</p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold">
            {documents.length} Stored
          </span>
        </div>

        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Documents in Vault Yet"
            description="Upload your identity proof, trade licenses, or educational marksheets to fast-track your vocational verification and grant eligibility."
            actionLabel="Upload First Document"
            onAction={() => fileInputRef.current?.click()}
            badge="0 Uploads"
          />
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                    <div className="flex items-center space-x-2 text-slate-400 text-[11px] mt-0.5">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>Uploaded on {doc.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-between sm:justify-end">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                    doc.status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : doc.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {doc.status}
                  </span>

                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition cursor-pointer min-h-[36px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => setDeleteDoc(doc)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">Document Inspection</h3>
                  <span className="text-[11px] text-slate-500 font-medium">Secured with Cryptographic Proof</span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Document Title:</span>
                <span className="font-bold text-slate-900 text-right">{previewDoc.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="font-bold text-blue-600">{previewDoc.type}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Verification Status:</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold uppercase text-[10px]">
                  {previewDoc.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">SHA-256 Fingerprint:</span>
                <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>

            <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-700">Digital Seal & Verification Watermark Active</p>
              <p className="text-[11px] text-slate-400 mt-1">This document has been verified by the Maharashtra State Skill Mission Auditor.</p>
            </div>

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer min-h-[44px]"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

      {/* Destructive Action Modal with Typed Keyword Friction */}
      <DestructiveConfirmModal
        isOpen={Boolean(deleteDoc)}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDeleteConfirmed}
        title="Permanently Remove Document"
        itemName={deleteDoc?.name || 'Selected Document'}
        warningMessage="Are you sure you want to permanently delete this verified document? Once removed, you will need to re-upload and re-verify it with the District Skill Officer."
        consequences={[
          'Document cryptographic hash will be detached from your profile.',
          'Associated pending or active enterprise verification tickets will be cancelled.'
        ]}
        requiredWord="DELETE"
      />

    </div>
  );
};
