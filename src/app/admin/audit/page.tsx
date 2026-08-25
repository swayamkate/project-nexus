'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Download, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function AdminAuditPage() {
  const [loadingExport, setLoadingExport] = useState(false);
  const supabase = createClient();

  const handleExportCSV = async () => {
    setLoadingExport(true);
    try {
      const { data, error } = await supabase.from('trainees').select('*');
      if (error) throw error;
      
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => 
          Object.values(row).map(val => 
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
          ).join(',')
        ).join('\n');
        
        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `nexus_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('No data found to export.');
      }
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Data & Audit</h1>
        <p className="text-sm text-slate-400 mt-1">Export records and view system audit trails.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Download className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Export Data</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4 max-w-xs mx-auto">Download a comprehensive CSV of all trainee records, skills, and progress metrics.</p>
            <button 
              onClick={handleExportCSV}
              disabled={loadingExport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 mx-auto disabled:opacity-70"
            >
              {loadingExport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 opacity-70">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Import Data</h3>
            <p className="text-sm text-slate-400 mt-1 mb-4 max-w-xs mx-auto">Bulk upload NSDC verified trainee records via standard CSV template format.</p>
            <button 
              disabled
              className="bg-slate-800 text-slate-400 px-6 py-2.5 rounded-xl font-bold transition flex items-center justify-center space-x-2 mx-auto cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV (Coming Soon)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
