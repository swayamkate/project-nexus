'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Target, 
  Compass, 
  BookOpen, 
  Award, 
  Briefcase, 
  BarChart3, 
  GraduationCap, 
  ShieldCheck, 
  CalendarClock, 
  Building2, 
  FileText, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
  badge?: number;
}

interface NavCategory {
  category: string;
  items: MenuItem[];
}

interface SidebarProps {
  viewMode: 'admin' | 'trainee';
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  viewMode, 
  activeSection, 
  setActiveSection 
}) => {
  const { profile, signOut, notifications, t } = useUser();

  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 0;

  const navCategories: NavCategory[] = [
    {
      category: t('sidebar.core', 'Core Navigation'),
      items: [
        { id: 'dashboard', label: t('nav.dashboard', 'Overview'), icon: LayoutDashboard },
        { id: 'my-profile', label: t('nav.profile', 'My Profile'), icon: User },
        { id: 'career-goal', label: t('nav.careerGoal', 'Career Goal & AI Gap'), icon: Target, isNew: true },
        { id: 'career-roadmap', label: t('nav.careerRoadmap', 'N-Days Roadmap'), icon: Compass, isNew: true },
      ]
    },
    {
      category: t('sidebar.skilling', 'Skilling & Assessment'),
      items: [
        { id: 'courses', label: t('nav.courses', 'Courses (NPTEL/Swayam)'), icon: BookOpen },
        { id: 'skill-assessments', label: t('nav.assessments', 'Trade Skill Quizzes'), icon: Award, isNew: true },
        { id: 'interview-prep', label: t('nav.interviewPrep', 'AI Interview Coach'), icon: Briefcase, isNew: true },
        { id: 'training-details', label: t('nav.training', 'Enrolled Programs'), icon: GraduationCap },
        { id: 'certifications', label: t('nav.certifications', 'Certifications & QR'), icon: ShieldCheck },
      ]
    },
    {
      category: t('sidebar.outcomes', 'Outcomes & Grants'),
      items: [
        { id: 'analytics', label: t('nav.analytics', 'Wage Analytics'), icon: BarChart3 },
        { id: 'follow-ups', label: t('nav.followups', '24M Follow-ups'), icon: CalendarClock },
        { id: 'self-employment', label: t('nav.selfEmployment', 'Udyam MSME Grants'), icon: Building2 },
        { id: 'documents', label: t('nav.documents', 'Document Vault'), icon: FileText },
      ]
    },
    {
      category: t('sidebar.account', 'Account & Support'),
      items: [
        { id: 'notifications', label: t('nav.notifications', 'Broadcast Alerts'), icon: Bell, badge: unreadNotifs },
        { id: 'settings', label: t('nav.settings', 'Settings & Privacy'), icon: Settings },
        { id: 'help-support', label: t('nav.help', 'Helpdesk & Support'), icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#090e1a] text-slate-700 dark:text-slate-300 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-colors duration-200">
      
      {/* Top Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <span className="text-white font-black text-lg tracking-tighter">C</span>
          </div>
          <div>
            <h1 className="font-black text-slate-900 dark:text-white text-sm tracking-tight leading-tight flex items-center space-x-1">
              <span>CareerLoop</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">MH</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Vocational Registry
            </p>
          </div>
        </div>

        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Connected" />
      </div>

      {/* Categorized Scrollable Navigation Container */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {navCategories.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.category}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {item.isNew && (
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/25 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        New
                      </span>
                    )}

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Sticky Action Panel */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 shrink-0 bg-slate-50/50 dark:bg-[#070b14]/50">
        
        {/* User Profile Quick Card in Sidebar */}
        <button
          onClick={() => setActiveSection('my-profile')}
          className={`w-full p-2.5 rounded-xl flex items-center space-x-2.5 transition text-left cursor-pointer border ${
            ['my-profile', 'profile'].includes(activeSection)
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
          }`}
          title="View My Profile"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {(profile?.full_name || 'T').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate leading-tight">{profile?.full_name || 'My Profile'}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate leading-tight">{profile?.trainee_id || 'TRN-ACTIVE'}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveSection('help-support')}
          className="w-full bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 p-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-bold transition cursor-pointer border border-blue-100 dark:border-blue-900/40"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>District Helpdesk</span>
        </button>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};
