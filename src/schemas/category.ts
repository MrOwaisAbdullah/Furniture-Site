export const category = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "name",        type: "string", title: "Name",  validation: (R: { required: () => unknown }) => R.required() },
    { name: "slug",        type: "slug",   title: "Slug",  options: { source: "name" }, validation: (R: { required: () => unknown }) => R.required() },
    { name: "description", type: "text",   title: "Description", rows: 3 },
    { name: "image",       type: "image",  title: "Category Image", options: { hotspot: true } },
    { name: "order",       type: "number", title: "Display Order", initialValue: 0 },
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
}
