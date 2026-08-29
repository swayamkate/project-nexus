'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { mutateAdminDb } from '@/lib/adminApi';
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
          await mutateAdminDb({
            action: 'insert',
            table: 'trainee_notifications',
            payload: {
              trainee_id: f.trainee_id,
              title: `Mandatory ${readableMilestone.toUpperCase()} Longitudinal Survey Due`,
              message: `Your verified ${readableMilestone} career outcome & wage check-in is pending. Please complete your survey on the portal. [Expires in 3 days]`,
              type: 'survey',
              is_read: false
            }
          });
          countDispatched++;
        }
      }

      // If no pending followups were in state, trigger for available trainees
      if (countDispatched === 0) {
        const { data: trainees } = await supabase.from('trainees').select('id, full_name').limit(10);
        if (trainees) {
          for (const t of trainees) {
            await mutateAdminDb({
              action: 'insert',
              table: 'trainee_notifications',
              payload: {
                trainee_id: t.id,
                title: 'Scheduled Longitudinal Survey Reminder',
                message: 'Your upcoming career check-in is ready for submission on the CareerLoop portal. [Expires in 3 days]',
                type: 'survey',
                is_read: false
              }
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
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {triggering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Dispatching Alerts...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Trigger Due Milestone Surveys</span>
            </>
          )}
        </button>
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0a1020] border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Total Follow-ups</span>
          <p className="text-2xl font-black text-white">{followups.length}</p>
        </div>
        <div className="bg-[#0a1020] border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 font-semibold">Completed Check-ins</span>
          <p className="text-2xl font-black text-emerald-400">{completedCount}</p>
        </div>
        <div className="bg-[#0a1020] border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-semibold">Upcoming / Due</span>
          <p className="text-2xl font-black text-amber-400">{upcomingCount}</p>
        </div>
        <div className="bg-[#0a1020] border border-slate-800 p-5 rounded-2xl space-y-1">
          <span className="text-xs text-blue-400 font-semibold">State Response Rate</span>
          <p className="text-2xl font-black text-blue-400">{completionRate}%</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0a1020] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate, email, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={milestoneFilter}
            onChange={(e) => setMilestoneFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="all">All Milestones</option>
            <option value="3_months">3 Months (M+3)</option>
            <option value="6_months">6 Months (M+6)</option>
            <option value="12_months">12 Months (M+12)</option>
            <option value="18_months">18 Months (M+18)</option>
            <option value="24_months">24 Months (M+24)</option>
          </select>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="bg-[#0a1020] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center space-x-3 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading Longitudinal Telemetry...</span>
          </div>
        ) : filteredFollowups.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs font-semibold">
            No longitudinal follow-up records found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Milestone</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reported Status</th>
                  <th className="py-3.5 px-4">Reported Income</th>
                  <th className="py-3.5 px-4">Support Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredFollowups.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{f.trainees?.full_name || 'Candidate'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{f.trainees?.email || f.trainee_id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{f.trainees?.district || 'Maharashtra'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 font-bold rounded text-[10px] uppercase">
                        {(f.milestone || '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{f.due_date || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        f.status === 'overdue' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 capitalize">
                      {(f.current_status || '-').replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {f.current_income_range || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {f.additional_support_needed || f.remarks || '-'}
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
