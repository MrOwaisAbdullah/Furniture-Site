"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { sampleProducts } from "@/data/sample-products"
import Link from "next/link"

interface SearchInputProps {
  className?: string
  placeholder?: string
  onClose?: () => void
}

export function SearchInput({ className, placeholder = "Search sets, beds, wardrobes…", onClose }: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.length >= 2
    ? sampleProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : []

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="search-input-shell flex items-center gap-2 rounded-[12px] border border-border-strong bg-white px-4 shadow-sm transition-colors focus-within:border-forest">
        <Search className="h-4.5 w-4.5 shrink-0 stroke-sage" strokeWidth={2} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:outline-none focus-visible:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus() }} aria-label="Clear search">
            <X className="h-4 w-4 stroke-sage hover:stroke-ink transition-colors" />
          </button>
        )}
        {onClose && (
          <button onClick={onClose} aria-label="Close search" className="ml-1">
            <X className="h-4.5 w-4.5 stroke-sage hover:stroke-ink transition-colors" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query.length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-[13px] border border-border bg-white shadow-lg">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Search className="h-8 w-8 stroke-mist" strokeWidth={1.5} />
              <p className="text-[13px] text-sage">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[11.5px] text-mist">Try: beds, wardrobe, walnut</p>
            </div>
          ) : (
            <>
              {results.map((product, i) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  onClick={() => { setOpen(false); setQuery("") }}
                  className={`flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-[8px]"
                    style={{ background: "linear-gradient(150deg,#244C3C,#0c231b)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-[13.5px] text-ink truncate">{product.name}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] text-sage">{product.category.name}</p>
                  </div>
                  <p className="font-mono text-[13px] text-gold-700 shrink-0">{formatPrice(product.basePrice)}</p>
                </Link>
              ))}
              <div className="border-t border-border px-4 py-2.5">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="font-heading font-bold text-[12px] text-forest hover:underline"
                >
                  See all results for &ldquo;{query}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
