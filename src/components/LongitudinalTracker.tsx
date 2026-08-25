'use client';

import React, { useState } from 'react';
import { 
  mockEmploymentTimeline, 
  mockWageLogs, 
  mockAttritionLogs, 
  mockTraineeProfile 
} from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  TrendingUp, 
  Briefcase, 
  AlertTriangle, 
  PlusCircle, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  UserMinus,
  FileCheck,
  ShieldCheck
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
import { AttritionReason, EmploymentType } from '@/types/database';

export const LongitudinalTracker: React.FC = () => {
  const [wageLogs, setWageLogs] = useState(mockWageLogs);
  const [attritionLogs, setAttritionLogs] = useState(mockAttritionLogs);
  
  // Modals
  const [showWageModal, setShowWageModal] = useState(false);
  const [showAttritionModal, setShowAttritionModal] = useState(false);

  // Form states
  const [newWage, setNewWage] = useState('');
  const [wageNote, setWageNote] = useState('');

  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [exitReason, setExitReason] = useState<AttritionReason>('removed_no_reason');
  const [exitExplanation, setExitExplanation] = useState('');

  // Prepare chart data
  const chartData = wageLogs.map((log) => ({
    date: log.recorded_at,
    wage: log.monthly_wage,
    increment: log.wage_increment_pct
  }));

  const currentWage = wageLogs[wageLogs.length - 1]?.monthly_wage || 42000;
  const startingBaseline = mockTraineeProfile.baseline_income;
  const overallRoiGain = Math.round(((currentWage - startingBaseline) / startingBaseline) * 100);

  const handleAddWage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWage) return;
    const num = parseFloat(newWage);
    const lastWage = wageLogs[wageLogs.length - 1]?.monthly_wage || 32000;
    const incPct = Math.round(((num - lastWage) / lastWage) * 100);

    const newLog = {
      id: `w-${Date.now()}`,
      employment_record_id: 'emp-2',
      trainee_id: 'tr-101',
      recorded_at: new Date().toISOString().split('T')[0],
      monthly_wage: num,
      wage_increment_pct: incPct,
      verified: true
    };

    setWageLogs([...wageLogs, newLog]);
    setNewWage('');
    setShowWageModal(false);
  };

  const handleAddAttrition = (e: React.FormEvent) => {
    e.preventDefault();
    const newAtt = {
      id: `att-${Date.now()}`,
      employment_record_id: 'emp-2',
      trainee_id: 'tr-101',
      exit_date: exitDate,
      tenure_days: 180,
      primary_reason: exitReason,
      specific_explanation: exitExplanation,
      was_severance_paid: false,
      next_expected_step: 'Seeking re-employment assistance',
      created_at: new Date().toISOString()
    };

    setAttritionLogs([newAtt, ...attritionLogs]);
    setExitExplanation('');
    setShowAttritionModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pre-Training Baseline</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-200 mt-2">{formatCurrency(startingBaseline)}/mo</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Unskilled Baseline</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Verified Wage</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{formatCurrency(currentWage)}/mo</p>
          <span className="text-[11px] text-emerald-400/80 mt-1 block font-medium">+{overallRoiGain}% Lifetime Growth</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Employment Status</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
              Permanent (Full-Time)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Apex Digital Solutions</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Credential Verification</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300 mt-2">100%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Offer letter & Payslips verified</span>
        </div>
      </div>

      {/* Wage Progression Chart & Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Longitudinal Wage Growth Trajectory</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically verified salary milestones tracked over time.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowWageModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Wage Increase</span>
            </button>
            <button
              onClick={() => setShowAttritionModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
            >
              <UserMinus className="w-4 h-4" />
              <span>Log Attrition / Job Exit</span>
            </button>
          </div>
        </div>

        {/* Recharts Longitudinal Line Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={(val) => formatDate(val)} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(value: any) => [`${formatCurrency(Number(value))}`, 'Monthly Wage']}
                labelFormatter={(label) => `Recorded: ${formatDate(String(label))}`}
              />
              <Area type="monotone" dataKey="wage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#wageGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employment Timeline & Attrition Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Career Timeline: Permanent vs Temporary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Longitudinal Career Milestones</h3>
            </div>
            <span className="text-xs text-slate-400">Verified Contracts</span>
          </div>

          <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2 mt-4">
            {mockEmploymentTimeline.map((emp) => (
              <div key={emp.id} className="relative space-y-1">
                {/* Dot */}
                <div className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                  emp.is_current ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-600'
                }`} />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{emp.job_title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    emp.employment_type === 'permanent' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {emp.employment_type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.company_name}</span>
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Tenure: {formatDate(emp.start_date)} — {emp.end_date ? formatDate(emp.end_date) : 'Present'}</span>
                  <span className="text-emerald-400 font-semibold">{formatCurrency(emp.current_monthly_wage)}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attrition & Exit Diagnostics */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Attrition & Exit Diagnostics</h3>
            </div>
            <span className="text-xs text-slate-400">Root-Cause Analysis</span>
          </div>

          <div className="space-y-3">
            {attritionLogs.map((att) => {
              const isUnfair = att.primary_reason === 'removed_no_reason';
              return (
                <div 
                  key={att.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isUnfair 
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400">
                      Reason: {att.primary_reason.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 text-[10px]">Exit: {formatDate(att.exit_date)}</span>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed">{att.specific_explanation}</p>

                  {att.next_expected_step && (
                    <div className="pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                      Next Step: <strong className="text-slate-200">{att.next_expected_step}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal: Log Wage Increase */}
      {showWageModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Log Wage Milestone / Promotion</h3>
            <form onSubmit={handleAddWage} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">New Monthly Wage (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45000"
                  value={newWage}
                  onChange={(e) => setNewWage(e.target.value)}
                  className="w-full bg-slate-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes / Verification Proof (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Appraisal letter Q2 2026"
                  value={wageNote}
                  onChange={(e) => setWageNote(e.target.value)}
                  className="w-full bg-slate-950 text-white text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWageModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Record Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Attrition */}
      {showAttritionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Log Job Loss / Attrition Reason</h3>
            <form onSubmit={handleAddAttrition} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Primary Reason</label>
                <select
                  value={exitReason}
                  onChange={(e) => setExitReason(e.target.value as AttritionReason)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="removed_no_reason">Removed for No Reason / Arbitrary Termination</option>
                  <option value="layoff">Company Layoff / Downsizing</option>
                  <option value="contract_expired">Contract / Internship Term Expired</option>
                  <option value="compensation">Compensation Dissatisfaction</option>
                  <option value="voluntary_upskilling">Voluntary Resignation for Upskilling</option>
                  <option value="work_environment">Work Environment / Toxic Culture</option>
                  <option value="health_personal">Health or Personal Relocation</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Detailed Circumstances</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what happened (e.g. without 30-day notice, project cancelled)..."
                  value={exitExplanation}
                  onChange={(e) => setExitExplanation(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttritionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Log Attrition Diagnostic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
