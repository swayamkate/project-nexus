'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  TrendingUp, 
  Menu, 
  X, 
  Award, 
  Sparkles, 
  Building2, 
  ShieldCheck
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
              <span className="text-white font-black text-xl tracking-tighter">N</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">Nexus</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Skilling & Career Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-300">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Sign In</span>
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
                Features
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Contact
              </Link>
              <Link 
                href="/privacy-policy" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-slate-900 rounded-xl"
              >
                Terms of Service
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-center font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-1.5"
              >
                <span>Access Portal (Sign In / Register)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Glow Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nexus Unified Skilling Registry</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Measure Longitudinal Impact.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Empower Verified Futures.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 leading-relaxed">
            The definitive longitudinal tracking and micro-enterprise verification platform for trainees, employers, and career growth.
          </p>

          {/* Clean Single Action CTA */}
          <div className="pt-4 flex justify-center">
            <Link 
              href="/login" 
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Get Started / Access Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0a1020] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Unified Platform Capabilities</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Empowering candidates and institutions with verified career outcomes and intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Wage Progression Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track dynamic wage growth from baseline through 3, 6, 12, 18, and 24-month milestones with automated survey reminders.
              </p>
            </div>

            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Verified Digital Credentials</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically validated certificates and skills credentials ready to share with employers.
              </p>
            </div>

            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-7 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Enterprise & Growth Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validate micro-enterprise registration, monthly revenue run-rates, and subsidy programs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Clean, Uniform Professional Footer */}
      <footer className="bg-[#070b14] py-12 border-t border-slate-800/80 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800/60">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  N
                </div>
                <span className="font-bold text-white text-lg tracking-tight">Nexus</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Unified longitudinal tracking and career outcomes platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300 font-medium">
              <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/privacy-policy#data-deletion" className="hover:text-white transition">Data Rights</Link>
              <Link href="/contact" className="hover:text-white transition">Help & Support</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Nexus. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-slate-500">
              <Link href="/terms" className="hover:text-slate-400 transition">Terms</Link>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-slate-400 transition">Privacy</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-slate-400 transition">Support</Link>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
