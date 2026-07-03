"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { sampleBlogPosts } from "@/data/sample-blog"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const CATEGORY_FALLBACK: Record<string, string> = {
  bedroom: "linear-gradient(150deg,#244C3C,#16352A)",
  wood: "linear-gradient(150deg,#5D4037,#3E2723)",
  showroom: "linear-gradient(150deg,#6B9685,#244C3C)",
}

export function BlogTeasers() {
  const prefersReduced = useReducedMotion()
  const posts = sampleBlogPosts.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: prefersReduced ? 0 : 0.45 }}
        className="mb-7 flex items-end justify-between"
      >
        <div>
          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2.5px" }}>
            Learn
          </p>
          <h2
            className="mt-1 font-heading font-black text-ink"
            style={{ fontSize: "clamp(22px,4vw,30px)", letterSpacing: "-0.6px" }}
          >
            Buying guides
          </h2>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 font-heading text-[13px] font-bold text-gold-700 transition-colors hover:text-gold"
        >
          All guides <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        {posts.map((post, i) => {
          const tag = post.tags[0] ?? "bedroom"
          const fallbackBg = CATEGORY_FALLBACK[tag] ?? "linear-gradient(150deg,#244C3C,#16352A)"
          return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: prefersReduced ? 0 : 0.45, delay: prefersReduced ? 0 : i * 0.1, ease: "easeOut" }}
              className="h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(22,53,42,.2)]"
              >
                {/* Image */}
                <div className="relative h-48 shrink-0 overflow-hidden" style={{ background: fallbackBg }}>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[8.5px] uppercase tracking-[1.5px] text-ink/70 backdrop-blur-sm">
                    {tag}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3
                    className="font-heading font-bold leading-[1.2] text-ink transition-colors group-hover:text-forest"
                    style={{ fontSize: "15.5px", letterSpacing: "-0.2px" }}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.55] text-slate">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3.5">
                    <span className="font-mono text-[10px] text-sage">{post.publishedAt}</span>
                    <span className="flex items-center gap-1 font-heading font-bold text-[12px] text-forest">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
