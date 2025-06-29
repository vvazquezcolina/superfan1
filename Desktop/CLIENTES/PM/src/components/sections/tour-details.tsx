// src/components/sections/tour-details.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const includedItems = [
  "Ceremonia maya",
  "Danza prehispánica",
  "Conducción de lancha rápida (doble – 2 pax por lancha)",
  "Recorrido con Guía Anfitrión Maya",
  "Música latina / Reggaetón y una bebida",
  "Chaleco salvavidas y equipo de snorkel",
  "Guía bilingüe",
  "Uso de locker (se requiere depósito reembolsable de $5USD)",
  "Servicios incluidos: WiFi, estacionamiento y baños",
  "Formato de salud individual al subir",
];

const notIncludedItems = [
  "Impuesto del Parque Nacional Marino y mantenimiento del muelle ($20 USD por persona)",
  "Transporte",
  "Fotos y videos",
  "Propinas",
];

export default function TourDetails() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-xl rounded-xl overflow-hidden p-6 md:p-8">
          <CardHeader className="text-center pb-6 md:pb-8">
            <CardTitle className="font-headline text-2xl md:text-3xl text-primary">
              Más del Mayan Jungle Tour en Puerto Maya Cancún
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-headline text-xl md:text-2xl text-foreground mb-4">Disponible:</h3>
              <p className="text-foreground/80 mb-6">Todo el año</p>

              <h3 className="font-headline text-xl md:text-2xl text-foreground mb-4">Duración:</h3>
              <p className="text-foreground/80 mb-6">3 horas</p>

              <h3 className="font-headline text-xl md:text-2xl text-foreground mb-4">Incluye:</h3>
              <ul className="space-y-2 mb-6">
                {includedItems.map((item, index) => (
                  <li key={index} className="flex items-start text-foreground/80">
                    <CheckCircle className="w-5 h-5 text-success mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-xl md:text-2xl text-foreground mb-4">No incluye:</h3>
              <ul className="space-y-2 mb-6">
                {notIncludedItems.map((item, index) => (
                  <li key={index} className="flex items-start text-foreground/80">
                    <XCircle className="w-5 h-5 text-error mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-headline text-xl md:text-2xl text-foreground mb-4">Edad mínima requerida:</h3>
              <p className="text-foreground/80 mb-6">La edad mínima para conducir la lancha rápida es de 18 años</p>
            </div>
          </CardContent>
          <div className="text-center mt-8 md:mt-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg md:text-xl px-10 py-3 rounded-lg shadow-md transition-transform hover:scale-105">
              Reserva ahora
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
