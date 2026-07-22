import type { Metadata } from "next"
import Image from "next/image"
import { getBlogPosts } from "@/lib/sanity/queries"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld"
import { BlogCard } from "@/components/blog/blog-card"

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

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post._id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
