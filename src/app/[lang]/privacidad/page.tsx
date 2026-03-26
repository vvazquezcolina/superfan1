import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { generateBreadcrumbs, buildBreadcrumbJsonLd } from '@/lib/breadcrumbs'
import { SITE_URL } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'es' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Politica de Privacidad',
    description:
      'Politica de privacidad de SuperFan Mundial 2026. Como recopilamos, usamos y protegemos tus datos.',
    lang: 'es',
    path: '/es/privacidad',
    alternates: {
      languages: {
        'es-419': `${SITE_URL}/es/privacidad`,
        en: `${SITE_URL}/en/privacy`,
        'x-default': `${SITE_URL}/es/privacidad`,
      },
    },
  })
}

export default function PrivacidadPage() {
  const breadcrumbs = generateBreadcrumbs('/es/privacidad', 'es', {
    home: 'Inicio',
    privacidad: 'Privacidad',
  }, 'Politica de Privacidad')

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
          <h1 className="text-3xl font-bold md:text-4xl">Politica de Privacidad</h1>
          <p className="mt-3 text-muted">Ultima actualizacion: 26 de marzo de 2026</p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Informacion que Recopilamos</h2>
          <p className="leading-relaxed">
            Utilizamos Google Analytics 4 (GA4) para recopilar datos de uso anonimos: paginas
            visitadas, tiempo en el sitio, tipo de dispositivo y ubicacion aproximada. No se
            recopila informacion de identificacion personal a traves de las herramientas de
            analitica.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Cookies</h2>
          <p className="leading-relaxed">
            Utilizamos cookies para: analitica (GA4 -- cookies _ga, _ga_*), preferencia de
            consentimiento de cookies (localStorage, no es una cookie). Puedes gestionar las
            preferencias de cookies a traves del banner de consentimiento o de la configuracion
            de tu navegador.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Enlaces de Afiliados</h2>
          <p className="leading-relaxed">
            Cuando haces clic en enlaces de afiliados (por ejemplo, Booking.com), el socio
            afiliado puede establecer sus propias cookies. Rastreamos los clics en afiliados a
            traves de eventos de GA4 para entender que contenido es mas util. No compartimos
            datos personales con socios afiliados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Tus Derechos</h2>
          <p className="leading-relaxed">
            Puedes rechazar las cookies de analitica a traves del banner de consentimiento.
            Puedes borrar las cookies de tu navegador en cualquier momento. Bajo el GDPR/CCPA,
            tienes el derecho de saber que datos se recopilan (explicado anteriormente).
            Contacta con nosotros en{' '}
            <a
              href="mailto:info@superfaninfo.com"
              className="text-primary underline hover:text-primary/80"
            >
              info@superfaninfo.com
            </a>{' '}
            para consultas sobre datos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Cambios</h2>
          <p className="leading-relaxed">
            Podemos actualizar esta politica. Los cambios se publicaran en esta pagina con una
            fecha de actualizacion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contacto</h2>
          <p className="leading-relaxed">
            Para cualquier consulta sobre privacidad, contacta con nosotros en:{' '}
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
