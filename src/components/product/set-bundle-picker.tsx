"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import confetti from "canvas-confetti"
import { Check, Tag, ShoppingBag, Eye } from "lucide-react"
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

function pieceCard(p: Product, selected: boolean, onToggle: () => void, viewHref: string | null) {
  return (
    <div
      key={p._id}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-[12px] border text-left transition-all",
        selected ? "border-forest shadow-[0_2px_10px_-4px_rgba(22,53,42,.22)]" : "border-border hover:border-forest/30"
      )}
    >
      <div className="relative h-[120px] w-full bg-surface-sunken">
        {p.images[0] && (
          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="180px" />
        )}
        {viewHref && (
          <Link
            href={viewHref}
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${p.name}`}
            className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-colors hover:bg-white"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
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
      <div className="flex flex-1 flex-col px-2.5 py-2.5">
        {p.category?.name && (
          <p className="font-mono text-[8.5px] uppercase tracking-[1px] text-sage">{p.category.name}</p>
        )}
        <p className="mt-0.5 font-heading font-bold text-[12.5px] leading-[1.25] text-ink truncate">{p.name}</p>
        <p className="mt-1 font-mono text-[11.5px] font-bold text-forest">{formatPrice(p.salePrice ?? p.basePrice)}</p>
        {p.shortDescription && (
          <p className="mt-1 line-clamp-2 text-[9.5px] leading-[1.35] text-sage">{p.shortDescription}</p>
        )}
      </div>
    </div>
  )
}

function anchorCard(p: Product) {
  return (
    <div
      key={p._id}
      className="relative flex flex-col overflow-hidden rounded-[12px] border border-forest bg-forest/[0.03] text-left"
    >
      <div className="relative h-[120px] w-full bg-surface-sunken">
        {p.images[0] && (
          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="180px" />
        )}
        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-forest bg-forest">
          <Check className="h-3 w-3 text-bone" strokeWidth={3} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-2.5 py-2.5">
        <p className="font-mono text-[8.5px] uppercase tracking-[1px] text-gold-700">Your pick</p>
        <p className="mt-0.5 font-heading font-bold text-[12.5px] leading-[1.25] text-ink truncate">{p.name}</p>
        <p className="mt-1 font-mono text-[11.5px] font-bold text-forest">{formatPrice(p.salePrice ?? p.basePrice)}</p>
        {p.shortDescription && (
          <p className="mt-1 line-clamp-2 text-[9.5px] leading-[1.35] text-sage">{p.shortDescription}</p>
        )}
      </div>
    </div>
  )
}

export function SetBundlePicker({ mode, anchorProduct, pieces, pool, onAddSelected }: SetBundlePickerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(mode === "browse" ? pieces.map((p) => p._id) : [])
  )
  const firedConfettiRef = useRef(false)

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedPieces = useMemo(() => pieces.filter((p) => selectedIds.has(p._id)), [pieces, selectedIds])
  const pricedSelected = useMemo(
    () => (anchorProduct ? [anchorProduct, ...selectedPieces] : selectedPieces),
    [anchorProduct, selectedPieces]
  )
  const pieceCount = pricedSelected.length
  const subtotal = pricedSelected.reduce((sum, p) => sum + (p.salePrice ?? p.basePrice), 0)
  const { pct, nextAt } = discountForPieceCount(pieceCount)
  const discountAmount = Math.round((subtotal * pct) / 100)
  const finalTotal = subtotal - discountAmount

  const bundleSku = useMemo(() => findBundleSku(pricedSelected, pool), [pricedSelected, pool])

  // The group can't actually supply more pieces than exist in it, so cap
  // the "next tier" promise to what's physically reachable — otherwise a
  // 4-piece group can dangle "add 1 more to save 20%" forever with no 5th
  // piece to add.
  const maxReachable = anchorProduct ? pieces.length + 1 : pieces.length
  const isFullSet = maxReachable > 0 && pieceCount === maxReachable
  const reachableNextAt = nextAt != null && nextAt <= maxReachable ? nextAt : null

  const fullSetPieces = useMemo(
    () => (anchorProduct ? [anchorProduct, ...pieces] : pieces),
    [anchorProduct, pieces]
  )
  const fullSetSubtotal = fullSetPieces.reduce((sum, p) => sum + (p.salePrice ?? p.basePrice), 0)
  const fullSetPct = discountForPieceCount(maxReachable).pct
  const fullSetSavings = Math.round((fullSetSubtotal * fullSetPct) / 100)

  useEffect(() => {
    if (isFullSet && !firedConfettiRef.current) {
      firedConfettiRef.current = true
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#C9A24B", "#16352A", "#F2EEE3"] })
    }
    if (!isFullSet) firedConfettiRef.current = false
  }, [isFullSet])

  if (pieces.length === 0) return null

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

        {/* Progress toward the next discount tier — or a completed state
            once every reachable piece in the set is selected. */}
        {reachableNextAt != null ? (
          <div className="mt-0.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${Math.min(100, (pieceCount / reachableNextAt) * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[10.5px] text-gold-700">
              Add {reachableNextAt - pieceCount} more piece{reachableNextAt - pieceCount !== 1 ? "s" : ""} to save {discountForPieceCount(reachableNextAt).pct}%
            </p>
          </div>
        ) : isFullSet && pct > 0 ? (
          <div className="mt-0.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-success/15">
              <div className="h-full w-full rounded-full bg-success" />
            </div>
            <p className="mt-1.5 font-mono text-[10.5px] font-bold text-success">
              Full set selected — you&rsquo;re saving {formatPrice(discountAmount)}!
            </p>
          </div>
        ) : null}
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

  const pickerCard = (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white">
      <div className="px-5 py-4" style={{ background: "linear-gradient(135deg,#16352A,#0c231b)" }}>
        <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-gold/70">
          {mode === "anchor" ? "Complete the set" : "Build your set"}
        </p>
        <p className="mt-0.5 font-heading font-black text-[16px] leading-snug text-bone">
          {mode === "anchor" ? "These pieces match — buy together and save" : "Pick what you want, save more the more you take"}
        </p>
        {fullSetSavings > 0 && (
          <p className="mt-2 font-mono text-[11px] text-gold">
            Buy all {maxReachable} pieces and save {formatPrice(fullSetSavings)}
          </p>
        )}
      </div>

      {/* On the browse page (no fixed anchor), leave room at the bottom on
          mobile for the sticky summary bar so piece cards aren't hidden
          under it. */}
      <div className={cn("p-4", mode === "browse" && "pb-24 lg:pb-4")}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {mode === "anchor" && anchorProduct && anchorCard(anchorProduct)}
          {pieces.map((p) =>
            pieceCard(
              p,
              selectedIds.has(p._id),
              () => toggle(p._id),
              mode === "browse" ? `/products/${p.slug}?fromSet=1` : `/products/${p.slug}`
            )
          )}
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

        {/* Anchor mode has no separate sidebar to put the summary in, so it
            stays inline here. Browse mode renders it in the sticky sidebar
            below instead (desktop) / the fixed bottom bar (mobile). */}
        {mode === "anchor" && <div className="mt-3.5">{summary}</div>}
      </div>
    </div>
  )

  if (mode === "anchor") return pickerCard

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">
        {pickerCard}

        {/* Sticky price/discount summary — desktop only, mirrors the
            checkout order-summary-sidebar's lg:sticky lg:top-24 convention. */}
        <aside className="hidden overflow-hidden rounded-[16px] border border-border bg-white lg:sticky lg:top-24 lg:block">
          <div className="p-4">{summary}</div>
        </aside>
      </div>

      {/* Mobile: fixed to the bottom of the screen (above the global bottom
          nav bar) so the running total and CTA stay in thumb-reach. */}
      <div
        className="fixed inset-x-0 z-40 border-t border-gold/20 bg-white px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(10,28,21,.25)] lg:hidden"
        style={{ bottom: "60px", paddingBottom: "12px" }}
      >
        {summary}
      </div>
    </>
  )
}
