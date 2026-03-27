import { HelpCircle, ChevronRight } from 'lucide-react'
import type { CityFAQ as FAQType, Locale } from '@/lib/content/schemas'

interface StadiumFAQProps {
  faqs: FAQType[]
  lang: Locale
}

export function StadiumFAQ({ faqs, lang }: StadiumFAQProps) {
  const heading = lang === 'es' ? 'Preguntas frecuentes' : 'Frequently Asked Questions'

  return (
    <section className="mx-auto max-w-prose scroll-mt-20">
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
