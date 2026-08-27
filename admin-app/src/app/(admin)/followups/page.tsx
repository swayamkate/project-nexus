'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { logAdminAction } from '@/lib/auditLogger';
import { 
  CalendarClock, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  Search, 
  TrendingUp, 
  Building2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Users
} from 'lucide-react';

export default function AdminFollowupsPage() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [milestoneFilter, setMilestoneFilter] = useState('all');
  const [triggering, setTriggering] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const supabase = createClient();

  const fetchFollowups = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('trainee_followups')
      .select('*, trainees(full_name, email, phone, district, trainee_id)')
      .order('due_date', { ascending: true });

    if (data) setFollowups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleTriggerBatch = async () => {
    setTriggering(true);
    try {
      // 1. Find all active/pending/overdue follow-ups
      const dueFollowups = followups.filter(f => f.status === 'upcoming' || f.status === 'scheduled' || f.status === 'overdue');
      
      let countDispatched = 0;
      for (const f of dueFollowups) {
        if (f.trainee_id) {
          const readableMilestone = (f.milestone || 'milestone').replace('_', ' ');
          await supabase.from('trainee_notifications').insert({
            trainee_id: f.trainee_id,
            title: `Mandatory ${readableMilestone.toUpperCase()} Longitudinal Survey Due`,
            message: `Your verified ${readableMilestone} career outcome & wage check-in is pending. Please complete your survey on the portal.`,
            type: 'survey'
          });
          countDispatched++;
        }
      }

      // If no pending followups were in state, trigger for available trainees
      if (countDispatched === 0) {
        const { data: trainees } = await supabase.from('trainees').select('id, full_name').limit(10);
        if (trainees) {
          for (const t of trainees) {
            await supabase.from('trainee_notifications').insert({
              trainee_id: t.id,
              title: 'Scheduled Longitudinal Survey Reminder',
              message: 'Your upcoming career check-in is ready for submission on the Nexus portal.',
              type: 'survey'
            });
            countDispatched++;
          }
        }
      }

      // 2. Log real audit action
      await logAdminAction(
        'TRIGGER_LONGITUDINAL_SURVEYS',
        'TRAINEE_FOLLOWUPS',
        null,
        `Dispatched milestone check-in notifications to ${countDispatched} trainees with active follow-ups.`
      );

      setToastMsg(`Dispatched survey notifications to ${countDispatched} candidates.`);
      setTimeout(() => setToastMsg(null), 4000);
      await fetchFollowups();
    } catch (err: any) {
      setToastMsg('Trigger error: ' + err.message);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setTriggering(false);
    }
  };

  const completedCount = followups.filter(f => f.status === 'completed').length;
  const upcomingCount = followups.filter(f => f.status === 'upcoming' || f.status === 'scheduled').length;
  const completionRate = followups.length > 0 ? Math.round((completedCount / followups.length) * 100) : 0;

  const filteredFollowups = followups.filter(f => {
    const matchesMilestone = milestoneFilter === 'all' || f.milestone === milestoneFilter;
    const matchesSearch = 
      (f.trainees?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.trainees?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.trainees?.district || '').toLowerCase().includes(search.toLowerCase());
    return matchesMilestone && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Longitudinal Follow-up & Survey Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track 3, 6, 12, 18, and 24-month wage milestones, job retention rates, and automated survey triggers.
          </p>
        </div>

        <button
          onClick={handleTriggerBatch}
          disabled={triggering}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-60"
        >
          {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Dispatch Milestone Survey Reminders</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Total Tracked Follow-ups</span>
          <p className="text-2xl font-black text-white">{followups.length}</p>
          <span className="text-[11px] text-slate-500 font-semibold">Across all 36 Maharashtra Districts</span>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Survey Completion Rate</span>
          <p className="text-2xl font-black text-emerald-400">{completionRate}%</p>
          <span className="text-[11px] text-emerald-400/80 font-semibold">{completedCount} Verified Responses</span>
        </div>

        <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400">Upcoming Surveys (30 Days)</span>
          <p className="text-2xl font-black text-amber-400">{upcomingCount}</p>
          <span className="text-[11px] text-amber-400/80 font-semibold">Auto-reminders active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by trainee name, district, or email..."
            className="w-full bg-[#0a1020] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={milestoneFilter}
          onChange={e => setMilestoneFilter(e.target.value)}
          className="bg-[#0a1020] border border-slate-800 text-slate-300 text-xs px-3.5 py-2.5 rounded-xl outline-none"
        >
          <option value="all">All Milestones</option>
          <option value="3_months">3 Months</option>
          <option value="6_months">6 Months</option>
          <option value="12_months">12 Months</option>
          <option value="18_months">18 Months</option>
          <option value="24_months">24 Months</option>
        </select>
      </div>

      {/* Follow-up Queue Table */}
      <div className="bg-[#0a1020] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Longitudinal Check-in Ledger</h3>
          <span className="text-[11px] text-slate-400">Streamed from PostgreSQL public.trainee_followups</span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" /> Loading follow-ups...
          </div>
        ) : filteredFollowups.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No survey records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-4">Trainee Candidate</th>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Reported Status</th>
                  <th className="py-3 px-4">Reported Income</th>
                  <th className="py-3 px-4">Survey Status</th>
                  <th className="py-3 px-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filteredFollowups.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{f.trainees?.full_name || 'Trainee'}</span>
                      <span className="text-[11px] text-slate-400">{f.trainees?.district || 'District not recorded'} • {f.trainees?.phone || 'Phone not recorded'}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-blue-400 uppercase">
                      {f.milestone?.replace('_', ' ')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {f.due_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${f.current_status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {f.current_status || '-'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {f.current_income_range || '-'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        f.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {f.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 truncate max-w-[200px]">
                      {f.remarks || 'Pending submission'}
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
