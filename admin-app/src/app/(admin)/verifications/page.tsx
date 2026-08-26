'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Loader2, FileText, CheckCircle, XCircle, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('verifications')
      .select('*, trainees(full_name, email, trainee_id, district)')
      .order('created_at', { ascending: false });

    if (data) setVerifications(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string, traineeId: string) => {
    if (!confirm(`Are you sure you want to mark this document as ${status}?`)) return;
    
    // 1. Update verification record
    await supabase.from('verifications').update({ 
      status: status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'admin@nexus.com'
    }).eq('id', id);

    // 2. If approved, mark trainee_employment as verified
    if (status === 'approved') {
      await supabase.from('trainee_employment').update({
        verified_by_admin: true,
        verified_at: new Date().toISOString()
      }).eq('trainee_id', traineeId);
    }

    fetchVerifications();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-blue-400" />
            Verification Queue & Document Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Validate trainee business registrations (Udyam, GST, bank proofs) to award official verified badges.
          </p>
        </div>
      </div>

      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Trainee</th>
                <th className="py-4 px-6 font-semibold">Proof Type & Name</th>
                <th className="py-4 px-6 font-semibold">Submitted Date</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : verifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No documents awaiting review. Submitted proofs will appear here.
                  </td>
                </tr>
              ) : (
                verifications.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/20 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{v.trainees?.full_name || 'Trainee'}</div>
                      <div className="text-xs text-blue-400 font-mono mt-0.5">{v.trainees?.trainee_id}</div>
                      <div className="text-[11px] text-slate-500">{v.trainees?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white uppercase text-xs">{v.document_type}</div>
                      <a 
                        href={v.document_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center text-blue-400 hover:text-blue-300 transition text-xs mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-[150px]">{v.document_name}</span>
                      </a>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {v.status === 'approved' ? (
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Approved
                        </span>
                      ) : v.status === 'rejected' ? (
                        <span className="text-rose-400 text-[10px] font-bold bg-rose-400/10 border border-rose-400/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Rejected
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-bold bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleUpdateStatus(v.id, 'approved', v.trainee_id)} 
                          className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-600 rounded-lg text-emerald-400 hover:text-white transition border border-emerald-500/30 flex items-center space-x-1 text-xs font-bold" 
                          title="Approve Document"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(v.id, 'rejected', v.trainee_id)} 
                          className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-600 rounded-lg text-rose-400 hover:text-white transition border border-rose-500/30 flex items-center space-x-1 text-xs font-bold" 
                          title="Reject Document"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
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
