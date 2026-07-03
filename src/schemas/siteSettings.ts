export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    { name: "siteName",        type: "string", title: "Site Name" },
    { name: "tagline",         type: "string", title: "Tagline" },
    { name: "whatsappNumber",  type: "string", title: "WhatsApp Number (e.g. 923001234567)" },
    { name: "address",         type: "text",   title: "Showroom Address" },
    { name: "hours",           type: "string", title: "Opening Hours" },
    {
      name: "socialLinks",
      type: "object",
      title: "Social Links",
      fields: [
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "facebook",  type: "url", title: "Facebook" },
        { name: "tiktok",    type: "url", title: "TikTok" },
      ],
    },
    {
      name: "seoDefaults",
      type: "object",
      title: "SEO Defaults",
      fields: [
        { name: "title",       type: "string", title: "Default Title" },
        { name: "description", type: "text",   title: "Default Description", rows: 3 },
        { name: "ogImage",     type: "image",  title: "Default OG Image" },
      ],
    },
  ],
}
