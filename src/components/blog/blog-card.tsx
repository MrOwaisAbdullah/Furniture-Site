import Link from "next/link"
import type { BlogPost } from "@/types"

interface BlogCardProps {
  post: BlogPost
  index?: number
}

function readTime(body: string) {
  return `${Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))} min read`
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
      className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-white transition-shadow hover:shadow-md"
    >
      <div
        className="h-[160px] sm:h-[200px]"
        style={{ background: gradients[index % gradients.length] }}
      >
        <div
          className="h-full w-full opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, #C9A24B 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5">
          <span
            className="rounded-full bg-forest/8 px-2.5 py-1 font-mono uppercase text-forest"
            style={{ fontSize: "9px", letterSpacing: "1.5px" }}
          >
            {post.tags[0]}
          </span>
          <span className="font-mono text-[10px] text-sage">{readTime(post.body)}</span>
        </div>

        <h2
          className="mt-3 font-heading font-black leading-snug text-ink group-hover:text-forest transition-colors"
          style={{ fontSize: "17px" }}
        >
          {post.title}
        </h2>
        <p className="mt-2 text-[12.5px] leading-[1.55] text-slate line-clamp-2">{post.excerpt}</p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
          <span className="font-mono text-[10px] text-sage">{post.publishedAt}</span>
          <span className="flex items-center gap-1 font-heading font-bold text-[12px] text-forest">
            Read more
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
