import { createClient } from "@sanity/client"

// One-off helper for the product `active` toggle work:
//   inspect          — list products (active state) and bundles with their product refs
//   backfill         — set active: true on every product missing the field
//   set <id> <bool>  — force active on one product (for testing)
//   test <id>        — run storefront + bundle GROQ candidates against a deactivated product

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const [cmd, arg, arg2] = process.argv.slice(2)

if (cmd === "inspect") {
  const products = await client.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name, "slug": slug.current, active, featured }`
  )
  const bundles = await client.fetch(
    `*[_type == "bundle"]{ _id, name, active, "productIds": products[]._ref }`
  )
  console.log("products:", products.length, "| with active field:", products.filter((p) => p.active !== undefined).length)
  for (const b of bundles) console.log("bundle:", b._id, b.name, "active:", b.active, "products:", b.productIds.length)
  console.log(JSON.stringify(products, null, 1))
  process.exit(0)
}

if (cmd === "backfill") {
  const ids = await client.fetch(`*[_type == "product" && !defined(active)]._id`)
  console.log("backfilling", ids.length, "products without an active field")
  for (const id of ids) await client.patch(id).set({ active: true }).commit()
  const missing = await client.fetch(`*[_type == "product" && !(_id in path("drafts.**")) && !defined(active)]._id`)
  console.log("remaining without active:", missing.length)
  process.exit(0)
}

if (cmd === "set") {
  await client.patch(arg).set({ active: arg2 === "true" }).commit()
  console.log(`set ${arg} active=${arg2}`)
  process.exit(0)
}

if (cmd === "test") {
  const id = arg
  const slug = await client.fetch(`*[_id == $id][0].slug.current`, { id })
  const result = { productId: id, slug }

  // 1) storefront queries must EXCLUDE the deactivated product
  const all = await client.fetch(`*[_type == "product" && active != false && !(_id in path("drafts.**"))]._id`)
  result.excludedFromProducts = !all.includes(id)
  const incl = await client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]._id`)
  result.includedWhenIncludeInactive = incl.includes(id)
  const bySlug = await client.fetch(
    `*[_type == "product" && active != false && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug }
  )
  result.slugQueryReturnsNull = bySlug == null
  const catCount = await client.fetch(`count(*[_type == "product" && active != false && references(^._id)])`, {})
  result.categoryCountQueryRuns = typeof catCount === "number"

  // 2) bundle projection: does an inactive member get filtered out?
  const bundles = await client.fetch(
    `*[_type == "bundle" && count(*[ _type=="product" && _id in ^.products[]._ref && active == false ]) > 0]{ _id, name, "ids": products[]._ref }`,
    {},
    {}
  )
  const target = bundles.find((b) => b.ids.includes(id))
  result.affectedBundle = target ? target.name : null
  if (target) {
    const candidates = {
      baseline: `*[_type == "bundle" && _id == $bid][0]{ "ids": products[]->_id }`,
      // candidate A: deref the element inside the filter
      candA: `*[_type == "bundle" && _id == $bid][0]{ "ids": products[@->active != false]->_id }`,
      // candidate B: plain attribute on the reference (expected broken/silent)
      candB: `*[_type == "bundle" && _id == $bid][0]{ "ids": products[active != false]->_id }`,
      // candidate C: filter after deref via inner projection
      candC: `*[_type == "bundle" && _id == $bid][0]{ "ids": [][], "tmp": products[]->{ _id, active } }`,
    }
    for (const [name, q] of Object.entries(candidates)) {
      try {
        const r = await client.fetch(q, { bid: target._id })
        if (name === "candC") {
          result[name] = r.tmp.filter((p) => p.active !== false).map((p) => p._id)
        } else {
          result[name] = r.ids
        }
      } catch (e) {
        result[name] = `ERROR: ${e.message?.split("\n")[0]}`
      }
    }
    const allIds = (await client.fetch(`*[_type=="bundle" && _id==$bid][0]{ "ids": products[]->_id }`, { bid: target._id })).ids
    result.expectedFilteredIds = allIds.filter((x) => x !== id)
  }

  console.log(JSON.stringify(result, null, 2))
  process.exit(0)
}

console.log("usage: node active-test.mjs <inspect|backfill|set <id> <bool>|test <id>>")
process.exit(1)

