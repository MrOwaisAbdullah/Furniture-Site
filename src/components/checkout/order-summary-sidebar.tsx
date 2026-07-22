"use client"

import { useState } from "react"
import { ChevronDown, Loader2, Tag, X, Info, Sparkles } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import type { CartSetDiscount } from "@/lib/set-bundle"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  finishName?: string
}

interface OrderSummarySidebarProps {
  items: OrderItem[]
  totalPrice: number
  advance: number
  discount: number
  appliedCode: string | null
  onApplyCoupon: (discountAmt: number, code: string) => void
  onRemoveCoupon: () => void
  /** Auto-detected from actual cart contents (matching-set pieces) — not
   * something the customer typed, so it has no "remove" affordance; it just
   * tracks whatever is really in the cart right now. */
  autoSetDiscount: CartSetDiscount | null
}

/** Whichever discount is bigger wins — same "pick the better one, never
 * stack" philosophy the server's resolveDiscount() already uses. */
function pickWinningDiscount(discount: number, autoSetDiscount: CartSetDiscount | null) {
  if (autoSetDiscount && autoSetDiscount.amount > discount) {
    return { amount: autoSetDiscount.amount, source: "set" as const }
  }
  return { amount: discount, source: "coupon" as const }
}

function SummaryBody({ items, totalPrice, advance, discount, appliedCode, onApplyCoupon, onRemoveCoupon, autoSetDiscount }: OrderSummarySidebarProps) {
  const [code, setCode] = useState("")
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function applyCoupon() {
    const trimmed = code.trim()
    if (!trimmed) return
    setChecking(true)
    setError(null)
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, orderTotal: totalPrice }),
      })
      const data = await res.json()
      if (!data.valid) {
        setError(data.error ?? "This code isn't valid.")
        return
      }
      onApplyCoupon(data.discountAmt, data.code ?? trimmed.toUpperCase())
      setCode("")
    } catch {
      setError("Couldn't check that code — try again.")
    } finally {
      setChecking(false)
    }
  }

  const winner = pickWinningDiscount(discount, autoSetDiscount)
  const finalTotal = Math.max(0, totalPrice - winner.amount)

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-[13px] border border-border bg-white">
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.productId} className="flex items-start justify-between px-4 py-3">
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-heading font-bold text-[13px] text-ink leading-[1.2] truncate">{item.name}</p>
                {item.finishName && (
                  <p className="mt-0.5 text-[11px] text-sage">{item.finishName}</p>
                )}
                <p className="mt-0.5 font-mono text-[10.5px] text-sage">×{item.quantity}</p>
              </div>
              <p className="font-mono text-[13px] font-semibold text-ink shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Auto-detected set discount — informational, no remove button */}
        {autoSetDiscount && (
          <div className="border-t border-border px-4 py-3">
            <div
              className={cn(
                "flex items-center justify-between rounded-[9px] px-3 py-2",
                winner.source === "set" ? "bg-success/8" : "bg-surface-sunken"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className={cn("h-3.5 w-3.5", winner.source === "set" ? "text-success" : "text-sage")} />
                <span className={cn("text-[11.5px]", winner.source === "set" ? "text-success" : "text-sage")}>
                  {autoSetDiscount.pieceCount} matching pieces from <span className="font-bold">{autoSetDiscount.setName}</span> — {autoSetDiscount.pct}% off
                </span>
              </div>
              {winner.source !== "set" && (
                <span className="font-mono text-[10px] text-sage">not applied</span>
              )}
            </div>
          </div>
        )}

        {/* Coupon */}
        <div className="border-t border-border px-4 py-3">
          {appliedCode ? (
            <div className="flex items-center justify-between rounded-[9px] bg-success/8 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-success" />
                <span className="font-mono text-[11.5px] font-bold text-success">{appliedCode}</span>
                <span className="text-[11.5px] text-success">applied</span>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                aria-label="Remove coupon"
                className="flex h-6 w-6 items-center justify-center rounded-full text-success transition-colors hover:bg-success/15"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(null) }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon() } }}
                  placeholder="Discount code"
                  className="flex-1 rounded-[9px] border border-border-strong bg-surface px-3 py-2.5 font-mono text-[12.5px] uppercase text-ink placeholder:normal-case placeholder:text-sage focus:border-forest focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={checking || !code.trim()}
                  className="flex min-w-[76px] items-center justify-center gap-1.5 rounded-[9px] bg-forest px-4 font-heading font-bold text-[12.5px] text-bone transition-colors hover:bg-forest/90 disabled:opacity-50"
                >
                  {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                </button>
              </div>
              {error && <p className="mt-1.5 text-[11px] text-error">{error}</p>}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] text-slate">Subtotal</span>
            <span className="font-mono text-[13px] text-slate">{formatPrice(totalPrice)}</span>
          </div>
          {winner.amount > 0 && (
            <div className="flex items-baseline justify-between">
              <span className="text-[12.5px] text-success">Discount</span>
              <span className="font-mono text-[13px] text-success">−{formatPrice(winner.amount)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-bold text-[13px] text-ink">Total</span>
            <span className="font-mono font-bold text-[16px] text-forest">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Advance block */}
      <div
        className="flex items-center justify-between rounded-[13px] px-4 py-4"
        style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60">
            30–50% advance to confirm
          </p>
          <p className="mt-0.5 text-[11.5px] text-bone/55">Balance paid on delivery</p>
        </div>
        <p className="font-mono font-bold text-[26px] text-gold">{formatPrice(advance)}</p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-[10px] bg-gold/10 px-3.5 py-3">
        <Info className="mt-[1px] h-3.5 w-3.5 shrink-0 text-gold-700" />
        <p className="text-[11.5px] leading-[1.55] text-gold-900">
          Prices and delivery times are estimates until we confirm your order on WhatsApp. By paying the advance, you agree to our
          {" "}<strong>advance payment policy</strong> — cancellations must be requested before the build begins.
        </p>
      </div>
    </div>
  )
}

export function OrderSummarySidebar(props: OrderSummarySidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const winner = pickWinningDiscount(props.discount, props.autoSetDiscount)
  const finalTotal = Math.max(0, props.totalPrice - winner.amount)
  const itemCount = props.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      {/* Desktop — always-visible sticky card, pinned to the second grid column */}
      <aside className="hidden lg:order-2 lg:block lg:sticky lg:top-24">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">Order summary</p>
        <SummaryBody {...props} />
      </aside>

      {/* Mobile — sticky collapsed bar, tap to expand */}
      <div className="sticky top-0 z-30 -mx-4 border-b border-border bg-white sm:-mx-6 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 sm:px-6"
        >
          <span className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-[13px] text-ink">Order summary</span>
            <span className="font-mono text-[11px] text-sage">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono font-bold text-[14px] text-forest">{formatPrice(finalTotal)}</span>
            <ChevronDown className={cn("h-4 w-4 text-sage transition-transform", mobileOpen && "rotate-180")} />
          </span>
        </button>
        {mobileOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3 sm:px-6">
            <SummaryBody {...props} />
          </div>
        )}
      </div>
    </>
  )
}
