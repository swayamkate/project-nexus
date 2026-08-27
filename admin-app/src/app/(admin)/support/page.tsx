'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  Headphones, 
  MessageSquare, 
  Bug, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Send, 
  Loader2, 
  AlertCircle, 
  User, 
  Mail, 
  Calendar,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { formatHumanError } from '@/lib/errorUtils';

export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'feedback'>('tickets');
  const [tickets, setTickets] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selected Item for Drawer / Response
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch support tickets
      const { data: ticketsData, error: tErr } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (tErr) console.error('Tickets error:', tErr);
      if (ticketsData) setTickets(ticketsData);

      // 2. Fetch platform feedback & bug reports
      const { data: fbData, error: fErr } = await supabase
        .from('platform_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fErr) console.error('Feedback error:', fErr);
      if (fbData) setFeedbackList(fbData);

    } catch (e) {
      console.error('Support fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status: newStatus,
          admin_response: adminResponseText.trim() || selectedTicket?.admin_response || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      // Log in audit_logs
      await supabase.from('audit_logs').insert({
        admin_email: 'admin@nexus.com',
        action: 'UPDATE_SUPPORT_TICKET',
        target_entity: 'SUPPORT_TICKETS',
        target_id: ticketId,
        details: `Updated ticket ${ticketId} status to ${newStatus}`,
        status: 'Success'
      });

      setTickets(prev => prev.map(t => t.id === ticketId ? { 
        ...t, 
        status: newStatus,
        admin_response: adminResponseText.trim() || t.admin_response 
      } : t));

      if (selectedTicket) {
        setSelectedTicket({
          ...selectedTicket,
          status: newStatus,
          admin_response: adminResponseText.trim() || selectedTicket.admin_response
        });
      }

      setToastMsg(`Ticket status updated to "${newStatus}".`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(formatHumanError(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('platform_feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId);

      if (error) throw error;

      setFeedbackList(prev => prev.map(f => f.id === feedbackId ? { ...f, status: newStatus } : f));
      setToastMsg(`Feedback marked as ${newStatus}.`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(formatHumanError(err));
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      (t.trainee_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.trainee_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredFeedback = feedbackList.filter(f => {
    const matchesSearch = 
      (f.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in slide-in-from-top text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <Headphones className="w-6 h-6 text-blue-400" />
            <span>Trainee Support & User Feedback</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review support queries, track district officer assignments, and triage bug reports directly.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#0d1527] border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'tickets' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Support Tickets ({tickets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'feedback' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Bug Reports & Feedback ({feedbackList.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0a1020] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#070b14] border border-slate-800 text-slate-300 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open / Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved / Closed</option>
          </select>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="p-16 flex items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
          <span className="font-bold text-sm">Loading support pipeline...</span>
        </div>
      ) : activeTab === 'tickets' ? (
        /* Support Tickets Table */
        <div className="bg-[#0a1020] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={Headphones}
              title="No Support Tickets Found"
              description="There are currently no active support requests matching your filter criteria."
              badge="0 Tickets"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Trainee / Submitter</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Assigned To</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{ticket.trainee_name || 'Trainee'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{ticket.trainee_email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-[11px]">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-200">
                        {ticket.subject}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {ticket.assigned_to || 'District Officer'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.status === 'resolved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ticket.status === 'in_progress'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                        {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setAdminResponseText(ticket.admin_response || '');
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          View & Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Bug Reports & Feedback Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedback.length === 0 ? (
            <div className="col-span-2">
              <EmptyState
                icon={Bug}
                title="No Feedback or Bug Reports"
                description="No user feedback or bug reports submitted yet."
                badge="0 Reports"
              />
            </div>
          ) : (
            filteredFeedback.map((fb) => (
              <div key={fb.id} className="bg-[#0a1020] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      fb.category === 'bug' ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                    }`}>
                      {fb.category}
                    </span>
                    <span className="text-amber-400 text-xs font-bold">
                      {'★'.repeat(fb.rating || 5)}{'☆'.repeat(5 - (fb.rating || 5))}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    fb.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {fb.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{fb.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{fb.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Submitted by <strong>{fb.user_name}</strong> ({fb.user_email})</span>
                  <div className="flex items-center space-x-2">
                    {fb.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateFeedbackStatus(fb.id, 'resolved')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ticket Drawer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  Ticket #{selectedTicket.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Trainee</span>
                  <span className="text-white font-bold">{selectedTicket.trainee_name} ({selectedTicket.trainee_email})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="text-blue-400 font-bold">{selectedTicket.category}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Trainee Query Message:</label>
                <div className="bg-[#070b14] border border-slate-800 p-3.5 rounded-xl text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">State Administrator Official Response:</label>
                <textarea
                  rows={3}
                  value={adminResponseText}
                  onChange={e => setAdminResponseText(e.target.value)}
                  placeholder="Provide resolution details or coordinator notes..."
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'in_progress')}
                  className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Mark In Progress
                </button>
                <button
                  disabled={updatingStatus}
                  onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve & Save</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
