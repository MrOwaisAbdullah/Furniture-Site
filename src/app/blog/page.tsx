import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getBlogPosts } from "@/lib/sanity/queries"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld"

const HERO_IMG = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80"

export const metadata: Metadata = {
  title: "Blog — Buying Guides & Stories",
  description:
    "Honest advice on materials, finishes, and choosing the right bedroom set for your home. Guides from Yousuf Living, Karachi.",
  openGraph: {
    title: "Yousuf Living Blog — Buying Guides & Stories",
    description:
      "Honest advice on materials, finishes, and choosing the right bedroom set for your home.",
    url: "https://yousufliving.pk/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/blog",
  },
}

// Read-time approximation from the excerpt — the full Portable Text body
// isn't fetched for the list view (kept lightweight); the post page itself
// computes an exact read time from the real body.
function readTime(excerpt: string) {
  const words = excerpt.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 40))} min read`
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <ItemListJsonLd
        items={posts.map((post, i) => ({
          name: post.title,
          url: `/blog/${post.slug}`,
          position: i + 1,
        }))}
      />
      {/* Hero banner with image */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <Image
          src={HERO_IMG}
          alt="Yousuf Living buying guides — furniture advice from Karachi"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg,rgba(10,28,21,.88) 0%,rgba(22,53,42,.75) 60%,rgba(22,53,42,.5) 100%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            From the workshop
          </p>
          <h1
            className="mt-3 font-display leading-[1.05] text-bone"
            style={{ fontSize: "clamp(26px,6vw,44px)" }}
          >
            Buying guides
            <br />
            <span className="italic text-gold">&amp; stories</span>
          </h1>
          <p className="mt-3 max-w-lg text-[13.5px] leading-[1.6] text-bone/65">
            Honest advice on materials, finishes, and choosing the right bedroom set for your home.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 lg:max-w-5xl">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-6">
          {posts.map((post, i) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.18)]"
            >
              {/* Image */}
              <div
                className="relative h-[180px] overflow-hidden sm:h-[220px]"
                style={{
                  background: i % 3 === 0
                    ? "linear-gradient(135deg,#244C3C,#16352A)"
                    : i % 3 === 1
                    ? "linear-gradient(135deg,#3d5a3e,#1c4233)"
                    : "linear-gradient(135deg,#2a3d36,#0c231b)",
                }}
              >
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-sage">{readTime(post.excerpt)}</span>
                </div>

                <h2
                  className="mt-2.5 font-heading font-black leading-snug text-ink transition-colors group-hover:text-forest"
                  style={{ fontSize: "17px" }}
                >
                  {post.title}
                </h2>
                <p className="mt-2 text-[12.5px] leading-[1.55] text-slate line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
                  <span className="font-mono text-[10px] text-sage">{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1 font-heading font-bold text-[12px] text-forest">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
