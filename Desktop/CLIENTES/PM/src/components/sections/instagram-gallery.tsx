// src/components/sections/instagram-gallery.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const instagramImages = [
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 1", dataAiHint: "beach cancun" },
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 2", dataAiHint: "mayan ruins" },
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 3", dataAiHint: "tourist fun" },
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 4", dataAiHint: "jungle adventure" },
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 5", dataAiHint: "ocean wildlife" },
  { src: "/images/misc/placeholder-400x400.svg", alt: "Instagram Post 6", dataAiHint: "cancun sunset" },
];

export default function InstagramGallery() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-6 mb-8 md:mb-12 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-background">
          {instagramImages.map((image, index) => (
            <div key={index} className="snap-center flex-shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                data-ai-hint={image.dataAiHint}
              />
            </div>
          ))}
        </div>
        <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg md:text-xl px-10 py-3 rounded-lg shadow-md transition-transform hover:scale-105 group">
          <Instagram className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
          Síguenos en Instagram
        </Button>
      </div>
    </section>
  );
}
