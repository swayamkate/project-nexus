import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sih2026.avishkark.in'),
  title: "CareerLoop | Skilling Outcomes & Longitudinal Tracking Platform",
  description: "Official Longitudinal Skilling-Outcomes and Career Intelligence Platform.",
  applicationName: "CareerLoop",
  authors: [{ name: "CareerLoop" }],
  keywords: ["CareerLoop", "Skilling Outcomes", "Longitudinal Survey", "Vocational Training", "Career Intelligence"],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "CareerLoop | Skilling Outcomes & Longitudinal Tracking Platform",
    description: "Official Longitudinal Vocational Impact & Outcomes Verification Platform.",
    url: 'https://sih2026.avishkark.in',
    siteName: 'CareerLoop',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'CareerLoop Emblem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CareerLoop | Skilling Outcomes Registry",
    description: "Official Longitudinal Skilling Impact & Verification Platform.",
    images: ['/icon.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareerLoop',
  },
};

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { PlatformSettingsSync } from "@/components/PlatformSettingsSync";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 dark:bg-[#060911] dark:text-slate-100 light:bg-slate-50 light:text-slate-900 selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <PlatformSettingsSync />
          <UserProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </UserProvider>
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
