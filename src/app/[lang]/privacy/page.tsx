import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { SITE_URL } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Privacy Policy',
    description:
      'SuperFan World Cup 2026 privacy policy. How we collect, use, and protect your data.',
    lang: 'en',
    path: '/en/privacy',
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/privacidad`,
        en: `${SITE_URL}/en/privacy`,
        'x-default': `${SITE_URL}/es/privacidad`,
      },
    },
  })
}

export default function PrivacyPage() {
  const breadcrumbs = generateBreadcrumbs('/en/privacy', 'en', {
    home: 'Home',
    privacy: 'Privacy',
  }, 'Privacy Policy')

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
          <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-muted">Last updated: March 26, 2026</p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="leading-relaxed">
            We use Google Analytics 4 (GA4) to collect anonymous usage data: pages visited,
            time on site, device type, and approximate location. No personally identifiable
            information is collected through analytics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <p className="leading-relaxed">
            We use cookies for: analytics (GA4 -- _ga, _ga_* cookies), cookie consent
            preference (localStorage, not a cookie). You can manage cookie preferences through
            the consent banner or your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Affiliate Links</h2>
          <p className="leading-relaxed">
            When you click affiliate links (e.g., Booking.com), the affiliate partner may set
            their own cookies. We track affiliate clicks via GA4 events to understand which
            content is most useful. We do not share personal data with affiliate partners.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <p className="leading-relaxed">
            You can reject analytics cookies via the consent banner. You can clear cookies from
            your browser at any time. Under GDPR/CCPA, you have the right to know what data is
            collected (explained above). Contact us at{' '}
            <a
              href="mailto:info@superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              info@superfaninfo.com
            </a>{' '}
            for data inquiries.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Changes</h2>
          <p className="leading-relaxed">
            We may update this policy. Changes will be posted on this page with an updated
            date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="leading-relaxed">
            For any privacy inquiries, contact us at:{' '}
            <a
              href="mailto:info@superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              info@superfaninfo.com
            </a>
          </p>
        </section>
      </article>
    </>
  )
}
