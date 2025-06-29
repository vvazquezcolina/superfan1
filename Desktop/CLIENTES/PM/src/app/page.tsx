
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HomeHero from "@/components/sections/home/home-hero";
import HomeTourOverview from "@/components/sections/home/home-tour-overview";
import HomeAdditionalActivities from "@/components/sections/home/home-additional-activities";
import HomeWhyChooseUs from "@/components/sections/home/home-why-choose-us";
import HomeTestimonials from "@/components/sections/home/home-testimonials";
import HomePromotions from "@/components/sections/home/home-promotions";
import Home360Gallery from "@/components/sections/home/home-360-gallery";
import HomeBookingCta from "@/components/sections/home/home-booking-cta";
import HomeContactMap from "@/components/sections/home/home-contact-map";
import JsonLd from "@/components/seo/json-ld";
import type { LocalBusiness, TouristAttraction, WithContext } from "schema-dts";
import { translations } from "@/translations"; // Assuming translations can be accessed here

// For server components, metadata can be exported directly.
// The main metadata (title, desc) is in layout.tsx.
// We can add specific JSON-LD here.

const localBusinessSchema: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: translations['footer.column1.title'].es, // Use a base language for schema
        image: '/images/logo-redondo-1.png', // URL to your logo
  url: 'https://www.puertomayacancun.com', // Your website URL
  telephone: '+525592252694',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Blvd. Kukulcan Km 14.7, Zona Hotelera (Inside Fred\'s Restaurant)',
    addressLocality: 'Cancún',
    addressRegion: 'QR',
    postalCode: '77500',
    addressCountry: 'MX',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 21.073923880586676,
    longitude: -86.78096462474215,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '08:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '08:00',
      closes: '19:00',
    },
  ],
  priceRange: '$$', // Optional: Or a specific price range
  department: {
    '@type': 'Organization',
    name: translations['footer.column1.title'].es,
    url: 'https://www.puertomayacancun.com/tours/mayan-jungle-tour/', // Link to main tour
    description: translations['home.tourOverview.description'].es,
  }
};

const touristAttractionSchema: WithContext<TouristAttraction> = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: translations['home.hero.title'].es,
  description: translations['home.hero.subtitle'].es,
        image: '/images/tours/14.webp', // A representative image of the attraction/main tour
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Blvd. Kukulcan Km 14.7, Zona Hotelera',
    addressLocality: 'Cancún',
    addressRegion: 'QR',
    postalCode: '77500',
    addressCountry: 'MX',
  },
  publicAccess: true,
  touristType: 'Adventure tourism, Cultural tourism',
};


export default function HomePage() {
  return (
    <>
      <JsonLd schema={localBusinessSchema} />
      <JsonLd schema={touristAttractionSchema} />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          <HomeHero />
          <HomeTourOverview />
          <HomeAdditionalActivities />
          <HomeWhyChooseUs />
          <HomeTestimonials />
          <HomePromotions />
          <Home360Gallery />
          <HomeBookingCta />
          <HomeContactMap />
        </main>
        <Footer />
      </div>
    </>
  );
}
