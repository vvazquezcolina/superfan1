
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Star, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";
import ToursGlimpseGallery from "@/components/sections/tours/tours-glimpse-gallery";

export default function ToursPage() {
  const { t, language } = useLanguage();
  const videoId = "MT7IGt7NkAk"; // YouTube Video ID for the hero

  useEffect(() => {
    document.title = t('page.toursOverview.meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('page.toursOverview.meta.description'));
    }
  }, [language, t]);

  const toursData = [
    {
      id: "mayan-jungle-tour",
      titleKey: "page.toursOverview.mayanJungleTour.title" as const,
      subtitleKey: "page.toursOverview.mayanJungleTour.subtitle" as const,
      descriptionKey: "page.toursOverview.mayanJungleTour.description" as const,
      imageSrc: "/images/tours/jungler-tour-en-cancun.jpg",
      imageAltKey: "page.toursOverview.mayanJungleTour.title" as const,
      link: "/tours/mayan-jungle-tour",
      includedKeys: [
        "page.toursOverview.mayanJungleTour.included.item1" as const,
        "page.toursOverview.mayanJungleTour.included.item2" as const,
        "page.toursOverview.mayanJungleTour.included.item3" as const,
        "page.toursOverview.mayanJungleTour.included.item4" as const,
        "page.toursOverview.mayanJungleTour.included.item5" as const,
        "page.toursOverview.mayanJungleTour.included.item6" as const,
        "page.toursOverview.mayanJungleTour.included.item7" as const,
      ],
      notIncludedKeys: [
        "page.toursOverview.mayanJungleTour.notIncluded.item1" as const,
        "page.toursOverview.mayanJungleTour.notIncluded.item2" as const,
        "page.toursOverview.mayanJungleTour.notIncluded.item3" as const,
        "page.toursOverview.mayanJungleTour.notIncluded.item4" as const,
      ],
    },
    {
      id: "jet-ski-cancun",
      titleKey: "page.toursOverview.jetSki.title" as const,
      subtitleKey: "page.toursOverview.jetSki.subtitle" as const,
      descriptionKey: "page.toursOverview.jetSki.description" as const,
      imageSrc: "/images/tours/jet-ski-laguna-cancun.jpeg",
      imageAltKey: "page.toursOverview.jetSki.title" as const,
      link: "/tours/jet-ski-cancun",
      includedKeys: [
        "page.toursOverview.jetSki.included.item1" as const,
        "page.toursOverview.jetSki.included.item2" as const,
        "page.toursOverview.jetSki.included.item3" as const,
        "page.toursOverview.jetSki.included.item4" as const,
      ],
      notIncludedKeys: [
        "page.toursOverview.jetSki.notIncluded.item1" as const,
        "page.toursOverview.jetSki.notIncluded.item2" as const,
        "page.toursOverview.jetSki.notIncluded.item3" as const,
        "page.toursOverview.jetSki.notIncluded.item4" as const,
      ],
    },
    {
      id: "mangrove-tour",
      titleKey: "page.toursOverview.mangrove.title" as const,
      subtitleKey: "page.toursOverview.mangrove.subtitle" as const,
      descriptionKey: "page.toursOverview.mangrove.description" as const,
      imageSrc: "/images/tours/Tour-manglar-laguna-nichupte.jpg",
      imageAltKey: "page.toursOverview.mangrove.title" as const,
      link: "/tours/mangrove-tour",
      includedKeys: [
        "page.toursOverview.mangrove.included.item1" as const,
        "page.toursOverview.mangrove.included.item2" as const,
        "page.toursOverview.mangrove.included.item3" as const,
        "page.toursOverview.mangrove.included.item4" as const,
      ],
      notIncludedKeys: [
        "page.toursOverview.mangrove.notIncluded.item1" as const,
        "page.toursOverview.mangrove.notIncluded.item2" as const,
        "page.toursOverview.mangrove.notIncluded.item3" as const,
        "page.toursOverview.mangrove.notIncluded.item4" as const,
      ],
    },
    {
      id: "mayan-path",
      titleKey: "page.toursOverview.mayanPath.title" as const,
      subtitleKey: "page.toursOverview.mayanPath.subtitle" as const,
      descriptionKey: "page.toursOverview.mayanPath.description" as const,
      imageSrc: "/images/tours/Ceremonia-maya-tour-cancun.jpg",
      imageAltKey: "page.toursOverview.mayanPath.title" as const,
      link: "/tours/mayan-path",
      includedKeys: [
        "page.toursOverview.mayanPath.included.item1" as const,
        "page.toursOverview.mayanPath.included.item2" as const,
        "page.toursOverview.mayanPath.included.item3" as const,
        "page.toursOverview.mayanPath.included.item4" as const,
      ],
      notIncludedKeys: [
        "page.toursOverview.mayanPath.notIncluded.item1" as const,
        "page.toursOverview.mayanPath.notIncluded.item2" as const,
        "page.toursOverview.mayanPath.notIncluded.item3" as const,
        "page.toursOverview.mayanPath.notIncluded.item4" as const,
      ],
    },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-[calc(theme(spacing.20)+theme(spacing.px)*100)] md:pt-[calc(theme(spacing.20)+theme(spacing.px)*116)]">
        {/* Hero Section with Video */}
        <section className="relative text-center h-[60vh] md:h-[70vh] min-h-[400px] sm:min-h-[450px] max-h-[700px] flex items-center justify-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0 z-0 w-full h-full bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&rel=0&start=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-1/2 left-1/2 w-full h-full min-w-[177.77vh] min-h-[100vw] md:min-w-[100vw] md:min-h-[56.25vw] transform -translate-x-1/2 -translate-y-1/2 object-cover"
              title={t('page.toursOverview.hero.title')}
            ></iframe>
            <div className="absolute inset-0 bg-black/70"></div> {/* Enhanced dark overlay for text contrast */}
          </div>
          
          <div className="container mx-auto px-4 py-10 sm:py-16 md:py-24 relative z-10">
            <h1 className="font-headline font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4 sm:mb-6 shadow-md animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s' }}>
              {t('page.toursOverview.hero.title')}
            </h1>
            <p className="font-body text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-3xl mx-auto shadow-sm animate-fadeInUp opacity-0" style={{ animationDelay: '0.4s' }}>
              {t('page.toursOverview.hero.description')}
            </p>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {toursData.map((tour) => (
                <Card key={tour.id} className="shadow-xl rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={tour.imageSrc}
                      alt={t(tour.imageAltKey)} 
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <p className="text-sm text-foreground/80 font-semibold">{t(tour.subtitleKey)}</p>
                    <CardTitle className="font-headline font-bold text-2xl text-foreground">{t(tour.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-foreground/80">{t(tour.descriptionKey)}</p>

                    <div>
                      <h4 className="font-semibold text-md text-foreground mb-2">{t('page.toursOverview.mayanJungleTour.includesTitle')}</h4>
                      <ul className="space-y-1 text-sm text-foreground/70">
                        {tour.includedKeys.map((itemKey, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 shrink-0" />
                            <span>{t(itemKey)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-md text-foreground mb-2">{t('page.toursOverview.mayanJungleTour.notIncludesTitle')}</h4>
                      <ul className="space-y-1 text-sm text-foreground/70">
                        {tour.notIncludedKeys.map((itemKey, index) => (
                          <li key={index} className="flex items-start">
                            <XCircle className="w-4 h-4 text-error mr-2 mt-0.5 shrink-0" />
                            <span>{t(itemKey)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
                      <Link href={tour.link}>{t('page.toursOverview.button.detailsAndBook')}</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <ToursGlimpseGallery />
        <HomeWhyChooseUs />
        <HomeTestimonials />
        <HomeContactMap />
      </main>
      <Footer />
    </div>
  );
}
