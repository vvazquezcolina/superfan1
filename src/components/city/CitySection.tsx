import type { CitySection as CitySectionType, Locale } from '@/lib/content/schemas'

interface CitySectionProps {
  section: CitySectionType
  lang: Locale
  id: string
  titleOverride?: string
}

export function CitySection({ section, lang, id, titleOverride }: CitySectionProps) {
  const paragraphs = section.content[lang].split('\n\n').filter(Boolean)

  return (
    <section id={id} className="mx-auto max-w-prose scroll-mt-20">
      <h2 className="text-2xl font-bold md:text-3xl">
        {titleOverride || section.title[lang]}
      </h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
