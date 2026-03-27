import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.superfaninfo.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — full access
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/pagefind/',
          '/*.json$',
        ],
      },
      // Google — explicitly allow everything including JS/CSS for rendering
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/pagefind/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/pagefind/'],
      },
      // AI crawlers — explicitly allowed for LLM/AI discovery
      // Allowing these increases probability of being cited in AI answers
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'Omgilibot',
        allow: '/',
      },
      // Meta AI
      {
        userAgent: 'meta-externalagent',
        allow: '/',
      },
      // Apple
      {
        userAgent: 'Applebot',
        allow: '/',
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      // Aggressive/excessive crawlers — allow but slow down
      {
        userAgent: 'AhrefsBot',
        allow: '/',
        crawlDelay: 10,
      },
      {
        userAgent: 'SemrushBot',
        allow: '/',
        crawlDelay: 10,
      },
      {
        userAgent: 'MJ12bot',
        allow: '/',
        crawlDelay: 30,
      },
      {
        userAgent: 'DotBot',
        allow: '/',
        crawlDelay: 30,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
