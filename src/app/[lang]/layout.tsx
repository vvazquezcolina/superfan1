import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'
import { buildHomeAlternates, SITE_URL } from '@/lib/i18n'
import '@/app/globals.css'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return {
    title: {
      default: dict.site.name,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.home.description,
    metadataBase: new URL(SITE_URL),
    alternates: buildHomeAlternates(),
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html lang={lang === 'es' ? 'es-419' : 'en'}>
      <body>{children}</body>
    </html>
  )
}
