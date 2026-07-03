"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  className?: string
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    console.log("[track] share_click", { title })
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-[10px] border border-border-strong px-3.5 py-2.5 font-heading font-bold text-[12.5px] text-slate transition-colors hover:bg-surface-sunken",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 stroke-success" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Share"}
    </button>
  )
}
