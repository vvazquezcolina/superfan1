import type { CitySection as SectionType, Locale } from '@/lib/content/schemas'

interface StadiumSectionProps {
  section: SectionType
  lang: Locale
  id: string
  titleOverride?: string
}

export function StadiumSection({ section, lang, id, titleOverride }: StadiumSectionProps) {
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
