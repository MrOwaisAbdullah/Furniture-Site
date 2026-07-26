// The closed set of finish colors Yousuf Living actually offers. A single
// source of truth for the hex value behind each name — content editors in
// Sanity Studio pick a name from this list, the hex swatch color is always
// looked up from here (never hand-typed), so a swatch can never drift from
// the real color.
//
// Synonyms are merged into one canonical name: "Offwhite" → "White" and
// "Light Pink" → "Pink". normalizeFinishName() (below) collapses any legacy
// Sanity data still using the old names, so existing products keep the right
// swatch without needing a data migration.
export const FINISH_COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Black",         hex: "#1A1A1A" },
  { name: "Blue",          hex: "#2E5C8A" },
  { name: "Gray",          hex: "#8A8A8A" },
  { name: "Pink",          hex: "#F3C4D3" },
  { name: "Purple",        hex: "#6B4E8E" },
  { name: "White",         hex: "#F2EEE3" },
  { name: "Beige",         hex: "#E3D5B8" },
  { name: "Brown",         hex: "#6B4226" },
  { name: "Dark Blue",     hex: "#1B3A5C" },
  { name: "Dark Grey",     hex: "#4A4A4A" },
  { name: "Emerald Green", hex: "#0E6F4E" },
  { name: "Light Blue",    hex: "#A9CBE8" },
  { name: "Light Grey",    hex: "#D3D3D3" },
  { name: "Mustard",       hex: "#D9A62E" },
  { name: "Olive Green",   hex: "#6B7A3D" },
  { name: "Teal Green",    hex: "#1F7A6C" },
  { name: "Rust",          hex: "#A6532E" },
  { name: "Terracotta",    hex: "#B5623E" },
  { name: "Taupe",         hex: "#A69783" },
  { name: "Taupe Brown",   hex: "#6E5C4D" },
  { name: "Blush",         hex: "#E8B4B8" },
  { name: "Pastel Blue",   hex: "#C7DCEC" },
]

export const FINISH_COLOR_NAMES = FINISH_COLOR_PALETTE.map((c) => c.name)

const HEX_BY_NAME = new Map(FINISH_COLOR_PALETTE.map((c) => [c.name, c.hex]))

// Legacy → canonical name mapping for merged finishes.
const FINISH_ALIASES: Record<string, string> = {
  Offwhite: "White",
  "Light Pink": "Pink",
}

/** Collapses merged-synonym finish names to their canonical form. Unknown
 *  names pass through unchanged (so a new/legacy name still resolves if it's
 *  later added to the palette). */
export function normalizeFinishName(name: string): string {
  return FINISH_ALIASES[name] ?? name
}

/** Falls back to a neutral gray for any legacy/unrecognized color name. */
export function hexForFinishName(name: string): string {
  const canonical = normalizeFinishName(name)
  return HEX_BY_NAME.get(canonical) ?? "#999999"
}
