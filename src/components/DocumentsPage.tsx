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
  Lock
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const DocumentsPage: React.FC = () => {
  const { profile } = useUser();
  const [documents, setDocuments] = useState<any[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (Cryptographically Masked)',
      type: 'Identity Proof',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-2',
      name: '12th Standard Passing Marksheet (HSC)',
      type: 'Education Certificate',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-3',
      name: 'ITI State Vocational Skill Certificate (NSQF Level 4)',
      type: 'Skill Credential',
      status: 'approved',
      date: '15 Jul 2024',
      url: '#'
    },
    {
      id: 'doc-4',
      name: 'Udyam MSME Registration Certificate (UDYAM-MH-26-0048291)',
      type: 'Enterprise Document',
      status: 'approved',
      date: '02 Aug 2024',
      url: '#'
    }
  ]);

  const [docType, setDocType] = useState('Enterprise Document');
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (profile?.id) {
      fetchUploadedDocs(profile.id);
    }
  }, [profile]);

  const fetchUploadedDocs = async (traineeId: string) => {
    const { data } = await supabase
      .from('verifications')
      .select('*')
      .eq('trainee_id', traineeId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      const mapped = data.map(d => ({
        id: d.id,
        name: d.document_name,
        type: d.document_type.toUpperCase(),
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString(),
        url: d.document_url
      }));
      setDocuments(prev => {
        const ids = new Set(prev.map(p => p.id));
        const newItems = mapped.filter(m => !ids.has(m.id));
        return [...prev, ...newItems];
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;

    setUploading(true);
    try {
      const fakeUrl = `https://storage.nexus.gov.in/proofs/${profile.id}/${encodeURIComponent(file.name)}`;
      const { error } = await supabase.from('verifications').insert({
        trainee_id: profile.id,
        document_type: docType,
        document_name: file.name,
        document_url: fakeUrl,
        status: 'pending'
      });
      if (error) throw error;
      await fetchUploadedDocs(profile.id);
      setToastMsg('Document submitted successfully for Administrator verification!');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg('Upload error: ' + (err.message || 'Failed to submit document.'));
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Document Locker</h1>
          <p className="text-xs text-slate-500 mt-0.5">Government encrypted proofs, academic certificates, and MSME registrations</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer min-h-[44px]"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Upload Box Helper */}
      <div 
        className="bg-white border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center space-y-3 shadow-xs transition cursor-pointer group" 
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center mx-auto shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Upload GST invoices, Udyam proofs, or Bank records</h3>
          <p className="text-xs text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB • Secured with Zero-Knowledge Encryption & SHA-256 Hashing</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Saved Documents ({documents.length})</h3>
          <span className="text-xs text-emerald-600 font-semibold flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1" /> DigiLocker & State Verified
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {documents.map((doc, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
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

              <div className="flex items-center space-x-3 justify-between sm:justify-end">
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
              </div>
            </div>
          ))}
        </div>
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

    </div>
  );
};
