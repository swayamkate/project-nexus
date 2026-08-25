'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Loader2, FileText, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    // Fetch trainees and their employment data
    const { data, error } = await supabase
      .from('trainee_employment')
      .select(`
        id,
        status,
        proof_file_url,
        verification_status,
        created_at,
        trainees (
          full_name,
          email,
          trainee_id
        )
      `)
      .not('proof_file_url', 'is', null)
      .order('created_at', { ascending: false });

    if (data) setVerifications(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to mark this document as ${status}?`)) return;
    
    await supabase.from('trainee_employment').update({ verification_status: status }).eq('id', id);
    fetchVerifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center"><FileText className="w-6 h-6 mr-2 text-blue-400" /> Verification Center</h1>
          <p className="text-sm text-slate-400 mt-1">Review self-employment proofs (Udyam, GST, etc.)</p>
        </div>
      </div>

      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Trainee</th>
                <th className="py-4 px-6 font-semibold">Document Proof</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" /></td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">No verification requests found.</td>
                </tr>
              ) : (
                verifications.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/20 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{v.trainees?.full_name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{v.trainees?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <a href={v.proof_file_url} target="_blank" rel="noreferrer" className="flex items-center text-blue-400 hover:text-blue-300 transition text-xs font-bold">
                        <ExternalLink className="w-3 h-3 mr-1" /> View Document
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      {v.verification_status === 'approved' ? (
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md uppercase tracking-wider">Approved</span>
                      ) : v.verification_status === 'rejected' ? (
                        <span className="text-rose-400 text-[10px] font-bold bg-rose-400/10 border border-rose-400/20 px-2 py-1 rounded-md uppercase tracking-wider">Rejected</span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-md uppercase tracking-wider">Pending</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleUpdateStatus(v.id, 'approved')} className="p-2 bg-emerald-500/10 hover:bg-emerald-600 rounded-lg text-emerald-400 hover:text-white transition border border-emerald-500/20" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleUpdateStatus(v.id, 'rejected')} className="p-2 bg-rose-500/10 hover:bg-rose-600 rounded-lg text-rose-400 hover:text-white transition border border-rose-500/20" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
