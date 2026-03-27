import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { SITE_URL } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'About SuperFan',
    description:
      'About SuperFan World Cup 2026: our mission, editorial independence, and team.',
    lang: 'en',
    path: '/en/about',
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/acerca`,
        en: `${SITE_URL}/en/about`,
        'x-default': `${SITE_URL}/es/acerca`,
      },
    },
  })
}

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbs('/en/about', 'en', {
    home: 'Home',
    about: 'About',
  }, 'About SuperFan')

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
          <h1 className="text-3xl font-bold md:text-4xl">About SuperFan World Cup 2026</h1>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="leading-relaxed">
            We are an independent guide to help Spanish-speaking football fans plan their World
            Cup 2026 experience across Mexico, the United States, and Canada. We provide
            comprehensive, verified information about host cities, stadiums, transport,
            accommodation, and cultural tips.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Editorial Independence</h2>
          <p className="leading-relaxed">
            Our recommendations are based on research and editorial judgment. While we use
            affiliate links to fund the site (see our{' '}
            <Link href="/en/disclosure" className="text-primary underline hover:text-primary/80">
              disclosure page
            </Link>
            ), affiliate partnerships never influence our content. We recommend options based
            on quality, value, and relevance to fans -- not commission rates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">How We Fund This Site</h2>
          <p className="leading-relaxed">
            This site is funded through affiliate commissions (primarily hotel bookings via
            Booking.com) and does not use display advertising. This allows us to keep the
            content free and ad-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">The Team</h2>
          <p className="leading-relaxed">
            SuperFan is a project by independent content creators passionate about making the
            World Cup accessible to Spanish-speaking fans worldwide.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="leading-relaxed">
            Email:{' '}
            <a
              href="mailto:info@superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              info@superfaninfo.com
            </a>
            <br />
            Website:{' '}
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
