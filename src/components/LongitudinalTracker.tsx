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
  Loader2,
  X
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

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWage) return;
    setWageHistory([...wageHistory, { month: newMonth, wage: Number(newWage) }]);
    setShowAddModal(false);
    setNewWage('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employment & Wage Progression</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Longitudinal 24-month income trajectories, retention curves, and district benchmarks
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Record Wage Milestone</span>
        </button>
      </div>

      {/* Trainee Wage Growth Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Longitudinal Wage Progression Curve</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            +206% Growth from Baseline
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wageHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="wageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Monthly Income']}
              />
              <Area type="monotone" dataKey="wage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#wageGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Placement Benchmarks */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">District Industrial Benchmark Comparison</h3>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading district benchmarks...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Total Certified</th>
                  <th className="py-3 px-4">Placement Rate</th>
                  <th className="py-3 px-4">Avg Monthly Wage</th>
                  <th className="py-3 px-4 text-right">Top Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(districtStats.length > 0 ? districtStats : [
                  { district: 'Pune', total_trained: 14200, placement_rate: 78.5, avg_monthly_wage: 19500, top_industry: 'Automotive & EV' },
                  { district: 'Mumbai Suburban', total_trained: 18900, placement_rate: 76.2, avg_monthly_wage: 22000, top_industry: 'IT & ITeS' },
                  { district: 'Nagpur', total_trained: 9800, placement_rate: 71.4, avg_monthly_wage: 16500, top_industry: 'Logistics' },
                  { district: 'Nashik', total_trained: 8400, placement_rate: 69.8, avg_monthly_wage: 15800, top_industry: 'Agri-Tech & Solar' }
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{row.district}</span>
                    </td>
                    <td className="py-3 px-4">{Number(row.total_trained || 12000).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{row.placement_rate}%</td>
                    <td className="py-3 px-4 font-semibold">₹{Number(row.avg_monthly_wage || 18000).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-500">{row.top_industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Income Progression</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Milestone Stage</label>
                <input
                  type="text"
                  required
                  value={newMonth}
                  onChange={e => setNewMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Monthly Income (₹)</label>
                <input
                  type="number"
                  required
                  value={newWage}
                  onChange={e => setNewWage(e.target.value)}
                  placeholder="e.g. 28000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
