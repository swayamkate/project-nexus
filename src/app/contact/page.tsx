'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, Clock, ShieldCheck, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatHumanError } from '@/lib/errorUtils';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from('support_tickets')
        .insert({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim() || 'General Inquiry via Web Portal',
          message: message.trim(),
          category: 'General',
          status: 'open',
          priority: 'medium',
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(formatHumanError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040812] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto z-10 relative">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Nexus</span>
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Nexus Platform</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Support & Help Center
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
              Have questions about your certificate verification, longitudinal surveys, or self-employment analytics? The Nexus technical support team is here to assist you.
            </p>

            <div className="space-y-5">
              <div className="flex items-start space-x-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">Nexus Operations Center</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Technology Operations & Verification Center<br />
                    Mumbai, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">Support Inboxes</h3>
                  <p className="text-xs text-slate-400 mt-0.5 space-y-0.5">
                    <span className="block">Support: <a href="mailto:support@nexus.in" className="text-emerald-400 hover:underline">support@nexus.in</a></span>
                    <span className="block">Helpdesk: <a href="mailto:help@nexus.in" className="text-emerald-400 hover:underline">help@nexus.in</a></span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">Toll-Free Helpline & Desk</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    1800-120-8040 (Toll-Free, 9:30 AM - 6:00 PM IST)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">District Office Working Hours</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monday to Friday: 9:30 AM – 6:00 PM IST (Excluding Gazetted Holidays)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact / Ticket Submission Form */}
          <div className="bg-[#0a1020]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
            <h3 className="text-lg font-black text-white mb-1 tracking-tight">Direct Support Dispatch</h3>
            <p className="text-xs text-slate-400 mb-6">Create a verified ticket in the state resolution queue.</p>

            {success ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Support Ticket Created!</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Your ticket has been dispatched to the District Support Desk. A reference notification will be sent to your email.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-900/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. user@nexus.in"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Subject / Inquiry Topic</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-900/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. MSME Udyam Verification Assistance"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Inquiry Details *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-slate-900/80 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    placeholder="Please explain how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer text-xs"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Dispatching Ticket...' : 'Send Inquiry to Support Desk'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
