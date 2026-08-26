'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Menu, 
  X, 
  Award, 
  Sparkles, 
  Building2, 
  BarChart3, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { CookieBanner } from '@/components/CookieBanner';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-[#0a1020]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Mission */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="4" r="2" fill="currentColor"/>
                <path d="M12 7v14M7 11l5-4 5 4M5 18l7-4 7 4"/>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block leading-tight">MahaSkill Track</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">State Longitudinal Registry</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-xs font-bold text-slate-300">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#framework" className="hover:text-white transition">Framework</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Zero-PII Privacy</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a 
              href="https://administrator.avishkark.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-400 hover:text-white transition px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center space-x-1"
            >
              <span>Admin Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-1.5"
            >
              <span>Sign In / OTP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0a1020] p-5 space-y-4 animate-in slide-in-from-top-4">
            <div className="flex flex-col space-y-3 text-sm font-bold text-slate-300">
              <Link 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Features & Modules
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Help & Contact
              </Link>
              <Link 
                href="/privacy-policy" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Privacy & Zero-PII Policy
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-center font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-1.5"
              >
                <span>Trainee Portal (Login & Register)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://administrator.avishkark.in" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 text-center font-bold text-sm rounded-xl border border-slate-800 flex items-center justify-center space-x-1.5"
              >
                <span>State Admin Console</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-28 lg:pb-36 overflow-hidden">
        {/* Glow Blobs (strictly pointer-events-none) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maharashtra State Skill Development Society (MSSDS)</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Measure Longitudinal Skilling Impact.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Empower Verified Futures.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 leading-relaxed">
            The definitive 24-month longitudinal tracking and micro-enterprise verification framework for trainees, employers, and government mission officers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto sm:max-w-none">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Access Trainee Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a 
              href="https://administrator.avishkark.in" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-800 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Executive Admin Console</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-PII SHA256 Enclave</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Resend Email OTP</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3M–24M Longitudinal Tracking</span>
            </span>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0a1020] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Enterprise Skilling Architecture</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Empowering Maharashtra’s workforce with cryptographically verified career outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Wage Progression Multiplier</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track dynamic wage growth from baseline through 3, 6, 12, 18, and 24-month milestones with automated survey reminders.
              </p>
            </div>

            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero-PII Privacy Enclave</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aadhaar masking and SHA-256 cryptographic proofs ensure trainee privacy while delivering district-level labor intelligence.
              </p>
            </div>

            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Udyam & MSME Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validate micro-enterprise registration, monthly revenue run-rates, and Mudra/PMEGP capital grant disbursements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05080f] py-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">MahaSkill Track</span>
          </div>

          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">Contact Support</Link>
          </div>

          <div className="text-slate-500">
            &copy; {new Date().getFullYear()} Government of Maharashtra. All rights reserved.
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
