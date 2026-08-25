import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Nexus',
  description: 'Get in touch with the Nexus support and administrative team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans p-6 md:p-12 selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-semibold mb-8 text-sm transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Get in touch</h1>
            <p className="text-sm text-slate-400 mb-10 leading-relaxed">
              Have questions about the Nexus platform? Need help configuring your administrative dashboard or connecting to our WhatsApp webhook APIs? Our team is here to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Corporate Headquarters</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Nexus Technologies Pvt. Ltd.<br />
                    12th Floor, CyberOne Tower<br />
                    Sector 30A, Vashi, Navi Mumbai<br />
                    Maharashtra, India - 400703
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email Support</h3>
                  <p className="text-sm text-slate-400">
                    <a href="mailto:support@avishkark.in" className="hover:text-emerald-400 transition">support@avishkark.in</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Phone</h3>
                  <p className="text-sm text-slate-400">
                    +91 (22) 2781 4000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a1020] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5 ml-1">Full Name</label>
                <input type="text" className="w-full bg-slate-900/80 text-white text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5 ml-1">Email Address</label>
                <input type="email" className="w-full bg-slate-900/80 text-white text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all" placeholder="john@company.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5 ml-1">Message</label>
                <textarea rows={4} className="w-full bg-slate-900/80 text-white text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 transition-all" placeholder="How can we help?" />
              </div>
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
