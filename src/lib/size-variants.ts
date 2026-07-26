// Standard width per King/Queen/Single size variant — the same across every
// product that offers these sizes (beds, and anything meant to match a
// bed's width, like a storage bench). A product's own stored `dimensions`
// only needs to hold the King-size width as a base/default; height and
// depth stay constant across all three sizes and are never overridden here.
export const SIZE_VARIANT_WIDTH: Record<string, string> = {
  King:   "72",
  Queen:  "60",
  Single: "42",
}
