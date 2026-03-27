import type { NextConfig } from 'next'

const SITE_URL = 'https://www.superfaninfo.com'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.pexels.com https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // Image optimization (sharp is installed as a peer dep by Next.js)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  // Enable compression
  compress: true,

  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Long-lived cache for Next.js static assets (immutable hashed files)
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 1-hour cache for HTML pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Long cache for public static files (images, fonts, etc.)
      {
        source: '/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      // English routes -> Spanish filesystem paths
      { source: '/en/cities', destination: '/en/ciudades' },
      { source: '/en/cities/:slug', destination: '/en/ciudades/:slug' },
      { source: '/en/stadiums', destination: '/en/estadios' },
      { source: '/en/stadiums/:slug', destination: '/en/estadios/:slug' },
      { source: '/en/teams', destination: '/en/equipos' },
      { source: '/en/teams/:slug', destination: '/en/equipos/:slug' },

      // Portuguese routes -> Spanish filesystem paths
      { source: '/pt/cidades', destination: '/pt/ciudades' },
      { source: '/pt/cidades/:slug', destination: '/pt/ciudades/:slug' },
      { source: '/pt/estadios', destination: '/pt/estadios' },
      { source: '/pt/estadios/:slug', destination: '/pt/estadios/:slug' },
      { source: '/pt/equipes', destination: '/pt/equipos' },
      { source: '/pt/equipes/:slug', destination: '/pt/equipos/:slug' },

      // French routes -> Spanish filesystem paths
      { source: '/fr/villes', destination: '/fr/ciudades' },
      { source: '/fr/villes/:slug', destination: '/fr/ciudades/:slug' },
      { source: '/fr/stades', destination: '/fr/estadios' },
      { source: '/fr/stades/:slug', destination: '/fr/estadios/:slug' },
      { source: '/fr/equipes', destination: '/fr/equipos' },
      { source: '/fr/equipes/:slug', destination: '/fr/equipos/:slug' },

      // German routes -> Spanish filesystem paths
      { source: '/de/staedte', destination: '/de/ciudades' },
      { source: '/de/staedte/:slug', destination: '/de/ciudades/:slug' },
      { source: '/de/stadien', destination: '/de/estadios' },
      { source: '/de/stadien/:slug', destination: '/de/estadios/:slug' },
      { source: '/de/teams', destination: '/de/equipos' },
      { source: '/de/teams/:slug', destination: '/de/equipos/:slug' },

      // Arabic routes -> Spanish filesystem paths (ASCII-safe transliterated paths)
      { source: '/ar/cities', destination: '/ar/ciudades' },
      { source: '/ar/cities/:slug', destination: '/ar/ciudades/:slug' },
      { source: '/ar/stadiums', destination: '/ar/estadios' },
      { source: '/ar/stadiums/:slug', destination: '/ar/estadios/:slug' },
      { source: '/ar/teams', destination: '/ar/equipos' },
      { source: '/ar/teams/:slug', destination: '/ar/equipos/:slug' },
    ]
  },

  // Redirect bare domain to canonical www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'superfaninfo.com' }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
