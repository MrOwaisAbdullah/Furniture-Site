"use client"

import { motion } from "framer-motion"
import { Factory, BadgeCheck, MessageCircle, Ruler } from "lucide-react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const reasons = [
  {
    icon: Factory,
    title: "Workshop-direct pricing",
    body: "No middleman markup. We build and sell directly from our Karachi workshop.",
    callout: "~30% cheaper than retail",
  },
  {
    icon: Ruler,
    title: "Made to your size",
    body: "Every piece is built to your exact dimensions. Custom sizes, no extra charge.",
    callout: "Free custom sizing",
  },
  {
    icon: BadgeCheck,
    title: "Honest about materials",
    body: "16mm Lasani MDF, deco polish, solid sheesham. No vague 'engineered wood'.",
    callout: "Transparent specs",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp at every stage",
    body: "Build progress photos, delivery ETA, and post-delivery support — on WhatsApp.",
    callout: "Real-time updates",
  },
]

export function WhyYousuf() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.45 }}
        className="mb-7"
      >
        <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
          Why choose us
        </p>
        <h2
          className="mt-1 font-heading font-black text-ink"
          style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.5px" }}
        >
          Honest furniture,<br className="lg:hidden" /> honestly priced.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {reasons.map(({ icon: Icon, title, body, callout }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : i * 0.1, ease: "easeOut" }}
            whileHover={{ y: prefersReduced ? 0 : -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
            className="group rounded-[14px] border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_8px_24px_-8px_rgba(22,53,42,.15)]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: prefersReduced ? 0 : 0.15 + i * 0.08 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/[0.07] text-forest transition-colors group-hover:bg-forest/14"
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
            </motion.div>
            <h3 className="mt-3.5 font-heading font-bold text-ink" style={{ fontSize: "14.5px", letterSpacing: "-0.2px" }}>
              {title}
            </h3>
            <p className="mt-1.5 text-[12.5px] leading-[1.6] text-slate">{body}</p>
            <div className="mt-4 inline-flex items-center rounded-full bg-gold/12 px-3 py-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[1px] text-gold-700">
                {callout}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
