import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { SITE_URL } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'es' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Acerca de SuperFan',
    description:
      'Sobre SuperFan Mundial 2026: nuestra mision, independencia editorial y equipo.',
    lang: 'es',
    path: '/es/acerca',
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/acerca`,
        en: `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/es/acerca`,
      },
    },
  })
}

export default function AcercaPage() {
  const breadcrumbs = generateBreadcrumbs('/es/acerca', 'es', {
    home: 'Inicio',
    acerca: 'Acerca de',
  }, 'Acerca de SuperFan')

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />
      <article className="mx-auto max-w-3xl py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Acerca de SuperFan Mundial 2026</h1>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Nuestra Mision</h2>
          <p className="leading-relaxed">
            Somos una guia independiente creada para ayudar a los fans de futbol de habla
            hispana a planificar su experiencia en el Mundial 2026 en Mexico, Estados Unidos y
            Canada. Ofrecemos informacion completa y verificada sobre ciudades sede, estadios,
            transporte, alojamiento y consejos culturales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Independencia Editorial</h2>
          <p className="leading-relaxed">
            Nuestras recomendaciones se basan en investigacion y criterio editorial. Si bien
            utilizamos enlaces de afiliados para financiar el sitio (ver nuestra{' '}
            <Link href="/es/divulgacion" className="text-primary underline hover:text-primary/80">
              pagina de divulgacion
            </Link>
            ), las asociaciones de afiliados nunca influyen en nuestro contenido. Recomendamos
            opciones basadas en calidad, valor y relevancia para los fans, no en las tasas de
            comision.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Como Nos Financiamos</h2>
          <p className="leading-relaxed">
            Este sitio se financia a traves de comisiones de afiliados (principalmente
            reservas de hoteles a traves de Booking.com) y no utiliza publicidad de display.
            Esto nos permite mantener el contenido gratuito y sin anuncios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">El Equipo</h2>
          <p className="leading-relaxed">
            SuperFan es un proyecto de creadores de contenido independientes apasionados por
            hacer el Mundial accesible a los fans de habla hispana de todo el mundo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contacto</h2>
          <p className="leading-relaxed">
            Correo electronico:{' '}
            <a
              href="mailto:info@superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              info@superfaninfo.com
            </a>
            <br />
            Sitio web:{' '}
            <a
              href="https://www.superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              www.superfaninfo.com
            </a>
          </p>
        </section>
      </article>
    </>
  )
}
