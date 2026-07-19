"use client"

import { useState } from "react"
import { Gift, Percent, Users, Loader2 } from "lucide-react"
import { waLink } from "@/lib/site-config"

const perks = [
  {
    icon: Percent,
    label: "5% for you",
    desc: "Earn 5% of every order placed through your link or code.",
  },
  {
    icon: Gift,
    label: "5% for your referral",
    desc: "Your contact gets a 5% discount on their first purchase.",
  },
  {
    icon: Users,
    label: "No minimum",
    desc: "Share once or a hundred times. No targets, no pressure.",
  },
]

export default function AffiliatePage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [platform, setPlatform] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const waHref = waLink(
    `Hi, I'd like to join the Yousuf Living affiliate programme.\n\nName: ${name}\nWhatsApp: ${phone}\nEmail: ${email}\nPlatform / reach: ${platform}`
  )

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const res = await fetch("/api/affiliate/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, platform }),
    })

    setSubmitting(false)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? "Something went wrong — try again")
      return
    }
    setSubmitted(true)
    window.open(waHref, "_blank", "noopener,noreferrer")
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/12">
          <Gift className="h-7 w-7 stroke-gold-700" />
        </div>
        <h1
          className="mt-5 font-display italic text-forest"
          style={{ fontSize: "28px" }}
        >
          Application sent!
        </h1>
        <p className="mt-2 max-w-xs text-[13px] leading-[1.55] text-slate">
          We&apos;ll review your application and email you at <strong>{email}</strong> once approved, with a link to
          your affiliate dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}>
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
        <p
          className="font-mono uppercase text-gold"
          style={{ fontSize: "10px", letterSpacing: "3px" }}
        >
          Partner programme
        </p>
        <h1
          className="mt-3 font-display leading-[1.05]"
          style={{ fontSize: "clamp(30px,7vw,52px)" }}
        >
          Earn with every
          <br />
          <span className="italic text-gold">referral.</span>
        </h1>
        <p className="mt-4 max-w-md text-[13.5px] leading-[1.6] text-bone/65">
          Share Yousuf Living with friends, family, or your audience. When they order, you earn — and they save.
        </p>

        {/* Stats strip */}
        <div className="mt-7 flex gap-5">
          {[
            { value: "5%", label: "You earn" },
            { value: "5%", label: "They save" },
            { value: "PKR", label: "Paid monthly" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-mono font-bold text-gold" style={{ fontSize: "24px" }}>
                {s.value}
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[1.5px] text-bone/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-xl px-5 py-8 sm:px-8">
        {/* Perks */}
        <div className="flex flex-col gap-3">
          {perks.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex gap-4 rounded-[14px] border border-border bg-white p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/8">
                <Icon className="h-5 w-5 stroke-forest" strokeWidth={2} />
              </div>
              <div>
                <p className="font-heading font-bold text-[14.5px] text-ink">{label}</p>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-slate">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Apply form */}
        <div className="mt-8">
          <h2
            className="font-heading font-black text-ink"
            style={{ fontSize: "20px", letterSpacing: "-0.4px" }}
          >
            Apply to join
          </h2>
          <p className="mt-1 text-[12.5px] text-slate">
            Takes 30 seconds. We&apos;ll send your unique code on WhatsApp.
          </p>

          <form onSubmit={handleApply} className="mt-5 flex flex-col gap-4">
            {error && (
              <div className="rounded-[10px] bg-error/10 px-3.5 py-2.5 text-[12.5px] text-error">{error}</div>
            )}

            <div>
              <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                Your name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sara Ahmed"
                className="w-full rounded-[10px] border border-border-strong bg-white px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                WhatsApp number
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 3XX XXXXXXX"
                className="w-full rounded-[10px] border border-border-strong bg-white px-3.5 py-3.5 font-mono text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[10px] border border-border-strong bg-white px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-sage">Used to send your dashboard login code once approved.</p>
            </div>

            <div>
              <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">
                Platform / how you&apos;ll share
              </label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. Instagram · 3k followers, WhatsApp groups, word of mouth"
                className="w-full rounded-[10px] border border-border-strong bg-white px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone transition-transform active:scale-[.99] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              )}
              {submitting ? "Submitting…" : "Apply now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
