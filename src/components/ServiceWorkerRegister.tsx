'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Nexus PWA ServiceWorker active with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('ServiceWorker registration error:', error);
          });
      });
    }
  }, []);

  return null;
}
