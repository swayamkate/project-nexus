'use client';

import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nexus_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nexus_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-[calc(100%-2rem)] bg-[#0a1020]/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl z-40 animate-in fade-in-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Privacy & Cookie Consent</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              We use Zero-PII analytics and local cookies to ensure privacy-preserving skilling telemetry.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center space-x-2 mt-3 pt-2.5 border-t border-slate-800/80">
        <button 
          onClick={handleAccept}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 rounded-lg transition cursor-pointer"
        >
          Accept & Continue
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
