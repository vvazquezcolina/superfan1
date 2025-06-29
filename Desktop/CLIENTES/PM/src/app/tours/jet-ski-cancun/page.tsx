
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";
import JsonLd from "@/components/seo/json-ld";
import type { Product, WithContext } from "schema-dts";
import { CheckCircle, XCircle, Zap, Trees, Coffee, ShieldCheck, CloudSun, GitCompareArrows, ClipboardCheck, CalendarDays, Clock, Users, ListChecks, AlertTriangle, HandCoins, Info, Weight } from "lucide-react";

export default function JetSkiCancunPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    // document.title = t('page.jetSki.meta.title'); // Temporarily disabled
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      // metaDesc.setAttribute('content', t('page.jetSki.meta.description')); // Temporarily disabled
    }
  }, [language, t]);

  const adventureHighlights = [
    { icon: ClipboardCheck, titleKey: "page.jetSki.adventure.welcome.title" as const, textKey: "page.jetSki.adventure.welcome.text" as const },
    { icon: Trees, titleKey: "page.jetSki.adventure.explore.title" as const, textKey: "page.jetSki.adventure.explore.text" as const },
    { icon: Zap, titleKey: "page.jetSki.adventure.speed.title" as const, textKey: "page.jetSki.adventure.speed.text" as const },
    { icon: Coffee, titleKey: "page.jetSki.adventure.relax.title" as const, textKey: "page.jetSki.adventure.relax.text" as const },
  ];

  const keyGuarantees = [
    { icon: ShieldCheck, titleKey: "page.jetSki.guarantees.securePayment.title" as const },
    { icon: CloudSun, titleKey: "page.jetSki.guarantees.weatherGuarantee.title" as const },
    { icon: GitCompareArrows, titleKey: "page.jetSki.guarantees.flexibleBooking.title" as const },
  ];

  const jetSkiGalleryImages = [
    { src: "/images/tours/wave-runner-3.webp", altKey: "page.jetSki.gallery.alt.image1" as const },
    { src: "/images/tours/wave-runner-4.webp", altKey: "page.jetSki.gallery.alt.image2" as const },
    { src: "/images/tours/wave-runner-6.webp", altKey: "page.jetSki.gallery.alt.image3" as const },
    { src: "/images/tours/wave-runner.webp", altKey: "page.jetSki.gallery.alt.image4" as const },
    { src: "/images/tours/wave-runner-7.webp", altKey: "page.jetSki.gallery.alt.image5" as const },
    { src: "/images/tours/wave-runner-5.webp", altKey: "page.jetSki.gallery.alt.image6" as const },
  ];

  const includedItems = [
    "page.jetSki.details.includes.item1" as const,
    "page.jetSki.details.includes.item2" as const,
    "page.jetSki.details.includes.item3" as const,
    "page.jetSki.details.includes.item4" as const,
    "page.jetSki.details.includes.item5" as const,
    "page.jetSki.details.includes.item6" as const,
    "page.jetSki.details.includes.item7" as const,
  ];

  const notIncludedItems = [
    "page.jetSki.details.notIncludes.item1" as const,
    "page.jetSki.details.notIncludes.item2" as const,
    "page.jetSki.details.notIncludes.item3" as const,
    "page.jetSki.details.notIncludes.item4" as const,
    "page.jetSki.details.notIncludes.item5" as const,
  ];

  const requirementsItems = [
    "page.jetSki.details.requirements.minAgeDrive" as const,
    "page.jetSki.details.requirements.minorsAccomp" as const,
    "page.jetSki.details.requirements.minAgeActivity" as const,
    "page.jetSki.details.requirements.maxWeight" as const,
  ];

  const recommendationsItems = [
    "page.jetSki.details.recommendations.item1" as const,
    "page.jetSki.details.recommendations.item2" as const,
    "page.jetSki.details.recommendations.item3" as const,
  ];
  
  const additionalInfoItems = [
    "page.jetSki.details.additionalInfo.item1" as const,
    "page.jetSki.details.additionalInfo.item2" as const,
    "page.jetSki.details.additionalInfo.item3" as const,
    "page.jetSki.details.additionalInfo.item4" as const,
  ];

  const productSchema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('page.jetSki.hero.title'),
    description: t('page.jetSki.hero.intro'), 
          image: '/images/tours/wave-runner-2.webp', 
    brand: {
      '@type': 'Brand',
      name: t('footer.column1.title'), 
    },
    offers: { 
      '@type': 'Offer',
      url: 'https://www.puertomayacancun.com/tours/jet-ski-cancun', 
      availability: 'https://schema.org/InStock',
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
          <section className="py-12 md:py-16 bg-card shadow-lg text-center">
            <div className="container mx-auto px-4">
              <h1 className="font-headline font-bold text-4xl md:text-5xl text-foreground mb-6">
                {t('page.jetSki.hero.title')}
              </h1>
              <div className="relative w-full max-w-4xl mx-auto aspect-[12/5] rounded-lg overflow-hidden shadow-md mb-8 group">
                <Image
                  src="/images/tours/wave-runner-2.webp"
                  alt={t('page.jetSki.hero.imageAlt')}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1200px) 100vw, 80vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
                {t('page.jetSki.hero.intro')}
              </p>
            </div>
          </section>

          {/* Adventure Highlights Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.jetSki.adventure.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {adventureHighlights.map((highlight) => (
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
               <p className="text-center text-foreground/80 mt-8 text-md">{t('page.jetSki.adventure.minAgeInfo')}</p>
            </div>
          </section>

          {/* Key Guarantees Section */}
          <section className="py-12 md:py-16 bg-card">
              <div className="container mx-auto px-4">
                   <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                      {t('page.jetSki.guarantees.title')}
                    </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                      {keyGuarantees.map((guarantee, index) => (
                      <Card key={index} className="bg-background shadow-lg border-none rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
                          <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                          <guarantee.icon className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-2" strokeWidth={1.5} />
                          <p className="text-md md:text-lg text-foreground font-semibold">{t(guarantee.titleKey)}</p>
                          </CardContent>
                      </Card>
                      ))}
                  </div>
              </div>
          </section>

          {/* Jet Ski Gallery Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.jetSki.gallery.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {jetSkiGalleryImages.map((image, index) => (
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

          {/* Details Section */}
          <section id="tour-details" className="py-12 md:py-16 bg-card scroll-mt-24 md:scroll-mt-28">
            <div className="container mx-auto px-4">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-center text-foreground mb-12">
                {t('page.jetSki.details.mainTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                {/* Left Column */}
                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-3">{t('page.jetSki.details.duration.label')}</h3>
                    <div className="flex items-center text-foreground/80">
                      <Clock className="w-5 h-5 mr-3 text-foreground"/>
                      <span>{t('page.jetSki.details.duration.value')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-3">{t('page.jetSki.details.schedule.label')}</h3>
                    <div className="flex items-center text-foreground/80">
                       <CalendarDays className="w-5 h-5 mr-3 text-foreground"/>
                       <span>{t('page.jetSki.details.schedule.times')}</span>
                    </div>
                  </div>
                   <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.jetSki.details.includesTitle')}</h3>
                    <ul className="space-y-2">
                      {includedItems.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <CheckCircle className="w-5 h-5 mr-3 text-success shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-2xl text-foreground mb-4">{t('page.jetSki.details.notIncludesTitle')}</h3>
                    <ul className="space-y-2">
                      {notIncludedItems.map(itemKey => (
                          <li key={itemKey} className="flex items-start text-foreground/80">
                              <XCircle className="w-5 h-5 mr-3 text-error shrink-0 mt-1"/>
                              <span>{t(itemKey)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Right Column */}
                <div className="md:col-span-2 space-y-8">
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><Users className="w-6 h-6 mr-3"/>{t('page.jetSki.details.requirements.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {requirementsItems.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><ListChecks className="w-6 h-6 mr-3"/>{t('page.jetSki.details.recommendations.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                       {recommendationsItems.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-success"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg rounded-xl p-6 bg-background">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="font-headline font-semibold text-2xl text-foreground flex items-center"><AlertTriangle className="w-6 h-6 mr-3"/>{t('page.jetSki.details.additionalInfo.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2 text-foreground/80">
                      {additionalInfoItems.map(itemKey => (
                        <p key={itemKey} className="text-sm flex items-start"><Info className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-foreground/70"/>{t(itemKey)}</p>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-12 md:py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline font-bold text-3xl md:text-4xl mb-4">{t('page.jetSki.cta.title')}</h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
                {t('page.jetSki.cta.text')}
              </p>
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold text-lg px-10 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
                {/* Link to a general booking or tours page for now */}
                <Link href="/tours">{t('page.jetSki.cta.button')}</Link>
              </Button>
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

    
