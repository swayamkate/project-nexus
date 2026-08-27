'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Loader2, 
  Search, 
  Filter, 
  Eye,
  AlertTriangle,
  X,
  Building2,
  Send
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { formatHumanError } from '@/lib/errorUtils';

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  
  // Reject Modal
  const [rejectItem, setRejectItem] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('verifications')
      .select('*, trainees(full_name, email, district, trainee_id)')
      .order('created_at', { ascending: false });

    if (data) setVerifications(data);
    setLoading(false);
  };

  const handleApprove = async (doc: any) => {
    setProcessingId(doc.id);
    try {
      // 1. Update verification record
      const { error: verifErr } = await supabase
        .from('verifications')
        .update({
          status: 'approved',
          reviewed_by: 'admin@nexus.com',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', doc.id);

      if (verifErr) throw verifErr;

      // 2. Mark enterprise verified in trainee_employment
      if (doc.trainee_id) {
        await supabase
          .from('trainee_employment')
          .update({ verified_by_admin: true, verified_at: new Date().toISOString() })
          .eq('trainee_id', doc.trainee_id);
      }

      // 3. Log to audit_logs
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'APPROVE_DOCUMENT',
        target_entity: 'VERIFICATIONS',
        target_id: doc.id,
        details: `Approved ${doc.document_type} document for trainee ${doc.trainees?.email || doc.trainee_id}`,
        status: 'Success'
      });

      setToastMsg(`Document "${doc.document_name}" approved successfully!`);
      setTimeout(() => setToastMsg(null), 3500);
      await fetchVerifications();
    } catch (err: any) {
      setToastMsg('Approval error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem) return;

    setProcessingId(rejectItem.id);
    try {
      const { error: rejectErr } = await supabase
        .from('verifications')
        .update({
          status: 'rejected',
          admin_notes: rejectReason,
          reviewed_by: 'admin@nexus.com',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', rejectItem.id);

      if (rejectErr) throw rejectErr;

      // Log in audit_logs
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'REJECT_DOCUMENT',
        target_entity: 'VERIFICATIONS',
        target_id: rejectItem.id,
        details: `Rejected ${rejectItem.document_name}. Reason: ${rejectReason}`,
        status: 'Success'
      });

      setToastMsg(`Document rejected with feedback: "${rejectReason}"`);
      setTimeout(() => setToastMsg(null), 3500);
      setRejectItem(null);
      setRejectReason('');
      await fetchVerifications();
    } catch (err: any) {
      setToastMsg('Rejection error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredDocs = verifications.filter(doc => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = 
      (doc.document_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.document_type || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.trainees?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.trainees?.email || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          <h1 className="text-2xl font-black text-white tracking-tight">Document Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Audit Udyam MSME registrations, GST proofs, salary slips, and educational certificates.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">{filteredDocs.length} Documents in Queue</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by trainee name, email, or document title..."
            className="w-full bg-[#0a1020] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-1 bg-[#0a1020] border border-slate-800 p-1 rounded-xl text-xs font-bold">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg transition capitalize cursor-pointer ${
                filterStatus === s ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Submitted Document Proofs</h3>
          <span className="text-[11px] text-slate-400">Direct PostgreSQL Verification Hook</span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading verifications...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FileText}
              title="Verification Queue All Clear"
              description={`No document verification requests currently match the status "${filterStatus}". All trainee salary slips, trade licenses, and Udyam certificates are fully up to date.`}
              actionLabel="View All Submissions"
              onAction={() => { setFilterStatus('all'); setSearch(''); }}
              badge="Queue Clear"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Trainee Candidate</th>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{doc.trainees?.full_name || 'Trainee'}</span>
                      <span className="text-[11px] text-slate-400">{doc.trainees?.email}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>{doc.document_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                        {doc.document_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : doc.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {doc.status}
                      </span>
                      {doc.admin_notes && (
                        <p className="text-[10px] text-rose-400 mt-0.5 truncate max-w-[140px]">{doc.admin_notes}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {doc.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(doc)}
                              disabled={processingId === doc.id}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center space-x-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => setRejectItem(doc)}
                              disabled={processingId === doc.id}
                              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg font-bold transition flex items-center space-x-1 disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">{previewDoc.document_name}</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/80 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Trainee Name:</span>
                <span className="font-bold text-white">{previewDoc.trainees?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Email:</span>
                <span className="font-mono text-slate-300">{previewDoc.trainees?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Document Type:</span>
                <span className="font-bold text-blue-400 uppercase">{previewDoc.document_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audit Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{previewDoc.status}</span>
              </div>
              {previewDoc.admin_notes && (
                <div>
                  <span className="text-slate-400 block mb-1">Rejection Remarks:</span>
                  <p className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{previewDoc.admin_notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Close
              </button>
              {previewDoc.status === 'pending' && (
                <button
                  onClick={() => {
                    handleApprove(previewDoc);
                    setPreviewDoc(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Approve Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Reason */}
      {rejectItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Reject Document Proof</h3>
              <button onClick={() => setRejectItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <p className="text-slate-400">
                Please state the official reason for rejecting <strong className="text-white">{rejectItem.document_name}</strong>. This feedback will be sent to the trainee.
              </p>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Rejection Reason / Required Correction</label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Udyam registration number does not match registered GST trade name. Please re-upload clear scan."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectItem(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === rejectItem.id}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
