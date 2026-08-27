'use client';

import React, { useState } from 'react';
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

export const HelpSupportPage: React.FC = () => {
  const { user, profile, t } = useUser();
  const supabase = createClient();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Certificate Verification');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am the Nexus AI Assistant. How can I help you with your training, certificate, or business support today?' }
  ]);
  const [userInput, setUserInput] = useState('');

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
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          trainee_id: profile?.id || null,
          trainee_name: profile?.full_name || 'Nexus Trainee',
          trainee_email: profile?.email || user?.email || 'avishkarkedar@gmail.com',
          category: ticketCategory,
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
          status: 'open',
          assigned_to: `District Officer ${profile?.district || 'Pune'}`
        })
        .select()
        .single();

      if (error) throw error;

      const ticketRef = `TK-${(data?.id || '').slice(0, 8).toUpperCase()}`;
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

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: userInput }];
    setChatMessages(newMsgs);
    setUserInput('');

    setTimeout(() => {
      let reply = 'Thank you for your question. Your inquiry has been routed to the District Skill Coordinator. You can also submit an official support ticket below!';
      if (userInput.toLowerCase().includes('certificate')) {
        reply = 'You can download your verified Certificate of Competency directly from the "Certifications" section on your sidebar!';
      } else if (userInput.toLowerCase().includes('loan') || userInput.toLowerCase().includes('money')) {
        reply = 'Under the PMEGP / Mudra scheme, certified trainees are eligible for up to ₹5,00,000 collateral-free loans with 35% subsidy. Check the Opportunities tab!';
      }
      setChatMessages([...newMsgs, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-slate-800">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('help.title', 'Help & Trainee Support Center')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t('help.subtitle', 'Direct coordinator channels, query tracking, and AI guidance.')}</p>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <a 
          href="tel:+918432884424" 
          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5 hover:border-blue-500 transition group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">{t('help.helpline', 'Toll-Free Helpline')}</span>
            <p className="text-sm font-black text-slate-900 mt-0.5 group-hover:text-blue-600 transition">+91 8432884424</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Mon–Sat, 9AM to 6PM</span>
          </div>
        </a>

        <a 
          href="https://wa.me/918432884424" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5 hover:border-emerald-500 transition group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">{t('help.whatsapp', 'WhatsApp Helpline')}</span>
            <p className="text-sm font-black text-slate-900 mt-0.5 group-hover:text-emerald-600 transition">+91 8432884424</p>
            <span className="text-[11px] text-blue-600 font-bold">24/7 Chat Available</span>
          </div>
        </a>

        <a 
          href="mailto:avishkarkedar@gmail.com" 
          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5 hover:border-purple-500 transition group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">{t('help.email', 'Official Support Email')}</span>
            <p className="text-xs font-bold text-slate-900 mt-0.5 group-hover:text-purple-600 transition">avishkarkedar@gmail.com</p>
            <span className="text-[11px] text-slate-400">Response within 24 hours</span>
          </div>
        </a>

      </div>

      {/* Ticket Submission & FAQ 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submit Ticket Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            {t('help.submitTicket', 'Submit a Support Request')}
          </h3>
          
          {createdTicketId && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Support Request Registered Successfully!</span>
                <span className="text-[11px]">Ticket ID: <strong className="font-mono">{createdTicketId}</strong>. Assigned to {profile?.district || 'Pune'} District Officer.</span>
              </div>
            </div>
          )}

          {ticketError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{ticketError}</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">{t('help.issueCategory', 'Issue Category')}</label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
              >
                <option value="Certificate Verification">Certificate Verification</option>
                <option value="Follow-up Survey Assistance">Follow-up Survey Assistance</option>
                <option value="Udyam / MSME Registration Guidance">Udyam / MSME Registration Guidance</option>
                <option value="Course Syllabus / Training Query">Course Syllabus / Training Query</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">{t('help.subject', 'Subject')}</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your query..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">{t('help.message', 'Description & Details')}</label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={ticketSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
            >
              {ticketSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{ticketSubmitting ? 'Registering...' : t('help.sendTicket', 'Submit Support Request')}</span>
            </button>
          </form>
        </div>

        {/* FAQs Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Frequently Asked Questions</h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden text-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 text-left transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-3.5 bg-slate-50 text-slate-600 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live AI Chatbot Modal */}
      {showChatBot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col h-[500px]">
            
            {/* Bot Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-none">Nexus AI Assistant</h4>
                  <span className="text-[10px] text-blue-100">Online • AI Support Assistant</span>
                </div>
              </div>
              <button onClick={() => setShowChatBot(false)} className="text-white/80 hover:text-white">
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Ask about certificates, loans, follow-ups..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
