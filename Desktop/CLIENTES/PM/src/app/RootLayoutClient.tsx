
"use client";

import { useEffect } from 'react';
import type { Metadata } from 'next';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WhatsappFab from '@/components/layout/whatsapp-fab';

const BASE_URL = 'https://www.puertomayacancun.com'; // Define BASE_URL

export default function RootLayoutClient({
  children,
  metadata: staticMetadata // Pass static metadata for initial render
}: Readonly<{
  children: React.ReactNode;
  metadata: Metadata; // Type for passed metadata
}>) {
  const { language, t } = useLanguage();
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    document.documentElement.lang = language;
    // Dynamically update title if needed, though full SEO requires server-side i18n for metadata
    // document.title = t('layout.meta.title'); 

    // --- HREFLANG TAGS --- 
    // // 1. Remove existing hreflang tags to prevent duplication
    // const existingHreflangLinks = document.querySelectorAll('link[data-hreflang-dynamic="true"]');
    // existingHreflangLinks.forEach(link => link.remove());

    // const supportedLanguages = ['es', 'en', 'fr'];
    // const currentFullUrl = `${BASE_URL}${pathname}`;

    // // Add new hreflang tags for each supported language
    // supportedLanguages.forEach(lang => {
    //   const link = document.createElement('link');
    //   link.setAttribute('rel', 'alternate');
    //   link.setAttribute('hreflang', lang);
    //   link.setAttribute('href', currentFullUrl); // Same URL, content changes by context
    //   link.setAttribute('data-hreflang-dynamic', 'true'); // Mark for cleanup
    //   document.head.appendChild(link);
    // });

    // // Add x-default hreflang tag (pointing to the 'es' version at the current URL)
    // const xDefaultLink = document.createElement('link');
    // xDefaultLink.setAttribute('rel', 'alternate');
    // xDefaultLink.setAttribute('hreflang', 'x-default');
    // xDefaultLink.setAttribute('href', currentFullUrl); // Default points to the same URL, assuming 'es' is default
    // xDefaultLink.setAttribute('data-hreflang-dynamic', 'true'); // Mark for cleanup
    // document.head.appendChild(xDefaultLink);
    // --- END HREFLANG TAGS ---

  }, [language, pathname, t]); 

  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        {/* If you want to dynamically update meta description, it's tricky client-side for SEO */}
        {/* <meta name="description" content={t('layout.meta.description')} /> */}
      </head>
      <body className="font-body antialiased">
        <div className="pb-20 md:pb-0">
          {children}
        </div>
        <Toaster />
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-card shadow-lg border-t border-border md:hidden">
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-8 rounded-md shadow-md transition-transform hover:scale-105">
            <Link href="/#booking">{t('layout.stickyFooter.bookNow')}</Link>
          </Button>
        </div>
        <WhatsappFab />
      </body>
    </html>
  );
}
