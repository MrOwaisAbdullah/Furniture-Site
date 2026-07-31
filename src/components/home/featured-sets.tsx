"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Product } from "@/types"
import { ProductCard } from "@/components/product/product-card"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export function FeaturedSets({ products }: { products: Product[] }) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.45 }}
        className="mb-5 flex items-end justify-between"
      >
        <div>
          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
            Featured
          </p>
          <h2
            className="mt-1 font-heading font-black text-ink"
            style={{ fontSize: "clamp(22px,4vw,30px)", letterSpacing: "-0.6px" }}
          >
            Bestselling sets
          </h2>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-1 font-heading text-[13px] font-bold text-gold-700 transition-colors hover:text-gold"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : i * 0.1, ease: "easeOut" }}
            className="h-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
