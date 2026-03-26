'use client'

import type { ReactNode } from 'react'
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
    <span className="inline-flex flex-col">
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
      <span className="mt-1 text-xs italic text-muted">{disclosure}</span>
    </span>
  )
}
