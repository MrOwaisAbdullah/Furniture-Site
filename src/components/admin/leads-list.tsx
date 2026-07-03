"use client"

import { useState } from "react"

interface Lead {
  id: number
  name: string
  phone: string
  productSlug: string | null
  message: string | null
  source: string
  followedUp: boolean
  createdAt: Date | string
}

export function LeadsList({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)

  async function toggle(id: number, followedUp: boolean) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, followedUp } : l)))
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, followedUp }),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {leads.map((lead) => (
        <div key={lead.id} className="rounded-[14px] border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-heading font-bold text-[14px] text-ink">{lead.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-sage">{lead.phone}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(lead.id, !lead.followedUp)}
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[1px] ${
                lead.followedUp ? "bg-success/15 text-success" : "bg-gold/15 text-gold-700"
              }`}
            >
              {lead.followedUp ? "Followed up" : "Needs follow-up"}
            </button>
          </div>
          {lead.message && <p className="mt-2.5 text-[12.5px] text-slate">{lead.message}</p>}
          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono text-[10px] text-sage">via {lead.source}{lead.productSlug ? ` · ${lead.productSlug}` : ""}</p>
            <p className="font-mono text-[10px] text-mist">
              {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
