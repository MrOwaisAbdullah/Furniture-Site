"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Check, Tag, ShoppingBag } from "lucide-react"
import type { Product } from "@/types"
import { formatPrice, cn } from "@/lib/utils"
import { discountForPieceCount, findBundleSku } from "@/lib/set-bundle"

interface SetBundlePickerProps {
  /** "anchor": the current product page — this piece is already being
   * bought, siblings are optional add-ons, default unselected.
   * "browse": the /sets/[set] page — no fixed anchor, every piece
   * defaults selected since the customer arrived to see the whole set. */
  mode: "anchor" | "browse"
  /** Only used in "anchor" mode — priced in but not itself toggleable. */
  anchorProduct?: Product
  /** Sibling pieces (anchor mode) or the full set group (browse mode). */
  pieces: Product[]
  /** Full catalog, for looking up a real pre-built bundle SKU. */
  pool: Product[]
  /** Called with exactly the toggled pieces (never the anchor) when the
   * customer confirms — the caller adds each as its own cart line. */
  onAddSelected: (pieces: Product[]) => void
}

function pieceCard(p: Product, selected: boolean, onToggle: () => void) {
  return (
    <button
      key={p._id}
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[12px] border-2 text-left transition-all",
        selected ? "border-forest" : "border-border hover:border-forest/30"
      )}
    >
      <div className="relative h-[100px] w-full bg-surface-sunken">
        {p.images[0] && (
          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="140px" />
        )}
        <div
          className={cn(
            "absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
            selected ? "border-forest bg-forest" : "border-white bg-white/70"
          )}
        >
          {selected && <Check className="h-3 w-3 text-bone" strokeWidth={3} />}
        </div>
      </div>
      <div className="px-2.5 py-2">
        <p className="font-heading font-bold text-[12px] leading-[1.2] text-ink truncate">{p.name}</p>
        <p className="mt-0.5 font-mono text-[11.5px] text-forest">{formatPrice(p.salePrice ?? p.basePrice)}</p>
      </div>
    </button>
  )
}

export function SetBundlePicker({ mode, anchorProduct, pieces, pool, onAddSelected }: SetBundlePickerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(mode === "browse" ? pieces.map((p) => p._id) : [])
  )

  if (pieces.length === 0) return null

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedPieces = pieces.filter((p) => selectedIds.has(p._id))
  const pricedSelected = anchorProduct ? [anchorProduct, ...selectedPieces] : selectedPieces
  const pieceCount = pricedSelected.length
  const subtotal = pricedSelected.reduce((sum, p) => sum + (p.salePrice ?? p.basePrice), 0)
  const { pct, nextAt } = discountForPieceCount(pieceCount)
  const discountAmount = Math.round((subtotal * pct) / 100)
  const finalTotal = subtotal - discountAmount

  const bundleSku = useMemo(() => findBundleSku(pricedSelected, pool), [pricedSelected, pool])

  const summary = (
    <>
      <div className="flex flex-col gap-1.5 rounded-[10px] bg-surface-sunken px-3.5 py-3">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] text-sage">
            {pieceCount} piece{pieceCount !== 1 ? "s" : ""} selected
          </span>
          {pct > 0 && (
            <span className="font-mono text-[11px] font-bold text-success">save {pct}%</span>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-heading font-bold text-[13.5px] text-ink">Total</span>
          <span className="font-mono font-bold text-[17px] text-forest">{formatPrice(finalTotal)}</span>
        </div>
        {discountAmount > 0 && (
          <p className="font-mono text-[10.5px] text-sage line-through">{formatPrice(subtotal)}</p>
        )}
        {nextAt != null && (
          <p className="font-mono text-[10.5px] text-gold-700">
            Add {nextAt - pieceCount} more piece{nextAt - pieceCount !== 1 ? "s" : ""} to save {discountForPieceCount(nextAt).pct}%
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={selectedPieces.length === 0}
        onClick={() => onAddSelected(selectedPieces)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] bg-forest py-3 font-heading font-bold text-[13.5px] text-bone transition-colors hover:bg-forest/90 disabled:opacity-40"
      >
        <ShoppingBag className="h-4 w-4" />
        Add selected to cart
      </button>
    </>
  )

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white">
      <div className="px-5 py-4" style={{ background: "linear-gradient(135deg,#16352A,#0c231b)" }}>
        <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-gold/70">
          {mode === "anchor" ? "Complete the set" : "Build your set"}
        </p>
        <p className="mt-0.5 font-heading font-black text-[16px] leading-snug text-bone">
          {mode === "anchor" ? "These pieces match — buy together and save" : "Pick what you want, save more the more you take"}
        </p>
      </div>

      {/* On the browse page (no fixed anchor), leave room at the bottom on
          mobile for the sticky summary bar so piece cards aren't hidden
          under it. */}
      <div className={cn("p-4", mode === "browse" && "pb-24 lg:pb-4")}>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {pieces.map((p) => pieceCard(p, selectedIds.has(p._id), () => toggle(p._id)))}
        </div>

        {bundleSku && (
          <div className="mt-3 flex items-center justify-between rounded-[10px] border border-gold/40 bg-gold/8 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 shrink-0 text-gold-700" />
              <span className="text-[11.5px] text-gold-900">
                Or buy as a pre-built set: <span className="font-bold">{bundleSku.name}</span>
              </span>
            </div>
            <span className="font-mono font-bold text-[13px] text-forest shrink-0">
              {formatPrice(bundleSku.salePrice ?? bundleSku.basePrice)}
            </span>
          </div>
        )}

        {mode === "anchor" ? (
          <div className="mt-3.5">{summary}</div>
        ) : (
          // Browse mode: inline on desktop, fixed to the bottom of the
          // screen on mobile (above the global bottom nav bar) so the
          // running total and CTA stay in thumb-reach while scrolling.
          <div className="mt-3.5 hidden lg:block">{summary}</div>
        )}
      </div>

      {mode === "browse" && (
        <div
          className="fixed inset-x-0 z-40 border-t border-gold/20 bg-white px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(10,28,21,.25)] lg:hidden"
          style={{ bottom: "60px", paddingBottom: "12px" }}
        >
          {summary}
        </div>
      )}
    </div>
  )
}
