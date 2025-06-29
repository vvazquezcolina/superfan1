// src/components/sections/tour-description.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TourDescription() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-3xl md:text-4xl text-center text-primary">
              Descubre el mejor Mayan jungle tour en Cancún
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-3xl mx-auto space-y-4">
              <span>
                Experimenta la emoción de recorrer en lancha rápida en la Laguna Nichupté, mientras exploras los impresionantes escenarios naturales del este de Cancún.
              </span>
              <span>
                Disfruta del mejor tour con nosotros en Puerto Maya Cancún.
              </span>
              <span>
                Aquí vivirás una conexión única guiada a través de los manglares de la laguna Nichupté, para después admirar los increíbles arrecifes de coral y vida marina mientras practicas snorkel en el Caribe Mexicano.
              </span>
              <span>
                Nuestro Jungle Tour en Cancún también incluye una ceremonia maya tradicional y danzas prehispánicas, comida mexicana y una bebida que experimentarás.
              </span>
              <span>
                ¡Reserva ahora para explorar la belleza de la naturaleza de Cancún de una manera única y emocionante!
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
