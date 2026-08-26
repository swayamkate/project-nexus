'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  LogOut,
  Sparkles,
  ShieldCheck,
  User
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
  const { user, profile, notifications, signOut } = useUser();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trainee';
  const displayId = profile?.trainee_id || 'TRN-PENDING';
  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 0;

  return (
    <header className="h-16 bg-[#0a1020]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Title / Current Page Heading */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMobileMenuToggle} 
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {viewMode === 'admin' ? (
            <div>
              <h2 className="text-base font-extrabold text-white">Government Analytics & Policy</h2>
              <p className="text-[11px] text-slate-400">Longitudinal Impact & State Outcome Registry</p>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                <span>Welcome, {displayName}</span>
                <span className="text-sm">👋</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Trainee ID: <span className="font-mono text-blue-400 font-semibold">{displayId}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center relative w-64 lg:w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
        <input 
          type="text" 
          placeholder="Search programs, skills, records..." 
          className="w-full bg-slate-900/90 text-slate-200 text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-600"
        />
      </div>

      {/* Right Controls: Notifications, Role Switcher, Profile, Logout */}
      <div className="flex items-center space-x-3">
        {/* Switch View Mode (State Admin vs Trainee Portal) */}
        <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('trainee')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'trainee' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Trainee Portal
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'admin' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            State Analytics
          </button>
        </div>

        {/* Notifications Bell */}
        <button 
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              {unreadNotifs}
            </span>
          )}
        </button>

        {/* User Profile Capsule */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url}
              alt="User avatar" 
              className="w-8 h-8 rounded-full object-cover border border-blue-500/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="hidden lg:block text-left">
            <h4 className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">
              {displayName}
            </h4>
            <p className="text-[10px] text-slate-400 max-w-[120px] truncate">
              {user?.email || 'Logged in'}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
