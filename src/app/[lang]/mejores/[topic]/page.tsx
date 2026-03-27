import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getListicle, getListicleSlugs } from '@/lib/content/programmatic'
import { getCityById } from '@/lib/content/cities'
import { getStadiumById } from '@/lib/content/stadiums'
import { getDictionary, hasLocale } from '@/app/[lang]/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { buildArticleJsonLd, buildItemListJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/content/schemas'
import { toContentLocale } from '@/lib/content/locale'

const SITE_URL = 'https://www.superfaninfo.com'

export async function generateStaticParams() {
  return getListicleSlugs().map(({ topic, lang }) => ({ lang, topic }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>
}): Promise<Metadata> {
  const { lang, topic } = await params
  if (!hasLocale(lang)) return {}
  const listicle = getListicle(topic)
  if (!listicle) return {}

  const contentLocale: Locale = toContentLocale(lang)

  return buildPageMetadata({
    title: listicle.title[contentLocale],
    description: listicle.description[contentLocale],
    lang: contentLocale,
    path: `/${lang}/mejores/${topic}`,
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/mejores/${listicle.slug}`,
        en: `${SITE_URL}/en/mejores/${listicle.slug}`,
        'x-default': `${SITE_URL}/es/mejores/${listicle.slug}`,
      },
    },
  })
}

function getMedalIcon(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}.`
}

export default async function ListiclePage({
  params,
}: {
  params: Promise<{ lang: string; topic: string }>
}) {
  const { lang, topic } = await params
  if (!hasLocale(lang)) notFound()
  const listicle = getListicle(topic)
  if (!listicle) notFound()

  const locale = lang as import('@/app/[lang]/dictionaries').Locale
  const contentLocale: Locale = toContentLocale(lang)

  const dict = await getDictionary(locale)
  const canonicalUrl = `${SITE_URL}/${lang}/mejores/${listicle.slug}`

  const breadcrumbs = generateBreadcrumbs(
    `/${lang}/mejores/${listicle.slug}`,
    contentLocale,
    dict.breadcrumbs,
    listicle.title[contentLocale],
  )

  // Resolve entity names and URLs for each item
  const resolvedItems = listicle.items.map((item) => {
    if (item.type === 'city') {
      const city = getCityById(item.entityId)
      return {
        rank: item.rank,
        name: city?.name[contentLocale] ?? item.entityId,
        url: city
          ? `/${lang}/${contentLocale === 'es' ? 'ciudades' : 'cities'}/${city.slugs[contentLocale]}`
          : null,
        value: item.value,
        unit: item.unit,
        note: item.note?.[contentLocale],
        type: 'city' as const,
      }
    } else {
      const stadium = getStadiumById(item.entityId)
      return {
        rank: item.rank,
        name: stadium?.name[contentLocale] ?? item.entityId,
        url: stadium
          ? `/${lang}/${contentLocale === 'es' ? 'estadios' : 'stadiums'}/${stadium.slugs[contentLocale]}`
          : null,
        value: item.value,
        unit: item.unit,
        note: item.note?.[contentLocale],
        type: 'stadium' as const,
      }
    }
  })

  const articleJsonLd = buildArticleJsonLd({
    headline: listicle.title[contentLocale],
    description: listicle.description[contentLocale],
    url: canonicalUrl,
    dateModified: listicle.lastUpdated,
    lang: contentLocale,
  })

  const itemListJsonLd = buildItemListJsonLd(
    resolvedItems.map((item) => ({
      name: item.name,
      url: item.url ? `${SITE_URL}${item.url}` : canonicalUrl,
    })),
    contentLocale,
  )

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <article className="mx-auto max-w-4xl space-y-12 py-6">
        {/* Hero */}
        <header className="space-y-4">
          <h1 className="text-3xl font-bold md:text-4xl">{listicle.title[contentLocale]}</h1>
          <p className="text-lg text-muted-foreground">{listicle.description[contentLocale]}</p>
        </header>

        {/* Ranked list */}
        <section>
          <ol className="space-y-4">
            {resolvedItems.map((item) => (
              <li
                key={item.rank}
                className={`rounded-lg border p-5 transition-colors hover:bg-muted/20 ${
                  item.rank <= 3
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank badge */}
                  <div className="flex-shrink-0 w-10 text-center">
                    {item.rank <= 3 ? (
                      <span className="text-2xl" role="img" aria-label={`Posicion ${item.rank}`}>
                        {getMedalIcon(item.rank)}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">
                        {item.rank}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h2 className="text-lg font-bold">
                        {item.url ? (
                          <Link href={item.url} className="hover:text-primary hover:underline">
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h2>
                      <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold whitespace-nowrap">
                        {item.value} {item.unit}
                      </span>
                    </div>
                    {item.note && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.note}
                      </p>
                    )}
                    {item.url && (
                      <Link
                        href={item.url}
                        className="mt-2 inline-block text-xs text-primary underline"
                      >
                        {item.type === 'city'
                          ? contentLocale === 'es'
                            ? `Ver guia de ${item.name}`
                            : `View ${item.name} guide`
                          : contentLocale === 'es'
                            ? `Ver guia del estadio`
                            : `View stadium guide`}
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Related listicles link block */}
        <section className="rounded-lg bg-muted/20 p-6">
          <h3 className="font-bold mb-3">
            {contentLocale === 'es' ? 'Mas rankings del Mundial 2026' : 'More World Cup 2026 Rankings'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={`/${lang}/${contentLocale === 'es' ? 'ciudades' : 'cities'}`}
                className="text-primary underline"
              >
                {contentLocale === 'es'
                  ? 'Guias completas de las 16 ciudades sede'
                  : 'Complete guides to all 16 host cities'}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/${contentLocale === 'es' ? 'estadios' : 'stadiums'}`}
                className="text-primary underline"
              >
                {contentLocale === 'es'
                  ? 'Guias de los 16 estadios del Mundial'
                  : 'Guides to all 16 World Cup stadiums'}
              </Link>
            </li>
          </ul>
        </section>

        <footer className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {contentLocale === 'es' ? 'Datos actualizados: ' : 'Data updated: '}
            {listicle.lastUpdated}
            {' | '}
            {contentLocale === 'es'
              ? 'Este sitio no esta afiliado con la FIFA. Los rankings son editoriales independientes.'
              : 'This site is not affiliated with FIFA. Rankings are independent editorial content.'}
          </p>
        </footer>
      </article>
    </>
  )
}
