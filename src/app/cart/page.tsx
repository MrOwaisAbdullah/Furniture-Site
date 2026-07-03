"use client"

import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { EmptyCart } from "@/components/cart/empty-cart"

export default function CartPage() {
  const { items, totalPrice, totalQuantity, updateQuantity, removeItem } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <h1 className="font-heading font-black text-[26px] text-ink" style={{ letterSpacing: "-0.6px" }}>Cart</h1>
          <EmptyCart />
        </div>
      </div>
    )
  }

  const advance = Math.round(totalPrice / 2)

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-heading font-black text-[26px] text-ink" style={{ letterSpacing: "-0.6px" }}>
          Your cart
        </h1>
        <p className="mt-1 font-mono text-[11px] text-sage">{totalQuantity} item{totalQuantity !== 1 ? "s" : ""}</p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:gap-8">
          {/* Items */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}-${item.finishId}`}
                className="flex gap-3 rounded-[13px] border border-border bg-white p-3"
              >
                <div
                  className="h-[74px] w-[74px] shrink-0 rounded-[10px] bg-forest-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-[14px] text-ink leading-[1.1]">{item.name}</p>
                  {item.finishName && (
                    <p className="mt-0.5 text-[11px] text-sage">{item.finishName}</p>
                  )}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 rounded-[8px] border border-border-strong px-1 py-0.5">
                      <button
                        className="flex h-5 w-5 items-center justify-center text-slate"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.finishId, item.quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono text-[12px] w-4 text-center">{item.quantity}</span>
                      <button
                        className="flex h-5 w-5 items-center justify-center text-slate"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.finishId, item.quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[14px] text-forest">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId, item.finishId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sage transition-all hover:bg-error/10 hover:text-error"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 rounded-[10px] border border-border-strong bg-white px-4 py-3.5 font-mono text-[13px] text-ink placeholder:text-sage focus:border-forest focus:outline-none"
              />
              <button className="rounded-[10px] bg-forest px-5 py-3.5 font-heading font-bold text-[13px] text-bone">
                Apply
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="rounded-[13px] border border-border bg-white p-4">
              <div className="flex justify-between text-[13.5px] text-slate mb-2">
                <span>Subtotal</span>
                <span className="font-mono text-ink">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[13.5px] text-slate mb-3">
                <span>Advance to confirm (50%)</span>
                <span className="font-mono text-ink">{formatPrice(advance)}</span>
              </div>
              <div className="my-3 h-px bg-border" />
              <div className="flex items-baseline justify-between">
                <span className="font-heading font-black text-[15px] text-ink">Total</span>
                <span className="font-mono font-bold text-[18px] text-forest">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-3 flex items-center justify-center rounded-[11px] bg-forest py-4 font-heading font-bold text-[15px] text-bone transition-transform active:scale-[.99]"
            >
              Proceed to Book
            </Link>

            <Link
              href="/shop"
              className="mt-2 block text-center font-heading text-[13px] font-bold text-gold-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
