"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Package } from "lucide-react"
import { OrderTracker, type OrderStep } from "@/components/orders/order-tracker"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { waLink } from "@/lib/site-config"

const demoSteps: OrderStep[] = [
  { label: "Order placed",      time: "Jun 20, 10:30am",                                    status: "done" },
  { label: "Payment confirmed", time: "Jun 20, 2:15pm", note: "Your advance has been received.",            status: "done" },
  { label: "Workshop building", time: "Jun 21",         note: "Your set is being cut and assembled.",       status: "done" },
  { label: "Polishing / deco paint",                    note: "Finishing coats in progress — ready Jun 25.", status: "active" },
  { label: "Final finishing",                                                                status: "upcoming" },
  { label: "Ready for delivery",                                                             status: "upcoming" },
  { label: "Delivered",                                                                      status: "upcoming" },
]

export default function TrackPage() {
  const [query, setQuery] = useState("YL-26-0418")
  const [searched, setSearched] = useState(false)

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
            Enter your order reference to see live status updates.
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
          <label htmlFor="order-ref" className="mb-3 block font-heading font-bold text-[14px] text-ink">
            Order reference
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage" />
              <input
                id="order-ref"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="YL-26-XXXX"
                className="w-full rounded-[10px] border border-border-strong bg-surface py-3 pl-9 pr-4 font-mono text-[12.5px] text-ink placeholder:text-sage focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
              />
            </div>
            <button
              onClick={() => setSearched(true)}
              className="rounded-[10px] bg-forest px-5 py-3 font-heading font-bold text-[13px] text-bone transition-all hover:bg-forest/90 active:scale-[.97]"
            >
              Track
            </button>
          </div>
          <p className="mt-2 text-[11px] text-sage">
            You&apos;ll find your order reference in the confirmation message we sent on WhatsApp.
          </p>
        </motion.div>

        {/* Demo order — will be replaced with real Neon lookup in Part 2 */}
        {(searched || true) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-forest" />
              <span className="font-heading font-bold text-[14px] text-ink">Order {query}</span>
            </div>
            <OrderTracker steps={demoSteps} orderRef={query} />
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
