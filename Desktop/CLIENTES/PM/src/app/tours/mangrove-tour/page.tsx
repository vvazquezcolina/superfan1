
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";
import JsonLd from "@/components/seo/json-ld";
import type { Product, Offer, WithContext } from "schema-dts";
import { CalendarDays, CheckCircle, XCircle, Award, ShieldCheck, GitCompareArrows, MapPin, AlertTriangle, Car, ListChecks, Info, Clock, Users, Sailboat, Trees, Sparkles, Utensils, Ship } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


export default function MangroveTourPage() {
  const { t, language } = useLanguage();
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }));

  useEffect(() => {
    // document.title = t('page.mangroveTour.meta.title'); // Temporarily disabled
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      // metaDesc.setAttribute('content', t('page.mangroveTour.meta.description')); // Temporarily disabled
    }
  }, [language, t]);

  const availabilityDayKeys = [
    "page.mangroveTour.hero.days.mon" as const,
    "page.mangroveTour.hero.days.tue" as const,
    "page.mangroveTour.hero.days.wed" as const,
    "page.mangroveTour.hero.days.thu" as const,
    "page.mangroveTour.hero.days.fri" as const,
  ];

  const experienceHighlights = [
    { icon: Sparkles, titleKey: "page.mangroveTour.experience.ritual.title" as const, textKey: "page.mangroveTour.experience.ritual.text" as const },
    { icon: Users, titleKey: "page.mangroveTour.experience.ceremony.title" as const, textKey: "page.mangroveTour.experience.ceremony.text" as const },
    { icon: Ship, titleKey: "page.mangroveTour.experience.tour.title" as const, textKey: "page.mangroveTour.experience.tour.text" as const },
    { icon: Utensils, titleKey: "page.mangroveTour.experience.flavor.title" as const, textKey: "page.mangroveTour.experience.flavor.text" as const },
  ];
  
  const keyGuarantees = [
    { icon: ShieldCheck, titleKey: "page.mangroveTour.guarantees.securePayment" as const },
    { icon: CalendarDays, titleKey: "page.mangroveTour.guarantees.weather" as const }, // Using CalendarDays as CloudSun is in JetSki
    { icon: GitCompareArrows, titleKey: "page.mangroveTour.guarantees.flexibleBooking" as const },
  ];

  const includedItemsKeys = [
    "page.mangroveTour.details.includes.item1" as const,
    "page.mangroveTour.details.includes.item2" as const,
    "page.mangroveTour.details.includes.item3" as const,
    "page.mangroveTour.details.includes.item4" as const,
    "page.mangroveTour.details.includes.item5" as const,
    "page.mangroveTour.details.includes.item6" as const,
    "page.mangroveTour.details.includes.item7" as const,
  ];

  const notIncludedItemsKeys = [
    "page.mangroveTour.details.notIncludes.item1" as const,
    "page.mangroveTour.details.notIncludes.item2" as const,
    "page.mangroveTour.details.notIncludes.item3" as const,
    "page.mangroveTour.details.notIncludes.item4" as const,
    "page.mangroveTour.details.notIncludes.item5" as const,
  ];
  
  const recommendationsTextKeys = [
    "page.mangroveTour.details.recommendations.item1" as const,
    "page.mangroveTour.details.recommendations.item2" as const,
    "page.mangroveTour.details.recommendations.item3" as const,
  ];
  
  const importantInfoTextKeys = [
    "page.mangroveTour.details.importantInfo.item1" as const,
    "page.mangroveTour.details.importantInfo.item2" as const,
    "page.mangroveTour.details.importantInfo.item3" as const,
    "page.mangroveTour.details.importantInfo.item4" as const,
    "page.mangroveTour.details.importantInfo.item5" as const,
  ];

  const optionalTransportTextKeys = [
    "page.mangroveTour.details.optionalTransport.p1" as const,
    "page.mangroveTour.details.optionalTransport.p2" as const,
    "page.mangroveTour.details.optionalTransport.p3" as const,
  ];

  const keySellingPointItems = [
    { icon: Award, textKey: "page.mangroveTour.keySellingPoints.tripadvisor" as const, subtextKey: "page.mangroveTour.keySellingPoints.tripadvisorSub" as const },
    { icon: ShieldCheck, textKey: "page.mangroveTour.keySellingPoints.securePayments" as const, subtextKey: "page.mangroveTour.keySellingPoints.securePaymentsSub" as const },
    { icon: GitCompareArrows, textKey: "page.mangroveTour.keySellingPoints.flexibility" as const, subtextKey: "page.mangroveTour.keySellingPoints.flexibilitySub" as const },
    { icon: MapPin, textKey: "page.mangroveTour.keySellingPoints.centralLocation" as const, subtextKey: undefined },
  ];

  const productSchema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('page.mangroveTour.hero.title'),
    description: t('page.mangroveTour.hero.intro'), 
          image: '/images/tours/mangrave-5.webp',
    brand: {
      '@type': 'Brand',
      name: t('footer.column1.title'), 
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.puertomayacancun.com/tours/mangrove-tour', 
      priceCurrency: 'USD', 
      price: '49.00', 
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0], 
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], 
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: t('footer.column1.title')
      }
    },
  };

  const mangroveGalleryImages = [
    { src: "/images/tours/6.webp", altKey: "page.mangroveTour.gallery.alt.image1" as const },
    { src: "/images/tours/1.webp", altKey: "page.mangroveTour.gallery.alt.image2" as const },
    { src: "/images/tours/mangrave.webp", altKey: "page.mangroveTour.gallery.alt.image3" as const },
    { src: "/images/tours/excursions-cancun-jungle-tour.jpg", altKey: "page.mangroveTour.gallery.alt.image4" as const },
  ];

  return (
    <>
      <JsonLd schema={productSchema} />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow pt-[100px] md:pt-[116px]">
          {/* Hero Section */}
          <section className="py-12 md:py-16 bg-card shadow-lg">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-4">
                {t('page.mangroveTour.hero.title')}
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-6">
                <CalendarDays className="w-6 h-6 text-foreground" />
                <p className="text-lg text-foreground/80 font-medium">{t('page.mangroveTour.hero.availability')}</p>
                {availabilityDayKeys.map(dayKey => (
                  <Badge key={dayKey} variant="secondary" className="text-sm bg-accent text-accent-foreground">{t(dayKey)}</Badge>
                ))}
              </div>
              <div className="relative w-full max-w-4xl mx-auto aspect-[12/5] rounded-lg overflow-hidden shadow-md mb-8 group">
                <Image
                  src="/images/tours/mangrave-5.webp"
                  alt={t('page.mangroveTour.hero.imageAlt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1200px) 100vw, 80vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
                {t('page.mangroveTour.hero.intro')}
              </p>
            </div>
          </section>

          {/* Overview Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <Card className="shadow-xl rounded-xl overflow-hidden border-none bg-card">
                <CardContent className="p-6 md:p-8 space-y-4 text-foreground/90 text-base md:text-lg leading-relaxed">
                  <p>{t('page.mangroveTour.overview.p1')}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Operation Details Section */}
          <section className="py-12 md:py-16 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mangroveTour.operation.title')}
              </h2>
              <Card className="shadow-lg rounded-xl p-6 bg-background max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-foreground/80">
                  <div>
                    <p><span className="font-semibold text-foreground">{t('page.mangroveTour.operation.daysLabel')}</span> {t('page.mangroveTour.operation.daysValue')}</p>
                    <p><span className="font-semibold text-foreground">{t('page.mangroveTour.operation.timesLabel')}</span> {t('page.mangroveTour.operation.timesValue')}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold text-foreground">{t('page.mangroveTour.operation.durationLabel')}</span> {t('page.mangroveTour.operation.durationValue')}</p>
                    <p><span className="font-semibold text-foreground">{t('page.mangroveTour.operation.minAgeLabel')}</span> {t('page.mangroveTour.operation.minAgeValue')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Experience Highlights Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mangroveTour.experience.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {experienceHighlights.map((highlight) => (
                  <Card key={highlight.titleKey} className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 bg-card text-center">
                    <CardHeader className="flex flex-col items-center gap-4 pb-3">
                      <highlight.icon className="w-12 h-12 text-foreground" />
                      <CardTitle className="font-headline font-semibold text-xl text-foreground">{t(highlight.titleKey)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 text-sm">{t(highlight.textKey)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* New Mangrove Tour Gallery Section */}
          <section className="py-12 md:py-16 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mangroveTour.gallery.title')}
              </h2>
              <Carousel
                opts={{ align: "start", loop: mangroveGalleryImages.length > 2 }}
                plugins={[autoplayPlugin.current]}
                className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent>
                  {mangroveGalleryImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div className="p-1">
                        <Card className="shadow-lg rounded-xl overflow-hidden group">
                          <div className="relative w-full aspect-video">
                            <Image
                              src={image.src}
                              alt={t(image.altKey)}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {mangroveGalleryImages.length > 2 && <CarouselPrevious className="text-foreground bg-background/70 hover:bg-card border-foreground/30 hover:border-foreground" />}
                {mangroveGalleryImages.length > 2 && <CarouselNext className="text-foreground bg-background/70 hover:bg-card border-foreground/30 hover:border-foreground" />}
              </Carousel>
            </div>
          </section>

          {/* Key Guarantees Section */}
          <section className="py-12 md:py-16 bg-background"> {/* Switched background for alternation */}
            <div className="container mx-auto px-4">
                 <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                    {t('page.mangroveTour.guarantees.title')}
                  </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                    {keyGuarantees.map((guarantee, index) => (
                    <Card key={index} className="bg-card shadow-lg border-none rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
                        <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                        <guarantee.icon className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-2" strokeWidth={1.5} />
                        <p className="text-md md:text-lg text-foreground font-semibold">{t(guarantee.titleKey)}</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>
          
          {/* Details & Pricing Section */}
           <section id="tour-details" className="py-12 md:py-16 bg-card shadow-lg scroll-mt-24 md:scroll-mt-28"> {/* Switched background */}
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mangroveTour.details.mainTitle')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                {/* Left Column for Details */}
                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mangroveTour.details.includesTitle')}</h3>
                    <ul className="space-y-2">
                      {includedItemsKeys.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <CheckCircle className="w-5 h-5 mr-3 text-success shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mangroveTour.details.notIncludesTitle')}</h3>
                    <ul className="space-y-2">
                      {notIncludedItemsKeys.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <XCircle className="w-5 h-5 mr-3 text-error shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column for Info & Pricing */}
                <div className="md:col-span-2 space-y-8">
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><ListChecks className="w-6 h-6 mr-3"/>{t('page.mangroveTour.details.recommendations.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {recommendationsTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><AlertTriangle className="w-6 h-6 mr-3"/>{t('page.mangroveTour.details.importantInfo.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {importantInfoTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                       <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><Car className="w-6 h-6 mr-3"/>{t('page.mangroveTour.details.optionalTransport.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {optionalTransportTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm">{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Pricing Card - Centered below details */}
              <div className="mt-12 flex justify-center">
                <Card className="shadow-xl rounded-xl p-6 md:p-8 bg-background w-full max-w-md transform hover:scale-105 transition-transform duration-300">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="font-headline font-bold text-3xl text-foreground">{t('page.mangroveTour.pricing.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">
                            {t('page.mangroveTour.pricing.adultPrefix')}{' '} 
                            <span className="text-5xl">{t('page.mangroveTour.pricing.adultPrice')}</span>
                            {' '}{t('page.mangroveTour.pricing.adultSuffix')}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">
                            {t('page.mangroveTour.pricing.childPrefix')}{' '}
                            <span className="text-5xl">{t('page.mangroveTour.pricing.childPrice')}</span>
                            {' '}{t('page.mangroveTour.pricing.childSuffix')}
                          </p>
                        </div>
                        <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 transition-transform hover:scale-105">
                          <Link href="/tours">{t('page.mangroveTour.pricing.button.bookNow')}</Link>
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
          </section>

           {/* Key Selling Points Section */}
           <section className="py-12 md:py-16 bg-background">
              <div className="container mx-auto px-4">
                   <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                      {t('page.mangroveTour.keySellingPoints.title')}
                    </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      {keySellingPointItems.map((point, index) => (
                      <Card key={index} className="bg-card shadow-lg border-none rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
                          <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                          <point.icon className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-2" strokeWidth={1.5} />
                          <p className="text-md md:text-lg text-foreground font-semibold">{t(point.textKey)}</p>
                          {point.subtextKey && <p className="text-xs text-foreground/70">{t(point.subtextKey)}</p>}
                          </CardContent>
                      </Card>
                      ))}
                  </div>
              </div>
          </section>

          <HomeWhyChooseUs />
          <HomeTestimonials />
          <HomeContactMap />
        </main>
        <Footer />
      </div>
    </>
  );
}

    
