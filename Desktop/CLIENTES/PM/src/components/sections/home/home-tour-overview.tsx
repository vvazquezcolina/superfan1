
// src/components/sections/home/home-tour-overview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Sailboat, Waves, Sparkles, Users, Utensils } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeTourOverview() {
  const { t } = useLanguage();

  const highlights = [
    { icon: Sailboat, translationKey: "home.tourOverview.highlights.speedboat" as const },
    { icon: Waves, translationKey: "home.tourOverview.highlights.snorkel" as const },
    { icon: Sparkles, translationKey: "home.tourOverview.highlights.mayanCeremony" as const },
    { icon: Users, translationKey: "home.tourOverview.highlights.prehispanicShow" as const },
    { icon: Utensils, translationKey: "home.tourOverview.highlights.mayanSnack" as const },
  ];

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden border-none bg-card animate-fadeInUp opacity-0" style={{animationDelay: '0.2s'}}>
          <CardHeader className="text-center pt-6 md:pt-8 pb-4 md:pb-6">
            <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-foreground/80 mb-2 font-body">
              {t('home.tourOverview.tagline')}
            </p>
            <CardTitle className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-foreground">
              {t('home.tourOverview.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto text-center mb-8 md:mb-10">
              {t('home.tourOverview.description')}
            </p>

            <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg mb-8 md:mb-12 group">
                <Image
                  src="/images/tours/14.webp"
                  alt="People enjoying speedboat in Mayan Jungle Tour"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-10 md:mb-12">
              {highlights.map((highlight) => (
                <div
                  key={highlight.translationKey}
                  className="flex flex-col items-center text-center p-3 sm:p-4 bg-background rounded-lg shadow-md hover:shadow-xl transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:bg-accent/5"
                >
                  <highlight.icon className="w-10 h-10 sm:w-12 sm:h-12 text-foreground mb-2 sm:mb-3" strokeWidth={1.5}/>
                  <p className="text-xs sm:text-sm md:text-md font-medium text-foreground">{t(highlight.translationKey)}</p>
                </div>
              ))}
            </div>

            <div className="text-center pb-4 sm:pb-6">
              <Button asChild size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-muted hover:text-foreground text-base sm:text-lg px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg shadow-md transition-transform hover:scale-105">
                <Link href="/tours/mayan-jungle-tour">{t('home.tourOverview.button.learnMore')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
