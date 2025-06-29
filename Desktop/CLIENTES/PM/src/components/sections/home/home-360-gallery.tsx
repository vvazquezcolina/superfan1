
// src/components/sections/home/home-360-gallery.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Orbit } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Home360Gallery() {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-3 sm:mb-4">
          <Orbit className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-foreground mr-2 sm:mr-3" strokeWidth={1.5} />
          <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">
            {t('home.360gallery.title')}
          </h2>
        </div>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-8 sm:mb-10">
          {t('home.360gallery.description')}
        </p>
        <div className="rounded-xl overflow-hidden shadow-2xl aspect-video max-w-5xl mx-auto mb-8 sm:mb-10 transform transition-all hover:scale-[1.02]">
          <iframe
            src="https://panoraven.com/es/embed/ORNKuM7qKh"
            style={{ border:0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('home.360gallery.iframe.title')}
            aria-label={t('home.360gallery.iframe.ariaLabel')}
            className="w-full h-full"
          ></iframe>
        </div>

        <Button asChild size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-muted hover:text-foreground text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-lg shadow-lg transition-transform hover:scale-105">
          <Link href="https://panoraven.com/es/slider/ORNKuM7qKh" target="_blank" rel="noopener noreferrer">{t('home.360gallery.button.exploreFull')}</Link>
        </Button>
      </div>
    </section>
  );
}
