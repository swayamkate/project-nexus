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
  BarChart3,
  Globe,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Language } from '@/lib/i18n';
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
  const { user, profile, notifications, signOut, t, language, setLanguage, markNotificationAsRead, markAllNotificationsAsRead } = useUser();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const displayName = profile?.full_name || 'CareerLoop Trainee';
  const firstName = displayName.split(' ')[0];
  const displayId = profile?.trainee_id || 'TRN-PENDING';
  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 0;

  const handleDropdownNavigate = (sec: string) => {
    if (onNavigate) onNavigate(sec);
    setShowUserMenu(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
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
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">CareerLoop</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium capitalize">
            {t(`nav.${activeSection.replace('-', '')}`, activeSection.replace('-', ' '))}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="uppercase tracking-wider">
              {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'EN'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95">
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>English</span>
                {language === 'en' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                onClick={() => handleLanguageSelect('mr')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  language === 'mr'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>मराठी</span>
                {language === 'mr' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                onClick={() => handleLanguageSelect('hi')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>हिन्दी</span>
                {language === 'hi' && <span className="text-[10px]">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs"
          title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-blue-400" />
          ) : theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Laptop className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Interactive Platform Guide */}
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Guide</span>
        </button>

        {/* Superadmin Console Quick Access (Only if admin email) */}
        {(user?.email === 'admin@avishkark.in' || user?.email === 'admin@nexus.com' || user?.email?.includes('admin')) && (
          <a
            href="https://administrator.avishkark.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Console</span>
          </a>
        )}

        {/* Notifications Bell with Popup */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowLangMenu(false);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-xs"
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
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No new broadcast alerts.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Capsule Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowLangMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{firstName}</span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">{displayId}</span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => handleDropdownNavigate('my-profile')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium transition cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('analytics')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium transition cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span>Career Analytics</span>
              </button>

              <button
                onClick={() => handleDropdownNavigate('settings')}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings & Security</span>
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                <button
                  onClick={signOut}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Tutorial Modal */}
      {isTutorialOpen && (
        <InteractiveTutorialModal 
          isOpen={isTutorialOpen} 
          onClose={() => setIsTutorialOpen(false)} 
        />
      )}

    </header>
  );
};
