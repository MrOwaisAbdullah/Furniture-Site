"use client"

import { useEffect, useState } from "react"
import { Loader2, LogOut, Mail } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Payout {
  id: number
  orderRef: string
  orderValue: string
  payoutOwed: string
  payoutStatus: string
  paidAt: string | null
  createdAt: string
}

interface AffiliateMe {
  name: string
  referralCode: string
  commissionPct: string
  totalOrders: number
  totalEarned: string
  totalPaid: string
  payouts: Payout[]
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch("/api/affiliate/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? "Something went wrong")
      return
    }
    onSent(email)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      {error && <div className="rounded-[10px] bg-error/10 px-3 py-2 text-[12px] text-error">{error}</div>}
      <input
        required
        type="email"
        placeholder="Email on your application"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-h-[48px] rounded-[11px] border border-border-strong px-3.5 text-[13.5px] focus:border-forest focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-[11px] bg-forest font-heading font-bold text-[14px] text-bone disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Sending…" : "Send login code"}
      </button>
    </form>
  )
}

function OtpStep({ email, onVerified }: { email: string; onVerified: () => void }) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch("/api/affiliate/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
    setLoading(false)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? "Invalid code")
      return
    }
    onVerified()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <p className="flex items-center gap-1.5 text-[12.5px] text-slate">
        <Mail className="h-4 w-4" /> Code sent to {email}
      </p>
      {error && <div className="rounded-[10px] bg-error/10 px-3 py-2 text-[12px] text-error">{error}</div>}
      <input
        required
        inputMode="numeric"
        maxLength={6}
        placeholder="6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="min-h-[48px] rounded-[11px] border border-border-strong px-3.5 text-center font-mono text-[18px] tracking-[6px] focus:border-forest focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-[11px] bg-forest font-heading font-bold text-[14px] text-bone disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Verifying…" : "Verify & sign in"}
      </button>
    </form>
  )
}

function Dashboard({ data, onLogout }: { data: AffiliateMe; onLogout: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-[22px] text-ink">Hi, {data.name}</h1>
          <p className="mt-0.5 font-mono text-[12px] text-forest">{data.referralCode}</p>
        </div>
        <button type="button" onClick={onLogout} className="flex items-center gap-1.5 text-[12.5px] text-slate hover:text-ink">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-[14px] border border-border bg-white p-4">
          <p className="font-mono font-bold text-[20px] text-ink">{data.totalOrders}</p>
          <p className="mt-1 text-[11.5px] text-slate">Orders driven</p>
        </div>
        <div className="rounded-[14px] border border-border bg-white p-4">
          <p className="font-mono font-bold text-[20px] text-gold-700">{formatPrice(Number(data.totalEarned))}</p>
          <p className="mt-1 text-[11.5px] text-slate">Total earned</p>
        </div>
        <div className="rounded-[14px] border border-border bg-white p-4">
          <p className="font-mono font-bold text-[20px] text-success">{formatPrice(Number(data.totalPaid))}</p>
          <p className="mt-1 text-[11.5px] text-slate">Paid out</p>
        </div>
      </div>

      <h2 className="mt-8 font-heading font-bold text-[15px] text-ink">Payout history</h2>
      <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
        {data.payouts.length === 0 ? (
          <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No orders yet — share your code!</p>
        ) : (
          data.payouts.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="font-mono font-bold text-[12px] text-forest">{p.orderRef}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-sage">Order: {formatPrice(Number(p.orderValue))}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[13px] text-ink">{formatPrice(Number(p.payoutOwed))}</p>
                <p className={`font-mono text-[10px] uppercase ${p.payoutStatus === "paid" ? "text-success" : "text-gold-700"}`}>
                  {p.payoutStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function AffiliateDashboardPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [step, setStep] = useState<"email" | "otp" | "dashboard">("email")
  const [data, setData] = useState<AffiliateMe | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/affiliate/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setData(json)
          setStep("dashboard")
        }
      })
      .finally(() => setChecking(false))
  }, [])

  async function loadDashboard() {
    const res = await fetch("/api/affiliate/me")
    if (res.ok) {
      setData(await res.json())
      setStep("dashboard")
    }
  }

  async function handleLogout() {
    await fetch("/api/affiliate/logout", { method: "POST" })
    setData(null)
    setStep("email")
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-forest" />
      </div>
    )
  }

  if (step === "dashboard" && data) {
    return <Dashboard data={data} onLogout={handleLogout} />
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-heading font-black text-[22px] text-ink">Affiliate dashboard</h1>
      <p className="mt-1 text-[13px] text-slate">Sign in with the email on your affiliate application.</p>
      {step === "email" ? (
        <EmailStep onSent={(e) => { setEmail(e); setStep("otp") }} />
      ) : (
        <OtpStep email={email!} onVerified={loadDashboard} />
      )}
    </div>
  )
}
