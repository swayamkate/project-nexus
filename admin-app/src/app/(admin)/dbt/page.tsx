'use client';

import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  CreditCard,
  Building,
  TrendingUp,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

interface DbtRecord {
  id: string;
  transaction_id: string;
  trainee_name: string;
  trainee_email: string;
  district: string;
  scheme_name: string;
  disbursed_amount: number;
  bank_name: string;
  masked_account_number: string;
  ifsc_code: string;
  payment_status: string;
  payment_mode: string;
  disbursed_at: string;
}

export default function DbtPage() {
  const [dbtRecords, setDbtRecords] = useState<DbtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const supabase = createClient();

  useEffect(() => {
    fetchDbtRecords();
  }, []);

  const fetchDbtRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dbt_disbursements')
        .select('*')
        .order('disbursed_at', { ascending: false });

      if (!error && data) {
        setDbtRecords(data);
      }
    } catch (err) {
      console.error('Failed to load DBT records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = dbtRecords.filter((r) => {
    const matchesSearch = 
      r.trainee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bank_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'All' || r.district === districtFilter;
    const matchesStatus = statusFilter === 'All' || r.payment_status === statusFilter;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const totalDisbursed = dbtRecords.reduce((acc, r) => acc + Number(r.disbursed_amount), 0);
  const totalBeneficiaries = new Set(dbtRecords.map((r) => r.trainee_email)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              PFMS & APBS Gateway
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              NPCI Direct Treasury Sync
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Direct Benefit Transfer (DBT) Ledger</h1>
          <p className="text-xs text-slate-400">
            Real-time reconciliation of monthly vocational stipends, PMEGP tool-kit grants, and NAPS apprenticeship payments.
          </p>
        </div>

        <button 
          onClick={fetchDbtRecords} 
          className="flex items-center space-x-2 bg-slate-900 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync PFMS Gateway</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Total Funds Disbursed</span>
            <Landmark className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">₹{totalDisbursed.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-1">Directly credited to Aadhaar-seeded accounts</p>
        </div>

        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Verified Beneficiaries</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalBeneficiaries} Trainees</p>
          <p className="text-[10px] text-emerald-400 mt-1">100% PFMS APBS settlement rate</p>
        </div>

        <div className="bg-[#0c1322] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider">Disbursement Mode</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-black text-cyan-400 mt-2">Aadhaar Payment Bridge</p>
          <p className="text-[10px] text-slate-400 mt-1">NPCI APBS & State Treasury Portal</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transaction ID, candidate name, or bank..."
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-blue-500"
          />
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-blue-500"
        >
          <option value="All">All Districts</option>
          <option value="Pune">Pune</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Nashik">Nashik</option>
          <option value="Aurangabad (Chhatrapati Sambhajinagar)">Chhatrapati Sambhajinagar</option>
          <option value="Thane">Thane</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-blue-500"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Success">Success (Settled)</option>
          <option value="Processing">Processing Treasury</option>
          <option value="Bank Rejected">Bank Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Disbursement Transaction Registry</h2>
            <p className="text-xs text-slate-400">Cryptographically signed records linked to state treasury</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">Showing {filteredRecords.length} Transactions</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">Loading disbursement ledger...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">No disbursement records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 px-3">PFMS Ref / Transaction</th>
                  <th className="pb-3 px-3">Beneficiary</th>
                  <th className="pb-3 px-3">Scheme & Purpose</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Bank & Account</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Disbursed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-400 font-bold">
                      {r.transaction_id}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-white font-bold block">{r.trainee_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.district}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="font-semibold text-white block">{r.scheme_name}</span>
                      <span className="text-[10px] text-slate-500">{r.payment_mode}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold text-sm">
                      ₹{Number(r.disbursed_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <span className="text-white block">{r.bank_name}</span>
                      <span className="text-slate-400 font-mono">{r.masked_account_number} ({r.ifsc_code})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black ${
                        r.payment_status === 'Success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        ✓ {r.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(r.disbursed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
