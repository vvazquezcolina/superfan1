import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // English city routes -> Spanish filesystem paths
      { source: '/en/cities', destination: '/en/ciudades' },
      { source: '/en/cities/:slug', destination: '/en/ciudades/:slug' },
      // English stadium routes -> Spanish filesystem paths
      { source: '/en/stadiums', destination: '/en/estadios' },
      { source: '/en/stadiums/:slug', destination: '/en/estadios/:slug' },
      // English team routes -> Spanish filesystem paths
      { source: '/en/teams', destination: '/en/equipos' },
      { source: '/en/teams/:slug', destination: '/en/equipos/:slug' },
    ]
  },
}

export default nextConfig
