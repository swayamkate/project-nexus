'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';
import { DEFAULT_SETTINGS, PUBLIC_SETTING_KEYS, type SettingsMap } from '@/lib/platformSettings';

/**
 * Reads public platform settings from Supabase (anon) and applies them to
 * the admin console: brand CSS variables, broadcast banner, document title.
 * Falls back silently to defaults when the platform_settings table has not
 * been migrated yet or the network fails.
 */
export function PlatformSettingsSync() {
  const [banner, setBanner] = useState<{ text: string } | null>(null);

  useEffect(() => {
    let active = true;
    const apply = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('platform_settings')
          .select('key, value')
          .in('key', PUBLIC_SETTING_KEYS as string[]);

        if (error || !active) return;

        const settings: SettingsMap = { ...DEFAULT_SETTINGS };
        for (const row of data ?? []) {
          if (Object.prototype.hasOwnProperty.call(settings, row.key)) {
            (settings as Record<string, unknown>)[row.key] = row.value;
          }
        }

        const root = document.documentElement;
        root.style.setProperty('--brand-primary', settings['branding.primary_color']);
        root.style.setProperty('--brand-accent', settings['branding.accent_color']);
        document.title = `${settings['general.app_name']} | Admin Console`;

        if (settings['branding.banner_enabled'] && settings['branding.banner_text'].trim()) {
          setBanner({ text: settings['branding.banner_text'] });
        } else {
          setBanner(null);
        }
      } catch {
        // Defaults already applied; nothing to do.
      }
    };
    apply();
    return () => { active = false; };
  }, []);

  if (!banner) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 text-xs text-amber-200 font-bold">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{banner.text}</span>
      </div>
      <button onClick={() => setBanner(null)} className="text-amber-300/70 hover:text-amber-200 cursor-pointer" aria-label="Dismiss banner">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
