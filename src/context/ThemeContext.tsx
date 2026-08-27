'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchPublicSettings } from '@/lib/platformSettings';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nexus_ui_theme') as ThemeMode | null;
    // The admin console is the source of truth for the platform theme. Keep a
    // local value only as an offline fallback while settings are loading.
    setThemeState(saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system');
    fetchPublicSettings().then(settings => {
      const configured = settings['branding.theme_mode'];
      if (configured === 'light' || configured === 'dark' || configured === 'system') {
        setThemeState(configured);
        try { localStorage.setItem('nexus_ui_theme', configured); } catch { /* incognito */ }
      }
    }).catch(() => { /* local fallback remains active */ });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme: 'light' | 'dark' = 'dark';
      if (theme === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        activeTheme = theme;
      }

      setResolvedTheme(activeTheme);

      const root = document.documentElement;
      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme, mounted]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('nexus_ui_theme', mode);
    } catch {
      // ignore in incognito
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
