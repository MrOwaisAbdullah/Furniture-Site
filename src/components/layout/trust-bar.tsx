"use client"

import React from "react"
import { Factory, Truck, CreditCard, Award } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { WARRANTY_LABEL, ADVANCE_LABEL } from "@/lib/site-config"

const trustItems = [
  { icon: Factory,      label: "Karachi Workshop" },
  { icon: Truck,        label: "City-wide Delivery" },
  { icon: Award,        label: `${WARRANTY_LABEL} Build Quality` },
  { icon: FaWhatsapp,   label: "WhatsApp Support" },
  { icon: CreditCard,   label: ADVANCE_LABEL },
]

export function TrustBar() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="border-b border-border bg-white">
      <div className="overflow-x-auto scrollbar-none">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: prefersReduced ? 0 : 0.4, ease: "easeOut" }}
          className="flex min-w-max items-center justify-center px-5 py-3 sm:px-8 lg:px-14"
        >
          {trustItems.map(({ icon: Icon, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className="mx-5 h-4 w-px shrink-0 bg-border sm:mx-7" aria-hidden="true" />
              )}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: prefersReduced ? 0 : i * 0.06 }}
                whileHover={{ y: -1 }}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-2 py-1 transition-colors hover:bg-surface-sunken"
              >
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gold/[0.12] text-gold-700">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <span
                  className="whitespace-nowrap font-mono text-slate"
                  style={{ fontSize: "10.5px", letterSpacing: "0.15px" }}
                >
                  {label}
                </span>
              </motion.div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
