
// src/components/layout/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; // Import SheetTitle
import { Menu as MenuIcon, ChevronDown, Phone, Instagram, Facebook, Sun, Moon, Mail, MessageSquare } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import WeatherDisplay from "./weather-display";
import type { AllTranslations } from '@/translations';


const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/PuertoMayaCancun/", translationKey: "footer.column4.socialMedia.facebook" as const },
  { icon: Instagram, href: "https://www.instagram.com/puertomayacancun/", translationKey: "footer.column4.socialMedia.instagram" as const },
  { textKey: "footer.column4.socialMedia.tiktok" as const, href: "https://www.tiktok.com/@puertomayacancun" },
];

const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return { isScrolled };
};


const ThemeToggleButton = ({ forMobileSheet = false }: { forMobileSheet?: boolean }) => {
  const { theme, setTheme } = useTheme();
  const { isScrolled } = useHeaderScroll();
  const { t, language } = useLanguage();
  const [currentAriaLabel, setCurrentAriaLabel] = useState('');

  useEffect(() => {
    setCurrentAriaLabel(t(theme === 'light' ? 'header.themeSelector.switchToDark' as keyof AllTranslations : 'header.themeSelector.switchToLight' as keyof AllTranslations));
  }, [theme, t, language]);

  const trackBaseClass = "relative flex items-center h-7 w-14 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  
  let knobIcon = null;
  let knobBgClass = "";
  let trackBgClass = "";
  let sunTrackIconClass = "";
  let moonTrackIconClass = "";

  if (theme === 'light') {
    knobIcon = <Sun className="h-3 w-3 text-white" />;
    knobBgClass = 'bg-orange-400';
    sunTrackIconClass = 'text-orange-400 opacity-0'; // Sun is in the knob, so track sun is invisible
    moonTrackIconClass = 'text-sky-500'; // Moon visible in track

    if (forMobileSheet) {
        trackBgClass = 'bg-muted';
    } else { 
        if (isScrolled) {
            trackBgClass = 'bg-secondary';
        } else { 
            trackBgClass = 'bg-white/50 backdrop-blur-sm';
        }
    }
  } else { // theme === 'dark'
    knobIcon = <Moon className="h-3 w-3 text-white" />;
    knobBgClass = 'bg-muted-foreground';
    sunTrackIconClass = 'text-yellow-400'; // Sun visible in track
    moonTrackIconClass = 'text-sky-400 opacity-0'; // Moon is in the knob, so track moon is invisible

    if (forMobileSheet) {
        trackBgClass = 'bg-muted';
    } else { 
        if (isScrolled) {
            trackBgClass = 'bg-muted';
        } else { 
            trackBgClass = 'bg-muted/70 backdrop-blur-sm';
        }
    }
  }

  const knobBaseClass = "absolute h-[20px] w-[20px] rounded-full shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center";
  const knobTransform = theme === 'dark' ? 'translateX(34px)' : 'translateX(2px)';


  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(trackBaseClass, trackBgClass)}
      aria-label={currentAriaLabel}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2">
        <Sun className={cn("h-4 w-4 transition-all duration-300", sunTrackIconClass)} />
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <Moon className={cn("h-4 w-4 transition-all duration-300", moonTrackIconClass)} />
      </span>
      <span
        className={cn(knobBaseClass, knobBgClass)}
        style={{ transform: knobTransform }}
      >
        {knobIcon}
      </span>
    </button>
  );
};


export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isScrolled } = useHeaderScroll();


  useEffect(() => {
    setIsMounted(true);
  }, []);


  const navItems = [
    { labelKey: "header.nav.home" as const, href: "/" },
    {
      labelKey: "header.nav.tours" as const,
      href: "/tours",
      subItems: [
        { labelKey: "header.nav.tours.mayanJungle" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.tours.jetSki" as const, href: "/tours/jet-ski-cancun" },
        { labelKey: "header.nav.tours.mayanPath" as const, href: "/tours/mayan-path" },
        { labelKey: "header.nav.tours.mangrove" as const, href: "/tours/mangrove-tour" },
      ]
    },
    {
      labelKey: "header.nav.activities" as const,
      href: "/actividades",
      subItems: [
        { labelKey: "header.nav.activities.speedboat" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.activities.snorkel" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.activities.mayanCeremony" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.activities.regionalTasting" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.activities.prehispanicDance" as const, href: "/tours/mayan-jungle-tour" },
        { labelKey: "header.nav.activities.lagoonEcoTours" as const, href: "/actividades" },
        { labelKey: "header.nav.activities.lagoonActivities" as const, href: "/actividades#laguna" },
        { labelKey: "header.nav.activities.nichupteFloraFauna" as const, href: "/actividades#naturaleza" },
        { labelKey: "header.nav.activities.jetSkiRental" as const, href: "/tours/jet-ski-cancun" },
      ]
    },
    {
      labelKey: "header.nav.promotions" as const,
      href: "/promociones",
      subItems: [
        { labelKey: "header.nav.promotions.mexicans" as const, href: "/promociones" },
        { labelKey: "header.nav.promotions.quintanarroenses" as const, href: "/promociones" },
        { labelKey: "header.nav.promotions.yourPhotos" as const, href: "/promociones" },
      ]
    },
    { labelKey: "header.nav.aboutUs" as const, href: "/nosotros" },
  ];

  const contactMethods = [
    { 
      icon: MessageSquare, 
      labelKey: "header.contact.whatsapp.label" as const, 
      detailKey: "header.contact.whatsapp.number" as const, 
      hrefPrefix: "https://wa.me/",
      numberToUse: "529982319265" 
    },
    { 
      icon: Mail, 
      labelKey: "header.contact.email.label" as const, 
      detailKey: "header.contact.email.address" as const, 
      hrefPrefix: "mailto:" 
    },
    { 
      icon: Phone, 
      labelKey: "header.contact.phoneUsCa.label" as const, 
      detailKey: "header.contact.phoneUsCa.number" as const, 
      hrefPrefix: "tel:" 
    },
    { 
      icon: Phone, 
      labelKey: "header.contact.phoneMx.label" as const, 
      detailKey: "header.contact.phoneMx.number" as const, 
      hrefPrefix: "tel:" 
    },
  ];

  const currentLanguageDisplay = language === 'es' ? t('header.lang.spanish' as keyof AllTranslations) : language === 'en' ? t('header.lang.english' as keyof AllTranslations) : t('header.lang.french' as keyof AllTranslations);

  const topBarScrolledClasses = "bg-card/95 backdrop-blur-lg text-foreground border-b border-border";
  const mainNavScrolledClasses = "bg-card/95 backdrop-blur-lg text-foreground shadow-lg border-b border-border";
  const interactiveTextScrolled = "text-foreground hover:text-muted-foreground focus:text-muted-foreground";
  const navLinkScrolledClasses = "text-foreground hover:bg-muted hover:text-foreground";
  const dropdownTriggerScrolledClasses = "text-foreground bg-transparent hover:bg-muted focus:bg-muted group-hover:bg-muted";
  const selectorButtonScrolledClasses = "text-foreground bg-transparent hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground";
  const mobileMenuIconScrolledClasses = "text-foreground hover:bg-muted focus:bg-muted";
  const popoverTriggerScrolledClasses = "text-foreground hover:bg-muted focus:bg-muted";

  const topBarTransparentClasses = "bg-transparent text-white border-b border-white/20";
  const mainNavTransparentClasses = "bg-transparent text-white shadow-none";
  const interactiveTextTransparent = "text-white hover:text-neutral-300 focus:text-neutral-300";
  const navLinkTransparentClasses = "text-white hover:bg-white/10";
  const dropdownTriggerTransparentClasses = "text-white bg-transparent hover:bg-white/10 focus:bg-white/10 group-hover:bg-white/10";
  const selectorButtonTransparentClasses = "text-white bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white";
  const mobileMenuIconTransparentClasses = "text-white hover:bg-white/10 focus:bg-white/10";
  const popoverTriggerTransparentClasses = "text-white hover:bg-white/10 focus:bg-white/10";


  const navLinkBaseClasses = "text-xs lg:text-sm font-medium px-2 py-2 lg:px-3 rounded-md transition-colors duration-300 ease-in-out";
  const dropdownTriggerBaseClasses = "p-1.5 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-300 ease-in-out";
  const selectorButtonBaseClasses = "text-xs lg:text-sm px-2 py-1 h-auto transition-colors duration-300 ease-in-out";
  const mobileMenuIconBaseClasses = "transition-colors duration-300 ease-in-out";
  const popoverTriggerBaseClasses = "p-1 sm:p-1.5 rounded-md transition-colors duration-300 ease-in-out focus-visible:ring-0 focus-visible:ring-offset-0";


  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
      )}
    >
      <div
        className={cn(
          "py-2 px-4 text-[10px] xs:text-xs sm:text-sm transition-colors duration-300 ease-in-out",
          isScrolled ? topBarScrolledClasses : topBarTransparentClasses
        )}
      >
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className={cn("flex items-center space-x-1 invisible md:visible", isScrolled ? interactiveTextScrolled : interactiveTextTransparent)}>
            <Phone className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 opacity-0")} /> 
            <span className="text-center sm:text-left opacity-0">Hidden Numbers</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 mt-1 sm:mt-0">
             <div className={cn("hidden md:inline-flex items-center space-x-1", isScrolled ? interactiveTextScrolled : interactiveTextTransparent)}>
              <span>Cancún</span>
              {isMounted && <WeatherDisplay classNameCn={cn(isScrolled ? interactiveTextScrolled : interactiveTextTransparent)} />}
            </div>
            <span className={cn("hidden md:inline mx-1", isScrolled ? interactiveTextScrolled : interactiveTextTransparent)}>|</span>

            {isMounted && <ThemeToggleButton />}

            {isMounted && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(popoverTriggerBaseClasses, "w-auto h-auto", isScrolled ? popoverTriggerScrolledClasses : popoverTriggerTransparentClasses)}
                    aria-label={t('header.contact.triggerAriaLabel' as keyof AllTranslations)}
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 sm:w-80 bg-popover text-popover-foreground shadow-xl rounded-lg p-4 border-border" sideOffset={10}>
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none text-popover-foreground">{t('header.contact.popover.title' as keyof AllTranslations)}</h4>
                    </div>
                    <div className="grid gap-2">
                      {contactMethods.map(method => {
                        const detail = t(method.detailKey);
                        const hrefValue = method.hrefPrefix === "https://wa.me/" ? `${method.hrefPrefix}${method.numberToUse}` : `${method.hrefPrefix}${detail.replace(/\s|\(|\)/g, '')}`;
                        return (
                          <a
                            key={method.labelKey}
                            href={hrefValue}
                            target={method.hrefPrefix.startsWith('http') ? '_blank' : undefined}
                            rel={method.hrefPrefix.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="group flex items-center justify-between rounded-md p-2 -m-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="flex items-center space-x-3">
                              <method.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-popover-foreground group-hover:text-accent-foreground transition-colors">{t(method.labelKey)}</span>
                                <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">{detail}</span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {socialLinks.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.icon ? t(social.translationKey) : (social.textKey ? t(social.textKey) : '')}
                className={cn("transition-colors duration-300 ease-in-out", isScrolled ? interactiveTextScrolled : interactiveTextTransparent)}
              >
                {social.icon ? <social.icon className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-[10px] xs:text-xs sm:text-sm">{social.textKey ? t(social.textKey) : ''}</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "py-3 px-4 transition-all duration-300 ease-in-out relative",
          isScrolled ? mainNavScrolledClasses : mainNavTransparentClasses
        )}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-redondo-1.png"
              alt="Puerto Maya Cancún Logo"
              width={50}
              height={50}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              item.subItems ? (
                <div key={item.labelKey} className={cn("flex items-center rounded-md group relative", isScrolled ? 'bg-background/50 backdrop-blur-sm border border-border/30 shadow-sm' : 'bg-transparent border border-transparent')}>
                  <Link
                    href={item.href}
                    className={cn(navLinkBaseClasses, "rounded-l-md", isScrolled ? navLinkScrolledClasses : navLinkTransparentClasses, isScrolled ? "group-hover:bg-muted" : "group-hover:bg-white/10")}
                  >
                    <span className={cn(isScrolled ? "text-foreground" : "text-white")}>
                      {t(item.labelKey)}
                    </span>
                  </Link>
                  {isMounted ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn(dropdownTriggerBaseClasses, "rounded-r-md", isScrolled ? dropdownTriggerScrolledClasses : dropdownTriggerTransparentClasses)}>
                          <ChevronDown className={cn("w-3 h-3 lg:w-4 lg:h-4", isScrolled ? "text-foreground" : "text-white")} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent key={`${language}-${theme}-desktop-sub-${item.labelKey}`} className="bg-popover border-border text-popover-foreground">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.labelKey} asChild className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-xs lg:text-sm">
                            <Link href={subItem.href}>{t(subItem.labelKey)}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                     <Button variant="ghost" className={cn(dropdownTriggerBaseClasses, "rounded-r-md", isScrolled ? dropdownTriggerScrolledClasses : dropdownTriggerTransparentClasses)} aria-hidden="true" tabIndex={-1} disabled>
                       <ChevronDown className={cn("w-3 h-3 lg:w-4 lg:h-4", isScrolled ? "text-foreground" : "text-white")} />
                     </Button>
                  )}
                </div>
              ) : (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={cn(navLinkBaseClasses, isScrolled ? navLinkScrolledClasses : navLinkTransparentClasses)}
                >
                  <span className={cn(isScrolled ? "text-foreground" : "text-white")}>
                    {t(item.labelKey)}
                  </span>
                </Link>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {isMounted ? (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn(selectorButtonBaseClasses, isScrolled ? selectorButtonScrolledClasses : selectorButtonTransparentClasses)}>
                    <span className={cn(isScrolled ? "text-foreground" : "text-white")}>{currentLanguageDisplay}</span>
                    <ChevronDown className={cn("w-3 h-3 lg:w-4 lg:h-4 ml-1", isScrolled ? "text-foreground" : "text-white")} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent key={`${language}-${theme}-desktop-lang`} className="bg-popover border-border text-popover-foreground">
                    <DropdownMenuItem
                        onClick={() => setLanguage("es")}
                        className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-xs lg:text-sm">
                        Español
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setLanguage("en")}
                         className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-xs lg:text-sm">
                        English
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setLanguage("fr")}
                         className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-xs lg:text-sm">
                        Français
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                 <Button variant="ghost" size="sm" className={cn(selectorButtonBaseClasses, isScrolled ? selectorButtonScrolledClasses : selectorButtonTransparentClasses)} disabled>
                    <span className={cn(isScrolled ? "text-foreground" : "text-white")}>{currentLanguageDisplay}</span>
                    <ChevronDown className={cn("w-3 h-3 lg:w-4 lg:h-4 ml-1", isScrolled ? "text-foreground" : "text-white")} />
                 </Button>
            )}
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs lg:text-sm px-4 py-2 lg:px-6 rounded-md shadow-md transition-transform hover:scale-105 h-auto">
              <Link href="/#booking">{t('header.button.book' as keyof AllTranslations)}</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(mobileMenuIconBaseClasses, isScrolled ? mobileMenuIconScrolledClasses : mobileMenuIconTransparentClasses)}>
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent key={`${language}-${theme}-mobile-menu`} side="right" className="w-[280px] bg-background text-foreground p-0 flex flex-col">
                <SheetTitle className="sr-only">{t('header.mobileMenu.title' as keyof AllTranslations)}</SheetTitle>
                <div className="p-4 flex-grow overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="inline-block">
                      <Image
                          src="/images/logo-redondo-1.png"
                          alt="Puerto Maya Cancún Logo"
                          width={40}
                          height={40}
                        />
                    </Link>
                    {isMounted && <ThemeToggleButton forMobileSheet={true} />} 
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                       item.subItems ? (
                        <div key={item.labelKey} className="rounded-md group hover:bg-accent/10">
                          <div className="flex items-center justify-between w-full">
                            <Link
                              href={item.href}
                              className="text-foreground group-hover:text-accent-foreground transition-colors text-base py-2 px-3 flex-grow"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {t(item.labelKey)}
                            </Link>
                            {isMounted ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="p-3 h-auto text-muted-foreground group-hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent focus:bg-transparent">
                                    <ChevronDown className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent key={`${language}-${theme}-mobile-sub-${item.labelKey}`} className="w-[calc(280px-64px)] bg-popover border-border text-popover-foreground ml-auto mr-3 sm:mr-4">
                                  {item.subItems.map((subItem) => (
                                    <DropdownMenuItem key={subItem.labelKey} asChild className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-sm">
                                      <Link href={subItem.href} onClick={() => setIsMobileMenuOpen(false)}>{t(subItem.labelKey)}</Link>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                             ) : (
                                <Button variant="ghost" size="icon" className="p-3 h-auto text-muted-foreground group-hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent focus:bg-transparent" aria-hidden="true" tabIndex={-1} disabled>
                                  <ChevronDown className="w-5 h-5" />
                                </Button>
                             )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.labelKey}
                          href={item.href}
                          className="text-foreground hover:bg-accent/10 hover:text-accent-foreground transition-colors text-base py-2 px-3 rounded-md block"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t(item.labelKey)}
                        </Link>
                      )
                    ))}
                  </nav>
                </div>
                 <div className="p-4 pt-3 border-t border-border">
                    <div className="space-y-3">
                      {isMounted && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center justify-center text-base text-foreground bg-background hover:bg-accent/10 hover:text-accent-foreground focus:bg-accent/10 focus:text-accent-foreground py-2.5 border-border">
                              <Phone className="w-5 h-5 mr-2" />
                              {t('header.contact.popover.title' as keyof AllTranslations)}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 bg-popover text-popover-foreground shadow-xl rounded-lg p-4 border-border mb-2" side="top" align="center" sideOffset={10}>
                            <div className="grid gap-4">
                              <div className="space-y-1">
                                <h4 className="font-medium leading-none text-popover-foreground">{t('header.contact.popover.title' as keyof AllTranslations)}</h4>
                              </div>
                              <div className="grid gap-2">
                                {contactMethods.map(method => {
                                  const detail = t(method.detailKey);
                                  const hrefValue = method.hrefPrefix === "https://wa.me/" ? `${method.hrefPrefix}${method.numberToUse}` : `${method.hrefPrefix}${detail.replace(/\s|\(|\)/g, '')}`;
                                  return (
                                    <a
                                      key={method.labelKey + "-mobile"}
                                      href={hrefValue}
                                      target={method.hrefPrefix.startsWith('http') ? '_blank' : undefined}
                                      rel={method.hrefPrefix.startsWith('http') ? 'noopener noreferrer' : undefined}
                                      className="group flex items-center justify-between rounded-md p-2 -m-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <method.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-popover-foreground group-hover:text-accent-foreground transition-colors">{t(method.labelKey)}</span>
                                          <span className="text-xs text-muted-foreground group-hover:text-accent-foreground/80 transition-colors">{detail}</span>
                                        </div>
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      {isMounted ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between text-base text-foreground bg-background hover:bg-accent/10 hover:text-accent-foreground focus:bg-accent/10 focus:text-accent-foreground py-2 border-border">
                                {currentLanguageDisplay}
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent key={`${language}-${theme}-mobile-sheet-lang`} className="w-[calc(100%-32px)] bg-popover border-border text-popover-foreground">
                              <DropdownMenuItem
                                  onClick={() => {setLanguage("es"); setIsMobileMenuOpen(false);}}
                                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-sm">
                                  Español
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  onClick={() => {setLanguage("en"); setIsMobileMenuOpen(false);}}
                                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-sm">
                                  English
                              </DropdownMenuItem>
                               <DropdownMenuItem
                                  onClick={() => {setLanguage("fr"); setIsMobileMenuOpen(false);}}
                                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer text-sm">
                                  Français
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        ) : (
                        <Button variant="outline" className="w-full justify-between text-base text-foreground bg-background py-2 border-border" disabled>
                            {currentLanguageDisplay}
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
                          <Link href="/#booking" onClick={() => setIsMobileMenuOpen(false)}>{t('header.button.book' as keyof AllTranslations)}</Link>
                      </Button>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 p-4 pt-3 pb-2 border-t border-border">
                  {socialLinks.map((social) => (
                    <Link key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.icon ? t(social.translationKey) : (social.textKey ? t(social.textKey) : '')}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-muted-foreground hover:text-accent-foreground transition-colors">
                      {social.icon ? <social.icon className="w-6 h-6" /> : <span className="text-sm">{social.textKey ? t(social.textKey) : ''}</span>}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Gradient Overlay for static header */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none -z-10",
          isScrolled && "hidden"
        )}
        aria-hidden="true"
      />
    </header>
  );
}

