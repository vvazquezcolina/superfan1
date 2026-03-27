import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SuperFan Mundial 2026',
    short_name: 'SuperFan',
    description:
      'La guia independiente mas completa en espanol para el Mundial de Futbol 2026 en Mexico, Estados Unidos y Canada.',
    start_url: '/es',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a472a',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es',
    categories: ['sports', 'travel', 'news'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  }
}
