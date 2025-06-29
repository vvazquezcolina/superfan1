
"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const galleryItems = [
  {
    src: "/images/gallery/ceremonia-maya-cancun-tours-600x810.jpg",
    altKey: "toursPage.glimpseGallery.alt.ceremony" as const,
    titleKey: "toursPage.glimpseGallery.title.ceremony" as const,
  },
  {
    src: "/images/gallery/comida-tipica-cancun-maya-600x810.jpg",
    altKey: "toursPage.glimpseGallery.alt.food" as const,
    titleKey: "toursPage.glimpseGallery.title.food" as const,
  },
  {
    src: "/images/gallery/jet-ski-laguna-cancun-600x810.jpeg",
    altKey: "toursPage.glimpseGallery.alt.jetSki" as const,
    titleKey: "toursPage.glimpseGallery.title.jetSki" as const,
  },
  {
    src: "/images/gallery/tours-en-cancun-puerto-maya-600x810.webp",
    altKey: "toursPage.glimpseGallery.alt.generalTour" as const,
    titleKey: "toursPage.glimpseGallery.title.generalTour" as const,
  },
  {
    src: "/images/tours/15.webp",
    altKey: "toursPage.glimpseGallery.alt.adventure1" as const,
    titleKey: "toursPage.glimpseGallery.title.adventure1" as const,
  },
  {
    src: "/images/tours/16.webp",
    altKey: "toursPage.glimpseGallery.alt.adventure2" as const,
    titleKey: "toursPage.glimpseGallery.title.adventure2" as const,
  },
  {
    src: "/images/tours/17.webp",
    altKey: "toursPage.glimpseGallery.alt.adventure3" as const,
    titleKey: "toursPage.glimpseGallery.title.adventure3" as const,
  },
  {
    src: "/images/tours/18.webp",
    altKey: "toursPage.glimpseGallery.alt.adventure4" as const,
    titleKey: "toursPage.glimpseGallery.title.adventure4" as const,
  },
];

export default function ToursGlimpseGallery() {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl text-center text-foreground mb-8 md:mb-12">
          {t('toursPage.glimpseGallery.mainTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative w-full aspect-[3/4]"> {/* Aspect ratio for portrait images */}
                <Image
                  src={item.src}
                  alt={t(item.altKey)}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4 bg-background">
                <h3 className="font-semibold text-lg text-foreground text-center">{t(item.titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
