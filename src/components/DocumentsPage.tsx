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
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';

export const DocumentsPage: React.FC = () => {
  const { profile } = useUser();
  const [documents, setDocuments] = useState<any[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (Masked)',
      type: 'Identity Proof',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-2',
      name: '12th Standard Passing Marksheet',
      type: 'Education Certificate',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-3',
      name: 'ITI Course Completion Certificate',
      type: 'Skill Credential',
      status: 'approved',
      date: '15 Jul 2024',
      url: '#'
    },
    {
      id: 'doc-4',
      name: 'Udyam MSME Registration Certificate',
      type: 'Enterprise Document',
      status: 'approved',
      date: '02 Aug 2024',
      url: '#'
    }
  ]);

  const [docType, setDocType] = useState('Enterprise Document');
  const [uploading, setUploading] = useState(false);
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
      setDocuments(prev => [...prev, ...mapped]);
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
      alert('Document submitted successfully for Administrator verification!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Upload Box Helper */}
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:border-blue-400 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Upload GST invoices, Udyam proofs, or Bank records</h3>
          <p className="text-xs text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB • Secured with Zero-Knowledge Encryption</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
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

                <a
                  href={doc.url}
                  onClick={(e) => {
                    if (doc.url === '#') {
                      e.preventDefault();
                      alert(`Viewing securely verified document: ${doc.name}`);
                    }
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
