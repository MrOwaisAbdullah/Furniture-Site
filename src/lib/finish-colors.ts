// The closed set of finish colors Yousuf Living actually offers. A single
// source of truth for the hex value behind each name — content editors in
// Sanity Studio pick a name from this list, the hex swatch color is always
// looked up from here (never hand-typed), so a swatch can never drift from
// the real color.
export const FINISH_COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Black",         hex: "#1A1A1A" },
  { name: "Blue",          hex: "#2E5C8A" },
  { name: "Gray",          hex: "#8A8A8A" },
  { name: "Light Pink",    hex: "#F3C4D3" },
  { name: "Purple",        hex: "#6B4E8E" },
  { name: "White",         hex: "#FFFFFF" },
  { name: "Beige",         hex: "#E3D5B8" },
  { name: "Brown",         hex: "#6B4226" },
  { name: "Dark Blue",     hex: "#1B3A5C" },
  { name: "Dark Grey",     hex: "#4A4A4A" },
  { name: "Emerald Green", hex: "#0E6F4E" },
  { name: "Light Blue",    hex: "#A9CBE8" },
  { name: "Light Grey",    hex: "#D3D3D3" },
  { name: "Mustard",       hex: "#D9A62E" },
  { name: "Offwhite",      hex: "#F2EEE3" },
  { name: "Olive Green",   hex: "#6B7A3D" },
  { name: "Teal Green",    hex: "#1F7A6C" },
]

export const FINISH_COLOR_NAMES = FINISH_COLOR_PALETTE.map((c) => c.name)

const HEX_BY_NAME = new Map(FINISH_COLOR_PALETTE.map((c) => [c.name, c.hex]))

/** Falls back to a neutral gray for any legacy/unrecognized color name. */
export function hexForFinishName(name: string): string {
  return HEX_BY_NAME.get(name) ?? "#999999"
}
