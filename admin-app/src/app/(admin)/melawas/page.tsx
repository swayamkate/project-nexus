'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Building2, 
  Plus, 
  QrCode, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Send,
  Sparkles,
  Search,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { formatHumanError } from '@/lib/errorUtils';

export default function RozgarMelawaPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'second_chance' | 'registrations'>('events');
  const [loading, setLoading] = useState(true);
  const [melawas, setMelawas] = useState<any[]>([]);
  const [secondChanceQueue, setSecondChanceQueue] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [venueAddress, setVenueAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [employersCount, setEmployersCount] = useState('25');
  const [openingsCount, setOpeningsCount] = useState('300');
  const [targetTrades, setTargetTrades] = useState('CNC Machining, Solar PV Installation, EV Servicing');

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/melawas');
      const json = await res.json();
      if (json.success) {
        setMelawas(json.melawas || []);
        setSecondChanceQueue(json.secondChanceQueue || []);
        setRegistrations(json.registrations || []);
      }
    } catch (err) {
      console.error('Failed to load Melawa data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const tradesArray = targetTrades.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/admin/melawas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_title: eventTitle,
          district,
          venue_address: venueAddress,
          event_date: eventDate,
          start_time: startTime,
          end_time: endTime,
          participating_employers_count: employersCount,
          available_openings: openingsCount,
          target_trades: tradesArray
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule event');

      showToast('success', `Rozgar Melawa "${eventTitle}" scheduled and published!`);
      setIsScheduleModalOpen(false);
      setEventTitle('');
      setVenueAddress('');
      setEventDate('');
      await fetchData();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnrollCandidate = async (melawaId: string, traineeId: string, candidateName: string) => {
    try {
      const res = await fetch('/api/admin/melawas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER_CANDIDATE',
          melawa_id: melawaId,
          trainee_id: traineeId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enroll candidate');

      showToast('success', `Enrolled ${candidateName} with Entry QR Pass: ${data.registration?.qr_pass_token}`);
      await fetchData();
    } catch (err: any) {
      showToast('error', formatHumanError(err));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <Building2 className="w-7 h-7 text-emerald-400" />
            <span>State Rozgar Melawas & Job Fairs Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Maharashtra job exchange event management, corporate recruiter quotas, and second-chance re-engagement
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Rozgar Melawa</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2 animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'events' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Scheduled Melawas ({melawas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('second_chance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'second_chance' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Second-Chance Re-Engagement Queue ({secondChanceQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTab === 'registrations' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Registered Candidate QR Passes ({registrations.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center items-center text-slate-400 space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <span className="text-xs">Loading Rozgar Melawa database...</span>
        </div>
      ) : (
        <div className="space-y-6">

          {/* TAB 1: SCHEDULED EVENTS */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {melawas.map((m: any) => (
                <div key={m.id} className="bg-[#0a1020] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {m.district} District
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                        {m.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {m.event_title}
                    </h3>

                    <div className="text-xs text-slate-400 space-y-1.5">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold">{new Date(m.event_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{m.start_time} – {m.end_time}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{m.venue_address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center py-2 bg-black/40 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Employers</span>
                        <span className="text-xs font-bold text-slate-200">{m.participating_employers_count} Verified</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Openings</span>
                        <span className="text-xs font-bold text-emerald-400">{m.available_openings} Vacancies</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Focus Trade Disciplines:</span>
                      <div className="flex flex-wrap gap-1">
                        {(m.target_trades || []).map((t: string, idx: number) => (
                          <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Registered Candidates: <b className="text-white">{m.registered_candidates_count || 0}</b></span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      Active Event <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SECOND-CHANCE RE-ENGAGEMENT QUEUE */}
          {activeTab === 'second_chance' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Second-Chance Rozgar Melawa Re-Engagement Queue</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Automatically populates candidates currently seeking employment to match and fast-track them into upcoming state job fairs.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Non-Placement Reason</th>
                      <th className="py-3 px-4">Candidate Perspective</th>
                      <th className="py-3 px-4 text-right">Assign to Melawa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {secondChanceQueue.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{item.trainees?.full_name || 'Candidate'}</span>
                          <span className="text-[11px] text-slate-400">{item.trainees?.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{item.trainees?.district || 'Pune'}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-medium">
                          {item.unemployed_reason?.replace(/_/g, ' ') || 'Seeking job vacancies'}
                        </td>
                        <td className="py-3.5 px-4 italic text-slate-400 max-w-xs truncate">
                          "{item.unemployed_perspective || 'Awaiting Rozgar Melawa drive'}"
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {melawas.length > 0 ? (
                            <button
                              onClick={() => handleEnrollCandidate(melawas[0].id, item.trainee_id, item.trainees?.full_name || 'Candidate')}
                              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              Enroll with Entry QR
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">No active event</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QR PASS REGISTRATIONS */}
          {activeTab === 'registrations' && (
            <div className="bg-[#0a1020] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span>Candidate Entry QR Passes & Interview Tracking</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cryptographic event entry passes verified at physical Rozgar Melawa check-in kiosks across Maharashtra.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Assigned Melawa Event</th>
                      <th className="py-3 px-4">Event Date</th>
                      <th className="py-3 px-4">Verifiable QR Pass Token</th>
                      <th className="py-3 px-4">Check-in Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {registrations.map((reg: any) => (
                      <tr key={reg.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{reg.trainees?.full_name || 'Candidate'}</span>
                          <span className="text-[11px] text-slate-400">{reg.trainees?.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">{reg.rozgar_melawas?.event_title}</td>
                        <td className="py-3.5 px-4 text-slate-300">{reg.rozgar_melawas?.event_date}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                          {reg.qr_pass_token}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {reg.registration_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Schedule New Rozgar Melawa</span>
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Official Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="e.g. Pune Mega Technical Rozgar Melawa 2026"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Host District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Venue Address *</label>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  placeholder="Government ITI Ground, Parihar Chowk, Pune"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Participating Employers</label>
                  <input
                    type="number"
                    value={employersCount}
                    onChange={e => setEmployersCount(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Target Openings</label>
                  <input
                    type="number"
                    value={openingsCount}
                    onChange={e => setOpeningsCount(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Target Trades (comma-separated)</label>
                <input
                  type="text"
                  value={targetTrades}
                  onChange={e => setTargetTrades(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Publish Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
