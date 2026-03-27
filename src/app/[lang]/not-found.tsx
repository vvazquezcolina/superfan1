import Link from 'next/link'

// Note: not-found.tsx cannot access params directly in Next.js 16.
// Use a simple bilingual fallback.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <p className="text-7xl font-extrabold text-primary/20">404</p>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">
        Pagina no encontrada
      </h1>
      <p className="mt-2 text-lg text-muted">
        La pagina que buscas no existe o fue movida.
      </p>
      <p className="mt-1 text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/es"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          Ir al inicio (ES)
        </Link>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          Go to Home (EN)
        </Link>
      </div>
    </div>
  )
}
