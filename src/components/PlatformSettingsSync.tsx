'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { fetchPublicSettings } from '@/lib/platformSettings';

/**
 * Applies admin-configurable platform settings to the public portal:
 * brand CSS variables (--brand-primary / --brand-accent), the document
 * title, and the optional broadcast banner. Renders nothing when no
 * banner is enabled.
 */
export function PlatformSettingsSync() {
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublicSettings().then(settings => {
      if (!active) return;
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', settings['branding.primary_color']);
      root.style.setProperty('--brand-accent', settings['branding.accent_color']);
      document.title = `${settings['general.app_name']} | Skilling Outcomes & Longitudinal Tracking Platform`;

      if (settings['branding.banner_enabled'] && settings['branding.banner_text'].trim()) {
        setBanner(settings['branding.banner_text']);
      }
    });
    return () => { active = false; };
  }, []);

  if (!banner) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 text-xs text-amber-200 font-bold">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{banner}</span>
      </div>
      <button onClick={() => setBanner(null)} className="text-amber-300/70 hover:text-amber-200 cursor-pointer" aria-label="Dismiss banner">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
