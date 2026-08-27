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
  title: "MahaSkill Track | Maharashtra Skilling Outcomes & Longitudinal Tracking Registry",
  description: "Official Privacy-Preserving, Longitudinal Skilling-Outcomes and Vocational Impact-Measurement System for the Government of Maharashtra.",
  applicationName: "MahaSkill Track",
  authors: [{ name: "Government of Maharashtra - MSSDS" }],
  keywords: ["MahaSkill", "Maharashtra", "Skilling Outcomes", "Longitudinal Survey", "Vocational Training", "MSME Verification", "PMEGP", "Mudra"],
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
    title: "MahaSkill Track | Maharashtra Skilling Outcomes & Longitudinal Tracking Registry",
    description: "Official Privacy-Preserving Longitudinal Vocational Impact & MSME Verification System for Government of Maharashtra.",
    url: 'https://sih2026.avishkark.in',
    siteName: 'MahaSkill Track',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'MahaSkill Track Emblem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MahaSkill Track | Maharashtra Skilling Outcomes Registry",
    description: "Official Longitudinal Skilling Impact & Verification Platform for the Government of Maharashtra.",
    images: ['/icon.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MahaSkill Track',
  },
};

import { ErrorBoundary } from "@/components/ErrorBoundary";

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
      <body className="min-h-full flex flex-col bg-[#040812] text-slate-100 selection:bg-blue-600 selection:text-white">
        <UserProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </UserProvider>
      </body>
    </html>
  );
}
