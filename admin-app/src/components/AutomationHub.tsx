'use client';

import React, { useState } from 'react';
import { mockFollowups } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { 
  Bot, 
  Send, 
  MessageSquare, 
  CheckCheck, 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  Zap,
  Activity,
  Code
} from 'lucide-react';
import { AutomatedFollowup } from '@/types/database';

export const AutomationHub: React.FC = () => {
  const [followups, setFollowups] = useState<AutomatedFollowup[]>(mockFollowups);
  const [testMessage, setTestMessage] = useState('Still working as Associate Developer, current salary is 45000.');
  const [testPhone, setTestPhone] = useState('+91 98765 43210');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);

    try {
      const res = await fetch('/api/webhooks/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: testPhone,
          text: testMessage,
          event_type: 'whatsapp_response_received',
          timestamp: new Date().toISOString()
        })
      });

      const data = await res.json();
      setApiResponse(data);

      if (data.success && data.parsed_data) {
        const newEntry: AutomatedFollowup = {
          id: `fol-${Date.now()}`,
          trainee_id: 'tr-101',
          checkpoint_milestone: 'M+6',
          channel: 'whatsapp',
          phone_number: testPhone,
          scheduled_for: new Date().toISOString(),
          sent_at: new Date().toISOString(),
          status: 'responded',
          trigger_message_body: 'Longitudinal Skilling Followup Check-in (M+6)',
          response_received_at: new Date().toISOString(),
          raw_response_text: testMessage,
          parsed_employment_status: data.parsed_data.detected_status,
          parsed_current_wage: data.parsed_data.detected_wage,
          parsed_attrition_reason: data.parsed_data.detected_attrition_reason,
          created_at: new Date().toISOString()
        };

        setFollowups([newEntry, ...followups]);
      }
    } catch (err: any) {
      setApiResponse({ error: err.message || 'Webhook invocation failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-800/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <Bot className="w-6 h-6" />
            <h1 className="text-2xl font-black text-white">Automated WhatsApp Follow-Up Engine</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Longitudinal check-ins triggered automatically at M+1, M+3, M+6, and M+12 via WhatsApp Webhook endpoints with Natural Language Wage and Attrition Reason extraction.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Webhook Active: /api/webhooks/whatsapp</span>
        </div>
      </div>

      {/* Simulator & Live Response Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: WhatsApp Webhook Live Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Interactive WhatsApp Ingest Simulator</h2>
          </div>

          <form onSubmit={handleSimulateWebhook} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Trainee Phone Number</label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Simulate Incoming WhatsApp Trainee Message</label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="e.g. Promoted to Senior Technician, salary 42000 OR Removed for no reason last week..."
                className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Quick Test Scenarios:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTestMessage('Still working full time as Solar Technician. Monthly pay increased to 38000.')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  🟢 Wage Increment (38k)
                </button>
                <button
                  type="button"
                  onClick={() => setTestMessage('I was removed for no reason after 2 months. Looking for new placement.')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-rose-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  🔴 "Removed for no reason"
                </button>
                <button
                  type="button"
                  onClick={() => setTestMessage('Started my own freelance solar consulting agency with monthly revenue 60000.')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  🔵 Self-Employment Transition
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Processing via Webhook...' : 'Fire WhatsApp Webhook Trigger'}</span>
            </button>
          </form>

          {/* Diagnostic JSON Output */}
          {apiResponse && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 mt-4">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px]">
                <Code className="w-3.5 h-3.5" />
                <span>Live Server Diagnostic Output</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Longitudinal Followup Log Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Longitudinal Follow-up Queue</h2>
            </div>
            <span className="text-xs text-slate-400">Periodic Checkpoints</span>
          </div>

          <div className="space-y-3.5">
            {followups.map((fol) => (
              <div 
                key={fol.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                      Milestone: {fol.checkpoint_milestone}
                    </span>
                    <span className="text-slate-400 text-[11px]">{fol.phone_number}</span>
                  </div>

                  <span className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px]">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{fol.status.toUpperCase()}</span>
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                  <span className="text-slate-500 block mb-0.5">Response Ingested:</span>
                  "{fol.raw_response_text}"
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                  {fol.parsed_employment_status && (
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono">
                      Status: <strong>{fol.parsed_employment_status}</strong>
                    </span>
                  )}
                  {fol.parsed_current_wage && (
                    <span className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      Parsed Wage: <strong>₹{fol.parsed_current_wage.toLocaleString()}</strong>
                    </span>
                  )}
                  {fol.parsed_attrition_reason && (
                    <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded font-mono">
                      Attrition: <strong>{fol.parsed_attrition_reason.replace(/_/g, ' ')}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
