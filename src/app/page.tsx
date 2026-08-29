'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  TrendingUp, 
  Menu, 
  X, 
  Award, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Target,
  GraduationCap,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  Zap,
  Activity,
  FileCheck,
  QrCode,
  Compass,
  DollarSign,
  Calculator,
  Layers,
  Landmark,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { CookieBanner } from '@/components/CookieBanner';
import { InteractiveTutorialModal } from '@/components/InteractiveTutorialModal';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState<'trainee' | 'admin' | 'employer'>('trainee');
  const [heroWage, setHeroWage] = useState<number>(14000);
  const [activeTabJourney, setActiveTabJourney] = useState<number>(0);

  // Dynamic live ticker simulation
  const [tickerIndex, setTickerIndex] = useState(0);
  const liveAudits = [
    { district: 'Pune', candidate: 'Suresh P.', trade: 'Solar PV Inverter Tech', lift: '+65% Wage Lift', time: 'Just now' },
    { district: 'Nagpur', candidate: 'Snehal M.', trade: 'Precision CNC Machining', lift: '+78% Wage Lift', time: '2m ago' },
    { district: 'Nashik', candidate: 'Amol D.', trade: 'EV Battery Diagnostic Lead', lift: '+82% Wage Lift', time: '4m ago' },
    { district: 'Chhatrapati Sambhajinagar', candidate: 'Pooja K.', trade: 'Garment QA & Boutique Lead', lift: '+70% Wage Lift', time: '7m ago' },
    { district: 'Kolhapur', candidate: 'Rohit T.', trade: 'Smart Agri-Tech Specialist', lift: '+60% Wage Lift', time: '11m ago' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveAudits.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const heroProjectedWage = Math.round(heroWage * 1.68);
  const hero2YearLift = (heroProjectedWage - heroWage) * 24;

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-600/20 via-indigo-600/15 to-transparent blur-[160px] rounded-full animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/3 -left-40 w-[650px] h-[650px] bg-cyan-600/12 blur-[180px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[650px] h-[650px] bg-indigo-600/15 blur-[180px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-[#060a17]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition flex-shrink-0">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">CareerLoop</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">State Skilling Registry</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-xs font-bold text-slate-300">
            <Link href="#overview" className="hover:text-cyan-300 transition">Overview</Link>
            <Link href="#features" className="hover:text-cyan-300 transition">Capabilities</Link>
            <Link href="#showcase" className="hover:text-cyan-300 transition">Platform Showcase</Link>
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Tour</span>
            </button>
            <Link href="/contact" className="hover:text-cyan-300 transition">Helpdesk</Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a 
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>State Admin Desk</span>
            </a>

            <Link 
              href="/login" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Access Trainee Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#060a17] p-5 space-y-4 animate-in slide-in-from-top-4">
            <div className="flex flex-col space-y-3 text-sm font-bold text-slate-300">
              <Link href="#overview" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-900 rounded-xl">
                Overview
              </Link>
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-900 rounded-xl">
                Capabilities
              </Link>
              <Link href="#showcase" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-900 rounded-xl">
                Platform Showcase
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-900 rounded-xl">
                Support Helpdesk
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-center font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5"
              >
                <span>Trainee Portal (Sign In / Register)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slate-800 text-slate-200 text-center font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Command Center</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-14 pb-20 lg:pt-24 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          
          {/* Live Government Status Pill */}
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-blue-900/35 border border-blue-500/35 text-blue-300 text-xs font-bold tracking-wide shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
            <span className="ml-2">Live Maharashtra State Skilling Telemetry • PS-135 Enclave</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Longitudinal Career Telemetry & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Verified Post-Training Outcomes.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The definitive statewide tracking architecture for Maharashtra vocational candidates, micro-enterprises, and skill development officers. Unifying NSQF accredited curricula, 24-month longitudinal wage audits, and cryptographic credential proofs.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-sm cursor-pointer hover:scale-[1.02]"
            >
              <span>Launch Trainee Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button 
              type="button"
              onClick={() => setIsTutorialOpen(true)}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-700/80 transition flex items-center justify-center space-x-2 text-sm cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive System Tour</span>
            </button>
          </div>

          {/* Live Outcome Feed Bar */}
          <div className="max-w-3xl mx-auto pt-4">
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Live Outcome Ticker:</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200">
                <span className="font-bold text-white">[{liveAudits[tickerIndex].district}]</span>
                <span>{liveAudits[tickerIndex].candidate} ({liveAudits[tickerIndex].trade})</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded text-[10px]">
                  {liveAudits[tickerIndex].lift}
                </span>
                <span className="text-[10px] text-slate-500">{liveAudits[tickerIndex].time}</span>
              </div>
            </div>
          </div>

          {/* 4 Live Telemetry KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-5xl mx-auto text-left">
            
            <div className="bg-[#0a1020]/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-1.5 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Outcome Verification</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">94.2%</p>
              <span className="text-[11px] text-emerald-400 font-bold">✓ State Evaluator Audited</span>
            </div>

            <div className="bg-[#0a1020]/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-1.5 hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Avg Verified Wage</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">₹24,500<span className="text-xs text-slate-400 font-normal">/mo</span></p>
              <span className="text-[11px] text-blue-400 font-bold">+68% Post-Training Lift</span>
            </div>

            <div className="bg-[#0a1020]/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-1.5 hover:border-purple-500/40 transition">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>District Integration</span>
                <Building2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">36 / 36</p>
              <span className="text-[11px] text-slate-400 font-bold">All Maharashtra Districts</span>
            </div>

            <div className="bg-[#0a1020]/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md space-y-1.5 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Credential Security</span>
                <QrCode className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
              <span className="text-[11px] text-amber-400 font-bold">SHA-256 Sealed Proofs</span>
            </div>

          </div>

        </div>
      </section>

      {/* Overview & 3-Step Outcomes Journey Section */}
      <section id="overview" className="py-20 bg-[#060a16] border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Platform Introduction & Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How CareerLoop Transforms Vocational Outcomes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              A comprehensive three-stage longitudinal pathway designed to bridge the gap between vocational training intake and high-income industry mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#0a1022] border border-slate-800/90 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition hover-lift">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-lg font-mono">
                  01
                </div>
                <h3 className="text-xl font-bold text-white">Trade & Identity Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Candidates register securely with DigiLocker, APAAR ID, and Aadhaar credential proofs. Uploaded trade diplomas and ITI certificates undergo SHA-256 cryptographic sealing and district officer verification.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-bold">
                <span>Tamper-Proof Vault</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0a1022] border border-slate-800/90 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition hover-lift">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-lg font-mono">
                  02
                </div>
                <h3 className="text-xl font-bold text-white">AI Pathways & NPTEL Upskilling</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose from 22+ NSQF industry presets or enter custom dream roles. The AI Career Engine computes exact skill deficits, builds personalized N-day milestones, and connects to 30+ accredited NPTEL/Swayam courses.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-bold">
                <span>Wage Lift Acceleration</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0a1022] border border-slate-800/90 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition hover-lift">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-lg font-mono">
                  03
                </div>
                <h3 className="text-xl font-bold text-white">24-Month Tracking & Micro-Grants</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Longitudinal milestone surveys at 3, 6, 12, 18, and 24 months record real salary growth. Self-employed graduates generate GST invoices and apply for PMEGP, Mudra, and CMEGP state capital subsidies.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Verified Enterprise Growth</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Inline Interactive Wage Lift Simulator */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0a1226] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-6 space-y-3 text-left">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-300">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Wage Lift Forecaster</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Estimate Your Post-Training Earning Potential
                </h3>
                <p className="text-xs text-slate-400">
                  Adjust your baseline monthly wage to see the average 68% salary lift achieved by certified Maharashtra vocational graduates over 24 months.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Baseline Monthly Intake:</span>
                    <span className="text-cyan-400 font-mono text-sm">₹{heroWage.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="8000"
                    max="40000"
                    step="1000"
                    value={heroWage}
                    onChange={(e) => setHeroWage(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>₹8,000 (Entry)</span>
                    <span>₹20,000 (Mid)</span>
                    <span>₹40,000 (Specialist)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">24-Month Projected Salary</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">₹{heroProjectedWage.toLocaleString('en-IN')}/mo</p>
                    <span className="text-[10px] text-emerald-300 font-bold">+68% Net Progression</span>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Cumulative Additional Income</span>
                    <p className="text-2xl font-black text-cyan-300 font-mono">+₹{hero2YearLift.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-400">Over 24 Months</span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-blue-600/25"
                >
                  <span>Register Free to Claim Your Skill Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Interactive Platform Showcase Section */}
      <section id="showcase" className="py-20 bg-[#040711] border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Interactive Platform Showcase</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Switch between perspectives to explore how CareerLoop unifies the entire skilling-to-workforce ecosystem.
            </p>

            {/* Switcher Tabs */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 gap-1 mt-4">
              <button
                onClick={() => setActiveShowcase('trainee')}
                className={`px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center space-x-2 ${
                  activeShowcase === 'trainee' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Trainee Career Enclave</span>
              </button>

              <button
                onClick={() => setActiveShowcase('admin')}
                className={`px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center space-x-2 ${
                  activeShowcase === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>State Admin Command Center</span>
              </button>

              <button
                onClick={() => setActiveShowcase('employer')}
                className={`px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center space-x-2 ${
                  activeShowcase === 'employer' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Industry Matchmaker</span>
              </button>
            </div>
          </div>

          {/* Dynamic Showcase View Container */}
          <div className="bg-[#080e1e] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            
            {activeShowcase === 'trainee' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">
                    <GraduationCap className="w-4 h-4" />
                    <span>Candidate Empowerment Portal</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Dynamic Wage Growth Curves & AI Skill Roadmaps
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Trainees track verified salary progression from day 0 to 24 months, complete multilingual follow-up surveys, build accredited NPTEL learning pathways, and issue GST-compliant digital invoices for micro-enterprises.
                  </p>
                  
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Automated 3M, 6M, 12M, 18M, 24M longitudinal survey check-ins.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Authentic NPTEL & Swayam courses with official enrollment links.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Interactive Self-Employment cashbook with WhatsApp invoice sharing.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer"
                    >
                      <span>Explore Trainee Features</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 text-left font-mono text-xs shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 font-bold">TRN-2026-MH-4820</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">Verified Intake</span>
                  </div>
                  
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Intake Wage (0M):</span>
                      <span className="font-bold text-white">₹14,000 / mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">6M Verified Progression:</span>
                      <span className="font-bold text-emerald-400">₹22,500 / mo (+60.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Role:</span>
                      <span className="font-bold text-blue-400">Industrial Garment QA Supervisor</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-3/4 rounded-full" />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">NSQF L5 Skill Gap: 75% Complete</div>
                </div>
              </div>
            )}

            {activeShowcase === 'admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>State Governance Center</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Tamper-Proof Document Audits & Broadcast Dispatches
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    District skill officers inspect proof documents with inline viewers, approve candidate verifications, broadcast 3-day expiring notifications, and query real-time district labor deficit matrices.
                  </p>
                  
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Document Preview Modal with SHA-256 cryptographic verification.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Targeted candidate notifications or statewide broadcasts with auto-expiry.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Real-time district placement and wage benchmark telemetry across 36 districts.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/20"
                    >
                      <span>Open Admin App (Port 3001)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 text-left font-mono text-xs shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-slate-400 font-bold">STATE VERIFICATION QUEUE</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-bold">Active Audit</span>
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1 text-slate-300">
                    <div className="text-white font-bold">Aadhaar & ITI Certificate Proof</div>
                    <div className="text-[11px] text-slate-400">Candidate: Snehal More • Pune District</div>
                    <div className="text-[10px] text-blue-400 truncate">SHA256: 8f9b4c2e1a7d...39e0a</div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">
                      Approve & Verify
                    </button>
                    <button className="flex-1 py-2 bg-slate-800 text-rose-400 border border-rose-900 rounded-xl font-bold text-xs">
                      Reject with Reason
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeShowcase === 'employer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20">
                    <Users className="w-4 h-4" />
                    <span>Industry Recruitment Link</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Verified Competency Filter & Direct Hiring
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Companies query verified trade candidates by NSQF competency badges, district proximity, and certified experience, eliminating unverified claims and accelerating talent acquisition.
                  </p>
                  
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Search by certified trade competencies (EV, CAD, Solar, Retail).</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Instant QR-code verification on candidate resumes.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>National Apprenticeship Scheme (NATS) compliance export.</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 text-left font-mono text-xs shadow-md">
                  <div className="text-slate-400 font-bold border-b border-slate-800 pb-2">
                    MATCHED CANDIDATES (PUNE & AURANGABAD)
                  </div>
                  
                  {[
                    { name: 'Rahul Shinde', trade: 'EV Battery Tech', nsqf: 'L6', match: '98%' },
                    { name: 'Priya Kulkarni', trade: 'Garment CAD Quality', nsqf: 'L5', match: '95%' },
                    { name: 'Vijay Patil', trade: 'Solar Grid Inverter Wiring', nsqf: 'L4', match: '92%' }
                  ].map((c, i) => (
                    <div key={i} className="p-2.5 bg-slate-800/50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.trade} • {c.nsqf}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-bold text-[10px]">
                        {c.match} Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#03060f] py-12 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span className="font-bold text-slate-300">CareerLoop State Skilling Registry</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">District Desk</Link>
            <Link href="/verify" className="hover:text-white transition">Verify Credential</Link>
          </div>

          <p className="text-center md:text-right">
            © 2026 Government of Maharashtra • Skill Development, Employment & Entrepreneurship Department.
          </p>
        </div>
      </footer>

      {/* Cookie Banner & Tutorial Modal */}
      <CookieBanner />
      <InteractiveTutorialModal 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />

    </div>
  );
}
