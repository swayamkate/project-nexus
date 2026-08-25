'use client';

import React, { useState } from 'react';
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

export default function Home() {
  const [viewMode, setViewMode] = useState<'admin' | 'trainee'>('admin');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModeChange = (mode: 'admin' | 'trainee') => {
    setViewMode(mode);
    setActiveSection('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative z-10 w-64 bg-[#0a1020] h-full shadow-2xl">
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
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar 
            viewMode={viewMode}
            setViewMode={handleModeChange}
            activeSection={activeSection}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Admin Views */}
            {viewMode === 'admin' && (
              <>
                {activeSection === 'dashboard' && <GovernmentDashboard />}
                {activeSection === 'trainees' && <LongitudinalTracker />}
                {activeSection === 'training' && <TraineePortal />}
                {activeSection === 'employment' && <LongitudinalTracker />}
                {activeSection === 'follow-ups' && <AutomationHub />}
                {activeSection === 'employers' && <CommunityHub />}
                {activeSection === 'skill-gap' && <TraineePortal />}
                {activeSection === 'district-analytics' && <GovernmentDashboard />}
                {activeSection === 'reports' && <GovernmentDashboard />}
                {activeSection === 'ai-insights' && <GovernmentDashboard />}
                {activeSection === 'settings' && <GovernmentDashboard />}
              </>
            )}

            {/* Trainee Views */}
            {viewMode === 'trainee' && (
              <>
                {activeSection === 'dashboard' && <TraineeHomeDashboard onNavigate={setActiveSection} />}
                {activeSection === 'my-profile' && <TraineeProfilePage onNavigate={setActiveSection} />}
                {activeSection === 'training-details' && <TraineePortal />}
                {activeSection === 'certifications' && <TraineePortal />}
                {activeSection === 'employment-status' && <LongitudinalTracker />}
                {activeSection === 'follow-ups' && <FollowupsPage />}
                {activeSection === 'self-employment' && <SelfEmploymentModule />}
                {activeSection === 'skill-development' && <TraineePortal />}
                {activeSection === 'documents' && <SelfEmploymentModule />}
                {activeSection === 'notifications' && <TraineeHomeDashboard onNavigate={setActiveSection} />}
                {activeSection === 'help-support' && <CommunityHub />}
              </>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}
