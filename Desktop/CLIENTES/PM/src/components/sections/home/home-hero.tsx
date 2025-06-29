
// src/components/sections/home/home-hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { Star, Sailboat, Waves, Sparkles, Utensils, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HomeHero() {
  const { t } = useLanguage();
  const videoId = "7sSeB8CHeTc"; // YouTube Video ID

  const keyServices = [
    { textKey: "home.hero.services.service1" as const, icon: Sailboat },
    { textKey: "home.hero.services.service2" as const, icon: Waves },
    { textKey: "home.hero.services.service3" as const, icon: Sparkles },
    { textKey: "home.hero.services.service4" as const, icon: Utensils },
    { textKey: "home.hero.services.service5" as const, icon: Zap },
  ];

  return (
    <>
      <section className="relative pt-[calc(theme(spacing.20)+theme(spacing.px)*100)] md:pt-[calc(theme(spacing.20)+theme(spacing.px)*116)] text-center h-[70vh] md:h-[85vh] min-h-[450px] sm:min-h-[500px] max-h-[800px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0 w-full h-full bg-gray-900">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&rel=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute top-1/2 left-1/2 w-full h-full min-w-[177.77vh] min-h-[100vw] md:min-w-[100vw] md:min-h-[56.25vw] transform -translate-x-1/2 -translate-y-1/2 object-cover"
            title="Puerto Maya Cancun Hero Video"
          ></iframe>
          <div className="absolute inset-0 bg-black/70"></div> {/* Enhanced dark overlay for text contrast */}
        </div>
        
        <div className="container mx-auto px-4 py-10 sm:py-20 md:py-32 relative z-10">
          <h1 className="font-headline font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground mb-4 sm:mb-6 shadow-md animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s' }}>
            {t('home.hero.title')}
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto shadow-sm animate-fadeInUp opacity-0" style={{ animationDelay: '0.4s' }}>
            {t('home.hero.subtitle')}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-md sm:text-lg md:text-xl px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg shadow-xl animate-fadeInUp animate-pulseCta opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            <Link href="/tours/mayan-jungle-tour">{t('home.hero.button.bookNow')}</Link>
          </Button>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-card text-card-foreground shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Image
                src="/images/misc/logo.svg" // Standard TripAdvisor logo
                alt="TripAdvisor Logo"
                width={180}
                height={40}
                className={cn("h-10 mb-2 transition-all duration-300", "dark:hidden")} 
              />
              <Image
                src="/images/misc/tripadvisor-dark.png" // Dark mode friendly TA logo
                alt="TripAdvisor Logo Dark Mode"
                width={180}
                height={40}
                className={cn("h-10 mb-2 transition-all duration-300", "hidden dark:block")}
              />
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={`hero-ta-star-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="font-headline font-semibold text-xl text-foreground">{t('home.hero.tripadvisor.ratingText')}</p>
              <p className="text-xs text-foreground/70">{t('home.hero.tripadvisor.reviewsText')}</p>
            </div>

            <div className="text-center md:text-left">
              <h2 className="font-headline font-semibold text-xl lg:text-2xl text-foreground mb-3">
                {t('home.hero.services.title')}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {keyServices.map((service) => (
                  <Badge key={service.textKey} variant="secondary" className="text-sm bg-background text-foreground border-border hover:bg-muted">
                    <service.icon className="w-4 h-4 mr-1.5" />
                    {t(service.textKey)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
