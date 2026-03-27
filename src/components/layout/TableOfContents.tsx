'use client'

import { useState, useEffect } from 'react'
import { List, ChevronDown, ChevronUp } from 'lucide-react'

export interface TocItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TableOfContentsProps {
  items: TocItem[]
  title: string
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className="mx-auto max-w-prose rounded-xl border border-border bg-white p-4 shadow-sm">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted">
          <List className="h-4 w-4" />
          {title}
        </span>
        {isCollapsed ? (
          <ChevronDown className="h-4 w-4 text-muted" />
        ) : (
          <ChevronUp className="h-4 w-4 text-muted" />
        )}
      </button>
      {!isCollapsed && (
        <ol className="mt-3 space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary ${
                  activeId === item.id
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-muted'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(item.id)
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    setActiveId(item.id)
                  }
                }}
              >
                {item.icon}
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}
