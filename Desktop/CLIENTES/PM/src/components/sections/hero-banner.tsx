// src/components/sections/hero-banner.tsx
import Image from "next/image";
import { Award, MapPin, UtensilsCrossed, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconFeatures = [
  {
    icon: Award,
    text: "Tour #1 en TripAdvisor",
    dataAiHint: "award quality"
  },
  {
    icon: MapPin,
    text: "Ubicado en el centro de la zona hotelera",
    dataAiHint: "location map"
  },
  {
    icon: UtensilsCrossed,
    text: "Bocadillo tradicional maya y bebida incluidos",
    dataAiHint: "food drink"
  },
  {
    icon: Sparkles,
    text: "Presencia y experimenta un ritual maya",
    dataAiHint: "mayan ritual"
  },
];

export default function HeroBanner() {
  return (
    <section className="pt-[100px] md:pt-[116px]"> {/* Adjust top padding to accommodate fixed header */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-foreground/10">
        <Image
          src="/images/misc/placeholder-1920x700.svg"
          alt="Mayan Jungle Tour Video Thumbnail"
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          priority
          data-ai-hint="jungle boat"
        />
        {/* Intentionally no text overlay on video as per requirements */}
      </div>
      
      <div className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {iconFeatures.map((feature, index) => (
              <Card key={index} className="bg-card shadow-lg border-none rounded-xl overflow-hidden transform transition-all hover:scale-105">
                <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                  <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-2" strokeWidth={1.5} />
                  <p className="text-sm md:text-base text-foreground font-medium">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
