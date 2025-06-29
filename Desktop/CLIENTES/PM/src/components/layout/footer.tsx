
// src/components/layout/footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Award, Phone, Clock, CreditCard, ShieldCheck, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const paymentMethods = [
  { label: "Visa", icon: CreditCard },
  { label: "Mastercard", icon: CreditCard },
  { label: "Amex", icon: CreditCard },
  { label: "Discover", icon: CreditCard },
];

export default function Footer() {
  const { t } = useLanguage();

  const socialLinksFooter = [
    { icon: Facebook, href: "https://facebook.com/PuertoMayaCancun", translationKey: "footer.column4.socialMedia.facebook" as const },
    { icon: Instagram, href: "https://instagram.com/puertomayacancun", translationKey: "footer.column4.socialMedia.instagram" as const },
    { icon: Award, href: "https://www.tripadvisor.com/Attraction_Review-g150807-d13953990-Reviews-Puerto_Maya_Cancun-Cancun_Yucatan_Peninsula.html", translationKey: "footer.column4.socialMedia.tripadvisor" as const },
    { textKey: "footer.column4.socialMedia.tiktok" as const, href: "https://www.tiktok.com/@puertomayacancun" },
    { icon: MessageSquare, href: "https://wa.me/529982319265", translationKey: "footer.column4.socialMedia.whatsapp" as const },
  ];

  const menuLinks = [
    { translationKey: "header.nav.home" as const, href: "/" },
    { translationKey: "header.nav.tours" as const, href: "/tours" },
    { translationKey: "page.servicios.meta.title" as const, href: "/servicios" },
    { translationKey: "home.contactMap.title" as const, href: "/#contact" },
  ];

  const infoLinks = [
      { translationKey: "page.actividades.meta.title" as const, href: "/actividades" },
      { translationKey: "footer.column3.meetingsEvents" as const, href: "/eventos" },
      { translationKey: "footer.column3.mayanLounge" as const, href: "/mayan-lounge" },
      { translationKey: "footer.column3.mayanMarket" as const, href: "/mayan-market" },
      { translationKey: "page.nosotros.meta.title" as const, href: "/nosotros" },
      { translationKey: "footer.column3.yourPhotosLink" as const, href: "/promociones" },
      { translationKey: "footer.column3.terms" as const, href: "/#" },
      { translationKey: "footer.column3.privacy" as const, href: "/#" },
      { translationKey: "footer.column3.travelAgencies" as const, href: "/#" },
      { translationKey: "footer.column3.faq" as const, href: "/#" },
  ];


  return (
    <footer className="bg-card text-foreground py-10 md:py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
          {/* Column 1: Puerto Maya Cancún / Atención al cliente */}
          <div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-3">{t('footer.column1.title')}</h3>
            <p className="font-semibold text-foreground/90 text-sm mb-1">{t('footer.column1.customerService')}</p>
            <div className="flex items-center text-xs text-foreground/80 mb-1">
              <Phone className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>MEX 559-225-2694</span>
            </div>
            <div className="flex items-center text-xs text-foreground/80 mb-2">
              <Phone className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>USA 833-592-1490</span>
            </div>
            <p className="font-semibold text-foreground/90 text-sm mb-1">{t('footer.column1.hours')}</p>
            <div className="flex items-center text-xs text-foreground/80">
              <Clock className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>{t('footer.column1.hours.weekdays')}</span>
            </div>
            <div className="flex items-center text-xs text-foreground/80">
              <Clock className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span>{t('footer.column1.hours.weekends')}</span>
            </div>
          </div>

          {/* Column 2: Menu */}
          <div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-3">{t('footer.column2.title')}</h3>
            <ul className="space-y-1.5 text-sm">
              {menuLinks.map((link) => (
                <li key={link.href + (link.translationKey || (link as any).label)}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary transition-colors text-xs">
                    {link.translationKey ? t(link.translationKey) : (link as any).label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Información */}
          <div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-3">{t('footer.column3.title')}</h3>
            <ul className="space-y-1.5 text-sm">
              {infoLinks.map((link) => (
                <li key={link.href + link.translationKey}>
                  <Link href={link.href} className="text-foreground/80 hover:text-primary transition-colors text-xs">
                    {t(link.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Redes Sociales / Sitio Seguro */}
          <div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-3">{t('footer.column4.socialMedia')}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
              {socialLinksFooter.map((social) => (
                <Link key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.icon ? t(social.translationKey) : t(social.textKey)}
                  className="text-foreground hover:text-primary transition-colors flex items-center">
                  {social.icon ? <social.icon className="w-5 h-5 sm:w-6 sm:h-6" /> : <span className="text-xs font-medium">{t(social.textKey)}</span>}
                </Link>
              ))}
            </div>
            <h3 className="font-headline font-bold text-lg text-foreground mb-3">{t('footer.column4.secureSite')}</h3>
             <div className="flex items-center text-xs text-foreground/80 mb-2">
                <ShieldCheck className="w-4 h-4 mr-2 text-success shrink-0" />
                <span>{t('footer.column4.secureSite')}</span>
            </div>
            <div className="flex items-center space-x-1.5 mb-2">
              {paymentMethods.map((method) => (
                <method.icon key={method.label} className="w-6 h-6 sm:w-7 sm:h-7 text-foreground/70" aria-label={method.label} />
              ))}
            </div>
            <Image
                src="/images/misc/pci-compliant.png"
                alt="PCI Compliant"
                width={80}
                height={40}
                className="h-auto transition-all duration-300 dark:filter dark:invert dark:grayscale dark:brightness-[1.5] dark:opacity-90"
            />
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-foreground/60">
          <p>&copy; {new Date().getFullYear()} {t('footer.column1.title')}. {t('footer.copyright.text1')}</p>
          <p className="mt-1">{t('footer.copyright.text2')}</p>
        </div>
      </div>
    </footer>
  );
}
