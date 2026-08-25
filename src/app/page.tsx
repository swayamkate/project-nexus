'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { TraineePortal } from '@/components/TraineePortal';
import { LongitudinalTracker } from '@/components/LongitudinalTracker';
import { SelfEmploymentModule } from '@/components/SelfEmploymentModule';
import { CommunityHub } from '@/components/CommunityHub';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AutomationHub } from '@/components/AutomationHub';

export default function Home() {
  const [activeTab, setActiveTab] = useState('trainee');
  const [userRole, setUserRole] = useState<'trainee' | 'admin' | 'evaluator'>('trainee');

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        setUserRole={setUserRole} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trainee' && <TraineePortal />}
        {activeTab === 'tracking' && <LongitudinalTracker />}
        {activeTab === 'self-emp' && <SelfEmploymentModule />}
        {activeTab === 'community' && <CommunityHub />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'automation' && <AutomationHub />}
      </main>

      {/* Platform Footer */}
      <footer className="border-t border-slate-900 bg-[#090e1a] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-400">NEXUS</span>
            <span>• PS-135 Privacy-Preserving Skilling Outcomes</span>
          </div>
          <p>Built for Smart India Hackathon 2026 • Differential Privacy (k ≥ 5) • Zero PII Exposure</p>
        </div>
      </footer>
    </div>
  );
}
