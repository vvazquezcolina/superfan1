
// src/components/sections/home/home-promotions.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { TicketPercent, ListChecks } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const currentPromotionKeys = [
  "home.promotions.promo.quintanarroense" as const,
  "home.promotions.promo.nationalRate" as const,
  "home.promotions.promo.adventureCouple" as const,
  "home.promotions.promo.photoPackage" as const,
  "home.promotions.promo.transportService" as const
];

export default function HomePromotions() {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-card">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden border-none bg-background hover:shadow-2xl transition-shadow duration-300 ease-out">
            <div className="md:grid md:grid-cols-2 md:items-center">
                <div className="p-6 md:p-8 lg:p-10 text-center md:text-left">
                    <div className="inline-flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        <TicketPercent className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {t('home.promotions.exclusiveOffers')}
                    </div>
                    <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 sm:mb-6">
                        {t('home.promotions.title')}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-4 sm:mb-6">
                        {t('home.promotions.description')}
                    </p>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left">
                      {currentPromotionKeys.map((promoKey, index) => (
                        <li key={index} className="flex items-center text-foreground/70 text-xs sm:text-sm md:text-md">
                          <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-foreground shrink-0" />
                          <span>{t(promoKey)}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg shadow-md transition-transform hover:scale-105">
                        <Link href="/promociones">{t('home.promotions.button.seeAll')}</Link>
                    </Button>
                </div>
                <div className="h-64 sm:h-80 md:h-full relative min-h-[250px] sm:min-h-[300px] order-first md:order-last">
                    <Image
                        src="/images/tours/5-activities-mov.webp"
                        alt="Promotional offer for Cancun tours"
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="rounded-t-xl md:rounded-r-xl md:rounded-t-none"
                    />
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
