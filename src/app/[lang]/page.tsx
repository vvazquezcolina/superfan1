import { getDictionary, hasLocale } from './dictionaries'
import { notFound } from 'next/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main>
      <h1>{dict.home.heading}</h1>
      <p>{dict.home.subheading}</p>
    </main>
  )
}
