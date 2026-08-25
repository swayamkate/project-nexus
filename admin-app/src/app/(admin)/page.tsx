import React from 'react';
import { Activity, Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">System Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time health and metrics for the Nexus platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400">Total Users</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Users className="w-4 h-4 text-blue-400" /></div>
          </div>
          <p className="text-3xl font-black text-white">12,482</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">+142 this week</p>
        </div>
        
        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400">System Health</h3>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-400" /></div>
          </div>
          <p className="text-3xl font-black text-white">99.9%</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">All services operational</p>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400">Security Alerts</h3>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-400" /></div>
          </div>
          <p className="text-3xl font-black text-white">3</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Requires review</p>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400">Active Promos</h3>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-purple-400" /></div>
          </div>
          <p className="text-3xl font-black text-white">12</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Across 4 districts</p>
        </div>
      </div>

      <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-6 shadow-sm">
         <h3 className="font-bold text-white mb-4">Recent Audit Logs</h3>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                 <th className="py-3 px-4 font-semibold">Timestamp</th>
                 <th className="py-3 px-4 font-semibold">Admin</th>
                 <th className="py-3 px-4 font-semibold">Action</th>
                 <th className="py-3 px-4 font-semibold">Status</th>
               </tr>
             </thead>
             <tbody className="text-sm text-slate-300">
               <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                 <td className="py-3 px-4 font-mono text-xs">2026-08-25 14:30:22</td>
                 <td className="py-3 px-4">admin@nexus.com</td>
                 <td className="py-3 px-4">Exported Trainee CSV</td>
                 <td className="py-3 px-4"><span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">Success</span></td>
               </tr>
               <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                 <td className="py-3 px-4 font-mono text-xs">2026-08-25 12:15:01</td>
                 <td className="py-3 px-4">admin@nexus.com</td>
                 <td className="py-3 px-4">Suspended user: TRN-9921</td>
                 <td className="py-3 px-4"><span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">Success</span></td>
               </tr>
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
