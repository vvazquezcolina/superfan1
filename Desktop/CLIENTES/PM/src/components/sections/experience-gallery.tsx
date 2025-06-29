// src/components/sections/experience-gallery.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";

const galleryImages = [
  { src: "/images/misc/placeholder-600x400.svg", alt: "Mayan Jungle Tour Experience 1", dataAiHint: "jungle boating" },
  { src: "/images/misc/placeholder-600x400.svg", alt: "Mayan Jungle Tour Experience 2", dataAiHint: "snorkeling coral" },
  { src: "/images/misc/placeholder-600x400.svg", alt: "Mayan Jungle Tour Experience 3", dataAiHint: "mayan ceremony" },
];

export default function ExperienceGallery() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base font-semibold uppercase tracking-wider text-accent mb-2 font-body">
          UN TOUR ÉPICO DE 3 HORAS EN PUERTO MAYA
        </p>
        <h2 className="font-headline text-3xl md:text-5xl text-primary mb-8 md:mb-12">
          LA MEJOR EXPERIENCIA
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {galleryImages.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg aspect-video transform transition-all hover:scale-105">
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full h-full object-cover"
                data-ai-hint={image.dataAiHint}
              />
            </div>
          ))}
        </div>

        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg md:text-xl px-10 py-3 rounded-lg shadow-md transition-transform hover:scale-105">
          Reserva
        </Button>
      </div>
    </section>
  );
}
