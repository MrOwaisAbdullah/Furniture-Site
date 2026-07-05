"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Package, Loader2, Download } from "lucide-react"
import { OrderTracker, type OrderStep } from "@/components/orders/order-tracker"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { waLink } from "@/lib/site-config"
import { ORDER_PIPELINE } from "@/lib/order-pipeline"
import { downloadReceipt, type ReceiptOrder } from "@/lib/generate-receipt"

interface LookupOrder {
  ref: string
  customerName: string
  customerPhone: string
  items: unknown
  subtotal: string
  discount: string
  advance: string
  total: string
  paymentMethod: string
  deliveryMethod: string
  deliveryArea: string | null
  status: string
  createdAt: string
}

function buildSteps(status: string): OrderStep[] {
  if (status === "cancelled") {
    return [{ label: "Order cancelled", status: "active" }]
  }
  const currentIndex = ORDER_PIPELINE.findIndex((s) => s.key === status)
  return ORDER_PIPELINE.map((s, i) => ({
    label: s.label,
    status: i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming",
  }))
}

export default function TrackPage() {
  const [ref, setRef] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<LookupOrder | null>(null)

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref, phone }),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body?.error ?? "Order not found")
        return
      }
      setOrder(body.order)
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleDownloadReceipt() {
    if (!order) return
    const items = (order.items as ReceiptOrder["items"]) ?? []
    downloadReceipt({
      ref: order.ref,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      advance: Number(order.advance),
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      deliveryArea: order.deliveryArea,
      createdAt: order.createdAt,
    })
  }

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Track Order", url: "/track" },
        ]}
      />
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)", minHeight: 160 }}
      >
        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            Order status
          </p>
          <h1
            className="mt-3 font-display leading-[1.05] text-bone"
            style={{ fontSize: "clamp(28px,5vw,40px)" }}
          >
            Track your order
          </h1>
          <p className="mt-2 text-[13.5px] text-bone/60">
            Enter your order reference and phone number to see live status updates.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-8 sm:px-8">
        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[16px] border border-border bg-white p-5"
        >
          <form onSubmit={handleTrack}>
            <label htmlFor="order-ref" className="mb-1.5 block font-heading font-bold text-[14px] text-ink">
              Order reference
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage" />
              <input
                id="order-ref"
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="YL-XXXXXXXX"
                required
                className="w-full rounded-[10px] border border-border-strong bg-surface py-3 pl-9 pr-4 font-mono text-[12.5px] text-ink placeholder:text-sage focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
              />
            </div>

            <label htmlFor="order-phone" className="mb-1.5 mt-3 block font-heading font-bold text-[14px] text-ink">
              Phone number
            </label>
            <input
              id="order-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
              required
              className="w-full rounded-[10px] border border-border-strong bg-surface px-4 py-3 font-mono text-[12.5px] text-ink placeholder:text-sage focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-forest font-heading font-bold text-[13px] text-bone transition-all hover:bg-forest/90 active:scale-[.97] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Looking up…" : "Track order"}
            </button>
          </form>

          {error && (
            <div className="mt-3 rounded-[10px] bg-error/10 px-3.5 py-2.5 text-[12.5px] text-error">{error}</div>
          )}

          <p className="mt-2 text-[11px] text-sage">
            You&apos;ll find your order reference in the confirmation message we sent on WhatsApp.
          </p>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-forest" />
                <span className="font-heading font-bold text-[14px] text-ink">Order {order.ref}</span>
              </div>
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-1.5 rounded-[9px] border border-border-strong px-3 py-2 font-heading font-bold text-[12px] text-slate hover:border-forest/30 hover:text-ink transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Receipt
              </button>
            </div>
            <OrderTracker steps={buildSteps(order.status)} orderRef={order.ref} />
          </motion.div>
        )}

        {/* Help */}
        <div
          className="mt-8 rounded-[14px] p-5"
          style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
        >
          <p className="font-heading font-bold text-[14px] text-bone">Need help?</p>
          <p className="mt-1 text-[12.5px] text-bone/60">
            Message us on WhatsApp with your order reference and we&apos;ll update you immediately.
          </p>
          <a
            href={waLink("Hi, I'd like to check on my order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-gold px-5 py-2.5 font-heading font-bold text-[12.5px] text-forest transition-all hover:bg-gold/88 active:scale-[.97]"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
