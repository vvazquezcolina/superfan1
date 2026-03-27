import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuide } from '@/lib/content/guides'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildArticleJsonLd, buildFAQPageJsonLd, buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CitySection } from '@/components/city/CitySection'
import { AffiliateLink } from '@/components/affiliate/AffiliateLink'
import type { Locale, GuideFAQ } from '@/lib/content/schemas'
import { Shield, ShieldCheck, ArrowLeft, ChevronDown } from 'lucide-react'

export const revalidate = 86400

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const locale = lang as Locale
  const guide = getGuide('seguridad-viaje')
  if (!guide) return {}

  const path = locale === 'es' ? '/es/fan/seguridad' : '/en/fan/safety'
  return buildPageMetadata({
    title: guide.title[locale],
    description: guide.description[locale],
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/fan/seguridad`,
        en: `${SITE_URL}/en/fan/safety`,
        'x-default': `${SITE_URL}/es/fan/seguridad`,
      },
    },
  })
}

export default async function SeguridadPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const guide = getGuide('seguridad-viaje')
  if (!guide) notFound()

  const dict = await getDictionary(locale)
  const path = locale === 'es' ? `/${lang}/fan/seguridad` : `/${lang}/fan/safety`
  const canonicalUrl = `${SITE_URL}${path}`

  const breadcrumbs = generateBreadcrumbs(path, locale, dict.breadcrumbs, guide.title[locale])
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const articleJsonLd = buildArticleJsonLd({
    headline: guide.title[locale],
    description: guide.description[locale],
    url: canonicalUrl,
    dateModified: guide.lastUpdated,
    lang: locale,
  })
  const faqJsonLd = buildFAQPageJsonLd(guide.faq as GuideFAQ[], locale)

  const sourcesLabel = locale === 'es' ? 'Fuentes' : 'Sources'
  const lastUpdatedLabel = locale === 'es' ? 'Ultima actualizacion' : 'Last updated'
  const faqLabel = locale === 'es' ? 'Preguntas frecuentes' : 'Frequently Asked Questions'
  const backLabel = locale === 'es' ? 'Ver guias para aficionados' : 'View fan guides'
  const indexPath = locale === 'es' ? `/${lang}/fan` : `/${lang}/fan`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLdScript(faqJsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-12 py-6">
        <header className="mx-auto max-w-prose">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{guide.title[locale]}</h1>
          </div>
        </header>

        {/* Prominent quick-answer info box (per D-05 LLM optimization) */}
        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6 mx-auto max-w-prose">
          <p className="font-semibold">{locale === 'es' ? 'Respuesta rapida' : 'Quick Answer'}</p>
          <p className="mt-2 leading-relaxed">{guide.overview[locale].split('\n\n')[0]}</p>
        </section>

        {/* Travel insurance affiliate CTA (SafetyWing) */}
        {guide.affiliateCTAs.length > 0 && (
          <div className="mx-auto max-w-prose rounded-lg border border-green-200 bg-green-50 p-6 my-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-green-700 shrink-0" aria-hidden="true" />
              <p className="font-semibold text-sm text-green-800">
                {locale === 'es' ? 'Seguro de viaje recomendado' : 'Recommended travel insurance'}
              </p>
            </div>
            {guide.affiliateCTAs.map((cta) => (
              <AffiliateLink
                key={cta.partner}
                href={cta.url}
                partner={cta.partner}
                disclosure={cta.disclosure[locale]}
                className="inline-flex items-center gap-1 font-semibold text-green-700 hover:text-green-800 hover:underline transition-colors"
              >
                {cta.label[locale]} →
              </AffiliateLink>
            ))}
          </div>
        )}

        {/* Content sections */}
        {guide.sections.map((section, index) => (
          <CitySection
            key={index}
            section={section}
            lang={locale}
            id={`seccion-${index + 1}`}
          />
        ))}

        {/* FAQ */}
        <section className="mx-auto max-w-prose scroll-mt-20">
          <h2 className="text-2xl font-bold md:text-3xl">{faqLabel}</h2>
          <div className="mt-4 divide-y divide-border">
            {guide.faq.map((faq, index) => (
              <details key={index} className="group py-4">
                <summary className="flex cursor-pointer items-start justify-between gap-3 font-semibold leading-relaxed hover:text-primary">
                  <span>{faq.question[locale]}</span>
                  <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{faq.answer[locale]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section className="mx-auto max-w-prose">
          <h2 className="text-2xl font-bold md:text-3xl">{sourcesLabel}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {guide.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mx-auto max-w-prose border-t border-border pt-6">
          <p className="text-sm text-muted">
            {lastUpdatedLabel}: {guide.lastUpdated}
          </p>
          <Link
            href={indexPath}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        </footer>
      </article>
    </>
  )
}
