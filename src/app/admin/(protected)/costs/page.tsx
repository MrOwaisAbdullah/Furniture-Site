import { getMaterialRates, getPieceCosts, getCategoryCosts, getCostModes } from "@/lib/neon/queries"
import { DEFAULT_MATERIAL_RATES, DEFAULT_PIECE_COSTS } from "@/lib/cost-sheet"
import { CostSheetEditor } from "@/components/admin/cost-sheet-editor"

export const dynamic = "force-dynamic"

export default async function AdminCostsPage() {
  const [rateRows, pieceRows, categoryRows, modeRows] = await Promise.all([
    getMaterialRates(),
    getPieceCosts(),
    getCategoryCosts(),
    getCostModes(),
  ])

  const rates = rateRows.length > 0
    ? rateRows.map((r) => ({ key: r.key, label: r.label, rate: Number(r.rate), unit: r.unit }))
    : DEFAULT_MATERIAL_RATES

  const pieces = pieceRows.length > 0
    ? pieceRows.map((p) => ({
        pieceType: p.pieceType, label: p.label,
        sheets16mm: Number(p.sheets16mm), thinSheets: Number(p.thinSheets),
        thapary: p.thapary, foam: p.foam, mirror: p.mirror,
        hardwareCost: Number(p.hardwareCost), labourCost: Number(p.labourCost), decoCost: Number(p.decoCost),
      }))
    : DEFAULT_PIECE_COSTS

  const categories = categoryRows.map((c) => ({
    categorySlug: c.categorySlug,
    manufacturingCost: Number(c.manufacturingCost),
    showroomMarginPct: Number(c.showroomMarginPct),
  }))

  const modes = modeRows.map((m) => ({ categorySlug: m.categorySlug, mode: m.mode as "average" | "per_product" }))

  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Cost Sheet
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">
        {rateRows.length === 0 ? "Showing defaults — save to persist" : "Live from your saved rates"}
      </p>

      <CostSheetEditor
        initialRates={rates}
        initialPieces={pieces}
        initialCategories={categories}
        initialModes={modes}
      />
    </div>
  )
}
