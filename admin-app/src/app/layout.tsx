import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://administrator.avishkark.in'),
  title: "Nexus | Executive Admin Control Center",
  description: "Enterprise Executive Control Center for Skilling Outcomes, Longitudinal Surveys & Verification.",
  applicationName: "Nexus Admin",
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
    title: "Nexus | Executive Admin Control Center",
    description: "Command Center for Longitudinal Skilling Surveys, MSME Verification and Scheme Governance.",
    url: 'https://administrator.avishkark.in',
    siteName: 'Nexus Admin',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Nexus Executive Admin Control Center',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nexus | Executive Admin Control Center",
    description: "Skilling Longitudinal Survey & Administration Portal.",
    images: ['/icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
