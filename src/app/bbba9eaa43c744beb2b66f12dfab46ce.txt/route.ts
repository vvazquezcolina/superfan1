/**
 * IndexNow verification key file.
 *
 * IndexNow (Bing / Yandex / etc.) requires the affiliate site to host a
 * text file at the root containing the same key that's POSTed to their
 * API. We serve it as a route handler instead of a static public/ file
 * because the locale-prefix middleware was catching the bare path.
 */
export const dynamic = 'force-static'

const KEY = 'bbba9eaa43c744beb2b66f12dfab46ce'

export function GET() {
  return new Response(KEY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
