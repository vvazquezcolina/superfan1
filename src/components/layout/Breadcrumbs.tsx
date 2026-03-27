import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/lib/breadcrumbs'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 py-3 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {isLast ? (
                <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {isFirst && <Home className="h-3 w-3" />}
                    <span className="hidden sm:inline">{item.label}</span>
                    {isFirst && <span className="sm:hidden">{item.label}</span>}
                  </Link>
                  <ChevronRight className="mx-1 h-3 w-3 text-muted/40" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
