import { FINISH_COLOR_NAMES } from "../lib/finish-colors"

// A hand-curated collection of specific products sold together at one flat
// price — distinct from `product.bundleCoversCategories` (a single product
// pretending to cover several categories, e.g. the Shaadi Package SKU).
// Powers /sets and /sets/[slug].
export const bundle = {
  name: "bundle",
  title: "Bundle Deal",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name", validation: (R: { required: () => unknown }) => R.required() },
    { name: "slug", type: "slug", title: "Slug", options: { source: "name" }, validation: (R: { required: () => unknown }) => R.required() },
    { name: "description", type: "text", title: "Description", rows: 3 },
    {
      name: "image",
      type: "image",
      title: "Cover image (optional)",
      options: { hotspot: true },
      description: "Shown on the /sets list card. Leave empty to fall back to the first product's own photo.",
    },
    {
      name: "products",
      type: "array",
      title: "Products in this bundle",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (R: { required: () => { min: (n: number) => unknown } }) => R.required().min(2),
    },
    {
      name: "finishNames",
      type: "array",
      title: "Color options",
      description: "The color(s) a customer can choose for this bundle — the chosen color applies to every piece at once, so only list colors every selected product actually offers.",
      of: [{ type: "string" }],
      options: { list: FINISH_COLOR_NAMES, layout: "tags" },
      validation: (R: { required: () => { min: (n: number) => unknown } }) => R.required().min(1),
    },
    {
      name: "bundlePrice",
      type: "number",
      title: "Bundle price (PKR)",
      description: "The flat total price for buying every piece in this bundle together, in any of the color options above.",
      validation: (R: { required: () => { min: (n: number) => unknown } }) => R.required().min(0),
    },
    {
      name: "variantOverrides",
      type: "array",
      title: "Variant overrides (advanced)",
      description: "For a piece normally sold as \"Single\", pick a different variant this bundle uses instead (e.g. \"Pair\") — match the exact variant name on that product. Leave empty to use each product's default (first) variant.",
      of: [{
        type: "object",
        fields: [
          { name: "product", type: "reference", to: [{ type: "product" }], validation: (R: { required: () => unknown }) => R.required() },
          { name: "variantSize", type: "string", title: "Variant name", validation: (R: { required: () => unknown }) => R.required() },
        ],
        preview: {
          select: { title: "product.name", subtitle: "variantSize" },
        },
      }],
    },
    { name: "active", type: "boolean", title: "Active", initialValue: true },
  ],
  preview: {
    select: { title: "name", price: "bundlePrice", active: "active", products: "products", media: "image" },
    prepare(selection: { title?: string; price?: number; active?: boolean; products?: unknown[]; media?: never }) {
      const count = selection.products?.length ?? 0
      return {
        title: selection.title,
        subtitle: `${selection.active ? "Active" : "Inactive"} · ${count} piece${count === 1 ? "" : "s"} · Rs ${selection.price ?? 0}`,
        media: selection.media,
      }
    },
  },
}
