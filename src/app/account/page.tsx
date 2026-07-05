"use client"

import { useEffect, useState } from "react"
import { Loader2, LogOut, Mail, Tag, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { AddressBook } from "@/components/account/address-book"

interface Order {
  id: number
  ref: string
  items: unknown
  subtotal: string
  discount: string
  total: string
  status: string
  couponCode: string | null
  createdAt: string
}

interface TargetedCoupon {
  id: number
  code: string
  type: string
  value: string
  expiresAt: string | null
  active: boolean
}

interface Redemption {
  couponId: number
  orderRef: string
  orderValue: string
  discountApplied: string
  redeemedAt: string
}

interface AccountMe {
  phone: string
  orders: Order[]
  targetedCoupons: TargetedCoupon[]
  redemptions: Redemption[]
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch("/api/account/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const body = await res.json().catch(() => null)
    setLoading(false)
    if (!res.ok) {
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
        placeholder="e.g. you@example.com"
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
      <p className="text-center text-[11px] text-sage">
        Use the email you gave us at checkout — no orders yet? Place one first.
      </p>
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
    const res = await fetch("/api/account/otp/verify", {
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
        <Mail className="h-4 w-4" /> Enter the code emailed to you
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

function AccountView({ data, onLogout }: { data: AccountMe; onLogout: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-[22px] text-ink">My account</h1>
          <p className="mt-0.5 font-mono text-[12px] text-sage">{data.phone}</p>
        </div>
        <button type="button" onClick={onLogout} className="flex items-center gap-1.5 text-[12.5px] text-slate hover:text-ink">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <AddressBook />

      {data.targetedCoupons.length > 0 && (
        <>
          <h2 className="mt-8 flex items-center gap-1.5 font-heading font-bold text-[15px] text-ink">
            <Tag className="h-4 w-4 text-gold-700" /> Coupons for you
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {data.targetedCoupons.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-[12px] border border-gold/30 bg-gold/5 px-4 py-3">
                <div>
                  <p className="font-mono font-bold text-[13px] text-forest">{c.code}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-sage">
                    {c.expiresAt ? `Expires ${new Date(c.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "No expiry"}
                  </p>
                </div>
                <span className="font-mono text-[13px] text-gold-700">
                  {c.type === "percent" ? `${c.value}% off` : `Rs ${c.value} off`}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 flex items-center gap-1.5 font-heading font-bold text-[15px] text-ink">
        <Package className="h-4 w-4" /> Past orders
      </h2>
      <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
        {data.orders.length === 0 ? (
          <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No orders yet.</p>
        ) : (
          data.orders.map((o, i) => (
            <div key={o.id} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="font-mono font-bold text-[12.5px] text-forest">{o.ref}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-sage capitalize">{o.status.replace(/_/g, " ")}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[13px] text-ink">{formatPrice(Number(o.total))}</p>
                {o.couponCode && <p className="font-mono text-[10px] text-info">{o.couponCode}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      {data.redemptions.length > 0 && (
        <>
          <h2 className="mt-8 font-heading font-bold text-[15px] text-ink">Coupon usage history</h2>
          <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
            {data.redemptions.map((r, i) => (
              <div key={`${r.couponId}-${r.orderRef}`} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <p className="font-mono text-[11.5px] text-slate">{r.orderRef}</p>
                <p className="font-mono text-[12px] text-success">-{formatPrice(Number(r.discountApplied))}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [step, setStep] = useState<"email" | "otp" | "account">("email")
  const [data, setData] = useState<AccountMe | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/account/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setData(json)
          setStep("account")
        }
      })
      .finally(() => setChecking(false))
  }, [])

  async function loadAccount() {
    const res = await fetch("/api/account/me")
    if (res.ok) {
      setData(await res.json())
      setStep("account")
    }
  }

  async function handleLogout() {
    await fetch("/api/account/logout", { method: "POST" })
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

  if (step === "account" && data) {
    return <AccountView data={data} onLogout={handleLogout} />
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-heading font-black text-[22px] text-ink">My account</h1>
      <p className="mt-1 text-[13px] text-slate">See your past orders and coupons.</p>
      {step === "email" ? (
        <EmailStep onSent={(e) => { setEmail(e); setStep("otp") }} />
      ) : (
        <OtpStep email={email!} onVerified={loadAccount} />
      )}
    </div>
  )
}
