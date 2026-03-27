import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { toContentLocale } from '@/lib/content/locale'
import type { Locale } from '@/lib/content/schemas'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return [
    { lang: 'es' }, { lang: 'en' }, { lang: 'pt' },
    { lang: 'fr' }, { lang: 'de' }, { lang: 'ar' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const contentLocale = toContentLocale(lang) as Locale
  const dict = await getDictionary(lang as Locale)

  return buildPageMetadata({
    title: contentLocale === 'es'
      ? 'Guía de Viajes al Mundial 2026'
      : 'Travel Guide for World Cup 2026',
    description: contentLocale === 'es'
      ? 'Todo lo que necesitas para planificar tu viaje al Mundial 2026: vuelos, hospedaje, transporte entre ciudades y requisitos de visa.'
      : 'Everything you need to plan your trip to the 2026 World Cup: flights, accommodation, intercity transport, and visa requirements.',
    lang: contentLocale,
    path: `/${lang}/viajes`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/viajes`,
        en: `${SITE_URL}/en/viajes`,
        'x-default': `${SITE_URL}/es/viajes`,
      },
    },
  })
}

const travelSections = {
  es: [
    { href: '/es/viajes/vuelos', title: 'Vuelos', desc: 'Encuentra vuelos baratos desde México, USA y Europa para el Mundial 2026.' },
    { href: '/es/viajes/hospedaje', title: 'Hospedaje', desc: 'Dónde hospedarse en cada ciudad sede: barrios, precios y recomendaciones.' },
    { href: '/es/viajes/transporte', title: 'Transporte entre ciudades', desc: 'Cómo moverte entre las 16 sedes: avión, autobús, tren y auto.' },
    { href: '/es/viajes/visa', title: 'Visa y requisitos de entrada', desc: 'ESTA, FMM y eTA: todo sobre visas para USA, México y Canadá.' },
  ],
  en: [
    { href: '/en/viajes/vuelos', title: 'Flights', desc: 'Find cheap flights from Mexico, USA, and Europe for the 2026 World Cup.' },
    { href: '/en/viajes/hospedaje', title: 'Accommodation', desc: 'Where to stay in each host city: neighborhoods, prices, and recommendations.' },
    { href: '/en/viajes/transporte', title: 'Intercity Transport', desc: 'How to get between the 16 venues: flights, buses, trains, and driving.' },
    { href: '/en/viajes/visa', title: 'Visa & Entry Requirements', desc: 'ESTA, FMM, and eTA: everything about visas for USA, Mexico, and Canada.' },
  ],
}

export default async function ViajesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const contentLocale = toContentLocale(lang) as Locale
  const dict = await getDictionary(lang as Locale)

  const breadcrumbs = generateBreadcrumbs(`/${lang}/viajes`, contentLocale, dict.breadcrumbs)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const sections = travelSections[contentLocale] ?? travelSections.es
  const title = contentLocale === 'es' ? 'Guía de Viajes al Mundial 2026' : 'Travel Guide for World Cup 2026'
  const intro = contentLocale === 'es'
    ? 'Planifica cada detalle de tu viaje al Mundial 2026. Desde vuelos baratos hasta requisitos de visa para los tres países sede, aquí encontrarás toda la información práctica que necesitas.'
    : 'Plan every detail of your trip to the 2026 World Cup. From cheap flights to visa requirements for all three host countries, here you\'ll find all the practical information you need.'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl py-6">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block rounded-lg border border-border p-6 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50"
            >
              <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
                {contentLocale === 'es' ? 'Leer guía' : 'Read guide'} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
