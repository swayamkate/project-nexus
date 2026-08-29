'use client';

import React, { useEffect, useState } from 'react';
import { 
  Headphones, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Bot,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabaseBrowser';
import { fetchPublicSettings } from '@/lib/platformSettings';
import { mutateDb } from '@/lib/traineeApi';

export const HelpSupportPage: React.FC = () => {
  const { user, profile, t } = useUser();
  const supabase = createClient();
  const [supportEmail, setSupportEmail] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Certificate Verification');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am the CareerLoop AI Assistant. How can I help you with your training, certificate, or business support today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    fetchPublicSettings().then(settings => setSupportEmail(settings['general.support_email'] || null));
  }, []);

  const faqs = [
    {
      q: 'How do I download my official NSQF Certificate?',
      a: 'Navigate to the "Certifications" tab in your dashboard. You can view your digitally signed certificate with anti-counterfeit QR verification and click "Print / Save PDF".'
    },
    {
      q: 'When is my next longitudinal follow-up survey due?',
      a: 'Follow-ups occur at 3, 6, 12, 18, and 24 months post-training. You will receive an automated notification alert before your due date, or you can fill it directly in the "Follow-ups" tab.'
    },
    {
      q: 'How can I apply for PMEGP / Mudra loans for my enterprise?',
      a: 'Go to "Self-Employment" and ensure your business details & Udyam number are registered. Then visit the "Recommended Opportunities" section to apply for the government capital subsidy.'
    },
    {
      q: 'Can I change my registered phone number or address?',
      a: 'Yes! Open the "My Profile" tab and click "Edit" on the Personal Information card to update your address and contact details.'
    }
  ];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitting(true);
    setTicketError(null);
    setCreatedTicketId(null);

    try {
      const { data, error } = await mutateDb({
        action: 'insert',
        table: 'support_tickets',
        payload: {
          trainee_id: profile?.id || null,
          trainee_name: profile?.full_name || '',
          trainee_email: profile?.email || user?.email || '',
          category: ticketCategory,
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
          status: 'open',
          assigned_to: profile?.district ? `District Officer ${profile.district}` : null
        }
      });

      if (error) throw error;

      const created = data && data[0] ? data[0] : null;
      const ticketRef = `TK-${(created?.id || '').slice(0, 8).toUpperCase() || Date.now().toString().slice(-6)}`;
      setCreatedTicketId(ticketRef);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      setTicketError(err.message || 'Failed to submit support request. Please try again.');
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);

    // Simulated Intelligent Trainee Assistant responses
    setTimeout(() => {
      let botResponse = 'Thank you for reaching out. Our District Skill Officer will review your query. You can also file an official ticket above for expedited tracking.';
      const lower = userText.toLowerCase();

      if (lower.includes('certif') || lower.includes('download')) {
        botResponse = 'You can download your NSQF certificate from the "Certifications" tab on the left sidebar once your final evaluation is approved.';
      } else if (lower.includes('loan') || lower.includes('mudra') || lower.includes('pmegp') || lower.includes('money')) {
        botResponse = 'Government financial assistance programs like PMEGP and Mudra are available under the "Recommended Opportunities" and "Self-Employment" desks.';
      } else if (lower.includes('follow') || lower.includes('survey')) {
        botResponse = 'Longitudinal surveys occur at 3, 6, 12, 18, and 24 months. You can fill out your milestone directly under the "Follow-ups" tab.';
      } else if (lower.includes('profile') || lower.includes('edit') || lower.includes('phone')) {
        botResponse = 'To update your phone number, address, or education details, head to the "My Profile" tab and click the "Edit" button.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 text-slate-800 animate-in fade-in-50">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/15 text-blue-200">
            <Headphones className="w-3.5 h-3.5 text-cyan-300" />
            <span>Candidate Grievance & Technical Enclave</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Help, Support & District Desk
          </h1>
          <p className="text-sm text-blue-100/80 mt-1 max-w-2xl">
            Get instant guidance, connect with your designated District Skill Development Officer, or raise formal support tickets.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <span className="text-xs text-cyan-200 block font-semibold">Toll-Free Helpline</span>
            <span className="text-sm font-black text-white font-mono">1800-123-4567</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Raise a Ticket & Contact Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Submit Support Ticket Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Raise Formal Support Ticket</h3>
                  <p className="text-xs text-slate-400">Direct escalation to District Skill Officer</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
                24h Response SLA
              </span>
            </div>

            {createdTicketId ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Support Ticket Created Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your ticket reference number is <strong className="font-mono text-emerald-700">{createdTicketId}</strong>. Our designated District Skill Officer has been notified and will review your request.
                </p>
                <button
                  type="button"
                  onClick={() => setCreatedTicketId(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer mt-2"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                {ticketError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{ticketError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800"
                    >
                      <option value="Certificate Verification">Certificate Verification</option>
                      <option value="Longitudinal Survey Query">Longitudinal Survey Query</option>
                      <option value="PMEGP / Mudra Loan Assistance">PMEGP / Mudra Loan Assistance</option>
                      <option value="Profile / Identity Correction">Profile / Identity Correction</option>
                      <option value="Other Technical Issues">Other Technical Issues</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Assigned District Desk</label>
                    <input
                      type="text"
                      readOnly
                      value={profile?.district ? `District Officer (${profile.district})` : 'State Central Grievance Desk'}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    placeholder="e.g. Request for correction in registered trade certificate"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Detailed Description</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    placeholder="Provide relevant details, dates, or error messages..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {ticketSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Grievance / Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Interactive AI Chat Assistant */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">CareerLoop AI Copilot Assistant</h4>
                  <p className="text-[11px] text-slate-400">Instant answers for skilling & enterprise questions</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Chat Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 h-52 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Ask about certificates, loans, or survey dates..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>

        {/* Right: Frequently Asked Questions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left text-xs font-bold text-slate-800 bg-slate-50/50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-3.5 text-xs">
            <h4 className="font-bold text-white text-sm">State Skill Development Society</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{supportEmail || 'support@mahaskill.in'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 22 2202 5488 / +91 22 2202 5489</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
              Working Hours: Mon–Fri, 9:30 AM – 6:00 PM IST (Excluding Public Holidays)
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
