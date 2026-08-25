'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseBrowser';
import { ShieldAlert, Users, Database, Activity, Tag, LogOut, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if user is an admin (simplified check for prototype)
      // In production, use Supabase custom claims or an `admins` table.
      if (session.user.email === 'admin@nexus.com' || session.user.email?.includes('admin')) {
        setIsAdmin(true);
      } else {
        router.push('/dashboard');
      }
    };
    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isAdmin === null) {
    return <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: Activity },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Audit & Export', href: '/admin/audit', icon: Database },
    { name: 'Billing & Promos', href: '/admin/billing', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] flex selection:bg-blue-600 selection:text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0a1020] border-r border-slate-800/80 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
          <ShieldAlert className="w-5 h-5 text-rose-500 mr-2" />
          <span className="text-white font-black tracking-tight">Nexus Admin</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-800/80">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Exit Admin</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#0a1020] border-b border-slate-800/80 flex items-center px-4">
          <ShieldAlert className="w-5 h-5 text-rose-500 mr-2" />
          <span className="text-white font-black tracking-tight">Nexus Admin</span>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
