"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, ChevronRight, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { RoomTier } from "@/lib/recommendations"

function PieceRow({ piece, size = "sm" }: { piece: { included: boolean; text: string }; size?: "sm" | "md" }) {
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3"
  const textSize = size === "md" ? "text-[13px]" : "text-[11px]"
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${
          piece.included
            ? "bg-forest/10"
            : "bg-red-50"
        } ${size === "md" ? "h-6 w-6" : "h-5 w-5"}`}
      >
        {piece.included
          ? <Check className={`${iconSize} stroke-forest`} strokeWidth={2.5} />
          : <X className={`${iconSize} stroke-red-400`} strokeWidth={2.5} />
        }
      </div>
      <span className={`${textSize} leading-[1.3] ${piece.included ? "text-slate" : "text-sage/50"}`}>
        {piece.text}
      </span>
    </div>
  )
}

/* ─── Tier detail popup (deepest layer) ─── */
function TierPopup({ tier, onClose, onBook }: { tier: RoomTier; onClose: () => void; onBook: (tier: RoomTier) => void }) {
  const advanceLow  = Math.round(tier.price * 0.3)
  const advanceHigh = Math.round(tier.price * 0.5)

  return (
    <>
      <motion.div
        key="tp-overlay"
        className="fixed inset-0 z-[110]"
        style={{ background: "rgba(10,28,21,.65)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        key="tp-sheet"
        className="fixed inset-x-0 bottom-0 z-[111] overflow-hidden"
        style={{
          borderRadius: "24px 24px 0 0",
          background: "#fff",
          paddingBottom: "max(28px, env(safe-area-inset-bottom))",
        }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3.5 pb-1">
          <div className="h-[5px] w-[42px] rounded-full bg-border" />
        </div>

        <div
          className="relative flex items-start justify-between px-5 py-4"
          style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
        >
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/50">You selected</p>
            <p className="mt-0.5 font-heading font-black text-[20px] text-bone">{tier.name}</p>
            <p className="mt-0.5 font-mono text-[11px] text-bone/60">{tier.tagline}</p>
          </div>
          <div className="text-right">
            {tier.badge && (
              <span className="mb-1.5 inline-block rounded-full bg-gold px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[1px] text-forest">
                {tier.badge}
              </span>
            )}
            <p className="font-mono font-bold text-[22px] text-gold">{formatPrice(tier.price)}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-bone/60 hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[1.5px] text-sage">What&apos;s included</p>
          <div className="flex flex-col gap-3">
            {tier.pieces.map((piece) => (
              <PieceRow key={piece.text} piece={piece} size="md" />
            ))}
          </div>
        </div>

        <div className="mx-5 mb-4 rounded-[10px] bg-gold/10 px-4 py-3">
          <p className="font-mono text-[10px] text-gold-900">
            Advance to book:{" "}
            <span className="font-bold text-forest">
              {formatPrice(advanceLow)} – {formatPrice(advanceHigh)}
            </span>
            {" "}· balance on delivery
          </p>
        </div>

        <div className="flex flex-col gap-2.5 px-5">
          <button
            onClick={() => onBook(tier)}
            className="flex items-center justify-center gap-2 rounded-[12px] bg-forest py-4 font-heading font-black text-[15px] text-bone shadow-[0_6px_20px_-8px_rgba(22,53,42,.5)] transition-colors hover:bg-forest-700"
          >
            Book this set
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={onClose}
            className="rounded-[12px] py-3.5 font-mono text-[12px] text-sage hover:text-ink"
          >
            Keep browsing
          </button>
        </div>
      </motion.div>
    </>
  )
}

function TierSheetCard({ tier, onSelect }: { tier: RoomTier; onSelect: (t: RoomTier) => void }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[14px] border transition-shadow ${
        tier.highlight ? "border-gold/60 shadow-sm" : "border-border"
      }`}
    >
      <div
        className={`flex items-start justify-between px-4 pt-3.5 pb-3 ${
          tier.highlight ? "bg-forest/[0.03]" : "bg-white"
        }`}
      >
        <div>
          {tier.badge && (
            <span className="mb-1 inline-block rounded-full bg-gold px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[1px] text-forest">
              {tier.badge}
            </span>
          )}
          <p className="font-heading font-bold text-[15px] text-ink">{tier.name}</p>
          <p className="mt-0.5 font-mono text-[10px] text-sage">{tier.tagline}</p>
        </div>
        <p className="ml-3 mt-0.5 shrink-0 font-mono font-bold text-[16px] text-forest">
          {formatPrice(tier.price)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/60 px-4 py-3">
        {tier.pieces.map((piece) => (
          <PieceRow key={piece.text} piece={piece} size="sm" />
        ))}
      </div>

      <div className={`mt-auto px-4 pb-4 ${tier.highlight ? "bg-forest/[0.03]" : ""}`}>
        <button
          onClick={() => onSelect(tier)}
          className={`flex w-full items-center justify-between rounded-[10px] px-4 py-3 font-heading font-bold text-[13px] transition-colors ${
            tier.highlight
              ? "shimmer-btn text-forest"
              : "bg-forest/8 text-forest hover:bg-forest/15"
          }`}
        >
          <span>Book — {formatPrice(tier.price)}</span>
          <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

/* ─── Post-cart intercept sheet — fires BEFORE cart add on anchor-category pages ─── */
export function TierUpsellSheet({
  open,
  onClose,
  onAddAnchorOnly,
  onBookTier,
  productName,
  tiers,
}: {
  open: boolean
  onClose: () => void
  onAddAnchorOnly: (fromEl?: HTMLElement | null) => void
  onBookTier: (tier: RoomTier) => void
  productName?: string
  tiers: RoomTier[]
}) {
  const [selectedTier, setSelectedTier] = useState<RoomTier | null>(null)

  const handleClose = () => {
    setSelectedTier(null)
    onClose()
  }

  if (tiers.length === 0) return null

  return (
    <AnimatePresence>
      {open && !selectedTier && (
        <>
          <motion.div
            key="us-overlay"
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(10,28,21,.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            key="us-sheet"
            className="fixed inset-x-0 bottom-0 z-[91]"
            style={{
              borderRadius: "24px 24px 0 0",
              background: "#fff",
              maxHeight: "92dvh",
              overflowY: "auto",
              paddingBottom: "max(28px, env(safe-area-inset-bottom))",
            }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3.5 pb-2">
              <div className="h-[5px] w-[42px] rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 pt-1">
              <p className="font-heading font-black text-[20px] leading-snug text-ink">
                Complete your bedroom?
              </p>
              <p className="mt-1 font-mono text-[11px] text-sage">
                You&apos;re getting <span className="font-bold text-ink">{productName ?? "this piece"}</span>. Add matching pieces and save.
              </p>
            </div>

            {/* Tier cards — 2-col on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 gap-3 px-5 pb-3 sm:grid-cols-2">
              {tiers.slice(0, 2).map((tier) => (
                <TierSheetCard key={tier.key} tier={tier} onSelect={setSelectedTier} />
              ))}
              {tiers[2] && (
                <div className="sm:col-span-2">
                  <TierSheetCard tier={tiers[2]} onSelect={setSelectedTier} />
                </div>
              )}
            </div>

            {/* Just the anchor piece */}
            <div className="px-5 pt-1">
              <button
                onClick={(e) => {
                  onAddAnchorOnly(e.currentTarget)
                  handleClose()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-border py-3.5 font-heading font-semibold text-[13px] text-slate hover:border-forest/30 hover:text-ink transition-colors"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                Just this piece — add to cart
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Nested tier detail */}
      {selectedTier && (
        <TierPopup
          key="us-tier-popup"
          tier={selectedTier}
          onClose={() => setSelectedTier(null)}
          onBook={onBookTier}
        />
      )}
    </AnimatePresence>
  )
}

/* ─── Inline upsell block ("Complete the room" — shown below product info) ─── */
export function UpsellBlock({ tiers, onBookTier }: { tiers: RoomTier[]; onBookTier: (tier: RoomTier) => void }) {
  const [selectedTier, setSelectedTier] = useState<RoomTier | null>(null)

  if (tiers.length === 0) return null

  const tier3 = tiers[2]

  return (
    <>
      <div className="overflow-hidden rounded-[16px] border border-border bg-white">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{ background: "linear-gradient(135deg,#16352A,#0c231b)" }}
        >
          <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-gold/70">Complete the room</p>
          <p className="mt-0.5 font-heading font-black text-[17px] leading-snug text-bone">
            Others sell pieces. We sell sets.
          </p>
        </div>

        {/* Tier grid: 2-col on desktop, stacked on mobile */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tiers.slice(0, 2).map((tier) => (
              <div
                key={tier.key}
                className="flex flex-col rounded-[12px] border border-border bg-white p-4"
              >
                {tier.badge && (
                  <span className="mb-2 self-start rounded-full bg-gold px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[1px] text-forest">
                    {tier.badge}
                  </span>
                )}
                <p className="font-heading font-bold text-[14px] text-ink">{tier.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-sage">{tier.tagline}</p>
                <p className="mt-2 font-mono font-bold text-[15px] text-forest">{formatPrice(tier.price)}</p>

                <div className="mt-3 flex flex-1 flex-col gap-2">
                  {tier.pieces.map((piece) => (
                    <PieceRow key={piece.text} piece={piece} size="sm" />
                  ))}
                </div>

                <button
                  onClick={() => setSelectedTier(tier)}
                  className="mt-4 flex items-center justify-center rounded-[8px] bg-forest/8 py-2.5 font-heading font-bold text-[12px] text-forest transition-colors hover:bg-forest/15"
                >
                  See what&apos;s inside
                </button>
              </div>
            ))}

            {/* Tier 3 — full width, horizontal layout on desktop */}
            {tier3 && (
              <div
                className="col-span-1 overflow-hidden rounded-[12px] border border-gold/50 sm:col-span-2"
                style={{ background: "linear-gradient(135deg,#f9f6f0,#fffdf9)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  {/* Info side */}
                  <div className="flex flex-col justify-center border-b border-gold/30 px-5 py-4 sm:w-[200px] sm:shrink-0 sm:border-b-0 sm:border-r">
                    {tier3.badge && (
                      <span className="mb-2 self-start rounded-full bg-gold px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[1px] text-forest">
                        {tier3.badge}
                      </span>
                    )}
                    <p className="font-heading font-bold text-[16px] text-ink">{tier3.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-sage">{tier3.tagline}</p>
                    <p className="mt-2.5 font-mono font-bold text-[18px] text-forest">{formatPrice(tier3.price)}</p>
                  </div>

                  {/* Pieces side */}
                  <div className="flex flex-1 flex-col justify-between px-5 py-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      {tier3.pieces.map((piece) => (
                        <PieceRow key={piece.text} piece={piece} size="sm" />
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedTier(tier3)}
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-[8px] shimmer-btn py-2.5 font-heading font-bold text-[12px] text-forest transition-colors"
                    >
                      See what&apos;s inside
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer — only shown when there's a real savings claim to make */}
        {tier3?.savings != null && (
          <div className="border-t border-border bg-surface px-5 py-3">
            <p className="text-center font-mono text-[10px] text-sage">
              Buying the pieces separately costs <span className="font-bold text-ink">{formatPrice(tier3.price + tier3.savings)}</span>.
              Our full bedroom is <span className="font-bold text-forest">{formatPrice(tier3.price)}</span> — you save {formatPrice(tier3.savings)}.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTier && (
          <TierPopup tier={selectedTier} onClose={() => setSelectedTier(null)} onBook={onBookTier} />
        )}
      </AnimatePresence>
    </>
  )
}
