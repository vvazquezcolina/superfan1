
"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";

export default function ServiciosPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = t('page.servicios.meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t('page.servicios.meta.description'));
    }
  }, [language, t]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-[100px] md:pt-[116px]">
        <section className="py-12 md:py-16 text-center bg-card shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
              {t('page.servicios.cardTitle')}
            </h1>
            <div className="relative w-full max-w-4xl mx-auto aspect-[12/5] rounded-lg overflow-hidden shadow-md mb-8 group">
              <Image
                src="/images/misc/placeholder-600x400.svg"
                alt={t('page.servicios.heading')}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1200px) 100vw, 80vw"
                className="transition-transform duration-300 group-hover:scale-110"
                data-ai-hint="boats services"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Card className="shadow-xl rounded-xl my-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardHeader className="text-center">
                <CardTitle className="font-headline font-semibold text-2xl md:text-3xl text-foreground">
                  {t('page.servicios.heading')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8 md:py-12">
                <p
                  className="text-lg text-foreground/80 max-w-xl mx-auto mb-8"
                  dangerouslySetInnerHTML={{ __html: t('page.servicios.p1').replace('<span class="font-semibold text-accent">', '<span class="font-semibold text-foreground">') }}
                />
                <p className="text-md text-foreground/70 max-w-xl mx-auto mb-8">
                  {t('page.servicios.p2')}
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
                  <Link href="/">{t('page.button.backHome')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <HomeWhyChooseUs />
        <HomeTestimonials />
        <HomeContactMap />
      </main>
      <Footer />
    </div>
  );
}
