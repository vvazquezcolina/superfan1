'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Loader2 } from 'lucide-react'

interface SearchModalDict {
  label: string
  placeholder: string
  noResults: string
  loading: string
  notAvailableInDev: string
  closeLabel: string
}

interface SearchModalProps {
  dict: SearchModalDict
}

type PagefindResult = {
  url: string
  excerpt: string
  meta: { title: string }
}

// Inline Pagefind type declaration — no @types/pagefind needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PagefindModule = {
  init: () => Promise<void>
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResult> }> }>
}

let pagefindModule: PagefindModule | null = null
let pagefindLoadAttempted = false

export function SearchModal({ dict }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const [pagefindUnavailable, setPagefindUnavailable] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load Pagefind on first open
  useEffect(() => {
    if (!isOpen || pagefindLoadAttempted) return
    pagefindLoadAttempted = true

    async function loadPagefind() {
      try {
        // Dynamic import of pagefind JS generated at build time
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pf = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js' as any).catch(
          () => null,
        )
        if (pf) {
          await pf.init()
          pagefindModule = pf
          setPagefindLoaded(true)
        } else {
          setPagefindUnavailable(true)
        }
      } catch {
        setPagefindUnavailable(true)
      }
    }

    loadPagefind()
  }, [isOpen])

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!pagefindLoaded || !pagefindModule) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const searchResult = await pagefindModule!.search(query)
        const data = await Promise.all(searchResult.results.slice(0, 10).map((r) => r.data()))
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, pagefindLoaded])

  function handleClose() {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  function handleOpen() {
    setIsOpen(true)
  }

  const modal =
    isOpen && isMounted
      ? createPortal(
          <div
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose()
            }}
            role="dialog"
            aria-modal="true"
            aria-label={dict.label}
          >
            <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 mx-4">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={dict.placeholder}
                  className="flex-1 text-lg border-0 outline-none border-b border-border pb-1 bg-transparent"
                />
                <button
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
                  aria-label={dict.closeLabel}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto mt-4">
                {pagefindUnavailable && (
                  <p className="text-sm text-muted py-6 text-center">{dict.notAvailableInDev}</p>
                )}

                {!pagefindUnavailable && isLoading && (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm text-muted">{dict.loading}</p>
                  </div>
                )}

                {!pagefindUnavailable && !isLoading && query.trim() && results.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="mx-auto h-8 w-8 text-muted/30 mb-2" />
                    <p className="text-sm text-muted">
                      {dict.noResults} &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {results.map((result, index) => (
                      <li key={index}>
                        <a
                          href={result.url}
                          onClick={handleClose}
                          className="block rounded-xl px-4 py-3 hover:bg-primary/5 transition-colors"
                        >
                          <p className="font-semibold text-foreground">{result.meta.title}</p>
                          <p
                            className="text-sm text-muted mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Keyboard shortcut hint */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>ESC {dict.closeLabel.toLowerCase()}</span>
                <kbd className="rounded bg-muted/10 px-1.5 py-0.5 font-mono text-xs">Ctrl+K</kbd>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label={dict.label}
        className="flex items-center gap-1.5 text-white/90 hover:text-accent transition-colors p-1.5 rounded-md hover:bg-white/10"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline text-sm">{dict.label}</span>
      </button>
      {modal}
    </>
  )
}
