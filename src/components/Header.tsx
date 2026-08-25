'use client';

import React from 'react';
import { 
  Compass, 
  TrendingUp, 
  Briefcase, 
  Users, 
  BarChart3, 
  Bot, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  setUserRole: (role: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  setUserRole 
}) => {
  const navItems = [
    { id: 'trainee', label: 'Skill Gap & Path', icon: Compass },
    { id: 'tracking', label: 'Longitudinal Outcomes', icon: TrendingUp },
    { id: 'self-emp', label: 'Self-Employment', icon: Briefcase },
    { id: 'community', label: 'Interview Hub', icon: Users },
    { id: 'admin', label: 'Admin Analytics', icon: BarChart3 },
    { id: 'automation', label: 'WhatsApp Bot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('trainee')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PS-135
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Privacy-Preserving Skilling Outcomes</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role & Privacy Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-PII Hashed</span>
            </div>

            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trainee">Role: Trainee</option>
              <option value="admin">Role: Policy Admin</option>
              <option value="evaluator">Role: NSDC Evaluator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex overflow-x-auto space-x-2 px-4 py-2 border-t border-slate-800 bg-slate-950/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
