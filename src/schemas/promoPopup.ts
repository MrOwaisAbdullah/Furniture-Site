// An image-based promotional popup shown site-wide (non-admin pages).
// Pure marketing surface — the popup renders the uploaded image at its own
// size, capped to the viewport. All timing/frequency is editable here.
// Fetched by getActivePopup() and revalidated via the /api/revalidate webhook.
type Rule = { required: () => unknown }
type MinRule = { min: (n: number) => { max?: (n: number) => unknown } }

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
      name: "image",
      type: "image",
      title: "Popup image",
      description: "The popup takes the size of this image (capped to the screen). Use a clear, web-sized image.",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text", description: "Describe the image for screen readers and SEO." },
      ],
      validation: (R: Rule) => R.required(),
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
    select: { title: "title", active: "active", media: "image" },
    prepare(selection: { title?: string; active?: boolean; media?: unknown }) {
      return {
        title: selection.title,
        subtitle: selection.active ? "Active" : "Inactive",
        media: selection.media as never,
      }
    },
  },
}
