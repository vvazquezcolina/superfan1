import React from 'react';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from '@/providers/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mandala Console - Admin Dashboard',
  description: 'Administrative console for Mandala Wallet ecosystem management',
  keywords: 'mandala, wallet, admin, dashboard, venue management, analytics',
  authors: [{ name: 'Mandala Team' }],
  creator: 'Mandala',
  publisher: 'Mandala',
  robots: 'noindex, nofollow', // Admin panel should not be indexed
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FF6B6B',
  colorScheme: 'light dark',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'Mandala Console',
    title: 'Mandala Console - Admin Dashboard',
    description: 'Administrative console for Mandala Wallet ecosystem management',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mandala Console',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mandala Console - Admin Dashboard',
    description: 'Administrative console for Mandala Wallet ecosystem management',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-MX"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mandala Console" />
        <meta name="application-name" content="Mandala Console" />
        <meta name="msapplication-TileColor" content="#FF6B6B" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FF6B6B" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#2C3E50" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 