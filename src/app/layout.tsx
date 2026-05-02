import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.superfaninfo.com'),
  manifest: '/manifest.webmanifest',
  // Google Search Console verification — kept here at the root metadata
  // so it propagates to every page response, not just /es/. Required for
  // Google to verify ownership and index the site at scale.
  verification: {
    google: 'L4RjOcqNwLB3nATvvEdEBN97hMf20FmaNVi4-MPQ8Rs',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
