
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, XCircle, Award, ShieldCheck, GitCompareArrows, MapPin, AlertTriangle, Car, ListChecks, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import JsonLd from "@/components/seo/json-ld";
import type { Product, Offer, WithContext } from "schema-dts";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";

export default function MayanPathPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    // document.title = t('page.mayanPath.meta.title'); // Temporarily disabled for language key return
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      // metaDesc.setAttribute('content', t('page.mayanPath.meta.description')); // Temporarily disabled
    }
  }, [language, t]);

  const availabilityDayKeys = [
    "page.mayanPath.hero.days.sun" as const, "page.mayanPath.hero.days.mon" as const, "page.mayanPath.hero.days.tue" as const,
    "page.mayanPath.hero.days.wed" as const, "page.mayanPath.hero.days.thu" as const, "page.mayanPath.hero.days.fri" as const, "page.mayanPath.hero.days.sat" as const
  ];

  const overviewParagraphKeys = [
    "page.mayanPath.overview.p1" as const,
    "page.mayanPath.overview.p2" as const,
    "page.mayanPath.overview.p3" as const,
    "page.mayanPath.overview.p4" as const,
    "page.mayanPath.overview.p5" as const,
    "page.mayanPath.overview.p6" as const,
  ];

  const mayanPathGalleryImages = [
    { src: "/images/tours/2-8.webp", altKey: "page.mayanPath.gallery.alt.image1" as const },
    { src: "/images/tours/3-7.webp", altKey: "page.mayanPath.gallery.alt.image2" as const },
    { src: "/images/tours/4-8.webp", altKey: "page.mayanPath.gallery.alt.image3" as const },
    { src: "/images/tours/6-6.webp", altKey: "page.mayanPath.gallery.alt.image4" as const },
    { src: "/images/tours/7-7.webp", altKey: "page.mayanPath.gallery.alt.image5" as const },
    { src: "/images/tours/9-5.webp", altKey: "page.mayanPath.gallery.alt.image6" as const },
  ];

  const includedItemsKeys = [
    "page.mayanPath.details.includes.item1" as const,
    "page.mayanPath.details.includes.item2" as const,
    "page.mayanPath.details.includes.item3" as const,
    "page.mayanPath.details.includes.item4" as const,
    "page.mayanPath.details.includes.item5" as const,
    "page.mayanPath.details.includes.item6" as const,
    "page.mayanPath.details.includes.item7" as const,
  ];

  const notIncludedItemsKeys = [
    "page.mayanPath.details.notIncludes.item1" as const,
    "page.mayanPath.details.notIncludes.item2" as const,
  ];
  
  const recommendationsTextKeys = [
    "page.mayanPath.details.recommendations.item1" as const,
    "page.mayanPath.details.recommendations.item2" as const,
    "page.mayanPath.details.recommendations.item3" as const,
  ];
  
  const importantInfoTextKeys = [
    "page.mayanPath.details.importantInfo.item1" as const,
    "page.mayanPath.details.importantInfo.item2" as const,
  ];

  const optionalTransportTextKeys = [
    "page.mayanPath.details.optionalTransport.p1" as const,
    "page.mayanPath.details.optionalTransport.p2" as const,
    "page.mayanPath.details.optionalTransport.p3" as const,
  ];

  const keySellingPointItems = [
    { icon: Award, textKey: "page.mayanPath.keySellingPoints.tripadvisor" as const, subtextKey: "page.mayanPath.keySellingPoints.tripadvisorSub" as const },
    { icon: ShieldCheck, textKey: "page.mayanPath.keySellingPoints.securePayments" as const, subtextKey: "page.mayanPath.keySellingPoints.securePaymentsSub" as const },
    { icon: GitCompareArrows, textKey: "page.mayanPath.keySellingPoints.flexibility" as const, subtextKey: "page.mayanPath.keySellingPoints.flexibilitySub" as const },
    { icon: MapPin, textKey: "page.mayanPath.keySellingPoints.centralLocation" as const, subtextKey: undefined },
  ];

  const productSchema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('page.mayanPath.hero.title'),
    description: t('page.mayanPath.overview.p1'), 
          image: '/images/tours/1-7.webp',
    brand: {
      '@type': 'Brand',
      name: t('footer.column1.title'), 
    },
    offers: {
      '@type': 'Offer',
      url: 'https://www.puertomayacancun.com/tours/mayan-path', 
      priceCurrency: 'USD', 
      price: '20.00', 
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
                {t('page.mayanPath.hero.title')}
              </h1>
              <div className="flex justify-center items-center space-x-2 mb-6">
                <CalendarDays className="w-6 h-6 text-foreground" />
                <p className="text-lg text-foreground/80 font-medium">{t('page.mayanPath.hero.availability')}</p>
                {availabilityDayKeys.map(dayKey => (
                  <Badge key={dayKey} variant="secondary" className="text-sm bg-accent text-accent-foreground">{t(dayKey)}</Badge>
                ))}
              </div>
              <div className="relative w-full max-w-4xl mx-auto aspect-[12/5] rounded-lg overflow-hidden shadow-md mb-8 group">
                <Image
                  src="/images/tours/1-7.webp" 
                  alt={t('page.mayanPath.hero.imageAlt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1200px) 100vw, 80vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <Card className="shadow-xl rounded-xl overflow-hidden border-none bg-card">
                <CardContent className="p-6 md:p-8 space-y-4 text-foreground/90 text-base md:text-lg leading-relaxed">
                  {overviewParagraphKeys.map(pKey => (
                    <p key={pKey}>{t(pKey)}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mayan Path Gallery Section */}
          <section className="py-12 md:py-16 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mayanPath.gallery.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {mayanPathGalleryImages.map((image, index) => (
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
          
          {/* Key Selling Points Section */}
          <section className="py-12 md:py-16 bg-background">
              <div className="container mx-auto px-4">
                   <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                      {t('page.mayanPath.keySellingPoints.title')}
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

          {/* Details & Pricing Section */}
           <section id="tour-details" className="py-12 md:py-16 bg-card shadow-lg scroll-mt-24 md:scroll-mt-28">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.mayanPath.details.title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                {/* Left Column for Details */}
                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanPath.details.includesTitle')}</h3>
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
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.mayanPath.details.notIncludesTitle')}</h3>
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
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><ListChecks className="w-6 h-6 mr-3"/>{t('page.mayanPath.details.recommendationsTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {recommendationsTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><AlertTriangle className="w-6 h-6 mr-3"/>{t('page.mayanPath.details.importantInfoTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {importantInfoTextKeys.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                       <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><Car className="w-6 h-6 mr-3"/>{t('page.mayanPath.details.optionalTransportTitle')}</CardTitle>
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
                        <CardTitle className="font-headline font-bold text-3xl text-foreground">{t('page.mayanPath.pricing.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">
                            {t('page.mayanPath.pricing.adultPrefix')}{' '} 
                            <span className="text-5xl">{t('page.mayanPath.pricing.adultPrice')}</span>
                            {' '}{t('page.mayanPath.pricing.adultSuffix')}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">
                            {t('page.mayanPath.pricing.childPrefix')}{' '}
                            <span className="text-5xl">{t('page.mayanPath.pricing.childPrice')}</span>
                            {' '}{t('page.mayanPath.pricing.childSuffix')}
                          </p>
                        </div>
                        <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 transition-transform hover:scale-105">
                          <Link href="/tours">{t('page.mayanPath.pricing.button.bookNow')}</Link>
                        </Button>
                    </CardContent>
                </Card>
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

