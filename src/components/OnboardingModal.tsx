'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  QrCode
} from 'lucide-react';

interface OnboardingModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ forceOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const hasSeenTour = localStorage.getItem('nexus_onboarding_completed');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleFinish = () => {
    localStorage.setItem('nexus_onboarding_completed', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const steps = [
    {
      icon: Award,
      badge: 'Step 1 of 3: Verified Registry',
      title: 'Your Verified Skilling Dossier',
      description: 'Nexus preserves your certified vocational credentials with cryptographic QR verification. Share your verified CV directly with employers.',
      highlights: [
        'Course certificates with anti-counterfeit QR code verification',
        'Privacy safeguards protecting your sensitive contact details',
        'Direct synchronization with verified assessment repositories'
      ],
      tag: 'Certified & Anti-Counterfeit'
    },
    {
      icon: TrendingUp,
      badge: 'Step 2 of 3: Career Growth',
      title: 'Longitudinal Wage & Impact Tracking',
      description: 'Participate in the 3, 6, 12, and 24-month longitudinal survey milestones to unlock government wage subsidies and career progression bonuses.',
      highlights: [
        'Track your monthly earnings trajectory post-training',
        'Automatic qualification for Mahaswayam state welfare incentives',
        'Access personalized career counseling & upskilling recommendations'
      ],
      tag: 'Longitudinal Milestones'
    },
    {
      icon: Building2,
      badge: 'Step 3 of 3: MSME & Subsidies',
      title: 'Micro-Enterprise & Self-Employment Portal',
      description: 'Are you starting your own venture? Link your Udyam registration and GSTIN to claim PMEGP capital subsidies and Mudra credit assistance.',
      highlights: [
        'Instant Udyam MSME verification queue and digital verification badges',
        'PMEGP & Mudra government grant disbursement tracking',
        'Direct employer hiring and apprentice matchmaking'
      ],
      tag: 'Enterprise Grants'
    }
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 relative flex flex-col space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              {current.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Graphic & Content */}
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
            <StepIcon className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Highlights Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Progress Dots & Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx 
                    ? 'w-6 bg-blue-600' 
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer"
              >
                Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
