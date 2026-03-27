import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuide } from '@/lib/content/guides'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { buildArticleJsonLd, buildFAQPageJsonLd, buildJsonLdScript } from '@/lib/jsonld'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CitySection } from '@/components/city/CitySection'
import type { Locale, GuideFAQ } from '@/lib/content/schemas'

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
  const guide = getGuide('visa-entrada')
  if (!guide) return {}

  const path =
    locale === 'es' ? '/es/viajes/visa' : '/en/travel/entry-requirements'
  return buildPageMetadata({
    title: guide.title[locale],
    description: guide.description[locale],
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/viajes/visa`,
        en: `${SITE_URL}/en/travel/entry-requirements`,
        'x-default': `${SITE_URL}/es/viajes/visa`,
      },
    },
  })
}

export default async function VisaPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale

  const guide = getGuide('visa-entrada')
  if (!guide) notFound()

  const dict = await getDictionary(locale)
  const path =
    locale === 'es' ? `/${lang}/viajes/visa` : `/${lang}/travel/entry-requirements`
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
  const backLabel = locale === 'es' ? 'Ver guias de viaje' : 'View travel guides'
  const indexPath = locale === 'es' ? `/${lang}/viajes` : `/${lang}/travel`

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
          <h1 className="text-3xl font-bold md:text-4xl">{guide.title[locale]}</h1>
        </header>

        {/* Prominent quick-answer info box (per D-05 LLM optimization) */}
        <section className="rounded-lg border-l-4 border-primary bg-primary/5 p-6 mx-auto max-w-prose">
          <p className="font-semibold">{locale === 'es' ? 'Respuesta rapida' : 'Quick Answer'}</p>
          <p className="mt-2 leading-relaxed">{guide.overview[locale].split('\n\n')[0]}</p>
        </section>

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
                <summary className="cursor-pointer font-semibold leading-relaxed hover:text-primary">
                  {faq.question[locale]}
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
          <a
            href={indexPath}
            className="mt-4 inline-block text-primary underline hover:text-primary/80"
          >
            {backLabel}
          </a>
        </footer>
      </article>
    </>
  )
}
