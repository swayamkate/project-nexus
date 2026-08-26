'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut,
  Sparkles,
  ShieldCheck,
  User,
  ChevronDown,
  Globe,
  X
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

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
  const { user, profile, notifications, signOut, language, setLanguage } = useUser();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = profile?.full_name || 'Priya Sharma';
  const firstName = displayName.split(' ')[0];
  const displayId = profile?.trainee_id || 'TRN123456';
  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 3;

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Left: Hamburger & Greeting */}
      <div className="flex items-center space-x-3.5">
        <button 
          onClick={onMobileMenuToggle} 
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {viewMode === 'admin' ? (
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">Government Dashboard</h2>
              <p className="text-xs text-slate-500 font-medium">Welcome back, Admin!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-1.5 leading-tight">
                <span>Welcome, {firstName}</span>
                <span>👋</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Track your training, progress and opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="hidden md:flex items-center relative w-72 lg:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
        <input 
          type="text" 
          placeholder={viewMode === 'admin' ? "Search trainees, courses, employers..." : "Search programs, skills, records..."}
          className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-400"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        
        {/* Language Switcher */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-50 border border-slate-200/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg transition ${language === 'en' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
          >
            ENG
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2 py-1 rounded-lg transition ${language === 'mr' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
          >
            मराठी
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-lg transition ${language === 'hi' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
          >
            हिंदी
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setViewMode('trainee')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'trainee' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trainee
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'admin' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            State Admin
          </button>
        </div>

        {/* Notifications Bell with Popup */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadNotifs}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-xs animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">Notifications ({unreadNotifs})</span>
                <button onClick={() => setShowNotifMenu(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 bg-blue-50/60 rounded-xl space-y-0.5">
                  <p className="font-bold text-slate-800">Your 3 Months follow-up recorded</p>
                  <p className="text-[11px] text-slate-500">20 Nov 2024</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                  <p className="font-bold text-slate-800">New course 'Advanced Tailoring' available</p>
                  <p className="text-[11px] text-slate-500">05 Dec 2024</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                  <p className="font-bold text-slate-800">Next follow-up due on 20 Jun 2025</p>
                  <p className="text-[11px] text-slate-500">20 May 2025</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill Capsule */}
        <div className="relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 pl-2 py-1 cursor-pointer group"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={displayName} 
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="hidden sm:block text-left">
              <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-center">
                <span>{displayName}</span>
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400 group-hover:text-slate-600 transition" />
              </h4>
              <p className="text-[10px] text-blue-600 font-semibold font-mono">
                Trainee ID: {displayId}
              </p>
            </div>
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in-50">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
              </div>
              <button 
                onClick={signOut}
                className="w-full mt-1 p-2.5 text-left text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center space-x-2 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
