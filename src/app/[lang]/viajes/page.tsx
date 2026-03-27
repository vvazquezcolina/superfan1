import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { toContentLocale } from '@/lib/content/locale'
import type { Locale } from '@/lib/content/schemas'
import { Plane, Hotel, Train, FileText, ChevronRight } from 'lucide-react'

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

  return buildPageMetadata({
    title: contentLocale === 'es'
      ? 'Guia de Viajes al Mundial 2026'
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
    { href: '/es/viajes/vuelos', title: 'Vuelos', desc: 'Encuentra vuelos baratos desde Mexico, USA y Europa para el Mundial 2026.', Icon: Plane, color: 'blue' },
    { href: '/es/viajes/hospedaje', title: 'Hospedaje', desc: 'Donde hospedarse en cada ciudad sede: barrios, precios y recomendaciones.', Icon: Hotel, color: 'green' },
    { href: '/es/viajes/transporte', title: 'Transporte entre ciudades', desc: 'Como moverte entre las 16 sedes: avion, autobus, tren y auto.', Icon: Train, color: 'purple' },
    { href: '/es/viajes/visa', title: 'Visa y requisitos de entrada', desc: 'ESTA, FMM y eTA: todo sobre visas para USA, Mexico y Canada.', Icon: FileText, color: 'orange' },
  ],
  en: [
    { href: '/en/viajes/vuelos', title: 'Flights', desc: 'Find cheap flights from Mexico, USA, and Europe for the 2026 World Cup.', Icon: Plane, color: 'blue' },
    { href: '/en/viajes/hospedaje', title: 'Accommodation', desc: 'Where to stay in each host city: neighborhoods, prices, and recommendations.', Icon: Hotel, color: 'green' },
    { href: '/en/viajes/transporte', title: 'Intercity Transport', desc: 'How to get between the 16 venues: flights, buses, trains, and driving.', Icon: Train, color: 'purple' },
    { href: '/en/viajes/visa', title: 'Visa & Entry Requirements', desc: 'ESTA, FMM, and eTA: everything about visas for USA, Mexico, and Canada.', Icon: FileText, color: 'orange' },
  ],
}

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-700' },
}

export default async function ViajesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const contentLocale = toContentLocale(lang) as Locale
  const dict = await getDictionary(lang as import('@/app/[lang]/dictionaries').Locale)

  const breadcrumbs = generateBreadcrumbs(`/${lang}/viajes`, contentLocale, dict.breadcrumbs)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const sections = travelSections[contentLocale] ?? travelSections.es
  const title = contentLocale === 'es' ? 'Guia de Viajes al Mundial 2026' : 'Travel Guide for World Cup 2026'
  const intro = contentLocale === 'es'
    ? 'Planifica cada detalle de tu viaje al Mundial 2026. Desde vuelos baratos hasta requisitos de visa para los tres paises sede, aqui encontraras toda la informacion practica que necesitas.'
    : 'Plan every detail of your trip to the 2026 World Cup. From cheap flights to visa requirements for all three host countries, here you\'ll find all the practical information you need.'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sections.map((s) => {
            const colors = colorMap[s.color]
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`group flex items-start gap-4 rounded-xl border ${colors.border} ${colors.bg} p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className={`rounded-xl ${colors.icon} p-3 shrink-0`}>
                  <s.Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold group-hover:text-primary transition-colors">
                    {s.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                    {contentLocale === 'es' ? 'Leer guia' : 'Read guide'}
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
