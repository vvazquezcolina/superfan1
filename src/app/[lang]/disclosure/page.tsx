import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Affiliate Disclosure',
    description:
      'Information about how we use affiliate links at SuperFan World Cup 2026 to fund the site, at no additional cost to you.',
    lang: 'en',
    path: '/en/disclosure',
    alternates: {
      languages: {
        'es-419': 'https://www.superfaninfo.com/es/divulgacion',
        en: 'https://www.superfaninfo.com/en/disclosure',
        'x-default': 'https://www.superfaninfo.com/es/divulgacion',
      },
    },
  })
}

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-prose space-y-10 py-8">
      <header>
        <h1 className="text-3xl font-bold md:text-4xl">Affiliate Disclosure</h1>
        <p className="mt-3 text-muted">Last updated: March 2026</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold">How we fund this site</h2>
        <p className="mt-3 leading-relaxed">
          SuperFan World Cup 2026 is an independent site created to help Latin
          American football fans plan their experience at the 2026 World Cup. The
          site is free for all visitors. To cover operating costs and continue
          creating quality content, we participate in affiliate programs with
          selected travel partners.
        </p>
        <p className="mt-3 leading-relaxed">
          Some of the links on this site are affiliate links. This means that if
          you click through and make a purchase, we may receive a small
          commission at no additional cost to you. These commissions help us
          maintain this site and continue creating quality free content.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What are affiliate links?</h2>
        <p className="mt-3 leading-relaxed">
          An affiliate link is a special URL that contains a unique identifier.
          When you click one of these links and complete a purchase or booking on
          a partner&apos;s site, that identifier tells the partner the visit came
          from SuperFan. The price you pay is exactly the same as if you visited
          the partner&apos;s site directly -- there is no surcharge or additional
          cost to you.
        </p>
        <p className="mt-3 leading-relaxed">
          All affiliate links on this site are marked with the{' '}
          <code>rel=&quot;sponsored&quot;</code> attribute in accordance with
          Google&apos;s guidelines, and a visible disclosure note always appears
          adjacent to the link.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Our partners</h2>
        <ul className="mt-3 space-y-4">
          <li className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Booking.com</h3>
            <p className="mt-1 text-sm leading-relaxed">
              Booking.com affiliate program. When you book a hotel through our
              links, Booking.com pays us a referral commission. Your price is
              identical to what you would find on Booking.com directly.
            </p>
            <a
              href="https://www.booking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary underline"
            >
              booking.com
            </a>
          </li>
          <li className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Travelpayouts</h3>
            <p className="mt-1 text-sm leading-relaxed">
              Travelpayouts affiliate network. When you book flights, hotels, or
              other travel products through our Travelpayouts links, we may
              receive a referral commission. Your price is identical to what you
              would find on the partner&apos;s site directly.
            </p>
            <a
              href="https://www.travelpayouts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary underline"
            >
              travelpayouts.com
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Our commitment</h2>
        <p className="mt-3 leading-relaxed">
          Our editorial independence is our top priority. Recommendations on this
          site are based on content quality and relevance to 2026 World Cup fans,
          not financial compensation from partners. No partner pays to be
          featured in our guide or to receive a favorable review. If a link is an
          affiliate link, we always disclose it clearly.
        </p>
        <p className="mt-3 leading-relaxed">We commit to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed">
          <li>Always marking affiliate links with visible disclosure text.</li>
          <li>
            Not modifying our editorial recommendations for commercial reasons.
          </li>
          <li>Not accepting payment for placement or favorable reviews.</li>
          <li>Updating this document when we add new partners.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="mt-3 leading-relaxed">
          If you have questions about our affiliate policies or want to report a
          link that is not properly disclosed, you can contact us at:{' '}
          <a
            href="mailto:info@superfaninfo.com"
            className="text-primary underline hover:text-primary/80"
          >
            info@superfaninfo.com
          </a>
        </p>
      </section>
    </article>
  )
}
