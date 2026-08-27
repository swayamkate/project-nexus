'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseBrowser';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Activity, 
  Tag, 
  LogOut, 
  Loader2, 
  FileText, 
  GraduationCap, 
  CalendarClock, 
  Landmark, 
  Search, 
  Bell, 
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Sliders,
  Headphones,
  BookOpen,
  Briefcase,
  Award
} from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PlatformSettingsSync } from '@/components/PlatformSettingsSync';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [pendingVerifsCount, setPendingVerifsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // 1. Verify session through secure server endpoint
        const saRes = await fetch('/api/auth/me');
        if (saRes.ok) {
          const saData = await saRes.json();
          if (saData.isAdmin || saData.isSuperadmin) {
            setIsAdmin(true);
            setAdminUser(saData.user || { email: 'admin@nexus.com', role: saData.role || 'admin' });
            fetchPendingCount();
            return;
          }
        }

        // 2. If server auth didn't pass, verify Supabase client session against user_roles
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role, username, email')
          .eq('user_id', session.user.id)
          .in('role', ['admin', 'superadmin', 'evaluator'])
          .maybeSingle();

        if (roleError || !roleData) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }

        setIsAdmin(true);
        setAdminUser({ 
          email: session.user.email || roleData.email, 
          role: roleData.role,
          username: roleData.username 
        });
        fetchPendingCount();
      } catch (err) {
        console.error('Admin layout auth check failed:', err);
        router.push('/login');
      }
    };

    const fetchPendingCount = async () => {
      try {
        const { count } = await supabase
          .from('verifications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        if (count !== null) setPendingVerifsCount(count);
      } catch (e) {}
    };

    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = 'nexus_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'sb_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'superadmin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
    router.refresh();
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white">
        <div className="flex items-center space-x-3 bg-[#0a1020] border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="font-bold text-sm text-slate-300">Authenticating Executive Console...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/', icon: Activity },
    { name: 'Trainees & Enterprises', href: '/users', icon: Users },
    { name: 'Accredited Courses (NPTEL)', href: '/courses', icon: BookOpen },
    { name: 'Skill Assessments & Badges', href: '/assessments', icon: Award },
    { name: 'Interview Questions Desk', href: '/interviews', icon: Briefcase },
    { name: 'Document Verifications', href: '/verifications', icon: FileText, badge: pendingVerifsCount },
    { name: 'Training Programs', href: '/programs', icon: GraduationCap },
    { name: 'Follow-ups & Milestones', href: '/followups', icon: CalendarClock },
    { name: 'Government Schemes', href: '/schemes', icon: Landmark },
    { name: 'Support & Feedback', href: '/support', icon: Headphones },
    { name: 'Billing & Subsidies', href: '/billing', icon: Tag },
    { name: 'Audit Logs & Pipeline', href: '/audit', icon: Database },
    { name: 'System Settings & Brand', href: '/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
      <PlatformSettingsSync />

      {/* Desktop Sidebar */}
      <aside className="w-68 bg-[#0a1020] border-r border-slate-800/80 hidden md:flex flex-col justify-between shrink-0 min-h-screen">
        <div>
          {/* Brand Header */}
          <div className="h-18 flex items-center px-6 border-b border-slate-800/80 space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block leading-none">Nexus Admin</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-1">Executive Control Center</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile Capsule & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{adminUser?.email || 'admin@nexus.com'}</p>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {adminUser?.role || 'Superadmin'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center space-x-2 p-2.5 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-18 bg-[#0a1020]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" /> PostgreSQL Connected
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-medium">State Skill Registry Node #129</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://sih2026.avishkark.in"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://studio.avishkark.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 rounded-xl text-xs font-bold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Supabase Studio</span>
            </a>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a1020] border-b border-slate-800 p-4 space-y-1 z-40 animate-in slide-in-from-top">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold ${
                  pathname === item.href ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Main View Body */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

      </div>
    </div>
  );
}
