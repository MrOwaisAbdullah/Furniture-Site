export const blogPost = {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title",         type: "string",   title: "Title",   validation: (R: { required: () => unknown }) => R.required() },
    { name: "slug",          type: "slug",     title: "Slug",    options: { source: "title" }, validation: (R: { required: () => unknown }) => R.required() },
    { name: "excerpt",       type: "text",     title: "Excerpt", rows: 3 },
    { name: "publishedAt",   type: "datetime", title: "Published At" },
    { name: "author",        type: "string",   title: "Author" },
    { name: "featuredImage", type: "image",    title: "Featured Image", options: { hotspot: true } },
    {
      name: "body",
      type: "array",
      title: "Body",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    },
    {
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "faq",
      type: "array",
      title: "FAQ",
      description: "Shown at the end of the post and marked up as FAQ structured data for Google.",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question", validation: (R: { required: () => unknown }) => R.required() },
            { name: "answer",   type: "text",   title: "Answer", rows: 3, validation: (R: { required: () => unknown }) => R.required() },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    },
    {
      name: "seo",
      type: "object",
      title: "SEO",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "metaTitle",       type: "string", title: "Meta title", description: "Leave blank to use the post title." },
        { name: "metaDescription", type: "text",   title: "Meta description", rows: 2, description: "Leave blank to use the excerpt." },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "featuredImage" },
  },
}
