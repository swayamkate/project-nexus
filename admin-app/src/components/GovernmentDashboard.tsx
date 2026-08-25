'use client';

import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  ChevronDown, 
  MapPin, 
  Bot, 
  ArrowUpRight, 
  PieChart as PieIcon,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

export const GovernmentDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Monthly');

  // Employment Trend Over Time
  const trendData = [
    { period: 'Jul 2024', count: 4200 },
    { period: 'Oct 2024', count: 5800 },
    { period: 'Jan 2025', count: 7100 },
    { period: 'Apr 2025', count: 8900 },
    { period: 'Jul 2025', count: 10400 },
    { period: 'Oct 2025', count: 11800 },
    { period: 'Jan 2026', count: 13200 },
    { period: 'Apr 2026', count: 14653 }, // In thousands (14,65,320)
  ];

  // Placement by Course Category
  const categoryData = [
    { name: 'IT & ITeS', value: 28, color: '#3b82f6' },
    { name: 'Engineering', value: 24, color: '#10b981' },
    { name: 'Healthcare', value: 19, color: '#f59e0b' },
    { name: 'Construction', value: 15, color: '#ec4899' },
    { name: 'Others', value: 14, color: '#8b5cf6' },
  ];

  // Salary Progression (Avg)
  const salaryData = [
    { stage: 'At Joining', salary: 12500 },
    { stage: '3 Months', salary: 14200 },
    { stage: '6 Months', salary: 16800 },
    { stage: '12 Months', salary: 18500 },
  ];

  // Reasons for Wage Stagnation / Challenges
  const stagnationReasons = [
    { name: 'Lack of Relevant Skills', value: 32, color: '#ec4899' },
    { name: 'Experience Required', value: 25, color: '#10b981' },
    { name: 'Location Constraints', value: 15, color: '#8b5cf6' },
    { name: 'Limited Job Opportunities', value: 18, color: '#f59e0b' },
    { name: 'Other Reasons', value: 10, color: '#64748b' },
  ];

  const districtList = [
    { name: 'Pune', count: '2,45,680' },
    { name: 'Mumbai', count: '2,10,450' },
    { name: 'Nagpur', count: '1,25,840' },
    { name: 'Nashik', count: '1,05,230' },
    { name: 'Aurangabad', count: '98,750' },
  ];

  const topSkillGaps = [
    { skill: 'Electric Vehicle Technician', gap: '-4,250' },
    { skill: 'Industrial Automation', gap: '-3,870' },
    { skill: 'Data Analytics', gap: '-3,400' },
    { skill: 'Cloud Computing', gap: '-2,980' },
    { skill: 'Solar Panel Technician', gap: '-2,760' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Date Range Selector Header */}
      <div className="flex justify-end items-center">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 text-slate-300 text-xs px-3.5 py-1.5 rounded-xl shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>01 Apr 2024 - 30 Apr 2026</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* 6 Top Stat KPI Cards with Rounded Icons and Delta Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Trainees */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Total Trainees</span>
          </div>
          <p className="text-xl font-black text-white">25,42,180</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>12.5% from last period</span>
          </span>
        </div>

        {/* Certified */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Certified</span>
          </div>
          <p className="text-xl font-black text-white">20,18,560</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>11.3% from last period</span>
          </span>
        </div>

        {/* Employed */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Employed</span>
          </div>
          <p className="text-xl font-black text-white">14,65,320</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>10.8% from last period</span>
          </span>
        </div>

        {/* Employment Rate */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Employment Rate</span>
          </div>
          <p className="text-xl font-black text-white">72.6%</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>3.6% from last period</span>
          </span>
        </div>

        {/* Avg Monthly Salary */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Avg Monthly Salary</span>
          </div>
          <p className="text-xl font-black text-white">₹18,500</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>8.2% from last period</span>
          </span>
        </div>

        {/* 6M Retention Rate */}
        <div className="bg-[#0e1628] border border-slate-800/90 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">6M Retention Rate</span>
          </div>
          <p className="text-xl font-black text-white">68.4%</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>4.1% from last period</span>
          </span>
        </div>
      </div>

      {/* Middle Grid: Trend Chart, Donut Placement, Employment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Employment Trend Over Time (6 cols) */}
        <div className="lg:col-span-6 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Employment Trend Over Time</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-900 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val/1000}K`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px' }}
                  formatter={(val: any) => [`${(Number(val) * 100).toLocaleString()}`, 'Employed Trainees']}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement by Course Category (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <h3 className="font-bold text-white text-sm">Placement by Course Category</h3>
          
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1 text-[11px] pt-1">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </span>
                <span className="font-bold text-slate-200">{cat.value}%</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-800/80 flex justify-between font-bold text-xs text-slate-100">
              <span>Total</span>
              <span className="text-blue-400">14,65,320</span>
            </div>
          </div>
        </div>

        {/* Employment Status (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm">Employment Status</h3>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Employed</span>
                </span>
                <span className="font-bold text-slate-100">14,65,320 (57.6%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '57.6%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Self-employed</span>
                </span>
                <span className="font-bold text-slate-100">3,25,420 (12.8%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '12.8%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Apprenticeship</span>
                </span>
                <span className="font-bold text-slate-100">1,85,750 (7.3%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '7.3%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Job Seeking</span>
                </span>
                <span className="font-bold text-slate-100">3,45,210 (13.6%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '13.6%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center space-x-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Not Employed</span>
                </span>
                <span className="font-bold text-slate-100">1,20,480 (4.7%)</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '4.7%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Employment by District, Salary Progression Bar Chart, Top Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Employment by District (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Employment by District</h3>
            <span className="text-xs text-blue-400 font-semibold cursor-pointer">View All</span>
          </div>

          <div className="space-y-2.5">
            {districtList.map((d, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <span className="text-slate-300 font-medium">{d.name}</span>
                <span className="font-bold text-slate-100">{d.count}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-center space-x-2 text-[11px] text-blue-300">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>36 Districts Active in Maharashtra Skilling Mission</span>
          </div>
        </div>

        {/* Salary Progression (Avg) & Stagnation Pie (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-white text-sm">Salary Progression (Avg)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Bar Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Avg Salary']}
                  />
                  <Bar dataKey="salary" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stagnation Breakdown Donut */}
            <div className="space-y-2">
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stagnationReasons}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                      dataKey="value"
                    >
                      {stagnationReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-slate-400 text-center font-medium">
                Wage Growth Inhibitor Breakdown
              </div>
            </div>
          </div>
        </div>

        {/* Top Skill Gaps (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Top Skill Gaps</h3>
            <span className="text-xs text-blue-400 font-semibold cursor-pointer">View All</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 pb-1 border-b border-slate-800">
              <span>Skill</span>
              <span>Demand Gap</span>
            </div>
            {topSkillGaps.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <span className="text-slate-200 font-medium">{item.skill}</span>
                <span className="font-bold text-rose-400">{item.gap}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between items-center">
            <span>Aggregated across 1,420 industrial employers</span>
            <span className="font-bold text-slate-200">Total Deficit: 17,260</span>
          </div>
        </div>

      </div>

      {/* AI Insight of the Day Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-[#0e1628] to-indigo-950/70 border border-blue-800/40 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">AI Insight of the Day</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.2 rounded-full border border-blue-500/20">Auto Policy Generator</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed max-w-4xl">
              The demand for <strong className="text-amber-400">Electric Vehicle Technicians</strong> has increased by <strong className="text-emerald-400">35%</strong> in the last 6 months, but trained candidates are only <strong className="text-rose-400">12%</strong> of the demand in Pune and Nashik districts.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Generated policy recommendation report sent to District Skill Officers.')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition whitespace-nowrap shadow-md shadow-blue-600/20"
        >
          Action Insight
        </button>
      </div>

    </div>
  );
};
