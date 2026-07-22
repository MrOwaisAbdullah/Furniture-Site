import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft, Percent, Truck } from "lucide-react"
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity"
import { BlogPostingJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo/json-ld"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { BlogCard } from "@/components/blog/blog-card"
import { TableOfContents, type TocHeading } from "@/components/blog/table-of-contents"
import { waLink } from "@/lib/site-config"

// Same stock image used as the blog archive's hero background — reused here
// so a post with no featuredImage still gets a real hero image, not a bare
// gradient.
const FALLBACK_HERO_IMG = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yousufliving.pk/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : [],
    },
    alternates: {
      canonical: `https://yousufliving.pk/blog/${post.slug}`,
    },
  }
}

function readTime(body: unknown): string {
  const blocks = Array.isArray(body) ? (body as PortableTextBlock[]) : []
  const wordCount = blocks.reduce((sum, block) => {
    if (!("children" in block) || !Array.isArray(block.children)) return sum
    const text = block.children.map((c) => ("text" in c ? c.text : "")).join(" ")
    return sum + text.trim().split(/\s+/).filter(Boolean).length
  }, 0)
  return `${Math.max(1, Math.round(wordCount / 200))} min read`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function blockText(block: PortableTextBlock): string {
  if (!("children" in block) || !Array.isArray(block.children)) return ""
  return block.children.map((c) => ("text" in c ? c.text : "")).join("")
}

function extractHeadings(body: unknown): TocHeading[] {
  const blocks = Array.isArray(body) ? (body as PortableTextBlock[]) : []
  return blocks
    .filter((b) => "style" in b && b.style === "h2")
    .map((b) => ({ id: slugify(blockText(b)), text: blockText(b) }))
    .filter((h) => h.text)
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2
        id={slugify(blockText(value as PortableTextBlock))}
        className="mt-8 scroll-mt-28 font-heading font-black text-ink"
        style={{ fontSize: "19px", letterSpacing: "-0.4px" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-heading font-bold text-ink" style={{ fontSize: "16px" }}>
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-[14px] leading-[1.7] text-slate">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 flex flex-col gap-1.5 pl-4">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[14px] leading-[1.65] text-slate before:mr-2 before:content-['·']">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  types: {
    image: ({ value }) => (
      <span className="relative mt-6 block h-[220px] overflow-hidden rounded-[12px] sm:h-[300px]">
        <Image src={urlFor(value).width(900).url()} alt={value.alt ?? ""} fill className="object-cover" sizes="(max-width: 640px) 100vw, 672px" />
      </span>
    ),
  },
}

function OfferBanner() {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-[14px] border border-gold/30 bg-gold/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-5">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink">
          <Percent className="h-3.5 w-3.5 text-forest" />
          30–50% advance · balance on delivery
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink">
          <Truck className="h-3.5 w-3.5 text-forest" />
          Custom sizing free · Karachi delivery
        </span>
      </div>
      <a
        href={waLink("Hi, I'd like to know more about your bedroom sets.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-forest px-4 py-2.5 font-heading font-bold text-[12.5px] text-bone transition-colors hover:bg-forest/90"
      >
        WhatsApp us <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()])

  if (!post) notFound()

  const otherPosts = allPosts.filter((p) => p.slug !== post.slug)
  const related = [
    ...otherPosts.filter((p) => p.tags.some((t) => post.tags.includes(t))),
    ...otherPosts.filter((p) => !p.tags.some((t) => post.tags.includes(t))),
  ].slice(0, 3)
  const recent = otherPosts.slice(0, 4)

  const headings = extractHeadings(post.body)
  const bodyBlocks = Array.isArray(post.body) ? (post.body as PortableTextBlock[]) : []
  const showMidBanner = bodyBlocks.length >= 6
  const midpoint = Math.ceil(bodyBlocks.length / 2)
  const bodyFirstHalf = showMidBanner ? bodyBlocks.slice(0, midpoint) : bodyBlocks
  const bodySecondHalf = showMidBanner ? bodyBlocks.slice(midpoint) : []

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
      <FAQJsonLd items={post.faq} />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <Image
          src={post.featuredImage || FALLBACK_HERO_IMG}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg,rgba(10,28,21,.88) 0%,rgba(22,53,42,.75) 60%,rgba(22,53,42,.5) 100%)" }}
        />
        <div className="relative mx-auto flex min-h-[280px] max-w-7xl flex-col justify-end px-5 pb-8 pt-10 sm:px-8 sm:pt-14 lg:px-14">
          <Breadcrumbs
            className="text-bone"
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title },
            ]}
          />
          <div className="mt-4 flex items-center gap-2.5">
            {post.tags[0] && (
              <span
                className="rounded-full bg-gold/15 px-2.5 py-1 font-mono uppercase text-gold"
                style={{ fontSize: "9px", letterSpacing: "1.5px" }}
              >
                {post.tags[0]}
              </span>
            )}
            <span className="font-mono text-[10px] text-bone/60">{readTime(post.body)}</span>
          </div>
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-8">
        {/* Mobile TOC — collapsible, sits above the article */}
        {headings.length > 0 && (
          <details className="mb-6 rounded-[12px] border border-border bg-white p-4 lg:hidden">
            <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[1.5px] text-sage marker:content-none">
              On this page
            </summary>
            <ul className="mt-3 flex flex-col gap-2">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-[13px] text-forest">{h.text}</a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-12">
          {/* Article */}
          <div className="max-w-[700px]">
            <h1
              className="font-heading font-black leading-tight text-ink"
              style={{ fontSize: "clamp(22px,5vw,34px)", letterSpacing: "-0.5px" }}
            >
              {post.title}
            </h1>

            <div className="mt-5 h-[3px] w-12 rounded-full bg-gold" />

            <p className="mt-5 font-display italic text-[16px] leading-[1.6] text-slate">
              {post.excerpt}
            </p>

            <div className="mt-1 flex items-center gap-3 border-b border-border pb-5">
              <span className="font-mono text-[10.5px] text-sage">{post.author}</span>
              <span className="text-mist">·</span>
              <span className="font-mono text-[10.5px] text-sage">
                {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="mt-6">
              <PortableText value={bodyFirstHalf} components={portableTextComponents} />
              {showMidBanner && <OfferBanner />}
              {showMidBanner && <PortableText value={bodySecondHalf} components={portableTextComponents} />}
            </div>

            {/* FAQ */}
            {post.faq.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading font-black text-ink" style={{ fontSize: "19px", letterSpacing: "-0.4px" }}>
                  Common questions
                </h2>
                <div className="mt-4 flex flex-col divide-y divide-border rounded-[14px] border border-border bg-white">
                  {post.faq.map((item) => (
                    <details key={item.question} className="group px-5 py-4">
                      <summary className="cursor-pointer list-none font-heading font-bold text-[14px] text-ink marker:content-none">
                        {item.question}
                      </summary>
                      <p className="mt-2.5 text-[13.5px] leading-[1.65] text-slate">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA */}
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
                className="mt-1 inline-flex items-center gap-2 rounded-[10px] shimmer-btn px-5 py-3 font-heading font-bold text-[13.5px] text-forest transition-all active:scale-[.97]"
              >
                Browse our sets <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-heading font-bold text-forest transition-colors hover:text-forest/80"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all guides
            </Link>
          </div>

          {/* Sidebar */}
          <aside className="mt-10 hidden lg:sticky lg:top-24 lg:mt-0 lg:block lg:self-start">
            <TableOfContents headings={headings} />

            {recent.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-sage">Recent posts</p>
                <ul className="mt-3 flex flex-col gap-3.5">
                  {recent.map((p) => (
                    <li key={p._id}>
                      <Link href={`/blog/${p.slug}`} className="group block">
                        <p className="text-[13px] font-bold leading-snug text-ink transition-colors group-hover:text-forest">
                          {p.title}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-sage">
                          {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="font-heading font-black text-ink" style={{ fontSize: "22px", letterSpacing: "-0.4px" }}>
              You might also like
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p._id} post={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
