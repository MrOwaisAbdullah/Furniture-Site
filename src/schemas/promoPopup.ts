// An image-based promotional popup shown site-wide (non-admin pages).
// Pure marketing surface — the popup renders the uploaded image at its own
// size, capped to the viewport. Supports 2+ variants for A/B testing; each
// visitor is randomly assigned one (weighted) and sticks with it. All
// timing/frequency is editable here, shared across variants.
// Fetched by getActivePopup() and revalidated via the /api/revalidate webhook.
type Rule = { required: () => unknown }
type MinRule = { min: (n: number) => { max?: (n: number) => unknown } }
type ArrayRule = { min: (n: number) => unknown }

export const promoPopup = {
  name: "promoPopup",
  title: "Promo Popup",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Internal label (e.g. Eid Sale Popup)",
      description: "Only for your reference in the studio — not shown to visitors.",
      validation: (R: Rule) => R.required(),
    },
    {
      name: "variants",
      type: "array",
      title: "Variants (A/B test)",
      description: "Add 2+ images to A/B test creatives. Traffic is split by weight, and each visitor keeps seeing the same variant they were first assigned.",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Variant name (e.g. Variant A)",
              validation: (R: Rule) => R.required(),
            },
            {
              name: "image",
              type: "image",
              title: "Image",
              description: "The popup takes the size of this image (capped to the screen). Use a clear, web-sized image.",
              options: { hotspot: true },
              fields: [
                { name: "alt", type: "string", title: "Alt text", description: "Describe the image for screen readers and SEO." },
              ],
              validation: (R: Rule) => R.required(),
            },
            {
              name: "weight",
              type: "number",
              title: "Traffic weight",
              description: "Relative share of visitors who see this variant, e.g. 50/50.",
              initialValue: 50,
              validation: (R: MinRule) => R.min(1),
            },
          ],
          preview: {
            select: { title: "name", subtitle: "weight", media: "image" },
            prepare(selection: { title?: string; subtitle?: number; media?: unknown }) {
              return {
                title: selection.title,
                subtitle: selection.subtitle ? `Weight: ${selection.subtitle}` : undefined,
                media: selection.media as never,
              }
            },
          },
        },
      ],
      validation: (R: ArrayRule) => R.min(1),
    },
    {
      name: "linkUrl",
      type: "string",
      title: "Click-through link (optional)",
      description: "Where clicking the image sends the visitor, e.g. /shop or /coupon/EID20. Leave blank for no link.",
    },
    {
      name: "active",
      type: "boolean",
      title: "Active",
      description: "Master on/off switch, independent of the date range below.",
      initialValue: false,
    },
    {
      name: "startsAt",
      type: "datetime",
      title: "Show from (optional)",
      description: "Leave blank to start immediately.",
    },
    {
      name: "endsAt",
      type: "datetime",
      title: "Show until (optional)",
      description: "Leave blank to run indefinitely.",
    },
    {
      name: "delaySeconds",
      type: "number",
      title: "Delay before showing (seconds)",
      description: "How long after the page loads before the popup appears.",
      initialValue: 3,
      validation: (R: MinRule) => R.min(0),
    },
    {
      name: "maxPerSession",
      type: "number",
      title: "Max times to show per session",
      description: "How many times a visitor sees it in a single browsing session.",
      initialValue: 1,
      validation: (R: MinRule) => R.min(1),
    },
    {
      name: "cooldownDays",
      type: "number",
      title: "Don't show again for (days) after closing",
      description: "Once a visitor closes it, hide it for this many days. 0 = may show again next session.",
      initialValue: 7,
      validation: (R: MinRule) => R.min(0),
    },
  ],
  preview: {
    select: { title: "title", active: "active", variants: "variants", media: "variants.0.image" },
    prepare(selection: { title?: string; active?: boolean; variants?: unknown[]; media?: unknown }) {
      const count = selection.variants?.length ?? 0
      return {
        title: selection.title,
        subtitle: `${selection.active ? "Active" : "Inactive"} · ${count} variant${count === 1 ? "" : "s"}`,
        media: selection.media as never,
      }
    },
  },
}
