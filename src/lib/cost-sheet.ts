// Pure calculation functions for the cost sheet, matching
// docs/furniture-cost-pricing-model-v5.xlsx exactly. Kept dependency-free
// so the same math runs server-side (page render) and client-side
// (live recompute as the admin edits inputs).

export interface MaterialRate {
  key: string
  label: string
  rate: number
  unit: string
}

export interface PieceCost {
  pieceType: string
  label: string
  sheets16mm: number
  thinSheets: number
  thapary: boolean
  foam: boolean
  mirror: boolean
  hardwareCost: number
  labourCost: number
  decoCost: number
}

export function rateFor(rates: MaterialRate[], key: string): number {
  return rates.find((r) => r.key === key)?.rate ?? 0
}

export function computePieceTotal(piece: PieceCost, rates: MaterialRate[]): number {
  const mdf = rateFor(rates, "mdf16mm")
  const thin = rateFor(rates, "thinBoard")
  const foamRexine = rateFor(rates, "foamRexinePerBed")
  const mirrorGlass = rateFor(rates, "mirrorGlass")
  const thapary = rateFor(rates, "thapary")

  const materials =
    piece.sheets16mm * mdf +
    piece.thinSheets * thin +
    (piece.foam ? foamRexine : 0) +
    (piece.thapary ? thapary : 0) +
    (piece.mirror ? mirrorGlass : 0)

  return materials + piece.hardwareCost + piece.labourCost + piece.decoCost
}

export function computeSetCosts(pieces: PieceCost[], rates: MaterialRate[], opts: {
  deductions?: number
  wastagePct?: number
} = {}) {
  const deductions = opts.deductions ?? 0
  const wastagePct = opts.wastagePct ?? 5

  const pieceTotals = pieces.map((p) => ({ pieceType: p.pieceType, label: p.label, total: computePieceTotal(p, rates) }))
  const piecesSubtotal = pieceTotals.reduce((sum, p) => sum + p.total, 0)
  const wastageAmt = ((piecesSubtotal - deductions) * wastagePct) / 100
  const manufacturingCost = piecesSubtotal - deductions + wastageAmt

  return { pieceTotals, piecesSubtotal, wastageAmt, manufacturingCost }
}

export function computePricingLadder(manufacturingCost: number, showroomMarginPct: number, onlineRetailMarkupPct: number) {
  const wholesalePrice = manufacturingCost * (1 + showroomMarginPct / 100)
  const retailPrice = wholesalePrice * (1 + onlineRetailMarkupPct / 100)
  const grossProfit = retailPrice - wholesalePrice
  const grossMarginPct = retailPrice > 0 ? (grossProfit / retailPrice) * 100 : 0
  return { wholesalePrice, retailPrice, grossProfit, grossMarginPct }
}

export function computePromoRoom(retailPrice: number, grossProfit: number, opts: {
  affiliateCommissionPct: number
  couponDiscountPct: number
  deliveryCostAbsorbed: number
}) {
  const affiliateAmt = (retailPrice * opts.affiliateCommissionPct) / 100
  const couponAmt = (retailPrice * opts.couponDiscountPct) / 100
  const netProfit = grossProfit - affiliateAmt - couponAmt - opts.deliveryCostAbsorbed
  const netMarginPct = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0
  const totalPromoSpendPct = retailPrice > 0 ? ((affiliateAmt + couponAmt) / retailPrice) * 100 : 0
  return { affiliateAmt, couponAmt, netProfit, netMarginPct, totalPromoSpendPct }
}

export const DEFAULT_MATERIAL_RATES: MaterialRate[] = [
  { key: "mdf16mm",          label: "MDF / Lasani 16mm (raw, 4x8)", rate: 5800,  unit: "per sheet" },
  { key: "thinBoard",        label: "Thin board 6–9mm",             rate: 2000,  unit: "per sheet" },
  { key: "foamRexinePerBed", label: "Foam + Rexine (per bed)",      rate: 20000, unit: "per bed" },
  { key: "mirrorGlass",      label: "Dressing/side-table mirror",   rate: 9000,  unit: "per unit" },
  { key: "thapary",          label: "Thapary (below mattress)",     rate: 6500,  unit: "per bed" },
]

export const DEFAULT_PIECE_COSTS: PieceCost[] = [
  { pieceType: "bed",              label: "Foam king bed (6x6.5)", sheets16mm: 3, thinSheets: 0,   thapary: true,  foam: true,  mirror: false, hardwareCost: 2000, labourCost: 4000, decoCost: 0 },
  { pieceType: "side_tables_pair",  label: "Side tables (pair)",    sheets16mm: 2, thinSheets: 1,   thapary: false, foam: false, mirror: false, hardwareCost: 4000, labourCost: 4000, decoCost: 10000 },
  { pieceType: "dressing_table",    label: "Dressing table",        sheets16mm: 1, thinSheets: 1,   thapary: false, foam: false, mirror: true,  hardwareCost: 8000, labourCost: 4000, decoCost: 10000 },
  { pieceType: "wardrobe_3door",    label: "3-door wardrobe",       sheets16mm: 6, thinSheets: 1.5, thapary: false, foam: false, mirror: false, hardwareCost: 5400, labourCost: 5000, decoCost: 20000 },
]
