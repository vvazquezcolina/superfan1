
// src/components/sections/home/home-additional-activities.tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, Pyramid, Palmtree, Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const activitiesData = [
  {
    icon: Zap,
    titleKey: "home.additionalActivities.jetSki.title" as const,
    descriptionKey: "home.additionalActivities.jetSki.description" as const,
    imageSrc: "/images/tours/wave-runner-4.webp",
    imageAlt: "Jet Ski Adventure at Puerto Maya Cancun",
    link: "/tours/jet-ski-cancun"
  },
  {
    icon: Pyramid,
    titleKey: "home.additionalActivities.mayanPath.title" as const,
    descriptionKey: "home.additionalActivities.mayanPath.description" as const,
    imageSrc: "/images/tours/Tour-cancun-mayan-ceremony.jpg",
    imageAlt: "Mayan Path Ceremony at Puerto Maya Cancun",
    link: "/tours/mayan-path"
  },
  {
    icon: Palmtree,
    titleKey: "home.additionalActivities.mangrove.title" as const,
    descriptionKey: "home.additionalActivities.mangrove.description" as const,
    imageSrc: "/images/tours/Cancun-water-activites-mangroo-tour.jpg",
    imageAlt: "Mangrove Tour at Puerto Maya Cancun",
    link: "/tours/mangrove-tour"
  },
  {
    icon: Leaf,
    titleKey: "home.additionalActivities.ecoTours.title" as const,
    descriptionKey: "home.additionalActivities.ecoTours.description" as const,
    imageSrc: "/images/tours/best-cenotes-near-cancun.jpg",
    imageAlt: "Eco Tour Nature Exploration near Cancun",
    link: "/actividades"
  },
];

export default function HomeAdditionalActivities() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-foreground mb-4 sm:mb-6 animate-fadeInUp opacity-0" style={{animationDelay: '0.2s'}}>
          {t('home.additionalActivities.title')}
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mb-10 md:mb-12 lg:mb-16 animate-fadeInUp opacity-0" style={{animationDelay: '0.3s'}}>
          {t('home.additionalActivities.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-10 md:mb-12 lg:mb-16">
          {activitiesData.map((activity, index) => (
            <Card
              key={activity.titleKey}
              className="shadow-lg rounded-xl overflow-hidden flex flex-col bg-background transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl group animate-fadeInUp opacity-0"
              style={{animationDelay: `${0.4 + index * 0.1}s`}}
            >
              <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={activity.imageSrc}
                  alt={activity.imageAlt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center mb-2 sm:mb-3">
                  <activity.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-foreground mr-3 sm:mr-4" strokeWidth={1.5}/>
                  <CardTitle className="font-headline font-bold text-xl sm:text-2xl md:text-3xl text-foreground">{t(activity.titleKey)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow px-4 sm:px-6 pb-4 sm:pb-6">
                <CardDescription className="text-foreground/70 text-xs sm:text-sm md:text-base leading-relaxed">{t(activity.descriptionKey)}</CardDescription>
              </CardContent>
              <div className="p-4 sm:p-6 pt-0">
                 <Button asChild size="lg" variant="outline" className="w-full border-foreground/30 text-foreground hover:bg-muted hover:text-foreground transition-transform hover:scale-105 text-sm sm:text-base md:text-lg py-2.5 sm:py-3">
                    <Link href={activity.link}>{t('home.additionalActivities.button.discoverMore')}</Link>
                 </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg sm:text-xl md:text-2xl px-10 sm:px-12 py-3 sm:py-4 md:px-16 md:py-5 rounded-lg shadow-md transition-transform hover:scale-105">
            <Link href="/actividades">{t('home.additionalActivities.button.exploreAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
