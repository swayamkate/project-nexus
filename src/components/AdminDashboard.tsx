'use client';

import React, { useState } from 'react';
import { mockGeospatialStats, mockAttritionLogs } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  AlertOctagon, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState('All States');

  // National metrics
  const totalTrainees = mockGeospatialStats.reduce((acc, s) => acc + s.trainees, 0);
  const avgNationalPlacement = (mockGeospatialStats.reduce((acc, s) => acc + s.placement_rate, 0) / mockGeospatialStats.length).toFixed(1);
  const avgNationalWage = Math.round(mockGeospatialStats.reduce((acc, s) => acc + s.avg_wage, 0) / mockGeospatialStats.length);

  // Longitudinal Retention Curve Data (M+1 to M+24)
  const retentionCurveData = [
    { milestone: 'Month 1', retention_rate: 94.2, baseline: 100 },
    { milestone: 'Month 3', retention_rate: 89.5, baseline: 100 },
    { milestone: 'Month 6', retention_rate: 84.1, baseline: 100 },
    { milestone: 'Month 12', retention_rate: 78.4, baseline: 100 },
    { milestone: 'Month 18', retention_rate: 74.0, baseline: 100 },
    { milestone: 'Month 24', retention_rate: 71.2, baseline: 100 },
  ];

  // Job Condition Distribution
  const jobConditionData = [
    { name: 'Permanent (Full-time)', value: 74, color: '#3b82f6' },
    { name: 'Verified Self-Employed', value: 16, color: '#06b6d4' },
    { name: 'Temporary / Contract', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-400">
            <BarChart3 className="w-6 h-6" />
            <h1 className="text-2xl font-black text-white">National Skilling Outcomes & Policy Analytics</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Longitudinal impact measurement, wage growth multiples, and state-level policy effectiveness for NSDC & State Skilling Missions (PS-135).
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Differential Privacy Applied (k ≥ 5)</span>
        </div>
      </div>

      {/* High-Level Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>Total Tracked Trainees</span>
            <Users className="w-4 h-4 text-blue-400" />
          </span>
          <p className="text-3xl font-black text-white mt-2">{totalTrainees.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2% YoY Enrolled</span>
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>National Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </span>
          <p className="text-3xl font-black text-emerald-400 mt-2">{avgNationalPlacement}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Within 90 Days of Certification</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>Average Monthly Wage</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </span>
          <p className="text-3xl font-black text-cyan-300 mt-2">{formatCurrency(avgNationalWage)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">+152% over pre-training baseline</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <span className="text-slate-400 text-xs font-medium flex items-center justify-between">
            <span>12-Month Job Retention</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </span>
          <p className="text-3xl font-black text-amber-300 mt-2">78.4%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Longitudinal Stability Index</span>
        </div>
      </div>

      {/* State-Level Geospatial Analysis & Retention Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: State-by-State Performance Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Geospatial Placement & Wage Multiplier Heatmap</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">State-level placement rate vs median wage gain</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockGeospatialStats} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="state" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any, name: any) => [
                    name === 'placement_rate' ? `${val}% Placement Rate` : `₹${Number(val).toLocaleString()} Avg Wage`,
                    name === 'placement_rate' ? 'Placement Rate' : 'Avg Wage'
                  ]}
                />
                <Bar dataKey="placement_rate" fill="#3b82f6" radius={[6, 6, 0, 0]} name="placement_rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Job Stability Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Job Condition Mix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Permanent vs. Gig vs. Self-employed</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobConditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobConditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {jobConditionData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Longitudinal 24-Month Retention Curve */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Longitudinal Retention Decay Curve (24-Month Cohort Analysis)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Proportion of placed candidates who remain continuously employed over 24 months.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="milestone" stroke="#64748b" fontSize={11} />
              <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any) => [`${val}% Retained`, 'Employment Retention']}
              />
              <Line 
                type="monotone" 
                dataKey="retention_rate" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#f59e0b' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
