import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { sampleBlogPosts } from "@/data/sample-blog"
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = sampleBlogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://yousufliving.pk/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.featuredImage, alt: post.title }],
    },
    alternates: {
      canonical: `https://yousufliving.pk/blog/${post.slug}`,
    },
  }
}

function readTime(body: string) {
  const words = body.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

function renderBody(body: string) {
  return body.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 font-heading font-black text-ink" style={{ fontSize: "19px", letterSpacing: "-0.4px" }}>
          {block.slice(3)}
        </h2>
      )
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "))
      return (
        <ul key={i} className="mt-4 flex flex-col gap-1.5 pl-4">
          {items.map((item, j) => (
            <li key={j} className="text-[14px] leading-[1.65] text-slate before:mr-2 before:content-['·']">
              {item.slice(2)}
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="mt-4 text-[14px] leading-[1.7] text-slate">
        {block}
      </p>
    )
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = sampleBlogPosts.find((p) => p.slug === slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-surface">
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        datePublished={post.publishedAt}
        author={post.author}
        url={`/blog/${post.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      {/* Hero image */}
      <div
        className="relative h-[220px] sm:h-[280px] lg:h-[360px]"
        style={{ background: "linear-gradient(145deg,#1c4233,#0a1c15)" }}
      >
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-6 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Link
              href="/blog"
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60 transition-colors hover:text-bone"
            >
              <ArrowLeft className="h-3 w-3" />
              Blog
            </Link>
            <span className="text-bone/30">/</span>
            <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60 truncate max-w-[160px]">
              {post.tags[0]}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="rounded-full bg-gold/20 px-2.5 py-1 font-mono uppercase text-gold"
              style={{ fontSize: "9px", letterSpacing: "1.5px" }}
            >
              {post.tags[0]}
            </span>
            <span className="font-mono text-[10px] text-bone/50">{readTime(post.body)}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <h1
          className="font-heading font-black leading-tight text-ink"
          style={{ fontSize: "clamp(22px,5vw,34px)", letterSpacing: "-0.5px" }}
        >
          {post.title}
        </h1>

        {/* Gold divider */}
        <div className="mt-5 h-[3px] w-12 rounded-full bg-gold" />

        <p className="mt-5 font-display italic text-[16px] leading-[1.6] text-slate">
          {post.excerpt}
        </p>

        <div className="mt-1 flex items-center gap-3 border-b border-border pb-5">
          <span className="font-mono text-[10.5px] text-sage">{post.author}</span>
          <span className="text-mist">·</span>
          <span className="font-mono text-[10.5px] text-sage">{post.publishedAt}</span>
        </div>

        <div className="mt-6">{renderBody(post.body)}</div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-forest/8 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[1.5px] text-forest"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-10 flex flex-col items-start gap-3 rounded-[16px] p-6"
          style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
        >
          <p className="font-heading font-black text-[18px] leading-tight text-bone">
            Ready to choose your set?
          </p>
          <p className="text-[13px] text-bone/60">
            Browse our full collection — delivered across Karachi.
          </p>
          <Link
            href="/shop"
            className="mt-1 inline-flex items-center gap-2 rounded-[10px] bg-gold px-5 py-3 font-heading font-bold text-[13.5px] text-forest transition-all hover:bg-gold/88 active:scale-[.97]"
          >
            Browse our sets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Back to blog */}
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-heading font-bold text-forest transition-colors hover:text-forest/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all guides
        </Link>
      </div>
    </div>
  )
}
