// src/components/sections/testimonials.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Obet Alberto D",
    title: "Muy buen servicio",
    text: "Me encantó la experiencia y la atención. Todos amables y un muy bonita experiencia. A mis hijas les encantó y volveríamos...",
    rating: 5,
  },
  {
    name: "Ana S",
    title: "Increíble",
    text: "El viaje fue increíble. Esta actividad será mi evento estrella de la atención hacia el cliente recordará. Lo recomendaría.",
    rating: 5,
  },
  {
    name: "Melissa L",
    title: "Such a blast!",
    text: "Andrés was awesome! He made the tour so much fun. His vibe made a huge difference. We laughed the whole time...",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl text-center text-primary mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-xl md:text-2xl text-foreground/90 font-medium mb-8 md:mb-12 flex items-center justify-center">
          EXCELLENT 
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 fill-yellow-400 ml-1" />
          ))}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-card shadow-lg rounded-xl overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-accent">{review.title}</CardTitle>
                <CardDescription className="text-foreground/80 pt-1">{review.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
