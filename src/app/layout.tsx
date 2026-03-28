import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.superfaninfo.com'),
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
