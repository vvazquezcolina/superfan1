'use client'

import type { ReactNode } from 'react'
import { ExternalLink, Info } from 'lucide-react'
import { trackAffiliateClick } from '@/lib/analytics'

interface AffiliateLinkProps {
  href: string
  partner: string
  children: ReactNode
  citySlug?: string
  disclosure: string
  className?: string
}

/**
 * Client component for affiliate links with GA4 tracking and FTC disclosure.
 * Renders with rel="nofollow sponsored noopener" and visible disclosure text.
 */
export function AffiliateLink({
  href,
  partner,
  children,
  citySlug,
  disclosure,
  className,
}: AffiliateLinkProps) {
  const handleClick = () => {
    trackAffiliateClick(partner, href, citySlug)
  }

  return (
    <span className="inline-flex flex-col gap-1.5">
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className={className}
        onClick={handleClick}
      >
        {children}
        <ExternalLink className="ml-1.5 inline-block size-3.5 align-middle" aria-hidden="true" />
      </a>
      <span className="inline-flex items-start gap-1 text-xs italic text-muted">
        <Info className="mt-px size-3 shrink-0 opacity-60" aria-hidden="true" />
        {disclosure}
      </span>
    </span>
  )
}
