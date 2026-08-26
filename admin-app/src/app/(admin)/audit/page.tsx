'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Filter,
  FileCheck,
  RefreshCw
} from 'lucide-react';

export default function AdminAuditPage() {
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setAuditLogs(data);
    setLoadingLogs(false);
  };

  const handleExportCSV = async () => {
    setLoadingExport(true);
    try {
      const { data, error } = await supabase
        .from('trainees')
        .select('trainee_id, full_name, email, phone, dob, gender, district, state, highest_education, skills, is_active, created_at');

      if (error) throw error;
      
      if (data && data.length > 0) {
        const headers = ['Trainee ID', 'Full Name', 'Email', 'Phone', 'DOB', 'Gender', 'District', 'State', 'Education', 'Skills', 'Active', 'Created At'];
        const rows = data.map(t => [
          t.trainee_id,
          `"${(t.full_name || '').replace(/"/g, '""')}"`,
          `"${(t.email || '').replace(/"/g, '""')}"`,
          `"${(t.phone || '').replace(/"/g, '""')}"`,
          t.dob,
          t.gender,
          `"${(t.district || '').replace(/"/g, '""')}"`,
          t.state,
          `"${(t.highest_education || '').replace(/"/g, '""')}"`,
          `"${(Array.isArray(t.skills) ? t.skills.join('; ') : '').replace(/"/g, '""')}"`,
          t.is_active,
          t.created_at
        ].join(','));
        
        const csvContent = `${headers.join(',')}\n${rows.join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `mahaskill_trainees_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Audit Log
        await supabase.from('audit_logs').insert({
          admin_email: 'admin@nexus.com',
          action: 'EXPORT_TRAINEES_CSV',
          target_entity: 'TRAINEES',
          details: `Exported ${data.length} trainee records to CSV`,
          status: 'Success'
        });

        await fetchAuditLogs();
        setImportStatus({ type: 'success', text: `Successfully exported ${data.length} trainee records to CSV file.` });
      } else {
        setImportStatus({ type: 'error', text: 'No trainee records found in database to export.' });
      }
    } catch (err: any) {
      setImportStatus({ type: 'error', text: `Export failed: ${err.message}` });
    } finally {
      setLoadingExport(false);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingImport(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) {
          throw new Error('CSV file contains no data rows.');
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const nameIdx = headers.findIndex(h => h.includes('name'));
        const emailIdx = headers.findIndex(h => h.includes('email'));
        const districtIdx = headers.findIndex(h => h.includes('district'));
        const phoneIdx = headers.findIndex(h => h.includes('phone'));

        if (emailIdx === -1) {
          throw new Error('CSV must contain an "email" column header.');
        }

        const toInsert = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const email = cols[emailIdx];
          if (email && email.includes('@')) {
            const fullName = nameIdx !== -1 ? cols[nameIdx] : email.split('@')[0];
            const district = districtIdx !== -1 ? cols[districtIdx] : 'Pune';
            const phone = phoneIdx !== -1 ? cols[phoneIdx] : '+91 98765 43210';
            const rand = Math.floor(100000 + Math.random() * 900000);

            toInsert.push({
              email: email.toLowerCase(),
              username: email.split('@')[0].toLowerCase(),
              full_name: fullName,
              district: district,
              phone: phone,
              trainee_id: `TRN${rand}`,
              highest_education: '12th Standard',
              is_active: true,
              profile_completion_pct: 60,
              skills: ['Tailoring', 'Vocational Training']
            });
          }
        }

        if (toInsert.length === 0) {
          throw new Error('No valid rows found in CSV.');
        }

        const { error: insertErr } = await supabase
          .from('trainees')
          .upsert(toInsert, { onConflict: 'email' });

        if (insertErr) throw insertErr;

        // Audit Log
        await supabase.from('audit_logs').insert({
          admin_email: 'admin@nexus.com',
          action: 'IMPORT_BULK_CSV',
          target_entity: 'TRAINEES',
          details: `Imported ${toInsert.length} trainee records from ${file.name}`,
          status: 'Success'
        });

        setImportStatus({
          type: 'success',
          text: `Successfully imported & synchronized ${toInsert.length} trainee records into PostgreSQL!`
        });

        await fetchAuditLogs();
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          text: `Import failed: ${err.message}`
        });
      } finally {
        setLoadingImport(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Audit Stream & Data Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time administrative ledger, automated CSV onboarding, and compliance exports.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition flex items-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Import Feedback */}
      {importStatus && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2.5 ${
          importStatus.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {importStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span>{importStatus.text}</span>
        </div>
      )}

      {/* Data Pipeline Action Cards (Export & Import) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export Full Database CSV</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download all verified trainee records, skills, education, and longitudinal outcomes.
              </p>
            </div>
          </div>

          <button 
            onClick={handleExportCSV}
            disabled={loadingExport}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
          >
            {loadingExport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Download Formatted CSV</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Bulk Trainee CSV Onboarding</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload NSDC or ITI batches (`full_name`, `email`, `district`, `phone`).
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingImport}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
          >
            {loadingImport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Select CSV & Bulk Ingest</span>
          </button>
        </div>

      </div>

      {/* Live Audit Log Table */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Administrative Audit Trail ({auditLogs.length} Events)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Immutable Compliance Log</span>
        </div>

        {loadingLogs ? (
          <div className="py-16 flex items-center justify-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading audit trail...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {log.admin_email}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.target_entity || 'SYSTEM'}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
