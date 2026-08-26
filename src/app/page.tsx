import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Nexus | Privacy-Preserving Skilling Outcomes',
  description: 'The ultimate longitudinal skilling-outcomes and impact-measurement system.',
  openGraph: {
    title: 'Nexus | Skilling Outcomes',
    description: 'Empowering trainees and governments with real-time data.',
    url: 'https://sih2026.avishkark.in',
    siteName: 'Nexus',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Nexus Dashboard Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-20 md:pb-0">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-[#0a1020]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">Nexus</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition">Features</Link>
            <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition">Contact</Link>
            <Link href="/privacy-policy" className="text-sm font-medium text-slate-300 hover:text-white transition">Privacy</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white transition hidden sm:block">Log In</Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Above the fold CTA) */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase mb-6">
            Privacy-Preserving Platform
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
            Measure Skilling Impact.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Empower Futures.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            The definitive longitudinal tracking system for governments, trainees, and employers. Real-time wage progression, verified outcomes, and zero-PII analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center text-lg">
              Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 transition flex items-center justify-center text-lg">
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0a1020] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Enterprise-Grade Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to map skills to outcomes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#070b14] border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Wage Progression</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Track salary growth dynamically over 3, 6, and 12-month longitudinal milestones with automated WhatsApp webhook integration.</p>
            </div>
            <div className="bg-[#070b14] border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero-PII Privacy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Advanced data masking and k-anonymity ensures trainee privacy while delivering hyper-accurate district-level analytics.</p>
            </div>
            <div className="bg-[#070b14] border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Verified Portfolios</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Self-employment validation via Udyam, Trade Licenses, and Digital Footprints to authenticate micro-entrepreneurship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05080f] py-12 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-white">Nexus</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Nexus Solutions. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a1020]/95 backdrop-blur border-t border-slate-800 z-50">
        <Link href="/login" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center">
          Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <CookieBanner />
    </div>
  );
}
