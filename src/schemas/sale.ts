// A standalone promotion — not tied to editing one product's price directly.
// Targets specific products and/or whole categories, with a percentage or
// fixed-amount discount and a date range. Resolved at read time by
// src/lib/sanity/map-product.ts (best-discount-wins if more than one
// active sale covers the same product).
export const sale = {
  name: "sale",
  title: "Sale / Promotion",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Internal label (e.g. Eid Sale 2026)", validation: (R: { required: () => unknown }) => R.required() },
    {
      name: "discountType",
      type: "string",
      title: "Discount type",
      options: { list: [{ title: "Percentage off", value: "percentage" }, { title: "Fixed amount off (PKR)", value: "fixed" }] },
      validation: (R: { required: () => unknown }) => R.required(),
    },
    { name: "discountValue", type: "number", title: "Discount value", validation: (R: { required: () => { min: (n: number) => unknown } }) => R.required().min(0) },
    {
      name: "appliesToProducts",
      type: "array",
      title: "Applies to specific products",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      name: "appliesToCategories",
      type: "array",
      title: "Applies to entire categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    { name: "startsAt", type: "datetime", title: "Starts at", validation: (R: { required: () => unknown }) => R.required() },
    { name: "endsAt", type: "datetime", title: "Ends at", validation: (R: { required: () => unknown }) => R.required() },
    { name: "active", type: "boolean", title: "Active", description: "Manual on/off switch, independent of the date range", initialValue: true },
  ],
  preview: {
    select: { title: "title", discountType: "discountType", discountValue: "discountValue", active: "active" },
    prepare(selection: Record<string, unknown>) {
      const { title, discountType, discountValue, active } = selection as {
        title: string; discountType: string; discountValue: number; active: boolean
      }
      const amount = discountType === "percentage" ? `${discountValue}% off` : `Rs ${discountValue} off`
      return { title, subtitle: `${amount}${active ? "" : " — inactive"}` }
    },
  },
}
