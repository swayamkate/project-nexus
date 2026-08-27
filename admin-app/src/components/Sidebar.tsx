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
  Compass
} from 'lucide-react';

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
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle },
  ];

  const currentMenuItems = viewMode === 'admin' ? adminMenuItems : traineeMenuItems;

  return (
    <aside className="w-64 bg-[#0a1020] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              Nexus
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Executive Administration
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.isNew && (
                  <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">
                    New
                  </span>
                )}

                {item.badge && (
                  <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information Card */}
      <div className="p-4 border-t border-slate-800/80">
        {viewMode === 'admin' ? (
          <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-800/30 p-3.5 rounded-2xl">
            <h4 className="font-bold text-slate-100 text-xs">Track. Analyse. Improve.</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Building a skilled Maharashtra for a better tomorrow.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('help-support')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold shadow-lg shadow-blue-600/20 hover:brightness-110 transition"
            >
              <Headphones className="w-4 h-4" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={async () => {
                const supabase = (await import('@/lib/supabaseBrowser')).createClient();
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
