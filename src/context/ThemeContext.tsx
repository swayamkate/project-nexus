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
  resolvedTheme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('nexus_ui_theme') as ThemeMode | null) : null;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setThemeState(saved);
    } else {
      fetchPublicSettings().then(settings => {
        const configured = settings['branding.theme_mode'];
        if (configured === 'light' || configured === 'dark' || configured === 'system') {
          // Only use configured if user has not set a local preference
          const currentLocal = localStorage.getItem('nexus_ui_theme');
          if (!currentLocal) {
            setThemeState(configured);
          }
        }
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme: 'light' | 'dark' = 'light';
      if (theme === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        activeTheme = theme;
      }

      setResolvedTheme(activeTheme);

      const root = document.documentElement;
      const body = document.body;
      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        body.classList.add('dark');
        body.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        body.classList.add('light');
        body.classList.remove('dark');
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nexus_ui_theme', mode);
      } catch {}
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
