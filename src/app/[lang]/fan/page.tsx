import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { toContentLocale } from '@/lib/content/locale'
import type { Locale } from '@/lib/content/schemas'
import { Users, Ticket, Shield, ChevronRight } from 'lucide-react'

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
      ? 'Experiencia Fan: Entradas y Seguridad'
      : 'Fan Experience: Tickets and Safety',
    description: contentLocale === 'es'
      ? 'Guía completa para fans del Mundial 2026: cómo comprar entradas de forma segura, consejos de seguridad y seguros de viaje.'
      : 'Complete guide for 2026 World Cup fans: how to buy tickets safely, safety tips, and travel insurance.',
    lang: contentLocale,
    path: `/${lang}/fan`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/fan`,
        en: `${SITE_URL}/en/fan`,
        'x-default': `${SITE_URL}/es/fan`,
      },
    },
  })
}

const fanSections = {
  es: [
    { href: '/es/fan/entradas', title: 'Entradas', desc: 'Cómo comprar entradas oficiales de forma segura, categorías, precios y cómo evitar estafas.', Icon: Ticket, color: 'blue' },
    { href: '/es/fan/seguridad', title: 'Seguridad y Seguros', desc: 'Consejos de seguridad, seguros de viaje recomendados y números de emergencia en cada país.', Icon: Shield, color: 'green' },
  ],
  en: [
    { href: '/en/fan/entradas', title: 'Tickets', desc: 'How to safely buy official tickets, categories, prices, and how to avoid scams.', Icon: Ticket, color: 'blue' },
    { href: '/en/fan/seguridad', title: 'Safety & Insurance', desc: 'Safety tips, recommended travel insurance, and emergency numbers in each country.', Icon: Shield, color: 'green' },
  ],
}

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-700' },
}

export default async function FanPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const contentLocale = toContentLocale(lang) as Locale
  const dict = await getDictionary(lang as Locale)

  const breadcrumbs = generateBreadcrumbs(`/${lang}/fan`, contentLocale, dict.breadcrumbs)
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  const sections = fanSections[contentLocale] ?? fanSections.es
  const title = contentLocale === 'es' ? 'Experiencia Fan: Mundial 2026' : 'Fan Experience: World Cup 2026'
  const intro = contentLocale === 'es'
    ? 'Todo lo que necesitas saber como fan para disfrutar el Mundial 2026: desde comprar entradas seguras hasta proteger tu salud y seguridad durante el torneo.'
    : 'Everything you need to know as a fan to enjoy the 2026 World Cup: from buying safe tickets to protecting your health and safety during the tournament.'

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
            <Users className="h-6 w-6 text-primary" />
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
                    {contentLocale === 'es' ? 'Leer guía' : 'Read guide'}
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
