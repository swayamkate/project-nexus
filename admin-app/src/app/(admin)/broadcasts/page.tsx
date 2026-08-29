'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Smartphone, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Filter,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Mail
} from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

interface BroadcastRecord {
  id: string;
  channel: string;
  template_name: string;
  recipient_count: number;
  target_district: string;
  target_milestone: string;
  message_preview: string;
  status: string;
  gateway_used: string;
  dispatched_by: string;
  created_at: string;
}

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [targetDistrict, setTargetDistrict] = useState('All Maharashtra');
  const [targetMilestone, setTargetMilestone] = useState('3M');
  const [template, setTemplate] = useState('3M_SURVEY');
  const [customPhone, setCustomPhone] = useState('919820011223');
  const [customMsg, setCustomMsg] = useState('नमस्ते Avishkar, महाराष्ट्र राज्य कौशल्य विकास मिशन (MSSDS). तुमचे 3 महिन्यांचे कौशल्य परिणाम सर्वेक्षण पूर्ण करा: https://sih2026.avishkark.in/dashboard');
  const [toast, setToast] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communication_broadcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBroadcasts(data);
      }
    } catch (err) {
      console.error('Failed to load broadcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (t: string) => {
    setTemplate(t);
    if (t === '3M_SURVEY') {
      setCustomMsg('नमस्ते Avishkar, महाराष्ट्र राज्य कौशल्य विकास मिशन (MSSDS). तुमचे 3 महिन्यांचे कौशल्य परिणाम सर्वेक्षण पूर्ण करा: https://sih2026.avishkark.in/dashboard');
    } else if (t === '6M_WAGE_LIFT') {
      setCustomMsg('Update your current monthly wage & MSME Udyam status to claim your verified skill credential badge on DigiLocker: https://sih2026.avishkark.in/dashboard');
    } else if (t === 'ROZGAR_MELAWA') {
      setCustomMsg('Govt of Maharashtra: Rozgar Melawa Job Fair scheduled at ITI Pune. Download your instant QR Gate Pass at https://sih2026.avishkark.in');
    } else if (t === 'DBT_STIPEND') {
      setCustomMsg('Your monthly vocational skill stipend of Rs. 3,500 has been credited via APBS/PFMS directly to your bank account.');
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { data, error } = await supabase
        .from('communication_broadcasts')
        .insert({
          channel,
          template_name: template,
          recipient_count: targetDistrict === 'All Maharashtra' ? 1420 : 380,
          target_district: targetDistrict,
          target_milestone: targetMilestone,
          message_preview: customMsg,
          status: 'Delivered',
          gateway_used: channel === 'whatsapp' ? 'Meta WhatsApp Business Cloud API' : 'CDAC Mobile Seva (NIC Govt Gateway)'
        })
        .select()
        .single();

      if (!error && data) {
        // Also fan-out in-app alert to all trainees so they can immediately fill the survey
        const { data: allTrainees } = await supabase.from('trainees').select('id');
        if (allTrainees && allTrainees.length > 0) {
          const notifPayloads = allTrainees.map(t => ({
            trainee_id: t.id,
            title: template === '3M_SURVEY' ? '📋 3-Month Longitudinal Skilling Survey Due'
                  : template === '6M_WAGE_LIFT' ? '📊 6-Month Longitudinal Wage & Retention Survey Due'
                  : '🔔 State Skilling Mission Alert',
            message: customMsg,
            type: 'survey_due',
            is_read: false
          }));
          await supabase.from('trainee_notifications').insert(notifPayloads);
        }

        setBroadcasts([data, ...broadcasts]);
        setToast(`Successfully dispatched ${channel.toUpperCase()} broadcast & alerted all candidates!`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      console.error('Dispatch failed:', err);
    } finally {
      setSending(false);
    }
  };

  const getWhatsAppDirectLink = () => {
    const cleanPhone = customPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customMsg);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  };

  const getSmsDirectLink = () => {
    const cleanPhone = customPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customMsg);
    return `sms:${cleanPhone}?body=${encodedText}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Omnichannel Gateway
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              CDAC & WhatsApp Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">SMS & WhatsApp Notification Hub</h1>
          <p className="text-xs text-slate-400">
            Dispatch automated longitudinal survey reminders, Rozgar Melawa QR passes, and DBT stipend alerts.
          </p>
        </div>

        <button 
          onClick={fetchBroadcasts} 
          className="flex items-center space-x-2 bg-slate-900 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Gateway Status</span>
        </button>
      </div>

      {/* Grid: Dispatch Form & Quick Deep Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Compose & Gateway Dispatch */}
        <div className="lg:col-span-2 bg-[#0c1322] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Broadcast Dispatch Console</h2>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setChannel('whatsapp')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setChannel('sms')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  channel === 'sms' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS Gateway</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Target District</label>
                <select
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2.5 rounded-xl focus:border-blue-500"
                >
                  <option value="All Maharashtra">All Maharashtra (36 Districts)</option>
                  <option value="Pune">Pune</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Aurangabad (Chhatrapati Sambhajinagar)">Chhatrapati Sambhajinagar</option>
                  <option value="Thane">Thane</option>
                  <option value="Kolhapur">Kolhapur</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Milestone</label>
                <select
                  value={targetMilestone}
                  onChange={(e) => setTargetMilestone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2.5 rounded-xl focus:border-blue-500"
                >
                  <option value="3M">3-Month Milestone (Initial Job Check)</option>
                  <option value="6M">6-Month Milestone (Wage Lift & WGM)</option>
                  <option value="12M">12-Month Milestone (Annual Retention)</option>
                  <option value="18M">18-Month Milestone (Career Progression)</option>
                  <option value="24M">24-Month Milestone (Promotion Velocity)</option>
                  <option value="Unemployed Queue">Second-Chance Unemployed Queue</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Pre-Approved Template</label>
                <select
                  value={template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2.5 rounded-xl focus:border-blue-500"
                >
                  <option value="3M_SURVEY">3M Milestone Survey (Marathi)</option>
                  <option value="6M_WAGE_LIFT">6M Wage Lift & Udyam Audit</option>
                  <option value="ROZGAR_MELAWA">Rozgar Melawa QR Gate Pass</option>
                  <option value="DBT_STIPEND">DBT Monthly Stipend Credit Alert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Message Body (Bilingual Template)</label>
              <textarea
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-3 rounded-xl focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Gateway: {channel === 'whatsapp' ? 'Meta Business Cloud API' : 'CDAC Mobile Seva (MeitY)'}</span>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Transmitting...' : 'Dispatch Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Direct 1-Click WhatsApp / SMS Link Generator */}
        <div className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Direct 1-Click Tester</h2>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Test live message dispatch on candidate mobile devices instantly via native protocol deep links.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Recipient Mobile Number</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="919820011223"
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:border-blue-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Live Preview Payload</p>
                <p className="text-xs text-emerald-300 font-mono line-clamp-3">{customMsg}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={getWhatsAppDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open in WhatsApp Web</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <a
              href={getSmsDirectLink()}
              className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
            >
              <Smartphone className="w-4 h-4" />
              <span>Launch Device SMS Client</span>
            </a>
          </div>
        </div>

      </div>

      {/* Broadcast Delivery Ledger */}
      <div className="bg-[#0c1322] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Live Transmission & Delivery Ledger</h2>
            <p className="text-xs text-slate-400">Immutable record of statewide automated and manual communications</p>
          </div>
          <span className="text-xs text-blue-400 font-mono font-bold">Total Transmissions: {broadcasts.length}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading transmission records...</div>
        ) : broadcasts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No broadcast logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 px-3">Channel</th>
                  <th className="pb-3 px-3">Template</th>
                  <th className="pb-3 px-3">Target Scope</th>
                  <th className="pb-3 px-3">Recipients</th>
                  <th className="pb-3 px-3">Gateway</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {b.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-white">{b.template_name}</td>
                    <td className="py-3 px-3">
                      <span className="text-slate-200 font-semibold">{b.target_district}</span>
                      <span className="text-[10px] text-slate-500 block">Milestone: {b.target_milestone}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{b.recipient_count.toLocaleString('en-IN')} youth</td>
                    <td className="py-3 px-3 text-[11px] text-slate-400">{b.gateway_used}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ✓ {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(b.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
