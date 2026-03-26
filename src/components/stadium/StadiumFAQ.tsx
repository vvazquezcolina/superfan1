import type { CityFAQ as FAQType, Locale } from '@/lib/content/schemas'

interface StadiumFAQProps {
  faqs: FAQType[]
  lang: Locale
}

export function StadiumFAQ({ faqs, lang }: StadiumFAQProps) {
  const heading = lang === 'es' ? 'Preguntas frecuentes' : 'Frequently Asked Questions'

  return (
    <section className="mx-auto max-w-prose scroll-mt-20">
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
