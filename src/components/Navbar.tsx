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
  X,
  Settings,
  BarChart3
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { InteractiveTutorialModal } from '@/components/InteractiveTutorialModal';

interface NavbarProps {
  viewMode: 'admin' | 'trainee';
  setViewMode: (mode: 'admin' | 'trainee') => void;
  activeSection: string;
  onNavigate?: (section: string) => void;
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  viewMode, 
  setViewMode, 
  activeSection, 
  onNavigate, 
  onMobileMenuToggle 
}) => {
  const { user, profile, notifications, signOut, t, markNotificationAsRead, markAllNotificationsAsRead } = useUser();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const displayName = profile?.full_name || 'Nexus Trainee';
  const firstName = displayName.split(' ')[0];
  const displayId = profile?.trainee_id || 'TRN-PENDING';
  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 0;

  const handleDropdownNavigate = (sec: string) => {
    if (onNavigate) onNavigate(sec);
    setShowUserMenu(false);
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#080c16]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">Nexus</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">
            {t(`nav.${activeSection.replace('-', '')}`, activeSection.replace('-', ' '))}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3.5">
        
        {/* Interactive Platform Guide */}
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Interactive Guide</span>
        </button>

        {/* Superadmin Console Quick Access (Only if admin email) */}
        {user?.email === 'admin@nexus.com' && (
          <a
            href="https://administrator.avishkark.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Console</span>
          </a>
        )}

        {/* Notifications Bell with Real Popup */}
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

          {/* Notifications Dropdown Panel */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  <span>State Broadcasts & Alerts</span>
                </span>
                {unreadNotifs > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {notifications && notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        n.is_read 
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 text-slate-500' 
                          : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{n.title}</p>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(n.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No new notifications from District Skill Mission.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={displayName} 
                className="w-7 h-7 rounded-full object-cover border border-blue-500 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[110px]">
                {firstName}
              </span>
              <span className="text-[10px] text-blue-600 font-mono font-semibold block leading-tight">
                {displayId}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => handleDropdownNavigate('profile')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('analytics')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Analytics & Wage Lift</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('settings')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => signOut()}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

      <InteractiveTutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} roleMode="trainee" />
    </header>
  );
};
