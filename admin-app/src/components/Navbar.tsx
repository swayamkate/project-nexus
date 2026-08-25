'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Menu, 
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  viewMode: 'admin' | 'trainee';
  setViewMode: (mode: 'admin' | 'trainee') => void;
  activeSection: string;
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  viewMode, 
  setViewMode, 
  activeSection,
  onMobileMenuToggle
}) => {
  return (
    <header className="h-16 bg-[#0a1020]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Title / Current Page Heading */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMobileMenuToggle} 
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {viewMode === 'admin' ? (
            <div>
              <h2 className="text-base font-extrabold text-white">Government Dashboard</h2>
              <p className="text-[11px] text-slate-400">Welcome back, Admin!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-extrabold text-white">Welcome, Priya 👋</h2>
              <p className="text-[11px] text-slate-400">Track your training, progress and opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center relative w-72 lg:w-96">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
        <input 
          type="text" 
          placeholder="Search trainees, courses, employers..." 
          className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Controls: Notifications, Role Switcher, Profile */}
      <div className="flex items-center space-x-3">
        {/* Switch View Mode (Admin vs Trainee) */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'admin' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setViewMode('trainee')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'trainee' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trainee View
          </button>
        </div>

        {/* Notifications Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
            {viewMode === 'admin' ? 12 : 3}
          </span>
        </button>

        {/* User Profile Capsule */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <img 
            src={
              viewMode === 'admin'
                ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
            }
            alt="User avatar" 
            className="w-8 h-8 rounded-full object-cover border border-blue-500/40"
          />
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-white leading-tight">
              {viewMode === 'admin' ? 'Admin' : 'Priya Sharma'}
            </h4>
            <p className="text-[10px] text-slate-400">
              {viewMode === 'admin' ? 'State Admin' : 'Trainee ID: TRN123456'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
