"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const steps = [
  {
    n: "01",
    title: "Browse sets online",
    body: "Explore our collection with honest prices, real finishes, and all specs upfront.",
  },
  {
    n: "02",
    title: "Book on WhatsApp",
    body: "Message us directly or use the website. We confirm your order the same day.",
  },
  {
    n: "03",
    title: "Pay advance to confirm",
    body: "A 30–50% advance secures your build slot. Balance on delivery — no surprises.",
  },
  {
    n: "04",
    title: "We build and deliver",
    body: "Built to your size in our Karachi workshop, then delivered and installed.",
  },
]

export function HowItWorks() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.45 }}
        className="mb-7 flex items-baseline justify-between"
      >
        <div>
          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
            Process
          </p>
          <h2
            className="mt-1 font-heading font-black text-ink"
            style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.5px" }}
          >
            How it works
          </h2>
        </div>
      </motion.div>

      {/* Mobile: vertical list with connector line */}
      <div className="flex flex-col gap-0 lg:hidden">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : i * 0.08 }}
            className="flex gap-4 items-start relative"
          >
            {/* Vertical connector */}
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-white shadow-sm">
                <span className="font-mono font-bold text-[13px] text-gold-700">{step.n}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-border my-1" />
              )}
            </div>
            <div className="pt-2 pb-6">
              <p className="font-heading font-bold text-ink" style={{ fontSize: "15px" }}>
                {step.title}
              </p>
              <p className="mt-0.5 text-[13px] leading-[1.55] text-slate">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: horizontal steps with animated connector line */}
      <div className="relative hidden lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Animated connector line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute left-0 right-0 top-7 h-px origin-left will-change-transform"
          style={{ background: "linear-gradient(90deg, transparent, #E4E0D6 10%, #E4E0D6 90%, transparent)" }}
        />

        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : i * 0.12, ease: "easeOut" }}
            className="relative flex flex-col"
          >
            {/* Number circle */}
            <motion.div
              whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
              whileTap={{ scale: prefersReduced ? 1 : 0.95 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-white shadow-sm"
            >
              <span className="font-mono font-bold text-[15px] text-gold-700">{step.n}</span>
              {i < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 h-px w-6 bg-border" />
              )}
            </motion.div>

            <div className="mt-4">
              <p className="font-heading font-bold text-ink" style={{ fontSize: "15.5px", letterSpacing: "-0.2px" }}>
                {step.title}
              </p>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
