
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomeContactMap from "@/components/sections/home/home-contact-map";

// Define metadata for this server component
export const metadata: Metadata = {
  title: 'Sobre Nosotras - Equipo Puerto Maya Cancún',
  description: 'Conoce al equipo femenino que impulsa Puerto Maya Cancún. Nuestra historia, valores y compromiso con la excelencia y experiencias auténticas.',
  alternates: {
    canonical: 'https://www.puertomayacancun.com/nosotras', // Replace with your actual domain
  },
};

export default function NosotrasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 pt-[100px] md:pt-[116px]">
        <Card className="shadow-xl rounded-xl my-8">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-foreground text-center">
              Conoce al Equipo Detrás de Puerto Maya
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Image
                              src="/images/misc/placeholder-600x400.svg"
              alt="Próximamente: Sobre Nosotras en Puerto Maya"
              width={600}
              height={400}
              className="mx-auto mb-8 rounded-lg shadow-md"
              data-ai-hint="team community"
            />
            <h3 className="text-2xl font-semibold text-foreground mb-4">Nuestra Pasión, Tu Aventura</h3>
            <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
              Pronto compartiremos más <span className="font-semibold text-foreground">sobre nosotras</span>: el equipo apasionado que hace posible la magia de Puerto Maya. Conoce nuestra historia, valores y el compromiso con ofrecerte experiencias auténticas y memorables.
            </p>
            <p className="text-md text-foreground/70 max-w-xl mx-auto mb-8">
              Estamos emocionadas de presentarnos. ¡Vuelve pronto para conocernos mejor!
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
        <HomeWhyChooseUs />
        <HomeTestimonials />
        <HomeContactMap />
      </main>
      <Footer />
    </div>
  );
}
