"use client"

import { useMemo, useState } from "react"
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  computeSetCosts, computePricingLadder, computePromoRoom,
  type MaterialRate, type PieceCost,
} from "@/lib/cost-sheet"

interface CategoryCost {
  categorySlug: string
  manufacturingCost: number
  showroomMarginPct: number
}

interface CostMode {
  categorySlug: string
  mode: "average" | "per_product"
}

const CATEGORY_LABELS: Record<string, string> = {
  "bedroom-sets":    "Bedroom Sets (Full)",
  "beds":            "Beds",
  "dressing-tables": "Dressing Tables",
  "side-tables":     "Side Tables",
  "wardrobes":       "Wardrobes",
}

function NumberInput({ value, onChange, className = "" }: { value: number; onChange: (v: number) => void; className?: string }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={`min-h-[36px] rounded-[8px] border border-border-strong bg-white px-2.5 text-right font-mono text-[12.5px] text-ink focus:border-forest focus:outline-none ${className}`}
    />
  )
}

export function CostSheetEditor({
  initialRates,
  initialPieces,
  initialCategories,
  initialModes,
}: {
  initialRates: MaterialRate[]
  initialPieces: PieceCost[]
  initialCategories: CategoryCost[]
  initialModes: CostMode[]
}) {
  const [rates, setRates] = useState(initialRates)
  const [pieces, setPieces] = useState(initialPieces)
  const [deductions, setDeductions] = useState(0)
  const [wastagePct, setWastagePct] = useState(5)
  const [showroomMarginPct, setShowroomMarginPct] = useState(20)
  const [onlineRetailMarkupPct, setOnlineRetailMarkupPct] = useState(40)

  const [affiliateCommissionPct, setAffiliateCommissionPct] = useState(4)
  const [couponDiscountPct, setCouponDiscountPct] = useState(5)
  const [deliveryCostAbsorbed, setDeliveryCostAbsorbed] = useState(0)
  const [marginAlertThreshold, setMarginAlertThreshold] = useState(15)

  const categorySlugs = Object.keys(CATEGORY_LABELS)
  const [categories, setCategories] = useState<CategoryCost[]>(() =>
    categorySlugs.map((slug) => initialCategories.find((c) => c.categorySlug === slug) ?? {
      categorySlug: slug, manufacturingCost: 0, showroomMarginPct: 20,
    })
  )
  const [modes, setModes] = useState<CostMode[]>(() =>
    categorySlugs.map((slug) => initialModes.find((m) => m.categorySlug === slug) ?? {
      categorySlug: slug, mode: "average" as const,
    })
  )

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setCosts = useMemo(() => computeSetCosts(pieces, rates, { deductions, wastagePct }), [pieces, rates, deductions, wastagePct])
  const ladder = useMemo(
    () => computePricingLadder(setCosts.manufacturingCost, showroomMarginPct, onlineRetailMarkupPct),
    [setCosts.manufacturingCost, showroomMarginPct, onlineRetailMarkupPct]
  )
  const promo = useMemo(
    () => computePromoRoom(ladder.retailPrice, ladder.grossProfit, { affiliateCommissionPct, couponDiscountPct, deliveryCostAbsorbed }),
    [ladder.retailPrice, ladder.grossProfit, affiliateCommissionPct, couponDiscountPct, deliveryCostAbsorbed]
  )

  const marginHealthy = promo.netMarginPct >= marginAlertThreshold

  function updatePiece(pieceType: string, patch: Partial<PieceCost>) {
    setPieces((prev) => prev.map((p) => (p.pieceType === pieceType ? { ...p, ...patch } : p)))
  }

  function updateRate(key: string, rate: number) {
    setRates((prev) => prev.map((r) => (r.key === key ? { ...r, rate } : r)))
  }

  function updateCategory(slug: string, patch: Partial<CategoryCost>) {
    setCategories((prev) => prev.map((c) => (c.categorySlug === slug ? { ...c, ...patch } : c)))
  }

  function updateMode(slug: string, mode: CostMode["mode"]) {
    setModes((prev) => prev.map((m) => (m.categorySlug === slug ? { ...m, mode } : m)))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const res = await fetch("/api/admin/cost-sheet", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates, pieces, categories, modes }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-6">
      {/* 1. Material rates */}
      <section className="overflow-hidden rounded-[14px] border border-border bg-white">
        <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
          1. Material rates (global — changing these recalculates everything below)
        </div>
        {rates.map((rate, i) => (
          <div key={rate.key} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-ink truncate">{rate.label}</p>
              <p className="font-mono text-[10.5px] text-sage">{rate.unit}</p>
            </div>
            <span className="font-mono text-[11px] text-sage">Rs</span>
            <NumberInput value={rate.rate} onChange={(v) => updateRate(rate.key, v)} className="w-28" />
          </div>
        ))}
      </section>

      {/* 2. Per-piece BOM */}
      <section className="overflow-x-auto rounded-[14px] border border-border bg-white">
        <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
          2. Bill of materials (per piece)
        </div>
        <table className="w-full min-w-[720px] text-[12.5px]">
          <thead>
            <tr className="border-t border-border text-left font-mono text-[10px] uppercase tracking-[1px] text-sage">
              <th className="px-4 py-2 font-normal">Piece</th>
              <th className="px-2 py-2 font-normal text-right">16mm sheets</th>
              <th className="px-2 py-2 font-normal text-right">Thin sheets</th>
              <th className="px-2 py-2 font-normal text-center">Thapary</th>
              <th className="px-2 py-2 font-normal text-center">Foam</th>
              <th className="px-2 py-2 font-normal text-center">Mirror</th>
              <th className="px-2 py-2 font-normal text-right">Hardware</th>
              <th className="px-2 py-2 font-normal text-right">Labour</th>
              <th className="px-2 py-2 font-normal text-right">Deco</th>
              <th className="px-4 py-2 font-normal text-right">Piece total</th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((piece) => {
              const total = setCosts.pieceTotals.find((t) => t.pieceType === piece.pieceType)?.total ?? 0
              return (
                <tr key={piece.pieceType} className="border-t border-border">
                  <td className="px-4 py-2.5 font-heading font-bold text-ink">{piece.label}</td>
                  <td className="px-2 py-2"><NumberInput value={piece.sheets16mm} onChange={(v) => updatePiece(piece.pieceType, { sheets16mm: v })} className="w-20" /></td>
                  <td className="px-2 py-2"><NumberInput value={piece.thinSheets} onChange={(v) => updatePiece(piece.pieceType, { thinSheets: v })} className="w-20" /></td>
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" checked={piece.thapary} onChange={(e) => updatePiece(piece.pieceType, { thapary: e.target.checked })} />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" checked={piece.foam} onChange={(e) => updatePiece(piece.pieceType, { foam: e.target.checked })} />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" checked={piece.mirror} onChange={(e) => updatePiece(piece.pieceType, { mirror: e.target.checked })} />
                  </td>
                  <td className="px-2 py-2"><NumberInput value={piece.hardwareCost} onChange={(v) => updatePiece(piece.pieceType, { hardwareCost: v })} className="w-24" /></td>
                  <td className="px-2 py-2"><NumberInput value={piece.labourCost} onChange={(v) => updatePiece(piece.pieceType, { labourCost: v })} className="w-24" /></td>
                  <td className="px-2 py-2"><NumberInput value={piece.decoCost} onChange={(v) => updatePiece(piece.pieceType, { decoCost: v })} className="w-24" /></td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-forest">{formatPrice(total)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* 3. Set-level + 4. Pricing ladder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-[14px] border border-border bg-white">
          <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
            3. Set-level costs
          </div>
          <Row label="Pieces subtotal" value={formatPrice(setCosts.piecesSubtotal)} />
          <RowInput label="Returns / deductions (Rs)" value={deductions} onChange={setDeductions} />
          <RowInput label="Wastage %" value={wastagePct} onChange={setWastagePct} suffix="%" />
          <Row label="Manufacturing cost" value={formatPrice(setCosts.manufacturingCost)} bold />
        </section>

        <section className="overflow-hidden rounded-[14px] border border-border bg-white">
          <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
            4. Pricing ladder
          </div>
          <RowInput label="Showroom margin %" value={showroomMarginPct} onChange={setShowroomMarginPct} suffix="%" />
          <Row label="Wholesale price" value={formatPrice(ladder.wholesalePrice)} />
          <RowInput label="Online retail markup %" value={onlineRetailMarkupPct} onChange={setOnlineRetailMarkupPct} suffix="%" />
          <Row label="Retail price" value={formatPrice(ladder.retailPrice)} bold />
          <Row label="Gross profit" value={`${formatPrice(ladder.grossProfit)} (${ladder.grossMarginPct.toFixed(1)}%)`} />
        </section>
      </div>

      {/* 5. Promo room (what-if planner — not persisted) */}
      <section className="overflow-hidden rounded-[14px] border border-border bg-white">
        <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
          5. Promo room — what-if planner (assumptions, not saved)
        </div>
        <RowInput label="Affiliate commission %" value={affiliateCommissionPct} onChange={setAffiliateCommissionPct} suffix="%" />
        <RowInput label="Coupon / launch discount %" value={couponDiscountPct} onChange={setCouponDiscountPct} suffix="%" />
        <RowInput label="Delivery cost absorbed (Rs)" value={deliveryCostAbsorbed} onChange={setDeliveryCostAbsorbed} />
        <Row label="Net profit" value={formatPrice(promo.netProfit)} bold />
        <Row label="Net margin" value={`${promo.netMarginPct.toFixed(1)}%`} />
        <RowInput label="Margin alert threshold %" value={marginAlertThreshold} onChange={setMarginAlertThreshold} suffix="%" />
        <div className={`flex items-center gap-2 px-4 py-3 text-[12.5px] ${marginHealthy ? "text-success" : "text-error"}`}>
          {marginHealthy ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {marginHealthy ? "Margin OK" : "Below target — review coupon discounts and affiliate commissions"}
        </div>
      </section>

      {/* 6. Category averages (Mode 1) */}
      <section className="overflow-hidden rounded-[14px] border border-border bg-white">
        <div className="bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-sage">
          6. Category averages — quick setup mode
        </div>
        {categories.map((cat, i) => {
          const mode = modes.find((m) => m.categorySlug === cat.categorySlug)?.mode ?? "average"
          return (
            <div key={cat.categorySlug} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="min-w-[140px] flex-1 text-[13px] text-ink">{CATEGORY_LABELS[cat.categorySlug]}</span>
              <label className="font-mono text-[10.5px] text-sage">Mfg cost</label>
              <NumberInput value={cat.manufacturingCost} onChange={(v) => updateCategory(cat.categorySlug, { manufacturingCost: v })} className="w-28" />
              <label className="font-mono text-[10.5px] text-sage">Margin %</label>
              <NumberInput value={cat.showroomMarginPct} onChange={(v) => updateCategory(cat.categorySlug, { showroomMarginPct: v })} className="w-20" />
              <select
                value={mode}
                onChange={(e) => updateMode(cat.categorySlug, e.target.value as CostMode["mode"])}
                className="min-h-[36px] rounded-[8px] border border-border-strong bg-white px-2 text-[12px] focus:border-forest focus:outline-none"
              >
                <option value="average">Average</option>
                <option value="per_product">Per-product</option>
              </select>
            </div>
          )
        })}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex min-h-[44px] items-center gap-2 rounded-[10px] bg-forest px-4 font-heading font-bold text-[13px] text-bone disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save cost sheet"}
        </button>
        {saved && <span className="font-mono text-[11px] text-success">Saved</span>}
      </div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 first:border-t-0">
      <span className={`text-[13px] ${bold ? "font-heading font-bold text-forest" : "text-slate"}`}>{label}</span>
      <span className={`font-mono text-[13px] ${bold ? "font-bold text-forest" : "text-ink"}`}>{value}</span>
    </div>
  )
}

function RowInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 first:border-t-0">
      <span className="text-[13px] text-slate">{label}</span>
      <div className="flex items-center gap-1.5">
        <NumberInput value={value} onChange={onChange} className="w-24" />
        {suffix && <span className="font-mono text-[11px] text-sage">{suffix}</span>}
      </div>
    </div>
  )
}
