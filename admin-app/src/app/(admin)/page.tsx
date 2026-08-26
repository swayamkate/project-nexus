'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Landmark, 
  FileText, 
  ArrowUpRight, 
  Loader2,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    totalTrainees: 0,
    totalEnterprises: 0,
    pendingVerifs: 0,
    activeSchemes: 0
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [districtStats, setDistrictStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  const fetchDashboardData = async () => {
    try {
      // 1. Total Trainees Count
      const { count: traineesCount } = await supabase
        .from('trainees')
        .select('*', { count: 'exact', head: true });

      // 2. Self-Employed Count
      const { count: empCount } = await supabase
        .from('trainee_employment')
        .select('*', { count: 'exact', head: true });

      // 3. Pending Verifications Count
      const { count: verifCount } = await supabase
        .from('verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 4. Active Schemes Count
      const { count: schemeCount } = await supabase
        .from('government_schemes')
        .select('*', { count: 'exact', head: true });

      setMetrics({
        totalTrainees: traineesCount || 0,
        totalEnterprises: empCount || 0,
        pendingVerifs: verifCount || 0,
        activeSchemes: schemeCount || 0
      });

      // 5. Recent Real Audit Logs
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      if (logs) setAuditLogs(logs);

      // 6. District Stats
      const { data: districts } = await supabase
        .from('district_employment_stats')
        .select('*')
        .order('placement_rate', { ascending: false })
        .limit(5);
      if (districts) setDistrictStats(districts);

    } catch (err) {
      console.error('Error loading admin overview metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-xs text-slate-400 font-semibold">Aggregating PostgreSQL telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Mission Operations Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time state metrics streamed directly from live PostgreSQL tables.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition flex items-center space-x-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* 4 Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Trainees */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Registered Trainees</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalTrainees.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-emerald-400 font-semibold">100% Zero-PII Enclave</span>
            <Link href="/users" className="text-blue-400 hover:underline font-bold">Manage Directory →</Link>
          </div>
        </div>

        {/* Active Enterprises */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Micro-Enterprises Tracked</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalEnterprises.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 font-medium">Self-Employed Units</span>
            <Link href="/users" className="text-blue-400 hover:underline font-bold">View Roster →</Link>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Proof Audits</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400">{metrics.pendingVerifs.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 font-medium">Requires Admin Sign-off</span>
            <Link href="/verifications" className="text-amber-400 hover:underline font-bold">Audit Queue →</Link>
          </div>
        </div>

        {/* Active Schemes */}
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Schemes & Grants</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Landmark className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{metrics.activeSchemes.toLocaleString()}</p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-purple-400 font-semibold">PMEGP / Mudra / MSSDS</span>
            <Link href="/schemes" className="text-blue-400 hover:underline font-bold">View Schemes →</Link>
          </div>
        </div>

      </div>

      {/* Middle 2 Columns: District Placement Leaderboard & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District Placement Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">District Placement Performance</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Top Regions</span>
          </div>

          <div className="space-y-3">
            {districtStats.map((d, idx) => (
              <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{d.district_name}</span>
                    <span className="text-[10px] text-slate-400">{d.total_trained?.toLocaleString()} Certified Trainees</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-extrabold block">{d.placement_rate}% Placed</span>
                  <span className="text-[10px] text-slate-400">Avg ₹{Number(d.avg_wage || 0).toLocaleString()}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Audit Trail Log (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a1020] border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Live System Audit Log</h3>
            </div>
            <Link href="/audit" className="text-xs text-blue-400 hover:underline font-bold">
              View All Logs →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Admin</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white truncate max-w-[120px]">
                      {log.admin_email}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-blue-400">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {log.target_entity || 'SYSTEM'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
