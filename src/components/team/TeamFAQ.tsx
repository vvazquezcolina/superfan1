import { HelpCircle, ChevronRight } from 'lucide-react'
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
      <h2 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
        <HelpCircle className="h-6 w-6 text-primary" />
        {heading}
      </h2>
      <div className="mt-4 space-y-3">
        {faqs.map((faq, index) => (
          <details key={index} className="group rounded-lg border border-border p-4 transition-colors open:bg-primary/5 open:border-primary/20">
            <summary className="cursor-pointer font-semibold leading-relaxed hover:text-primary list-none flex items-center justify-between gap-2">
              <span>{faq.question[lang]}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-90" />
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
