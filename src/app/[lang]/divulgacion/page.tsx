import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  return [{ lang: 'es' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Divulgacion de Afiliados',
    description:
      'Informacion sobre como usamos enlaces de afiliados en SuperFan Mundial 2026 para financiar el sitio, sin costo adicional para ti.',
    lang: 'es',
    path: '/es/divulgacion',
    alternates: {
      languages: {
        'es-419': 'https://www.superfaninfo.com/es/divulgacion',
        en: 'https://www.superfaninfo.com/en/disclosure',
        'x-default': 'https://www.superfaninfo.com/es/divulgacion',
      },
    },
  })
}

export default function DivulgacionPage() {
  return (
    <article className="mx-auto max-w-prose space-y-10 py-8">
      <header>
        <h1 className="text-3xl font-bold md:text-4xl">
          Divulgacion de Afiliados
        </h1>
        <p className="mt-3 text-muted">
          Ultima actualizacion: marzo 2026
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold">Como nos financiamos</h2>
        <p className="mt-3 leading-relaxed">
          SuperFan Mundial 2026 es un sitio independiente creado para ayudar a los
          aficionados latinoamericanos a planificar su experiencia en el Mundial
          2026. El sitio es gratuito para todos los visitantes. Para cubrir los
          costos de operacion y seguir creando contenido de calidad, utilizamos
          programas de afiliados con socios de viaje seleccionados.
        </p>
        <p className="mt-3 leading-relaxed">
          Algunos de los enlaces en este sitio son enlaces de afiliados. Esto
          significa que si haces clic y realizas una compra, podemos recibir una
          pequeña comision sin costo adicional para ti. Estas comisiones nos
          ayudan a mantener este sitio y seguir creando contenido gratuito de
          calidad.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Que son los enlaces de afiliados?</h2>
        <p className="mt-3 leading-relaxed">
          Un enlace de afiliado es un URL especial que contiene un identificador
          unico. Cuando haces clic en uno de estos enlaces y completas una compra
          o reserva en el sitio del socio, ese identificador le indica al socio
          que la visita provino de SuperFan. El precio que pagas es exactamente
          el mismo que si accedieras directamente al sitio del socio -- no hay
          recargo ni costo adicional para ti.
        </p>
        <p className="mt-3 leading-relaxed">
          Todos los enlaces de afiliados en este sitio estan marcados con el
          atributo <code>rel=&quot;sponsored&quot;</code> de acuerdo con las
          directrices de Google, y siempre aparece una nota de divulgacion
          visible junto al enlace.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Nuestros socios</h2>
        <ul className="mt-3 space-y-4">
          <li className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Booking.com</h3>
            <p className="mt-1 text-sm leading-relaxed">
              Programa de afiliados de Booking.com. Cuando reservas un hotel a
              traves de nuestros enlaces, Booking.com nos paga una comision por
              la referencia. Tu precio es identico al que encontrarias en
              Booking.com directamente.
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
              Red de afiliados Travelpayouts. Cuando reservas vuelos, hoteles u
              otros productos de viaje a traves de nuestros enlaces de
              Travelpayouts, podemos recibir una comision por la referencia. Tu
              precio es identico al que encontrarias directamente en el sitio
              del socio.
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
        <h2 className="text-xl font-semibold">Nuestra promesa</h2>
        <p className="mt-3 leading-relaxed">
          Nuestra independencia editorial es nuestra prioridad. Las
          recomendaciones en este sitio se basan en la calidad del contenido y
          la relevancia para los aficionados del Mundial 2026, no en
          compensaciones economicas de los socios. Ningun socio paga para
          aparecer en nuestra guia ni para obtener una valoracion positiva. Si
          un enlace es de afiliado, siempre lo indicamos claramente.
        </p>
        <p className="mt-3 leading-relaxed">
          Nos comprometemos a:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed">
          <li>Marcar siempre los enlaces de afiliados con texto de divulgacion visible.</li>
          <li>No modificar nuestras recomendaciones editoriales por razones comerciales.</li>
          <li>No aceptar pagos por posicionamiento o reseñas favorables.</li>
          <li>Actualizar este documento cuando añadamos nuevos socios.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Contacto</h2>
        <p className="mt-3 leading-relaxed">
          Si tienes preguntas sobre nuestras politicas de afiliados o quieres
          reportar un enlace que no esta debidamente marcado, puedes contactarnos
          en:{' '}
          <a
            href="mailto:hola@superfaninfo.com"
            className="text-primary underline hover:text-primary/80"
          >
            hola@superfaninfo.com
          </a>
        </p>
      </section>
    </article>
  )
}
