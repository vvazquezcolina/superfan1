
// src/components/sections/home/home-contact-map.tsx
"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeContactMap() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-10 md:py-16 lg:py-20 bg-background scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="md:pr-6">
            <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 sm:mb-6">
              {t('home.contactMap.title')}
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-foreground/80">
              <div className="flex items-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-foreground shrink-0" />
                <span>Mex: 559-225-2694 | USA: 833-592-1490</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-foreground shrink-0" />
                <a href="mailto:contact@puertomayacancun.com" className="hover:text-primary transition-colors break-all">contact@puertomayacancun.com</a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-foreground shrink-0 mt-1" />
                <span>Blvd. Kukulcan Km 14.7, Zona Hotelera, 77500 Cancún, Q.R., México <br/>(Inside Fred's Restaurant)</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.968410141676!2d-86.78096462474215!3d21.073923880586676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c282d97eb4e67%3A0x5c52a7be18078a6c!2sPuerto%20Maya%20Canc%C3%BAn%20-%20Jungle%20Tour%2C%20Snorkeling%2C%20Mayan%20Experience%20%26%20Jet%20Ski%20Rentals!5e0!3m2!1sen!2smx!4v1748808997967!5m2!1sen!2smx"
              style={{ border:0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('home.contactMap.iframe.title')}
              aria-label={t('home.contactMap.iframe.ariaLabel')}
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
