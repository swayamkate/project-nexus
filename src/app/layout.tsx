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
  title: "Nexus | Skilling Outcomes & Longitudinal Tracking Platform",
  description: "Official Longitudinal Skilling-Outcomes and Career Intelligence Platform.",
  applicationName: "Nexus",
  authors: [{ name: "Nexus" }],
  keywords: ["Nexus", "Skilling Outcomes", "Longitudinal Survey", "Vocational Training", "Career Intelligence"],
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
    title: "Nexus | Skilling Outcomes & Longitudinal Tracking Platform",
    description: "Official Longitudinal Vocational Impact & Outcomes Verification Platform.",
    url: 'https://sih2026.avishkark.in',
    siteName: 'Nexus',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Nexus Emblem',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nexus | Skilling Outcomes Registry",
    description: "Official Longitudinal Skilling Impact & Verification Platform.",
    images: ['/icon.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nexus',
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
