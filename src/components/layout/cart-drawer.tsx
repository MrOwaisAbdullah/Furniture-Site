"use client"

import { useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCartStore, type CartItem } from "@/lib/store"
import Image from "next/image"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

interface CartSnapshot {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
}

const emptySnapshot: CartSnapshot = { items: [], totalQuantity: 0, totalPrice: 0 }

function useCartSnapshot(): CartSnapshot {
  return useSyncExternalStore(
    useCartStore.subscribe,
    useCartStore.getState,
    () => emptySnapshot
  )
}

function CartItemRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: CartItem
  onUpdate: (qty: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-3.5 px-5 py-4">
      {/* Thumbnail */}
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[10px] bg-surface-sunken">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="72px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-sage/30" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-heading font-bold leading-[1.3] text-[13.5px] text-ink">
            {item.name}
          </p>
          <button
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sage/50 transition-all hover:bg-error/10 hover:text-error"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.finishName && (
          <p className="mt-0.5 font-mono text-[10px] text-sage">{item.finishName}</p>
        )}

        {/* Stepper + line total */}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <div className="flex items-center overflow-hidden rounded-[8px] border border-border">
            <button
              onClick={() => onUpdate(Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-slate transition-colors hover:bg-surface-sunken disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-2.5 w-2.5" />
            </button>
            <span className="min-w-[28px] text-center font-mono text-[12px] font-bold text-ink">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.quantity + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-slate transition-colors hover:bg-surface-sunken"
              aria-label="Increase quantity"
            >
              <Plus className="h-2.5 w-2.5" />
            </button>
          </div>

          <p className="font-mono font-bold text-[14px] text-forest">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalPrice } = useCartSnapshot()
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  const advanceLow  = Math.round(totalPrice * 0.3)
  const advanceHigh = Math.round(totalPrice * 0.5)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(10,28,21,.52)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="cart-panel"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[400px] flex-col overflow-hidden bg-white"
            style={{ boxShadow: "-6px 0 40px rgba(10,28,21,.18)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36, mass: 0.9 }}
          >
            {/* ── Header ── */}
            <div
              className="flex shrink-0 items-center justify-between px-5 py-4"
              style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <ShoppingBag className="h-4 w-4 text-bone/80" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading font-black text-[16px] leading-none text-bone">
                    Your Cart
                  </h2>
                  <p className="mt-0.5 font-mono text-[9.5px] text-bone/45">
                    {items.length === 0
                      ? "Nothing added yet"
                      : `${items.length} item${items.length > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-bone/70 transition-colors hover:bg-white/20"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Item list ── */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/8">
                    <ShoppingBag className="h-7 w-7 text-forest/35" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[17px] text-ink">Nothing here yet</p>
                    <p className="mt-1 font-mono text-[11px] text-sage">
                      Add a bed or bedroom set to get started
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-1 flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-forest px-5 py-2.5 font-heading font-bold text-[13px] text-bone transition-colors hover:bg-forest-700"
                  >
                    Browse collection
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <CartItemRow
                      key={`${item.productId}-${item.variantId}-${item.finishId}`}
                      item={item}
                      onUpdate={(qty) =>
                        updateQuantity(item.productId, item.variantId, item.finishId, qty)
                      }
                      onRemove={() =>
                        removeItem(item.productId, item.variantId, item.finishId)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-border bg-surface px-5 pb-5 pt-4">
                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
                    Subtotal
                  </span>
                  <span className="font-mono font-bold text-[22px] text-forest">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Advance strip */}
                <div className="mt-2.5 rounded-[8px] bg-gold/10 px-3.5 py-2.5">
                  <p className="font-mono text-[10px] text-gold-900">
                    Advance to confirm:{" "}
                    <span className="font-bold text-forest">
                      {formatPrice(advanceLow)} – {formatPrice(advanceHigh)}
                    </span>
                    <span className="text-sage"> · balance on delivery</span>
                  </p>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-forest py-4 font-heading font-black text-[15px] text-bone shadow-[0_6px_20px_-8px_rgba(22,53,42,.45)] transition-colors hover:bg-forest-700"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>

                <button
                  onClick={onClose}
                  className="mt-2 w-full cursor-pointer py-3 font-mono text-[11px] text-sage transition-colors hover:text-ink"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
