'use client'

import { MessageCircle } from 'lucide-react'
import type { Locale } from '@/lib/content/schemas'

interface WhatsAppShareProps {
  url: string
  title: string
  lang: Locale
}

/**
 * WhatsApp share button — critical for LATAM distribution. WhatsApp is
 * how Spanish-speaking travelers actually share trip plans with friends,
 * so one tap from any city/match page opens a pre-filled chat.
 *
 * The click fires a GA event so we can measure whether shares are
 * actually generating referral traffic.
 */
export function WhatsAppShare({ url, title, lang }: WhatsAppShareProps) {
  const localeKey: 'es' | 'en' = lang === 'es' ? 'es' : 'en'
  const label =
    localeKey === 'es'
      ? 'Compartir en WhatsApp'
      : 'Share on WhatsApp'
  const text =
    localeKey === 'es'
      ? `${title} — SuperFan Mundial 2026\n${url}`
      : `${title} — SuperFan World Cup 2026\n${url}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(text)}`

  function handleClick() {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'share', {
        method: 'whatsapp',
        content_type: 'page',
        item_id: url,
      })
    }
  }

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1ebe57] transition-colors"
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {label}
    </a>
  )
}
