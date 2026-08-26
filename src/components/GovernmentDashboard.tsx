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
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  Repeat
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
    { period: 'Apr 2026', count: 14653 }, // 14,65,320
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

  // Wage Stagnation Reasons
  const stagnationReasons = [
    { name: 'Lack of Relevant Skills', value: 32, color: '#ec4899' },
    { name: 'Experience Required', value: 25, color: '#10b981' },
    { name: 'Limited Job Opportunities', value: 18, color: '#f59e0b' },
    { name: 'Location Constraints', value: 15, color: '#8b5cf6' },
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-800">
      
      {/* Date Range Selector Header */}
      <div className="flex justify-end">
        <div className="inline-flex items-center space-x-2 bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-xs">
          <span>01 Apr 2024 - 30 Apr 2026</span>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Trainees */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Trainees</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">25,42,180</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 12.5% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

        {/* Certified */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certified</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">20,18,560</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 11.3% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

        {/* Employed */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Employed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">14,65,320</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 10.8% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

        {/* Employment Rate */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Employment Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">72.6%</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 3.6% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

        {/* Avg Monthly Salary */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Monthly Salary</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">₹18,500</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 8.2% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

        {/* 6M Retention Rate */}
        <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">6M Retention Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900">68.4%</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center">
            ↑ 4.1% <span className="text-slate-400 font-normal ml-1">from last period</span>
          </span>
        </div>

      </div>

      {/* Middle Grid: Trend Line, Placement Donut, Status List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Line (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Employment Trend Over Time</h3>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg outline-none font-semibold"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={v => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: any) => [`${(Number(v) * 100).toLocaleString()}`, 'Employed Trainees']}
                />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Placement by Course Category</h3>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600">{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employment Status Breakdown (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Employment Status</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Employed</span>
              </div>
              <span className="font-bold text-slate-800">14,65,320 (57.6%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600">Self-employed</span>
              </div>
              <span className="font-bold text-slate-800">3,25,420 (12.8%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-600">Apprenticeship</span>
              </div>
              <span className="font-bold text-slate-800">1,85,750 (7.3%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600">Job Seeking</span>
              </div>
              <span className="font-bold text-slate-800">3,45,210 (13.6%)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Not Employed</span>
              </div>
              <span className="font-bold text-slate-800">1,20,480 (4.7%)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-700">
            <span>Total Tracked</span>
            <span>25,42,180</span>
          </div>
        </div>

      </div>

      {/* Bottom Grid: District Employment, Salary Progression Bar Chart, Top Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District Employment (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Employment by District</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer">View All</span>
          </div>

          <div className="space-y-2 text-xs">
            {districtList.map((d, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <span className="font-semibold text-slate-700">{d.name}</span>
                <span className="font-bold text-slate-900">{d.count}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-2 text-xs text-blue-700">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>36 Districts Active across Maharashtra</span>
          </div>
        </div>

        {/* Salary Progression & Stagnation (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Salary Progression (Avg)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Bar Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="stage" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Avg Salary']}
                  />
                  <Bar dataKey="salary" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stagnation Donut */}
            <div className="space-y-1 text-center">
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
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block">Wage Inhibitor Breakdown</span>
            </div>
          </div>
        </div>

        {/* Top Skill Gaps (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Top Skill Gaps</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer">View All</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 pb-1 border-b border-slate-100">
              <span>Skill</span>
              <span>Demand Gap</span>
            </div>
            {topSkillGaps.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <span className="text-slate-700 font-medium">{item.skill}</span>
                <span className="font-bold text-rose-500">{item.gap}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Total Industrial Deficit:</span>
            <span className="font-bold text-slate-900">17,260</span>
          </div>
        </div>

      </div>

      {/* AI Insight of the Day Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">AI Insight of the Day</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-bold">Auto Policy Generator</span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-4xl">
              The demand for <strong className="text-blue-900">Electric Vehicle Technicians</strong> has increased by <strong className="text-emerald-700 font-bold">35%</strong> in the last 6 months, but trained candidates are only <strong className="text-rose-600 font-bold">12%</strong> of the demand in Pune and Nashik districts.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Automated policy action memo dispatched to Pune & Nashik District Skill Offices!')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition whitespace-nowrap shadow-sm shadow-blue-600/20 cursor-pointer"
        >
          Action Insight
        </button>
      </div>

    </div>
  );
};
