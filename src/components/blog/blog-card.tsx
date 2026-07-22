import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { BlogPost } from "@/types"

interface BlogCardProps {
  post: Pick<BlogPost, "slug" | "title" | "excerpt" | "featuredImage" | "publishedAt" | "tags">
  index?: number
}

// Approximated from the excerpt — the full Portable Text body isn't fetched
// for card-list views.
function readTime(excerpt: string) {
  return `${Math.max(1, Math.round(excerpt.trim().split(/\s+/).length / 40))} min read`
}

const gradients = [
  "linear-gradient(135deg,#244C3C,#16352A)",
  "linear-gradient(135deg,#3d5a3e,#1c4233)",
  "linear-gradient(135deg,#2a3d36,#0c231b)",
]

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.18)]"
    >
      <div
        className="relative h-[180px] overflow-hidden sm:h-[220px]"
        style={{ background: gradients[index % gradients.length] }}
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
          {post.tags[0] && (
            <span
              className="rounded-full bg-forest/8 px-2.5 py-1 font-mono uppercase text-forest"
              style={{ fontSize: "9px", letterSpacing: "1.5px" }}
            >
              {post.tags[0]}
            </span>
          )}
          <span className="font-mono text-[10px] text-sage">{readTime(post.excerpt)}</span>
        </div>

        <h3
          className="mt-2.5 font-heading font-black leading-snug text-ink group-hover:text-forest transition-colors"
          style={{ fontSize: "17px" }}
        >
          {post.title}
        </h3>
        <p className="mt-2 text-[12.5px] leading-[1.55] text-slate line-clamp-2">{post.excerpt}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
          <span className="font-mono text-[10px] text-sage">
            {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1 font-heading font-bold text-[12px] text-forest">
            Read more
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
