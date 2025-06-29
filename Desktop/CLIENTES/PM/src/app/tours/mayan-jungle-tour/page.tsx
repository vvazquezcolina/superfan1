
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CalendarDays, CheckCircle, Clock, CreditCard, GitCompareArrows, MapPin, ShieldCheck, Sparkles, Star, Users, Waves, Zap, Eye, Sun, Mountain, Utensils, Sailboat, Info, AlertTriangle, Car, ListChecks, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import JsonLd from "@/components/seo/json-ld";
import type { Product, AggregateRating, Offer, WithContext } from "schema-dts";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";

export default function MayanJungleTourPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = t('page.mayanJungleTour.meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('page.mayanJungleTour.meta.description'));
    }
  }, [language, t]);

  const availabilityDayKeys = [
    "page.mayanJungleTour.hero.days.sun" as const, "page.mayanJungleTour.hero.days.mon" as const, "page.mayanJungleTour.hero.days.tue" as const,
    "page.mayanJungleTour.hero.days.wed" as const, "page.mayanJungleTour.hero.days.thu" as const, "page.mayanJungleTour.hero.days.fri" as const, "page.mayanJungleTour.hero.days.sat" as const
  ];

  const tourFeatureItems = [
    { icon: Users, titleKey: "page.mayanJungleTour.features.expertGuides.title" as const, textKey: "page.mayanJungleTour.features.expertGuides.text" as const },
    { icon: Zap, titleKey: "page.mayanJungleTour.features.thrillingAdventures.title" as const, textKey: "page.mayanJungleTour.features.thrillingAdventures.text" as const },
    { icon: Mountain, titleKey: "page.mayanJungleTour.features.stunningLandscapes.title" as const, textKey: "page.mayanJungleTour.features.stunningLandscapes.text" as const },
    { icon: Sparkles, titleKey: "page.mayanJungleTour.features.authenticCeremony.title" as const, textKey: "page.mayanJungleTour.features.authenticCeremony.text" as const },
    { icon: Eye, titleKey: "page.mayanJungleTour.features.prehispanicDance.title" as const, textKey: "page.mayanJungleTour.features.prehispanicDance.text" as const },
    { icon: Utensils, titleKey: "page.mayanJungleTour.features.mayanAppetizers.title" as const, textKey: "page.mayanJungleTour.features.mayanAppetizers.text" as const },
    { icon: MapPin, titleKey: "page.mayanJungleTour.features.convenientLocation.title" as const, textKey: "page.mayanJungleTour.features.convenientLocation.text" as const },
    { icon: Sun, titleKey: "page.mayanJungleTour.features.unforgettableMemories.title" as const, textKey: "page.mayanJungleTour.features.unforgettableMemories.text" as const },
    { icon: ShieldCheck, titleKey: "page.mayanJungleTour.features.safetyFirst.title" as const, textKey: "page.mayanJungleTour.features.safetyFirst.text" as const },
  ];

  const keySellingPointItems = [
    { icon: Award, textKey: "page.mayanJungleTour.keySellingPoints.tripadvisor" as const, subtextKey: "page.mayanJungleTour.keySellingPoints.tripadvisorSub" as const },
    { icon: ShieldCheck, textKey: "page.mayanJungleTour.keySellingPoints.securePayments" as const, subtextKey: "page.mayanJungleTour.keySellingPoints.securePaymentsSub" as const },
    { icon: GitCompareArrows, textKey: "page.mayanJungleTour.keySellingPoints.flexibility" as const, subtextKey: "page.mayanJungleTour.keySellingPoints.flexibilitySub" as const },
    { icon: MapPin, textKey: "page.mayanJungleTour.keySellingPoints.centralLocation" as const, subtextKey: undefined },
  ];

  const includedItemsKeys = [
    "page.mayanJungleTour.details.includes.item1" as const,
    "page.mayanJungleTour.details.includes.item2" as const,
    "page.mayanJungleTour.details.includes.item3" as const,
    "page.mayanJungleTour.details.includes.item4" as const,
    "page.mayanJungleTour.details.includes.item5" as const,
    "page.mayanJungleTour.details.includes.item6" as const,
    "page.mayanJungleTour.details.includes.item7" as const,
    "page.mayanJungleTour.details.includes.item8" as const,
    "page.mayanJungleTour.details.includes.item9" as const,
    "page.mayanJungleTour.details.includes.item10" as const,
    "page.mayanJungleTour.details.includes.item11" as const,
  ];

  const notIncludedItemsKeys = [
    "page.mayanJungleTour.details.notIncludes.item1" as const,
    "page.mayanJungleTour.details.notIncludes.item2" as const,
    "page.mayanJungleTour.details.notIncludes.item3" as const,
  ];

  const alsoOfferedItemsKeys = [
    "page.mayanJungleTour.details.alsoOffered.item1" as const,
    "page.mayanJungleTour.details.alsoOffered.item2" as const,
    "page.mayanJungleTour.details.alsoOffered.item3" as const,
  ];

  const recommendationsTextKeys = [
    "page.mayanJungleTour.details.recommendations.item1" as const,
    "page.mayanJungleTour.details.recommendations.item2" as const,
    "page.mayanJungleTour.details.recommendations.item3" as const,
  ];
  
  const importantInfoTextKeys = [
    "page.mayanJungleTour.details.importantInfo.item1" as const,
    "page.mayanJungleTour.details.importantInfo.item2" as const,
    "page.mayanJungleTour.details.importantInfo.item3" as const,
    "page.mayanJungleTour.details.importantInfo.item4" as const,
    "page.mayanJungleTour.details.importantInfo.item5" as const,
  ];

  const additionalTransportTextKeys = [
    "page.mayanJungleTour.details.additionalTransport.p1" as const,
    "page.mayanJungleTour.details.additionalTransport.p2" as const,
    "page.mayanJungleTour.details.additionalTransport.p3" as const,
  ];

  const productSchema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('page.mayanJungleTour.hero.title'),
    description: t('page.mayanJungleTour.meta.description'), 
          image: '/images/tours/13.webp', 
    sku: 'PM-MJT-001', 
    mpn: 'PM-MJT-001', 
    brand: {
      '@type': 'Brand',
      name: t('footer.column1.title'), 
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.puertomayacancun.com/tours/mayan-jungle-tour', 
      priceCurrency: 'MXN',
      price: '1380.00', 
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0], 
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], 
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: t('footer.column1.title')
      }
    },
    aggregateRating: { 
      '@type': 'AggregateRating',
      ratingValue: '4.9', 
      reviewCount: '1900', 
      bestRating: '5',
      worstRating: '1',
    },
  };

  const tourGalleryImages = [
    { src: "/images/tours/13.webp", altKey: "page.mayanJungleTour.gallery.alt.image0" as const },
    { src: "/images/tours/14.webp", altKey: "page.mayanJungleTour.gallery.alt.image1" as const },
    { src: "/images/tours/15.webp", altKey: "page.mayanJungleTour.gallery.alt.image2" as const },
    { src: "/images/tours/16.webp", altKey: "page.mayanJungleTour.gallery.alt.image3" as const },
    { src: "/images/tours/17.webp", altKey: "page.mayanJungleTour.gallery.alt.image4" as const },
    { src: "/images/tours/18.webp", altKey: "page.mayanJungleTour.gallery.alt.image5" as const },
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
                {t('page.mayanJungleTour.hero.title')}
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-6">
                <CalendarDays className="w-6 h-6 text-foreground" />
                <p className="text-lg text-foreground/80 font-medium">{t('page.mayanJungleTour.hero.availability')}</p>
                {availabilityDayKeys.map(dayKey => (
                  <Badge key={dayKey} variant="secondary" className="text-sm bg-accent text-accent-foreground">{t(dayKey)}</Badge>
                ))}
              </div>
               <Image
                  src="/images/tours/13.webp" 
                  alt={t('page.mayanJungleTour.hero.title')}
                  width={1200}
                  height={500}
                  className="mx-auto mb-8 rounded-lg shadow-md aspect-[12/5] object-cover"
                  priority
              />
              <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-4">
                {t('page.mayanJungleTour.hero.description.p1')}
              </p>
              <p className="text-md md:text-lg text-foreground/70 max-w-2xl mx-auto">
                {t('page.mayanJungleTour.hero.description.p2')}
              </p>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mayanJungleTour.features.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tourFeatureItems.map((feature) => (
                  <Card key={feature.titleKey} className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 bg-card">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <feature.icon className="w-10 h-10 text-foreground" />
                      <CardTitle className="font-headline font-bold text-xl text-foreground">{t(feature.titleKey)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80">{t(feature.textKey)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
               <div className="text-center mt-12">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
                  <Link href="#tour-details">{t('page.mayanJungleTour.features.button.bookAdventure')}</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Details & Pricing Section */}
           <section id="tour-details" className="py-12 md:py-16 bg-card shadow-lg scroll-mt-24 md:scroll-mt-28">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mayanJungleTour.details.title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                {/* Columna Izquierda para Detalles */}
                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanJungleTour.details.minAge.label')}</h3>
                    <div className="flex items-center text-foreground/80">
                      <Users className="w-5 h-5 mr-3 text-foreground"/>
                      <span>{t('page.mayanJungleTour.details.minAge.value')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanJungleTour.details.duration.label')}</h3>
                    <div className="flex items-center text-foreground/80">
                      <Clock className="w-5 h-5 mr-3 text-foreground"/>
                      <span>{t('page.mayanJungleTour.details.duration.value')}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanJungleTour.details.includesTitle')}</h3>
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
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanJungleTour.details.notIncludesTitle')}</h3>
                    <ul className="space-y-2">
                      {notIncludedItemsKeys.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <XCircle className="w-5 h-5 mr-3 text-error shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanJungleTour.details.alsoOfferedTitle')}</h3>
                    <ul className="space-y-2">
                      {alsoOfferedItemsKeys.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <CheckCircle className="w-5 h-5 mr-3 text-success shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Columna Derecha para Info Adicional y Precios */}
                <div className="md:col-span-2 space-y-8">
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground">{t('page.mayanJungleTour.details.recommendationsTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {recommendationsTextKeys.map(itemKey => (
                        <p key={itemKey}>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground">{t('page.mayanJungleTour.details.importantInfoTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {importantInfoTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm">{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                       <CardTitle className="font-headline font-semibold text-2xl text-foreground">{t('page.mayanJungleTour.details.additionalTransportTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {additionalTransportTextKeys.map(itemKey => (
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
                        <CardTitle className="font-headline font-bold text-3xl text-foreground">{t('page.mayanJungleTour.pricingCard.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                        <p className="text-sm text-foreground/70">{t('page.mayanJungleTour.pricingCard.adult')}</p>
                        <p className="text-4xl font-bold text-primary">
                            $1380 <span className="text-xl font-normal">MXN</span>
                        </p>
                        </div>
                        <div className="text-center">
                        <p className="text-sm text-foreground/70">{t('page.mayanJungleTour.pricingCard.child')}</p>
                        <p className="text-4xl font-bold text-primary">
                            $980 <span className="text-xl font-normal">MXN</span>
                        </p>
                        </div>
                        <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 transition-transform hover:scale-105">
                        {t('page.mayanJungleTour.pricingCard.button.bookNow')}
                        </Button>
                    </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Key Selling Points Section */}
          <section className="py-12 md:py-16 bg-background">
              <div className="container mx-auto px-4">
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

          {/* New Gallery Section for Mayan Jungle Tour */}
          <section className="py-12 md:py-16 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mayanJungleTour.gallery.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {tourGalleryImages.map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="relative w-full aspect-video">
                      <Image
                        src={image.src}
                        alt={t(image.altKey)}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
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

