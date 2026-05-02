import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['es', 'en', 'pt', 'fr', 'de', 'ar']
const defaultLocale = 'es'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

/**
 * Paths that should never be redirected to a locale prefix. These are
 * verification files, robots-readable assets, or static files served
 * directly from public/. Checked at the top of the middleware function
 * because matcher-level negative lookahead doesn't reliably handle the
 * regex syntax for our cases.
 */
function isStaticAssetPath(pathname: string): boolean {
  // Verification files at root
  if (pathname.startsWith('/google') && pathname.endsWith('.html')) return true
  // IndexNow / search engine keys
  if (/^\/[a-f0-9]{20,}\.txt$/i.test(pathname)) return true
  // Common bare-root files
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/ads.txt' ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest'
  ) {
    return true
  }
  // Generic static file extensions
  if (/\.(txt|xml|json|html|webmanifest|ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|otf|js|css|map)$/i.test(pathname)) {
    return true
  }
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bail early for static / verification assets — never redirect them.
  if (isStaticAssetPath(pathname)) return

  // Check if pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  // Redirect to locale-prefixed path
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Match everything except _next and api routes. Static asset
    // exclusions are handled inside the function body for reliability.
    '/((?!_next|api).*)',
  ],
}
