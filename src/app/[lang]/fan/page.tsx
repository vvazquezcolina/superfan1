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
    { href: '/es/fan/entradas', title: 'Entradas', desc: 'Cómo comprar entradas oficiales de forma segura, categorías, precios y cómo evitar estafas.' },
    { href: '/es/fan/seguridad', title: 'Seguridad y Seguros', desc: 'Consejos de seguridad, seguros de viaje recomendados y números de emergencia en cada país.' },
  ],
  en: [
    { href: '/en/fan/entradas', title: 'Tickets', desc: 'How to safely buy official tickets, categories, prices, and how to avoid scams.' },
    { href: '/en/fan/seguridad', title: 'Safety & Insurance', desc: 'Safety tips, recommended travel insurance, and emergency numbers in each country.' },
  ],
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
