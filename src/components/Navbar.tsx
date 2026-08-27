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
  X,
  Settings,
  BarChart3,
  Award,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

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
  const { user, profile, notifications, signOut, language, setLanguage, t, markNotificationAsRead, markAllNotificationsAsRead } = useUser();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = profile?.full_name || 'Nexus Trainee';
  const firstName = displayName.split(' ')[0];
  const displayId = profile?.trainee_id || 'TRN-PENDING';
  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 0;

  const handleDropdownNavigate = (sec: string) => {
    if (onNavigate) onNavigate(sec);
    setShowUserMenu(false);
  };

  const handleCycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
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
        
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-transparent dark:border-slate-800">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${language === 'en' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-black' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${language === 'mr' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-black' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            मराठी
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${language === 'hi' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-black' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            हिंदी
          </button>
        </div>

        {/* Quick Theme Toggle Button */}
        <button
          type="button"
          onClick={handleCycleTheme}
          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer btn-interactive"
          title={`Theme: ${theme.toUpperCase()} (Click to cycle)`}
        >
          {theme === 'system' ? (
            <Monitor className="w-4 h-4 text-blue-500" />
          ) : theme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
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

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">{t('nav.notifications', 'Notifications')} ({unreadNotifs})</span>
                <div className="flex items-center space-x-2">
                  {unreadNotifs > 0 && (
                    <button 
                      onClick={() => markAllNotificationsAsRead()} 
                      className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      {t('nav.markAllRead', 'Mark all read')}
                    </button>
                  )}
                  <button onClick={() => setShowNotifMenu(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
                      className={`p-3 rounded-xl space-y-1 transition cursor-pointer ${
                        notif.is_read 
                          ? 'bg-slate-50 text-slate-600 hover:bg-slate-100/80' 
                          : 'bg-blue-50/80 text-slate-900 border border-blue-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className={`text-xs ${notif.is_read ? 'font-semibold text-slate-700' : 'font-black text-blue-950'}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                        {new Date(notif.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400">
                    <Bell className="w-6 h-6 mx-auto mb-1 opacity-40" />
                    <p className="text-xs">{t('nav.noNotifications', 'No new notifications.')}</p>
                  </div>
                )}
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
                {displayId}
              </p>
            </div>
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in-50 space-y-1">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 font-mono">{user?.email || 'user@nexus.in'}</p>
              </div>

              <button
                onClick={() => handleDropdownNavigate('my-profile')}
                className="w-full p-2 text-left text-slate-700 hover:bg-slate-50 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('analytics')}
                className="w-full p-2 text-left text-slate-700 hover:bg-slate-50 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>Career Analytics</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('settings')}
                className="w-full p-2 text-left text-slate-700 hover:bg-slate-50 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Settings & Security</span>
              </button>

              <div className="pt-1 border-t border-slate-100">
                <button 
                  onClick={signOut}
                  className="w-full p-2 text-left text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center space-x-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
