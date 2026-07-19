"use client"

import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { waLink } from "@/lib/site-config"

export function ShaadiStrip() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[18px] px-5 py-6 text-bone sm:px-7 sm:py-7"
        style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
      >
        {/* Animated decorative SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          whileInView={{ opacity: 0.08, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReduced ? 0 : 0.8, delay: 0.3 }}
          className="pointer-events-none absolute -right-4 -top-6"
        >
          <svg
            width="180"
            height="164"
            viewBox="0 0 110 100"
            fill="none"
            stroke="#C9A24B"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 52 L22 38 C22 30 30 26 40 26 L70 26 C80 26 88 30 88 38 L88 52" />
            <path d="M14 52 L96 52 C99 52 100 54 100 57 L100 62 L10 62 L10 57 C10 54 11 52 14 52 Z" />
            <path d="M16 62 L16 70" />
            <path d="M94 62 L94 70" />
          </svg>
        </motion.div>

        <p
          className="relative font-mono uppercase text-gold"
          style={{ fontSize: "10px", letterSpacing: "2.5px" }}
        >
          Shaadi / Jahez
        </p>

        <h2
          className="relative mt-2.5 font-display italic leading-none"
          style={{ fontSize: "clamp(24px,4vw,32px)" }}
        >
          Complete 5-piece sets
        </h2>

        <p className="relative mt-2.5 max-w-lg text-[13px] leading-[1.55] text-bone/70">
          Bed, dressing table, side tables &amp; wardrobe, booked together, delivered together.
        </p>

        <div className="relative mt-5 flex items-center gap-3">
          <div>
            <p className="font-mono text-[9px] text-bone/40">Starting price</p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReduced ? 0 : 0.5, delay: 0.3 }}
              className="font-mono font-bold text-gold"
              style={{ fontSize: "20px" }}
            >
              {formatPrice(165000)}
            </motion.p>
          </div>
          <motion.a
            href={waLink("Hi, I'm interested in a complete Shaadi set.")}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 480, damping: 22 }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-[9px] shimmer-btn px-5 py-2.5 font-heading text-[12.5px] font-bold text-forest shadow-[0_4px_14px_-4px_rgba(201,162,75,.5)] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Enquire
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
