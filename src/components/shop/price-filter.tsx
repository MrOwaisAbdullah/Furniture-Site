"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { PRICE_RANGES as PRICE_BRACKETS } from "@/lib/price-ranges"
import { ProductCard } from "@/components/product/product-card"
import type { Product } from "@/types"

interface PriceFilterProps {
  products: Product[]
}

// "All Prices" is a UI-only bucket (no filter applied) — the real brackets
// come from the shared module so this filter and /shop/price never drift.
const PRICE_RANGES = [{ label: "All Prices", min: 0, max: Infinity }, ...PRICE_BRACKETS]

export function PriceFilter({ products }: PriceFilterProps) {
  const [selectedRange, setSelectedRange] = useState(0)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES[selectedRange]!
    return products.filter((p) => {
      const price = p.salePrice || p.basePrice
      return price >= range.min && price < range.max
    })
  }, [products, selectedRange])

  return (
    <div>
      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        className="mb-4 flex items-center gap-2 rounded-[10px] border border-border bg-white px-4 py-2.5 text-[13px] font-medium text-forest lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {PRICE_RANGES[selectedRange]?.label}
        {selectedRange !== 0 && (
          <X
            className="ml-1 h-3.5 w-3.5 text-sage"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedRange(0)
            }}
          />
        )}
      </button>

      {/* Desktop filter */}
      <div className="hidden lg:flex lg:items-center lg:gap-2">
        <SlidersHorizontal className="h-4 w-4 text-sage" />
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-sage">Price:</span>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setSelectedRange(i)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                selectedRange === i
                  ? "bg-forest text-bone"
                  : "border border-border text-slate hover:border-forest/30 hover:text-forest"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile filter dropdown */}
      {showMobileFilter && (
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={range.label}
              type="button"
              onClick={() => {
                setSelectedRange(i)
                setShowMobileFilter(false)
              }}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                selectedRange === i
                  ? "bg-forest text-bone"
                  : "border border-border text-slate hover:border-forest/30 hover:text-forest"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="mb-4 text-[11px] text-sage">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        {selectedRange !== 0 && (
          <button
            type="button"
            onClick={() => setSelectedRange(0)}
            className="ml-2 text-forest hover:underline"
          >
            Clear filter
          </button>
        )}
      </p>

      {/* Product grid — plain, uniform columns, same card used everywhere else on the site */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-heading font-bold text-[17px] text-ink">No products in this range</p>
          <p className="text-[13px] text-slate">Try a different price range or browse all products.</p>
          <button
            type="button"
            onClick={() => setSelectedRange(0)}
            className="mt-2 rounded-[10px] bg-forest px-5 py-3 font-heading font-bold text-[13.5px] text-bone"
          >
            Show all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
