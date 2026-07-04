"use client"

import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ProductCardCompact } from "@/components/product/product-card"
import type { Product } from "@/types"

interface CheckoutUpsellModalProps {
  open: boolean
  products: Product[]
  onAdd: (product: Product) => void
  onClose: () => void
}

/** Dismissible checkout-time upsell — 2-3 specific complementary products,
 * never a big list, never gates "Confirm booking." */
export function CheckoutUpsellModal({ open, products, onAdd, onClose }: CheckoutUpsellModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[120]"
            style={{ background: "rgba(10,28,21,.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-4 z-[121] mx-auto max-w-md overflow-hidden rounded-[18px] bg-white sm:inset-x-0"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "110%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative flex items-start justify-between px-5 py-4"
              style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
            >
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-gold/70">Complete your order</p>
                <p className="mt-0.5 font-heading font-black text-[16px] text-bone">Add these to your order?</p>
              </div>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-bone/60 hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto p-4" style={{ scrollbarWidth: "none" }}>
              {products.map((p) => (
                <ProductCardCompact key={p._id} product={p} onAdd={onAdd} />
              ))}
            </div>

            <div className="border-t border-border px-4 py-3">
              <button
                onClick={onClose}
                className="w-full rounded-[10px] py-2.5 font-mono text-[12px] text-sage hover:text-ink"
              >
                No thanks, continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
