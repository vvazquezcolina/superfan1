import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HelpCircle, ChevronLeft } from 'lucide-react'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildFAQPageJsonLd, buildArticleJsonLd, buildJsonLdScript } from '@/lib/jsonld'
import { FlightPrices } from '@/components/affiliate/FlightPrices'
import { BookingWidget } from '@/components/affiliate/BookingWidget'
import { TravelInsurance } from '@/components/affiliate/TravelInsurance'
import { WhatsAppShare } from '@/components/engagement/WhatsAppShare'
import faqPagesJson from '@content/faq-pages.json'
import { getCityById } from '@/lib/content/cities'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'

export const revalidate = 86400

const SITE_URL = 'https://www.superfaninfo.com'

interface FaqPageSection {
  title: string
  body: string
}

interface FaqPageData {
  slug: string
  question: string
  shortAnswer: string
  sections: FaqPageSection[]
  showFlights: boolean
  showHotels: boolean
  showInsurance: boolean
  relatedCityId: string | null
}

const faqPages = (faqPagesJson as { pages: FaqPageData[] }).pages

function getFaqPage(slug: string): FaqPageData | undefined {
  return faqPages.find((p) => p.slug === slug)
}

export async function generateStaticParams() {
  return faqPages.flatMap((page) =>
    (['es', 'en'] as const).map((lang) => ({ lang, slug: page.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const page = getFaqPage(slug)
  if (!page) return {}
  const locale = lang as Locale

  const path = `/${lang}/respuestas/${slug}`
  return buildPageMetadata({
    title: page.question,
    description: page.shortAnswer.slice(0, 160),
    lang: locale,
    path,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/respuestas/${slug}`,
        en: `${SITE_URL}/en/respuestas/${slug}`,
        'x-default': `${SITE_URL}/es/respuestas/${slug}`,
      },
    },
  })
}

// Minimal markdown-to-jsx: supports **bold**, numbered lists, bullets, line breaks
function renderBody(body: string): React.ReactNode {
  const paragraphs = body.split('\n\n')
  return paragraphs.map((para, i) => {
    // Bullet list?
    if (para.split('\n').every((l) => l.trim().startsWith('- '))) {
      const items = para.split('\n').map((l) => l.replace(/^- /, ''))
      return (
        <ul key={i} className="mt-3 list-disc space-y-1.5 pl-6 text-foreground">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ul>
      )
    }
    // Numbered list?
    if (para.split('\n').every((l) => /^\d+\. /.test(l.trim()))) {
      const items = para.split('\n').map((l) => l.replace(/^\d+\. /, ''))
      return (
        <ol key={i} className="mt-3 list-decimal space-y-1.5 pl-6 text-foreground">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ol>
      )
    }
    return (
      <p
        key={i}
        className="mt-3 leading-relaxed text-foreground"
        dangerouslySetInnerHTML={{ __html: inlineMd(para) }}
      />
    )
  })
}

function inlineMd(text: string): string {
  // Escape HTML first
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export default async function FaqAnswerPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const page = getFaqPage(slug)
  if (!page) notFound()

  const locale = lang as Locale
  const contentLocale = toContentLocale(lang)
  const dict = await getDictionary(locale)

  const canonicalUrl = `${SITE_URL}/${lang}/respuestas/${slug}`
  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/respuestas/${slug}`,
    contentLocale,
    dict.breadcrumbs,
    page.question,
  )
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)
  const faqJsonLd = buildFAQPageJsonLd(
    [{ question: { es: page.question, en: page.question }, answer: { es: page.shortAnswer, en: page.shortAnswer } }],
    contentLocale,
  )
  const articleJsonLd = buildArticleJsonLd({
    headline: page.question,
    description: page.shortAnswer.slice(0, 160),
    url: canonicalUrl,
    dateModified: new Date().toISOString().slice(0, 10),
    lang: contentLocale,
  })

  const relatedCity = page.relatedCityId ? getCityById(page.relatedCityId) : null

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

      <article className="mx-auto max-w-3xl space-y-8 py-6">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <HelpCircle className="size-3.5" aria-hidden="true" />
            {contentLocale === 'es' ? 'Respuesta rápida' : 'Quick answer'}
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {page.question}
          </h1>
        </header>

        {/* Direct answer — optimized for LLM citation and Google Featured Snippets */}
        <section
          className="rounded-xl border-l-4 border-primary bg-primary/5 p-6"
          aria-label={contentLocale === 'es' ? 'Respuesta directa' : 'Direct answer'}
        >
          <p className="text-lg font-medium leading-relaxed">{page.shortAnswer}</p>
        </section>

        {/* Affiliate blocks — placed EARLY to maximize conversion from
            long-tail traffic. People searching long-tail questions have
            high intent and are ready to click. */}
        {page.showFlights && relatedCity && (
          <FlightPrices
            cityId={relatedCity.id}
            cityName={relatedCity.name[contentLocale]}
            lang={contentLocale}
          />
        )}
        {page.showHotels && relatedCity && (
          <BookingWidget
            cityName={relatedCity.name[contentLocale]}
            citySlug={relatedCity.slugs[contentLocale]}
            lang={contentLocale}
            dict={dict.affiliate}
          />
        )}
        {page.showInsurance && <TravelInsurance lang={contentLocale} />}

        {/* Detailed sections */}
        {page.sections.map((section, i) => (
          <section key={i} className="space-y-2">
            <h2 className="text-2xl font-bold">{section.title}</h2>
            {renderBody(section.body)}
          </section>
        ))}

        {/* WhatsApp share */}
        <div className="flex justify-center py-4">
          <WhatsAppShare url={canonicalUrl} title={page.question} lang={contentLocale} />
        </div>

        <footer className="border-t border-border pt-6">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ChevronLeft className="size-4" />
            {contentLocale === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
        </footer>
      </article>
    </>
  )
}
