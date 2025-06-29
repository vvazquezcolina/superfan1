
// src/components/sections/home/home-why-choose-us.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, Sparkles, MapPin, Award, Smile } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const whyChooseUsPointsData = [
  {
    icon: Users,
    titleKey: "home.whyChooseUs.expertGuides.title" as const,
    descriptionKey: "home.whyChooseUs.expertGuides.description" as const,
  },
  {
    icon: ShieldCheck,
    titleKey: "home.whyChooseUs.topSecurity.title" as const,
    descriptionKey: "home.whyChooseUs.topSecurity.description" as const,
  },
  {
    icon: Sparkles,
    titleKey: "home.whyChooseUs.authenticCulture.title" as const,
    descriptionKey: "home.whyChooseUs.authenticCulture.description" as const,
  },
  {
    icon: MapPin,
    titleKey: "home.whyChooseUs.primeLocation.title" as const,
    descriptionKey: "home.whyChooseUs.primeLocation.description" as const,
  },
  {
    icon: Award,
    titleKey: "home.whyChooseUs.excellenceCommitment.title" as const,
    descriptionKey: "home.whyChooseUs.excellenceCommitment.description" as const,
  },
  {
    icon: Smile, 
    titleKey: "home.whyChooseUs.funForAll.title" as const, 
    descriptionKey: "home.whyChooseUs.funForAll.description" as const, 
  },
];

export default function HomeWhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4 animate-fadeInUp opacity-0" style={{animationDelay: '0.2s'}}>
            {t('home.whyChooseUs.mainTitle')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto animate-fadeInUp opacity-0" style={{animationDelay: '0.3s'}}>
            {t('home.whyChooseUs.mainDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {whyChooseUsPointsData.map((point, index) => (
            <Card
              key={index}
              className="bg-background shadow-lg rounded-xl overflow-hidden flex flex-col transform transition-all hover:shadow-2xl hover:-translate-y-1 border-none p-4 sm:p-6 animate-fadeInUp opacity-0"
              style={{animationDelay: `${0.4 + index * 0.1}s`}} 
            >
              <CardHeader className="items-center text-center pt-0 pb-2 sm:pb-3">
                <point.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-foreground mb-2 sm:mb-3" strokeWidth={1.5} />
                <CardTitle className="font-headline font-bold text-lg sm:text-xl md:text-2xl text-foreground">{t(point.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center px-0 pb-0">
                <p className="text-foreground/70 leading-relaxed text-xs sm:text-sm md:text-base">{t(point.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

