'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose()
            }}
            role="dialog"
            aria-modal="true"
            aria-label={dict.label}
          >
            <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl p-4 mx-4">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-muted flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
                  className="text-muted hover:text-foreground transition-colors p-1"
                  aria-label={dict.closeLabel}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto mt-4">
                {pagefindUnavailable && (
                  <p className="text-sm text-muted py-4 text-center">{dict.notAvailableInDev}</p>
                )}

                {!pagefindUnavailable && isLoading && (
                  <p className="text-sm text-muted py-4 text-center">{dict.loading}</p>
                )}

                {!pagefindUnavailable && !isLoading && query.trim() && results.length === 0 && (
                  <p className="text-sm text-muted py-4 text-center">
                    {dict.noResults} &ldquo;{query}&rdquo;
                  </p>
                )}

                {results.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {results.map((result, index) => (
                      <li key={index}>
                        <a
                          href={result.url}
                          onClick={handleClose}
                          className="block rounded-lg px-3 py-3 hover:bg-primary/5 transition-colors"
                        >
                          <p className="font-medium text-foreground">{result.meta.title}</p>
                          <p
                            className="text-sm text-muted mt-1"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
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
        className="text-white/90 hover:text-accent transition-colors p-1"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {modal}
    </>
  )
}
