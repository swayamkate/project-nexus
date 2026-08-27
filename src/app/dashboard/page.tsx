'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { GovernmentDashboard } from '@/components/GovernmentDashboard';
import { TraineeHomeDashboard } from '@/components/TraineeHomeDashboard';
import { TraineeProfilePage } from '@/components/TraineeProfilePage';
import { FollowupsPage } from '@/components/FollowupsPage';
import { SelfEmploymentModule } from '@/components/SelfEmploymentModule';
import { TraineePortal } from '@/components/TraineePortal';
import { LongitudinalTracker } from '@/components/LongitudinalTracker';
import { CommunityHub } from '@/components/CommunityHub';
import { AutomationHub } from '@/components/AutomationHub';
import { CertificationsPage } from '@/components/CertificationsPage';
import { TrainingDetailsPage } from '@/components/TrainingDetailsPage';
import { DocumentsPage } from '@/components/DocumentsPage';
import { HelpSupportPage } from '@/components/HelpSupportPage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { SettingsPage } from '@/components/SettingsPage';
import { OnboardingModal } from '@/components/OnboardingModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { MessageSquarePlus, Sparkles, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'admin' | 'trainee'>('trainee');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setCurrentUser(session.user);
        if (session.user.email === 'admin@nexus.com') {
          setViewMode('admin');
        } else {
          setViewMode('trainee');
        }
        setLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleModeChange = (mode: 'admin' | 'trainee') => {
    setViewMode(mode);
    setActiveSection('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-700">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-sm text-slate-800">Loading MahaSkill Track...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        
        {/* Desktop & Tablet Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            viewMode={viewMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
              <Sidebar 
                viewMode={viewMode}
                activeSection={activeSection}
                setActiveSection={(s) => {
                  setActiveSection(s);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 justify-between">
          <div>
            <Navbar 
              viewMode={viewMode}
              setViewMode={handleModeChange}
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* Admin Views */}
              {viewMode === 'admin' && (
                <>
                  {activeSection === 'dashboard' && <GovernmentDashboard />}
                  {activeSection === 'trainees' && <LongitudinalTracker />}
                  {activeSection === 'training' && <TrainingDetailsPage />}
                  {activeSection === 'employment' && <LongitudinalTracker />}
                  {activeSection === 'follow-ups' && <AutomationHub />}
                  {activeSection === 'employers' && <CommunityHub />}
                  {activeSection === 'skill-gap' && <TraineePortal />}
                  {activeSection === 'district-analytics' && <GovernmentDashboard />}
                  {activeSection === 'reports' && <AnalyticsPage />}
                  {activeSection === 'ai-insights' && <GovernmentDashboard />}
                  {activeSection === 'settings' && <SettingsPage />}
                </>
              )}

              {/* Trainee Views */}
              {viewMode === 'trainee' && (
                <>
                  {activeSection === 'dashboard' && <TraineeHomeDashboard onNavigate={setActiveSection} />}
                  {activeSection === 'my-profile' && <TraineeProfilePage onNavigate={setActiveSection} />}
                  {activeSection === 'analytics' && <AnalyticsPage />}
                  {activeSection === 'training-details' && <TrainingDetailsPage />}
                  {activeSection === 'certifications' && <CertificationsPage />}
                  {activeSection === 'employment-status' && <LongitudinalTracker />}
                  {activeSection === 'follow-ups' && <FollowupsPage />}
                  {activeSection === 'self-employment' && <SelfEmploymentModule />}
                  {activeSection === 'skill-development' && <TraineePortal />}
                  {activeSection === 'documents' && <DocumentsPage />}
                  {activeSection === 'notifications' && <TraineeHomeDashboard onNavigate={setActiveSection} />}
                  {activeSection === 'settings' && <SettingsPage />}
                  {activeSection === 'help-support' && <HelpSupportPage />}
                </>
              )}
            </main>
          </div>

          {/* Legal & Governance In-App Footer */}
          <footer className="mt-12 py-6 px-6 border-t border-slate-200/80 bg-white/80 backdrop-blur-xs text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-700">MahaSkill Track</span>
                <span>•</span>
                <span>Govt of Maharashtra MSSDS</span>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <Link href="/privacy-policy" className="hover:text-blue-600 transition">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
                <Link href="/privacy-policy#data-deletion" className="hover:text-blue-600 transition">Data Deletion</Link>
                <Link href="/contact" className="hover:text-blue-600 transition">Support Helpdesk</Link>
                <button
                  type="button"
                  onClick={() => setShowTour(true)}
                  className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Platform Tour</span>
                </button>
              </div>
            </div>
          </footer>

        </div>

      </div>

      {/* Floating Feedback & Bug Report Pill */}
      <button
        type="button"
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-full shadow-xl shadow-slate-950/20 text-xs font-bold transition-all flex items-center space-x-2 group cursor-pointer hover:scale-105"
        title="Report a Bug or Give Feedback"
      >
        <MessageSquarePlus className="w-4 h-4 text-blue-400 group-hover:text-white transition" />
        <span className="hidden sm:inline">Feedback & Bug Report</span>
      </button>

      {/* Modals */}
      <OnboardingModal 
        forceOpen={showTour} 
        onClose={() => setShowTour(false)} 
      />

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
        userEmail={currentUser?.email}
      />

    </div>
  );
}
