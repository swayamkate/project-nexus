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
  Award,
  BarChart3,
  Building2,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PlatformSettingsSync } from '@/components/PlatformSettingsSync';
import { InteractiveTutorialModal } from '@/components/InteractiveTutorialModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [pendingVerifsCount, setPendingVerifsCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // 1. Verify session through secure server endpoint with Bearer token
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const saRes = await fetch('/api/auth/me', { headers });
        if (saRes.ok) {
          const saData = await saRes.json();
          if (saData.isAdmin || saData.isSuperadmin) {
            setIsAdmin(true);
            setAdminUser(saData.user || { email: session?.user?.email || 'admin@avishkark.in', role: saData.role || 'superadmin' });
            fetchPendingCount();
            return;
          }
        }

        // 2. Direct Supabase client session validation
        if (!session) {
          router.push('/login');
          return;
        }

        const userEmail = session.user.email?.toLowerCase();
        const isKnownSuperadmin = userEmail && ['admin@avishkark.in', 'avishkarkedar@gmail.com', 'admin@nexus.com', 'admin@nexus.gov.in'].includes(userEmail);

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role, username, email')
          .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
          .in('role', ['admin', 'superadmin', 'evaluator', 'employer'])
          .maybeSingle();

        if (!roleData && !isKnownSuperadmin) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }

        const effectiveRole = roleData?.role || (isKnownSuperadmin ? 'superadmin' : 'admin');
        setIsAdmin(true);
        setAdminUser({ 
          email: session.user.email || roleData?.email, 
          role: effectiveRole,
          username: roleData?.username || session.user.email?.split('@')[0] 
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
    document.cookie = 'careerloop_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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

  const navCategories = adminUser?.role === 'employer' ? [
    {
      title: 'Recruitment & Talent',
      items: [
        { name: 'Candidate Evaluation Desk', href: '/employer-desk', icon: Users },
        { name: 'AI Workforce Matching', href: '/workforce', icon: Sparkles },
        { name: 'Document & QR Verifier', href: '/verifications', icon: FileText, badge: pendingVerifsCount },
      ]
    },
    {
      title: 'Placements & Events',
      items: [
        { name: 'Rozgar Melawas & Job Fairs', href: '/melawas', icon: Building2 },
        { name: 'Accredited NPTEL Courses', href: '/courses', icon: BookOpen },
        { name: 'Skill Assessments Explorer', href: '/assessments', icon: Award },
      ]
    },
    {
      title: 'Communication & Help',
      items: [
        { name: 'SMS & WhatsApp Broadcasts', href: '/broadcasts', icon: MessageSquare },
        { name: 'Support & Helpdesk', href: '/support', icon: Headphones },
      ]
    }
  ] : [
    {
      title: 'Command & Directory',
      items: [
        { name: 'Dashboard Overview', href: '/', icon: Activity },
        { name: 'Trainees & Governance', href: '/users', icon: Users },
        { name: 'Document Verifications', href: '/verifications', icon: FileText, badge: pendingVerifsCount },
        { name: 'Employer Evaluation Desk', href: '/employer-desk', icon: Building2 },
      ]
    },
    {
      title: 'Skilling & Curriculum',
      items: [
        { name: 'Accredited Courses (NPTEL)', href: '/courses', icon: BookOpen },
        { name: 'Skill Assessments & Badges', href: '/assessments', icon: Award },
        { name: 'Interview Questions Desk', href: '/interviews', icon: Briefcase },
        { name: 'Training Programs', href: '/programs', icon: GraduationCap },
        { name: 'ITI & Centers Auditor', href: '/centers', icon: Landmark },
      ]
    },
    {
      title: 'Placements & Grants',
      items: [
        { name: 'AI Workforce Suite', href: '/workforce', icon: Sparkles },
        { name: 'Rozgar Melawas & Fairs', href: '/melawas', icon: Building2 },
        { name: 'Government Schemes', href: '/schemes', icon: Landmark },
        { name: 'DBT & Stipends Ledger', href: '/dbt', icon: CreditCard },
        { name: 'Follow-ups & Milestones', href: '/followups', icon: CalendarClock },
      ]
    },
    {
      title: 'Governance & Telemetry',
      items: [
        { name: 'Analytics Evidence', href: '/analytics', icon: BarChart3 },
        { name: 'SMS & WhatsApp Hub', href: '/broadcasts', icon: MessageSquare },
        { name: 'Support & Feedback', href: '/support', icon: Headphones },
        { name: 'Billing & Subsidies', href: '/billing', icon: Tag },
        { name: 'Audit Logs & Pipeline', href: '/audit', icon: Database },
        { name: 'System Settings & Brand', href: '/settings', icon: Sliders },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
      <PlatformSettingsSync />

      {/* Desktop Sticky Sidebar */}
      <aside className="w-72 bg-[#0a1020] border-r border-slate-800/80 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand Header */}
          <div className="h-16 flex items-center px-5 border-b border-slate-800/80 space-x-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block leading-none">CareerLoop Admin</span>
              <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block mt-0.5">
                {adminUser?.role === 'employer' ? 'Industry Recruiter Console' : 'Executive Control Center'}
              </span>
            </div>
          </div>
          
          {/* Navigation Links Scrollable Container */}
          <div className="p-3 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-800">
            {navCategories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-1">
                <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                  {cat.title}
                </div>

                {cat.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Logout Bottom Bar */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0 space-y-2">
            <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                {(adminUser?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{adminUser?.email || 'admin@careerloop.gov.in'}</p>
                <div className="flex items-center space-x-1">
                  {adminUser?.role === 'superadmin' ? (
                    <span className="text-[8px] font-black text-amber-300 uppercase tracking-wider">
                      👑 SUPERADMIN
                    </span>
                  ) : adminUser?.role === 'employer' ? (
                    <span className="text-[8px] font-black text-purple-300 uppercase tracking-wider">
                      🏢 INDUSTRY EMPLOYER
                    </span>
                  ) : (
                    <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">
                      🛡️ {adminUser?.role || 'Admin'}
                    </span>
                  )}
                </div>
              </div>
            </div>  
            
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center space-x-1.5 p-2 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="font-extrabold text-white tracking-tight">CareerLoop State Command</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 capitalize">
                {pathname === '/' ? 'Dashboard Overview' : pathname.replace('/', '').replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Interactive Platform Guide */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/60 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Guide</span>
            </button>

            {/* Candidate Portal Quick Link */}
            {/* Industry Employer Portal Link */}
            <a
              href="https://avishkark.in/employers"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-blue-950/60 border border-blue-800 hover:border-blue-700 text-blue-300 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Employers Portal</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </a>

            {/* Candidate Portal Quick Link */}
            <a
              href="https://avishkark.in/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              <span>Candidate Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-[#0a1020] h-full p-4 overflow-y-auto space-y-4 border-r border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navCategories.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-1">
                    <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                      {cat.title}
                    </div>
                    {cat.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                          pathname === item.href ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        {/* Global Tutorial Modal */}
        {isTutorialOpen && (
          <InteractiveTutorialModal 
            isOpen={isTutorialOpen} 
            onClose={() => setIsTutorialOpen(false)} 
          />
        )}

      </div>
    </div>
  );
}
