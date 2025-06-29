// src/components/sections/home/home-booking-cta.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function HomeBookingCta() {
  const { t } = useLanguage();

  return (
    <section
      id="booking"
      className={cn(
        "py-10 md:py-16 lg:py-20 scroll-mt-24 md:scroll-mt-28",
        "bg-[#963868] text-accent-foreground" // Use specific hex for purple background
      )}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 text-inherit">
          {t('home.bookingCta.title')}
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl mx-auto opacity-90 text-inherit">
          {t('home.bookingCta.description')}
        </p>
        <Button
          asChild
          size="lg"
          className="font-semibold text-base sm:text-lg md:text-xl px-10 sm:px-12 py-3 sm:py-4 rounded-lg shadow-xl transition-transform hover:scale-105 transform bg-primary text-primary-foreground hover:bg-primary/90" // Button remains red
        >
          <Link href="/tours">{t('home.bookingCta.button.reserve')}</Link>
        </Button>
      </div>
    </section>
  );
}
