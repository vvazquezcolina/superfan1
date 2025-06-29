// src/components/sections/location-map.tsx
import Image from "next/image";

export default function LocationMap() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8 md:mb-12">
          Ubicación
        </h2>
        <div className="rounded-lg overflow-hidden shadow-xl aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
          <Image
            src="/images/misc/placeholder-1200x675.svg" 
            alt="Mapa de ubicación de Puerto Maya Cancún"
            width={1200}
            height={675}
            className="w-full h-full object-cover"
            data-ai-hint="cancun map"
          />
        </div>
      </div>
    </section>
  );
}
