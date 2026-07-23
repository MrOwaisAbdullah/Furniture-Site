import { FINISH_COLOR_NAMES } from "../lib/finish-colors"

// Sale pricing is NOT a field here — it's managed entirely through the
// `sale` document type (schemas/sale.ts), which can target specific
// products or whole categories with a percentage or fixed discount and a
// date range. See resolveSalePrice() in src/lib/sanity/map-product.ts.
export const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    { name: "name",        type: "string",   title: "Name",        validation: (R: { required: () => unknown }) => R.required() },
    { name: "slug",        type: "slug",     title: "Slug",        options: { source: "name" }, validation: (R: { required: () => unknown }) => R.required() },
    { name: "category",    type: "reference", title: "Category",   to: [{ type: "category" }], validation: (R: { required: () => unknown }) => R.required() },
    { name: "basePrice",   type: "number",   title: "Base Price (PKR)", validation: (R: { required: () => { min: (n: number) => unknown } }) => R.required().min(0) },
    {
      name: "compareAtPrice",
      type: "number",
      title: "Compare-at price (PKR, optional)",
      description: "A permanent \"if bought separately\" reference price shown struck through next to Base Price — for bundle SKUs where buying the set is structurally cheaper than the individual pieces. Not for time-limited discounts — use a Sale/Promotion for those.",
    },
    { name: "sku",         type: "string",   title: "SKU" },
    { name: "stockCount",  type: "number",   title: "Stock Count", initialValue: 0 },
    { name: "inStock",     type: "boolean",  title: "In Stock",    initialValue: true },
    { name: "featured",    type: "boolean",  title: "Featured on Homepage", initialValue: false },
    {
      name: "images",
      type: "array",
      title: "Product Images",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    {
      name: "finishes",
      type: "array",
      title: "Available Finishes",
      description: "The swatch color is always looked up from the color name — there's no separate hex field to keep in sync.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Color",
              options: { list: FINISH_COLOR_NAMES },
              validation: (R: { required: () => unknown }) => R.required(),
            },
            { name: "priceModifier", type: "number", title: "Price Modifier (PKR)", initialValue: 0 },
            {
              name: "images",
              type: "array",
              title: "Photos in this color",
              description: "Shown in the product gallery when a customer selects this color. Leave empty to keep showing the default product photos for this color.",
              of: [{ type: "image", options: { hotspot: true } }],
            },
          ],
        },
      ],
    },
    {
      name: "variants",
      type: "array",
      title: "Variants",
      description: "Configuration or size options for this piece — e.g. King/Queen/Single, Single/Pair, or Base/With Mirror/With Mirror & Stool. The first variant is the default shown on page load; picking any other one appends its label to the product name in the title and cart.",
      of: [
        {
          type: "object",
          fields: [
            { name: "size",          type: "string", title: "Variant label (e.g. Single, Pair, With Mirror & Stool)" },
            { name: "priceModifier", type: "number", title: "Price Modifier (PKR)", initialValue: 0 },
          ],
        },
      ],
    },
    {
      name: "dimensions",
      type: "object",
      title: "Dimensions",
      fields: [
        { name: "width",  type: "string", title: "Width" },
        { name: "height", type: "string", title: "Height" },
        { name: "depth",  type: "string", title: "Depth" },
        { name: "unit",   type: "string", title: "Unit", initialValue: "cm" },
      ],
    },
    { name: "material",          type: "string", title: "Material" },
    { name: "description",       type: "text",   title: "Description", rows: 4 },
    { name: "careInstructions",  type: "text",   title: "Care Instructions", rows: 3 },
    {
      name: "tags",
      type: "array",
      title: "Tags (for search & SEO)",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "bundleCoversCategories",
      type: "array",
      title: "Bundle covers categories (only for full sets)",
      description: "Category slugs this product already includes (e.g. beds, wardrobes) — stops the site suggesting 'add a bed' when this bundle already has one.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
  ],
  preview: {
    select: { title: "name", subtitle: "category.name", media: "images.0" },
  },
}
