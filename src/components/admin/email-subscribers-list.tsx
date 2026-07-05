"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Copy, Check, Search, ExternalLink } from "lucide-react"

interface Subscriber {
  id: number
  email: string
  source: string
  createdAt: Date | string
}

export function EmailSubscribersList({ subscribers }: { subscribers: Subscriber[] }) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleCopy(email: string) {
    navigator.clipboard.writeText(email)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  function handleCopyAll() {
    const allEmails = filtered.map((s) => s.email).join(", ")
    navigator.clipboard.writeText(allEmails)
    setCopiedEmail("all")
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  return (
    <div className="rounded-[12px] border border-sage/20 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-sage/10 px-4 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sage" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full rounded-[8px] border border-sage/20 bg-bone/30 py-2 pl-9 pr-3 text-xs text-forest placeholder:text-sage focus:border-forest/30 focus:outline-none"
          />
        </div>
        <button
          onClick={handleCopyAll}
          disabled={filtered.length === 0}
          className="shrink-0 rounded-[8px] border border-sage/20 px-3 py-2 font-heading text-[11px] font-bold text-forest transition-colors hover:bg-bone disabled:opacity-50"
        >
          {copiedEmail === "all" ? (
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3" /> Copied!</span>
          ) : (
            <span className="flex items-center gap-1.5"><Copy className="h-3 w-3" /> Copy All ({filtered.length})</span>
          )}
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-sage/10">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-sage">No subscribers found</p>
        ) : (
          filtered.map((sub) => (
            <div key={sub.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bone/30">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 font-heading text-[11px] font-bold text-forest">
                {sub.email[0]?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-forest">{sub.email}</p>
                <p className="text-[10px] text-sage">
                  via {sub.source} · {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                </p>
              </div>
              <button
                onClick={() => handleCopy(sub.email)}
                className="shrink-0 rounded p-1.5 text-sage transition-colors hover:bg-bone hover:text-forest"
                title="Copy email"
              >
                {copiedEmail === sub.email ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <a
                href={`mailto:${sub.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded p-1.5 text-sage transition-colors hover:bg-bone hover:text-forest"
                title="Open in email client"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="border-t border-sage/10 px-4 py-2.5">
          <p className="text-[10px] text-sage">
            {filtered.length} subscriber{filtered.length !== 1 ? "s" : ""}
            {search && ` (filtered from ${subscribers.length})`}
          </p>
        </div>
      )}
    </div>
  )
}
