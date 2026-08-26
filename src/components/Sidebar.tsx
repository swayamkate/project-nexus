'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CalendarClock, 
  Building2, 
  Target, 
  MapPin, 
  BarChart3, 
  Sparkles, 
  Settings, 
  User, 
  Award, 
  FileText, 
  Bell, 
  HelpCircle, 
  LogOut,
  Headphones,
  Compass,
  TreeDeciduous,
  ShieldAlert
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
  badge?: number;
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
  const { signOut, notifications } = useUser();

  const unreadNotifs = notifications?.filter(n => !n.is_read)?.length || 3;

  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainees', label: 'Trainees', icon: Users },
    { id: 'training', label: 'Training & Courses', icon: GraduationCap },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { id: 'employers', label: 'Employers', icon: Building2 },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
    { id: 'district-analytics', label: 'District Analytics', icon: MapPin },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const traineeMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-profile', label: 'My Profile', icon: User },
    { id: 'training-details', label: 'Training Details', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'employment-status', label: 'Employment Status', icon: Briefcase },
    { id: 'follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { id: 'self-employment', label: 'Self-Employment', icon: Building2, isNew: true },
    { id: 'skill-development', label: 'Skill Development', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
  ];

  const currentMenuItems = viewMode === 'admin' ? adminMenuItems : traineeMenuItems;

  return (
    <aside className="w-64 bg-white text-slate-700 border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen select-none">
      
      {/* Top Section: Logo & Nav List */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="4" r="2" fill="currentColor"/>
              <path d="M12 7v14M7 11l5-4 5 4M5 18l7-4 7 4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
              MahaSkill Track
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-normal mt-0.5">
              Your Skill. Your Future
            </p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 space-y-1">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.isNew && (
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    New
                  </span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Support Card & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {viewMode === 'admin' ? (
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-4 rounded-2xl relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h4 className="font-bold text-white text-xs">Track. Analyse. Improve.</h4>
              <p className="text-[10px] text-blue-200 mt-1 leading-relaxed">
                Building a skilled Maharashtra for a better tomorrow.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-md shadow-blue-600/15 space-y-3 relative overflow-hidden">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">Need Help?</h4>
              <p className="text-[10px] text-blue-100">We're here to support you</p>
            </div>

            <button
              onClick={() => setActiveSection('help-support')}
              className="w-full bg-white hover:bg-slate-50 text-blue-700 p-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
          </div>
        )}

        {/* Logout Link */}
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};
