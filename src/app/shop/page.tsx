"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, SlidersHorizontal, X, Check, Search } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ProductCard } from "@/components/product/product-card"
import { sampleProducts } from "@/data/sample-products"
import { sampleCategories } from "@/data/sample-categories"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/track-event"

const SHOP_HERO = "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=1400&q=80"
const ALL_CAT = "__all__"

const finishColors = [
  { name: "Walnut",   code: "#5b3a22" },
  { name: "White",    code: "#ece7de" },
  { name: "Grey Oak", code: "#8a8378" },
]

type SortKey = "featured" | "price-asc" | "price-desc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
]

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const current = SORT_OPTIONS.find((o) => o.value === value)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        style={{ touchAction: "manipulation" }}
        className="flex items-center gap-2 rounded-[9px] border border-border-strong bg-white px-3.5 py-2 font-body font-semibold text-[12.5px] text-slate transition-colors hover:border-forest/40"
      >
        {current.label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-sage transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* click-away overlay */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-full z-20 mt-1.5 min-w-[190px] overflow-hidden rounded-[12px] border border-border bg-white"
              style={{ boxShadow: "0 8px 30px -8px rgba(10,28,21,.22)" }}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-body font-semibold text-[13px] transition-colors",
                    opt.value === value
                      ? "bg-forest text-bone"
                      : "text-ink hover:bg-surface-sunken"
                  )}
                >
                  {opt.label}
                  {opt.value === value && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ShopPage() {
  const [activeCat, setActiveCat]         = useState<string>(ALL_CAT)
  const [activeFinish, setActiveFinish]   = useState<string | null>(null)
  const [sort, setSort]                   = useState<SortKey>("featured")
  const [mobileFilters, setMobileFilters] = useState(false)
  const [query, setQuery]                 = useState("")

  let filtered = activeCat === ALL_CAT
    ? sampleProducts
    : sampleProducts.filter((p) => p.category.slug === activeCat)

  if (activeFinish) filtered = filtered.filter((p) => p.finishes.some((f) => f.name === activeFinish))

  const trimmedQuery = query.trim().toLowerCase()
  if (trimmedQuery) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(trimmedQuery) || p.category.name.toLowerCase().includes(trimmedQuery)
    )
  }

  if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice))
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice))
  if (sort === "featured")   filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  // Debounced search tracking — fires once typing settles, not per keystroke.
  useEffect(() => {
    if (!trimmedQuery) return
    const timer = setTimeout(() => {
      trackEvent("search", { term: trimmedQuery, resultCount: filtered.length })
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedQuery])

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
        <Image
          src={SHOP_HERO}
          alt="The collection"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg,rgba(10,28,21,.9) 0%,rgba(22,53,42,.75) 55%,rgba(22,53,42,.45) 100%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono uppercase text-gold" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>All products</p>
              <h1
                className="mt-1 font-heading font-black text-bone"
                style={{ fontSize: "clamp(26px,4vw,38px)", letterSpacing: "-0.8px" }}
              >
                The collection
              </h1>
            </div>
            <p className="hidden font-mono text-[11px] text-bone/50 lg:block">
              {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">

        {/* ── Search ── */}
        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sage" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beds, wardrobes, dressing tables…"
            className="search-input-shell w-full rounded-[11px] border border-border-strong bg-white py-3 pl-10 pr-9 text-[13.5px] text-ink placeholder:text-sage/60 transition-colors focus:border-forest"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Mobile filter bar ── */}
        <div className="flex items-center gap-2 border-b border-border py-3 lg:hidden">
          <div className="relative flex min-w-0 flex-1">
            <div
              className="flex gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              {[{ slug: ALL_CAT, name: "All" }, ...sampleCategories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCat(cat.slug)}
                  style={{ touchAction: "manipulation" }}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 font-body font-semibold text-[12px] transition-colors",
                    cat.slug === activeCat
                      ? "border-forest bg-forest text-bone"
                      : "border-border-strong bg-white text-slate"
                  )}
                >
                  {cat.name}
                </button>
              ))}
              <div className="w-4 shrink-0" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" />
          </div>

          {/* Filter icon — opens drawer */}
          <button
            onClick={() => setMobileFilters(true)}
            style={{ touchAction: "manipulation" }}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
              (activeFinish || sort !== "featured")
                ? "border-forest bg-forest text-bone"
                : "border-border-strong bg-white text-slate"
            )}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-10 py-8">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <p className="mb-2 font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-sage">Category</p>
            <div className="flex flex-col gap-0.5">
              {[{ slug: ALL_CAT, name: "All" }, ...sampleCategories].map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCat(cat.slug)}
                  className={cn(
                    "rounded-[9px] px-3 py-2 text-left font-body font-semibold text-[13.5px] transition-colors",
                    cat.slug === activeCat ? "bg-forest text-bone" : "text-slate hover:bg-surface-sunken"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <p className="mb-2.5 mt-7 font-heading text-[10.5px] font-bold uppercase tracking-[2px] text-sage">Finish</p>
            <div className="flex gap-2.5">
              {finishColors.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFinish(activeFinish === f.name ? null : f.name)}
                  className={cn(
                    "relative h-7 w-7 rounded-full border transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold",
                    activeFinish === f.name ? "border-forest ring-2 ring-forest/40 scale-110" : "border-black/12"
                  )}
                  style={{ background: f.code }}
                  title={f.name}
                  aria-label={f.name}
                />
              ))}
            </div>
          </aside>

          {/* ── Main grid ── */}
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-mono text-[11px] text-sage">
                {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
              </p>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-heading font-bold text-[18px] text-ink">
                  {trimmedQuery ? `No results for "${query.trim()}"` : "No products in this category"}
                </p>
                <p className="mt-2 text-[13px] text-slate">Try a different filter or browse all products.</p>
                <button
                  onClick={() => { setActiveCat(ALL_CAT); setQuery("") }}
                  className="mt-5 rounded-[10px] bg-forest px-6 py-3 font-heading font-bold text-[13.5px] text-bone"
                >
                  Show all
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              key="filter-backdrop"
              className="fixed inset-0 z-[80]"
              style={{ background: "rgba(10,28,21,.52)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileFilters(false)}
            />

            {/* Sheet */}
            <motion.div
              key="filter-sheet"
              className="fixed inset-x-0 bottom-0 z-[81] overflow-hidden rounded-t-[20px] bg-white"
              style={{ maxHeight: "88dvh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 38, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pb-1 pt-3">
                <div className="h-1 w-10 rounded-full bg-border-strong" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 pt-2">
                <h2 className="font-heading font-black text-[20px] text-ink" style={{ letterSpacing: "-0.4px" }}>
                  Filters
                </h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-sunken text-slate transition-colors hover:bg-border"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(88dvh - 140px)" }}>
                {/* Category */}
                <div className="px-5 pb-5">
                  <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[2px] text-sage">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ slug: ALL_CAT, name: "All" }, ...sampleCategories].map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setActiveCat(cat.slug)}
                        style={{ touchAction: "manipulation" }}
                        className={cn(
                          "rounded-full border px-4 py-2 font-body font-semibold text-[13px] transition-colors",
                          cat.slug === activeCat
                            ? "border-forest bg-forest text-bone"
                            : "border-border-strong bg-white text-slate"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finish */}
                <div className="border-t border-border px-5 py-5">
                  <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[2px] text-sage">Finish</p>
                  <div className="flex gap-4">
                    {finishColors.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setActiveFinish(activeFinish === f.name ? null : f.name)}
                        style={{ touchAction: "manipulation" }}
                        className="flex flex-col items-center gap-1.5"
                        aria-label={f.name}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full border-2 transition-all",
                            activeFinish === f.name
                              ? "border-forest ring-2 ring-forest/30 scale-110"
                              : "border-transparent ring-1 ring-black/10"
                          )}
                          style={{ background: f.code }}
                        />
                        <span className={cn(
                          "font-mono text-[9px]",
                          activeFinish === f.name ? "text-forest font-bold" : "text-sage"
                        )}>
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="border-t border-border px-5 py-5">
                  <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[2px] text-sage">Sort by</p>
                  <div className="flex flex-col gap-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSort(opt.value)}
                        style={{ touchAction: "manipulation" }}
                        className={cn(
                          "flex items-center justify-between rounded-[10px] px-4 py-3 text-left font-body font-semibold text-[13.5px] transition-colors",
                          opt.value === sort
                            ? "bg-forest text-bone"
                            : "text-ink hover:bg-surface-sunken"
                        )}
                      >
                        {opt.label}
                        {opt.value === sort && (
                          <Check className="h-4 w-4 shrink-0 stroke-gold" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Done button */}
              <div className="border-t border-border px-5 pb-8 pt-4">
                <button
                  onClick={() => setMobileFilters(false)}
                  style={{ touchAction: "manipulation" }}
                  className="w-full rounded-[12px] bg-forest py-4 font-heading font-black text-[15px] text-bone shadow-[0_6px_20px_-8px_rgba(22,53,42,.45)] transition-colors hover:bg-forest/90"
                >
                  Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
