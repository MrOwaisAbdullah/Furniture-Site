"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"

export function AiSummaryButton({ type, data }: { type: "pnl" | "funnel" | "affiliate"; data: object }) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(false)
    const res = await fetch("/api/admin/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    })
    setLoading(false)

    if (!res.ok) {
      setError(true)
      return
    }
    const body = await res.json()
    if (!body.summary) {
      setError(true)
      return
    }
    setSummary(body.summary)
  }

  if (summary) {
    return (
      <div className="mt-3 rounded-[10px] border border-gold/30 bg-gold/5 px-4 py-3">
        <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[1px] text-gold-700">
          <Sparkles className="h-3.5 w-3.5" /> AI summary
        </p>
        <p className="text-[13px] leading-[1.55] text-ink">{summary}</p>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-[8px] border border-gold/40 px-3 py-1.5 font-mono text-[11px] text-gold-700 hover:bg-gold/8 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {loading ? "Thinking…" : "AI Summary"}
      </button>
      {error && <p className="mt-1.5 text-[11px] text-sage">No summary available — check AI_API_KEY is configured.</p>}
    </div>
  )
}
