import Link from 'next/link'
import { Plane, Hotel, ShieldCheck, Ticket, ArrowRight } from 'lucide-react'
import {
  buildEktaInsuranceUrl,
  buildGetYourGuideSearchUrl,
} from '@/lib/travelpayouts/partners'
import { AffiliateLink } from './AffiliateLink'
import type { Locale } from '@/lib/content/schemas'

interface HomeAffiliateBandProps {
  lang: Locale
}

/**
 * Homepage monetization band — 1 hero card (travel insurance, 25% commission,
 * highest reward in the partner mix) plus 3 quick-link cards that funnel
 * traffic into the high-conversion sections of the site (flights guide,
 * lodging guide, activities search).
 *
 * Placed between the host stadiums grid and the FAQ section. Visual
 * consistency with site primary palette so it doesn't look like an ad.
 */
export function HomeAffiliateBand({ lang }: HomeAffiliateBandProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'

  const sectionTitle =
    localeKey === 'es'
      ? 'Empieza a planear tu Mundial 2026'
      : 'Start planning your 2026 World Cup'
  const sectionSubtitle =
    localeKey === 'es'
      ? 'Vuelos, hospedaje, seguro y experiencias — todo en un solo lugar, con precios reales y reservables ahora.'
      : 'Flights, lodging, insurance, and experiences — all in one place, with real bookable prices.'

  const insuranceTitle =
    localeKey === 'es'
      ? 'Seguro de viaje desde $25 USD'
      : 'Travel insurance from $25 USD'
  const insuranceBody =
    localeKey === 'es'
      ? 'Cobertura médica internacional + cancelación. Requerido para muchos visados y altamente recomendado para el Mundial. Cotización en 2 minutos.'
      : 'International medical + cancellation coverage. Required for many visas and strongly recommended for the World Cup. Quote in 2 minutes.'
  const insuranceCta = localeKey === 'es' ? 'Cotizar ahora' : 'Get a quote'
  const insuranceDisclosure =
    localeKey === 'es'
      ? 'Enlace de afiliado (EKTA) — sin costo extra para ti.'
      : 'Affiliate link (EKTA) — no extra cost to you.'

  const quickLinks = [
    {
      icon: Plane,
      title: localeKey === 'es' ? 'Vuelos baratos al Mundial' : 'Cheap flights',
      body:
        localeKey === 'es'
          ? 'Precios en tiempo real desde MEX, MIA, MAD y BOG hacia las 16 sedes.'
          : 'Live prices from MEX, MIA, MAD and BOG to the 16 host cities.',
      href: localeKey === 'es' ? `/${lang}/viajes/vuelos` : `/${lang}/viajes/vuelos`,
      cta: localeKey === 'es' ? 'Ver vuelos' : 'View flights',
      external: false,
    },
    {
      icon: Hotel,
      title: localeKey === 'es' ? 'Hospedaje en las sedes' : 'Lodging at the host cities',
      body:
        localeKey === 'es'
          ? 'Guía de barrios, precios típicos y enlaces directos a Booking con fechas del Mundial.'
          : 'Neighborhood guide, typical prices, and direct Booking links with World Cup dates.',
      href: localeKey === 'es' ? `/${lang}/viajes/hospedaje` : `/${lang}/viajes/hospedaje`,
      cta: localeKey === 'es' ? 'Ver hospedaje' : 'View lodging',
      external: false,
    },
    {
      icon: Ticket,
      title:
        localeKey === 'es' ? 'Tours y experiencias' : 'Tours & experiences',
      body:
        localeKey === 'es'
          ? 'Aprovecha los días libres entre partidos. Reserva con cancelación gratis hasta 24 horas antes.'
          : 'Make the most of the free days between matches. Book with free cancellation up to 24h.',
      href: buildGetYourGuideSearchUrl(
        localeKey === 'es' ? 'Mundial 2026' : 'World Cup 2026',
        localeKey,
      ),
      cta: localeKey === 'es' ? 'Buscar tours' : 'Find tours',
      external: true,
    },
  ]

  return (
    <section className="mt-14 mx-auto max-w-6xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{sectionTitle}</h2>
        <p className="mt-3 max-w-2xl mx-auto text-base text-muted">
          {sectionSubtitle}
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* Hero insurance card spans 2 cols on lg */}
        <div className="lg:col-span-2 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
              <ShieldCheck className="size-6 text-cyan-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{insuranceTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {insuranceBody}
              </p>
              <div className="mt-4">
                <AffiliateLink
                  href={buildEktaInsuranceUrl(localeKey)}
                  partner="ekta"
                  disclosure={insuranceDisclosure}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-cyan-700"
                >
                  {insuranceCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </AffiliateLink>
              </div>
            </div>
          </div>
        </div>

        {/* First quick link in the third col on lg */}
        {quickLinks.slice(0, 1).map((link) => {
          const Icon = link.icon
          return (
            <div
              key={link.title}
              className="rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-base font-bold">{link.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{link.body}</p>
              <Link
                href={link.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {link.cta}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Remaining quick links full row */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {quickLinks.slice(1).map((link) => {
          const Icon = link.icon
          return (
            <div
              key={link.title}
              className="rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-base font-bold">{link.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{link.body}</p>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {link.cta}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {link.cta}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
