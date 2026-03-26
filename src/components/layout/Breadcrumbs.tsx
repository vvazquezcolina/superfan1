import type { BreadcrumbItem } from '@/lib/breadcrumbs'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 py-2 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <a
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                  <span className="mx-1 text-muted/50">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
