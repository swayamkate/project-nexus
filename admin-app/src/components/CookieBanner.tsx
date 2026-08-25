'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-2xl z-50">
      <h4 className="text-sm font-bold text-white mb-2">We value your privacy</h4>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        We use cookies to enhance your browsing experience, serve personalized analytics, and analyze our traffic. 
        By clicking "Accept", you consent to our use of cookies as per our Privacy Policy.
      </p>
      <div className="flex space-x-3">
        <button 
          onClick={handleAccept}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
        >
          Accept
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
