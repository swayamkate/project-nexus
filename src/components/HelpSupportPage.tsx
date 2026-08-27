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
  Bot
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

export const HelpSupportPage: React.FC = () => {
  const { profile } = useUser();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Certificate Verification');
  const [ticketSuccess, setTicketSuccess] = useState(false);
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
      a: 'Follow-ups occur at 3, 6, 12, 18, and 24 months post-training. You will receive an automated WhatsApp reminder 7 days before your due date, or you can fill it directly in the "Follow-ups" tab.'
    },
    {
      q: 'How can I apply for PMEGP / Mudra loans for my tailoring business?',
      a: 'Go to "Self-Employment" and ensure your business details & Udyam number are registered. Then visit the "Recommended Opportunities" section to apply for the 35% government capital subsidy.'
    },
    {
      q: 'Can I change my registered phone number or address?',
      a: 'Yes! Open the "My Profile" tab and click "Edit" on the Personal Information card to update your address and contact details.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSuccess(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: userInput }];
    setChatMessages(newMsgs);
    setUserInput('');

    setTimeout(() => {
      let reply = 'Thank you for your question. Your request has been recorded with District Skill Officer (Pune). You can also access quick links under your dashboard!';
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Help & Trainee Support Center</h1>
        <p className="text-xs text-slate-500 mt-0.5">Contact district coordinators, submit support queries, or chat with our 24/7 AI Bot</p>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Toll-Free Helpline</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">1800-120-8040</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Mon–Sat, 9AM to 6PM</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">WhatsApp Assistant</span>
            <p className="text-sm font-black text-slate-900 mt-0.5">+91 90210 44220</p>
            <button 
              onClick={() => setShowChatBot(true)}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              Open Live Web Chat
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Official Support Email</span>
            <p className="text-xs font-bold text-slate-900 mt-0.5">support@nexus.in</p>
            <span className="text-[11px] text-slate-400">Response within 24 hours</span>
          </div>
        </div>

      </div>

      {/* Ticket Submission & FAQ 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submit Ticket Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Submit a Support Request</h3>
          
          {ticketSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Your support ticket has been created! Ticket ID: #TK-92841</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
              >
                <option value="Certificate Verification">Certificate Verification</option>
                <option value="Follow-up Survey Assistance">Follow-up Survey Assistance</option>
                <option value="Udyam / MSME Registration Guidance">Udyam / MSME Registration Guidance</option>
                <option value="Course Syllabus / ITI Query">Course Syllabus / ITI Query</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your query..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Description & Details</label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
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
