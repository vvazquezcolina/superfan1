import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'
import { buildHomeAlternates, SITE_URL } from '@/lib/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { CookieConsent } from '@/components/analytics/CookieConsent'
import { buildOrganizationJsonLd } from '@/lib/jsonld'
import type { Locale } from '@/lib/content/schemas'
import '@/app/globals.css'

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
  const dict = await getDictionary(lang)

  return {
    title: {
      default: dict.site.name,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.home.description,
    metadataBase: new URL(SITE_URL),
    alternates: buildHomeAlternates(),
    other: {
      // Preconnect hints expressed as metadata for crawlers
      'application-name': dict.site.name,
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const locale = lang as Locale
  const orgJsonLd = buildOrganizationJsonLd(locale)

  return (
    <html lang={lang === 'es' ? 'es-419' : 'en'}>
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.tp.st" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.tp.st" />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Organization JSON-LD on every page for brand authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header lang={lang} dict={dict} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <CookieConsent lang={lang} />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
