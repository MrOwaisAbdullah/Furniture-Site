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
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "featuredImage" },
  },
}
