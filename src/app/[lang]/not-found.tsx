// Note: not-found.tsx cannot access params directly in Next.js 16.
// Use a simple bilingual fallback.
export default function NotFound() {
  return (
    <main>
      <h1>Pagina no encontrada / Page not found</h1>
      <p>
        La pagina que buscas no existe. / The page you are looking for does not
        exist.
      </p>
    </main>
  )
}
