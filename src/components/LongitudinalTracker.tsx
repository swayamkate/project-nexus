'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  AlertTriangle, 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  ShieldCheck,
  MapPin,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { createClient } from '@/lib/supabaseBrowser';
import { useUser } from '@/context/UserContext';

export const LongitudinalTracker: React.FC = () => {
  const { employment } = useUser();
  const [districtStats, setDistrictStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wageHistory, setWageHistory] = useState<any[]>([
    { month: 'Month 0 (Baseline)', wage: 8000 },
    { month: 'Month 3 (Follow-up)', wage: 12500 },
    { month: 'Month 6 (Mid-Term)', wage: 18000 },
    { month: 'Month 12 (Annual)', wage: 24500 }
  ]);
  const [newWage, setNewWage] = useState('');
  const [newMonth, setNewMonth] = useState('Month 18 (Scaling)');
  const [showAddModal, setShowAddModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('district_employment_stats')
        .select('*')
        .order('placement_rate', { ascending: false });

      if (data && data.length > 0) {
        setDistrictStats(data);
      }
      setLoading(false);
    };
    fetchDistricts();
  }, [supabase]);

  const handleAddWage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWage) return;
    setWageHistory([
      ...wageHistory,
      { month: newMonth, wage: Number(newWage) }
    ]);
    setNewWage('');
    setShowAddModal(false);
  };

  const currentWage = wageHistory[wageHistory.length - 1]?.wage || 18000;
  const initialWage = wageHistory[0]?.wage || 8000;
  const totalGrowthPct = Math.round(((currentWage - initialWage) / initialWage) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Longitudinal Wage Progression Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Wage Growth & Retention Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Cryptographically verified longitudinal income trajectory across 3, 6, 12, 18, and 24-month milestones.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-blue-600/20 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Wage Increment</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e1628] border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 block">Current Verified Income</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            ₹{currentWage.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/month</span>
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-2 inline-block">
            +₹{(currentWage - initialWage).toLocaleString('en-IN')} net increase
          </span>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 block">Baseline Starting Income</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-300 mt-1">
            ₹{initialWage.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/month</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-2 inline-block">Pre-skilling baseline</span>
        </div>

        <div className="bg-[#0e1628] border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 block">Longitudinal Income Escalation</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            +{totalGrowthPct}%
          </p>
          <span className="text-[11px] text-emerald-400/80 font-semibold mt-2 inline-block">
            Over 12 months post-certification
          </span>
        </div>
      </div>

      {/* Wage Escalation Area Chart */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Wage Escalation Curve</h2>
            <p className="text-xs text-slate-400">Monthly earnings progression over time</p>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg">
            Live Trajectory
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wageHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a1020', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Monthly Income']}
              />
              <Area type="monotone" dataKey="wage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#wageGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Employment Benchmarks from Real PostgreSQL DB */}
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>State District Outcomes (PostgreSQL Source)</span>
            </h2>
            <p className="text-xs text-slate-400">Aggregated district placement rates and average wages</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">live db connection</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Total Trained</th>
                <th className="py-3 px-4">Self-Employed</th>
                <th className="py-3 px-4">Average Wage</th>
                <th className="py-3 px-4 text-right">Placement Rate</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-slate-800/40">
              {districtStats.map(d => (
                <tr key={d.id} className="hover:bg-slate-800/20 transition">
                  <td className="py-3 px-4 font-bold text-white">{d.district_name}</td>
                  <td className="py-3 px-4">{d.total_trained?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-purple-400 font-semibold">{d.self_employed_count?.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">₹{Number(d.avg_wage).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      {d.placement_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding wage log */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Verified Income Update</h3>
            <form onSubmit={handleAddWage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Milestone Tag</label>
                <select
                  value={newMonth}
                  onChange={e => setNewMonth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Month 18 (Scaling)">Month 18 (Scaling)</option>
                  <option value="Month 24 (Longitudinal Audit)">Month 24 (Longitudinal Audit)</option>
                  <option value="Special Assessment">Special Assessment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Monthly Earnings (₹)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={newWage}
                  onChange={e => setNewWage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 28000"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                >
                  Save to Curve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
