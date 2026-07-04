"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export interface AdminAffiliate {
  id: number
  name: string
  phone: string
  email: string | null
  referralCode: string
  commissionPct: string
  discountForBuyer: string
  platform: string | null
  handle: string | null
  followerCount: number | null
  contentType: string | null
  contentDeadline: Date | string | null
  contentLiveUrl: string | null
  collabNotes: string | null
  totalOrders: number
  totalEarned: string
  totalPaid: string
  active: boolean
  approvedAt: Date | string | null
}

function AffiliateRow({ affiliate: a }: { affiliate: AdminAffiliate }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [busy, setBusy] = useState(false)

  const [commissionPct, setCommissionPct] = useState(a.commissionPct)
  const [discountForBuyer, setDiscountForBuyer] = useState(a.discountForBuyer)
  const [platform, setPlatform] = useState(a.platform ?? "")
  const [handle, setHandle] = useState(a.handle ?? "")
  const [followerCount, setFollowerCount] = useState(String(a.followerCount ?? ""))
  const [contentType, setContentType] = useState(a.contentType ?? "")
  const [collabNotes, setCollabNotes] = useState(a.collabNotes ?? "")
  const [confirmingApprove, setConfirmingApprove] = useState(false)

  const pending = !a.approvedAt

  async function approve() {
    setBusy(true)
    await fetch(`/api/admin/affiliates/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    })
    setBusy(false)
    setConfirmingApprove(false)
    router.refresh()
  }

  async function saveDetails() {
    setBusy(true)
    await fetch(`/api/admin/affiliates/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commissionPct: Number(commissionPct),
        discountForBuyer: Number(discountForBuyer),
        platform, handle,
        followerCount: followerCount ? Number(followerCount) : undefined,
        contentType, collabNotes,
      }),
    })
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="border-t border-border first:border-t-0">
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 font-heading font-bold text-[13px] text-forest">
          {a.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-[14px] text-ink">{a.name}</p>
          <p className="font-mono text-[11px] text-sage">{a.referralCode} · {a.email ?? "no email"}</p>
        </div>
        <div className="text-right">
          <p className="font-mono font-bold text-[13px] text-gold-700">{formatPrice(Number(a.totalEarned))}</p>
          <p className="font-mono text-[10px] text-sage">{a.totalOrders} orders</p>
        </div>
        {pending ? (
          <>
            <button
              type="button"
              onClick={() => setConfirmingApprove(true)}
              disabled={busy}
              className="rounded-full bg-forest px-3 py-1.5 font-mono text-[10px] uppercase text-bone disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
            </button>
            <ConfirmDialog
              open={confirmingApprove}
              onClose={() => setConfirmingApprove(false)}
              onConfirm={approve}
              title={`Approve ${a.name}?`}
              description="They'll get portal access and their referral code becomes active immediately."
              confirmLabel="Approve"
              variant="success"
              loading={busy}
            />
          </>
        ) : (
          <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase ${a.active ? "bg-success/12 text-success" : "bg-gold/12 text-gold-700"}`}>
            {a.active ? "active" : "inactive"}
          </span>
        )}
        <button type="button" onClick={() => setExpanded((e) => !e)} className="text-slate hover:text-ink" aria-label="Expand">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-3 border-t border-border bg-surface px-4 py-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Commission %</label>
            <input value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Buyer discount (Rs)</label>
            <input value={discountForBuyer} onChange={(e) => setDiscountForBuyer(e.target.value)} className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Platform</label>
            <input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Instagram" className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Handle</label>
            <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle" className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Followers</label>
            <input value={followerCount} onChange={(e) => setFollowerCount(e.target.value)} inputMode="numeric" className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Content type</label>
            <input value={contentType} onChange={(e) => setContentType(e.target.value)} placeholder="Reel / post / story" className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-[1px] text-sage">Collab notes</label>
            <textarea value={collabNotes} onChange={(e) => setCollabNotes(e.target.value)} rows={2} className="w-full rounded-[8px] border border-border-strong bg-white px-2.5 py-2 text-[13px]" />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={saveDetails}
              disabled={busy}
              className="flex min-h-[38px] items-center gap-2 rounded-[8px] bg-forest px-3.5 font-heading font-bold text-[12.5px] text-bone disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AffiliatesManager({ affiliates }: { affiliates: AdminAffiliate[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-[14px] border border-border bg-white">
      {affiliates.length === 0 ? (
        <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No affiliate applications yet.</p>
      ) : (
        affiliates.map((a) => <AffiliateRow key={a.id} affiliate={a} />)
      )}
    </div>
  )
}
