"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QrCode, Plus, Loader2, X } from "lucide-react"
import { CouponQrModal } from "./coupon-qr-modal"

export interface AdminCoupon {
  id: number
  code: string
  type: string
  value: string
  minOrderValue: string | null
  maxUses: number | null
  usedCount: number
  perUserLimit: number | null
  combinable: boolean
  expiresAt: Date | string | null
  active: boolean
  notes: string | null
  targetPhone: string | null
}

function CreateCouponForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percent" | "flat">("percent")
  const [value, setValue] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [perUserLimit, setPerUserLimit] = useState("1")
  const [combinable, setCombinable] = useState(false)
  const [expiresAt, setExpiresAt] = useState("")
  const [targetPhone, setTargetPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code, type, value: Number(value),
        maxUses: maxUses ? Number(maxUses) : undefined,
        perUserLimit: perUserLimit ? Number(perUserLimit) : undefined,
        combinable,
        expiresAt: expiresAt || undefined,
        targetPhone: targetPhone || undefined,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error ?? "Failed to create coupon")
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 lg:items-center">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-[20px] bg-white p-5 lg:rounded-[16px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-[16px] text-ink">New coupon</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-3 rounded-[10px] bg-error/10 px-3 py-2 text-[12px] text-error">{error}</div>}

        <div className="flex flex-col gap-3">
          <input
            required
            placeholder="Code (e.g. SHAADI10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="min-h-[44px] rounded-[10px] border border-border-strong px-3 font-mono text-[13.5px] focus:border-forest focus:outline-none"
          />

          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "percent" | "flat")}
              className="min-h-[44px] rounded-[10px] border border-border-strong px-3 text-[13px] focus:border-forest focus:outline-none"
            >
              <option value="percent">% off</option>
              <option value="flat">Rs off</option>
            </select>
            <input
              required
              placeholder="Value"
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[44px] flex-1 rounded-[10px] border border-border-strong px-3 text-[13.5px] focus:border-forest focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Max uses (blank = unlimited)"
              inputMode="numeric"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="min-h-[44px] flex-1 rounded-[10px] border border-border-strong px-3 text-[13px] focus:border-forest focus:outline-none"
            />
            <input
              placeholder="Per-customer limit"
              inputMode="numeric"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
              className="min-h-[44px] w-40 rounded-[10px] border border-border-strong px-3 text-[13px] focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Expiry date</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="min-h-[44px] w-full rounded-[10px] border border-border-strong px-3 text-[13px] focus:border-forest focus:outline-none"
            />
          </div>

          <input
            placeholder="Assign to customer phone (optional — targeted coupon)"
            value={targetPhone}
            onChange={(e) => setTargetPhone(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-border-strong px-3 text-[13px] focus:border-forest focus:outline-none"
          />

          <label className="flex items-center gap-2 text-[12.5px] text-slate">
            <input type="checkbox" checked={combinable} onChange={(e) => setCombinable(e.target.checked)} />
            Combinable with an affiliate code (opt-in — default is one discount per order)
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] bg-forest font-heading font-bold text-[14px] text-bone disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating…" : "Create coupon"}
          </button>
        </div>
      </form>
    </div>
  )
}

export function CouponsManager({ coupons }: { coupons: AdminCoupon[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [qrCoupon, setQrCoupon] = useState<AdminCoupon | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  async function toggleActive(coupon: AdminCoupon) {
    setTogglingId(coupon.id)
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, active: !coupon.active }),
    })
    setTogglingId(null)
    router.refresh()
  }

  const isExpired = (c: AdminCoupon) => c.expiresAt && new Date(c.expiresAt) < new Date()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
          Coupons
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-forest px-3.5 font-heading font-bold text-[12.5px] text-bone"
        >
          <Plus className="h-4 w-4" /> New coupon
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[14px] border border-border bg-white">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2 bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1px] text-sage">
          <span>Code</span><span>Discount</span><span>Uses</span><span>Expires</span><span>Status</span><span></span>
        </div>
        {coupons.length === 0 ? (
          <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No coupons yet — create one above.</p>
        ) : (
          coupons.map((c, i) => {
            const expired = isExpired(c)
            return (
              <div key={c.id} className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-[13px] text-forest">{c.code}</span>
                  {c.targetPhone && <span className="font-mono text-[9.5px] text-info">for {c.targetPhone}</span>}
                  {c.combinable && <span className="font-mono text-[9.5px] text-gold-700">combinable</span>}
                </div>
                <span className="font-mono text-[13px] text-ink">
                  {c.type === "percent" ? `${c.value}%` : `Rs ${c.value}`}
                </span>
                <span className="font-mono text-[12.5px] text-slate">
                  {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
                </span>
                <span className="font-mono text-[11.5px] text-slate">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No expiry"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleActive(c)}
                  disabled={togglingId === c.id}
                  className={`w-fit font-mono text-[10px] underline underline-offset-2 disabled:opacity-50 ${
                    expired ? "text-error" : c.active ? "text-success" : "text-sage"
                  }`}
                >
                  {expired ? "Expired" : c.active ? "Active" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => setQrCoupon(c)}
                  aria-label={`QR code for ${c.code}`}
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] text-forest hover:bg-forest/8"
                >
                  <QrCode className="h-4.5 w-4.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      {showForm && <CreateCouponForm onClose={() => setShowForm(false)} />}
      {qrCoupon && (
        <CouponQrModal
          code={qrCoupon.code}
          type={qrCoupon.type as "percent" | "flat"}
          value={Number(qrCoupon.value)}
          expiresAt={qrCoupon.expiresAt ? String(qrCoupon.expiresAt) : null}
          onClose={() => setQrCoupon(null)}
        />
      )}
    </div>
  )
}
