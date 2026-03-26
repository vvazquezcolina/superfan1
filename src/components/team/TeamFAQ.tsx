import type { TeamFAQ as TeamFAQType, CityFAQ, Locale } from '@/lib/content/schemas'
import { buildFAQPageJsonLd } from '@/lib/jsonld'

interface TeamFAQProps {
  faqs: TeamFAQType[]
  lang: Locale
}

export function TeamFAQ({ faqs, lang }: TeamFAQProps) {
  const heading = lang === 'es' ? 'Preguntas frecuentes' : 'Frequently Asked Questions'
  // TeamFAQ has same shape as CityFAQ { question: LocalizedText, answer: LocalizedText }
  const faqJsonLd = buildFAQPageJsonLd(faqs as CityFAQ[], lang)

  return (
    <section className="mx-auto max-w-prose scroll-mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>
      <div className="mt-4 divide-y divide-border">
        {faqs.map((faq, index) => (
          <details key={index} className="group py-4">
            <summary className="cursor-pointer font-semibold leading-relaxed hover:text-primary">
              {faq.question[lang]}
            </summary>
            <p className="mt-3 leading-relaxed text-muted">
              {faq.answer[lang]}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
