/**
 * Publishes the "Lasani MDF vs Solid Wood" post (docs/blog-draft/lasani-mdf-vs-solid-wood.md)
 * as a real blogPost document in Sanity. Uses createOrReplace so re-running
 * after an edit updates the live post instead of no-op'ing.
 * Usage: npm run tsx scripts/seed-blog-post.ts (or node_modules/.bin/tsx directly)
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
})

function block(text: string, style: "normal" | "h2" = "normal", key: string) {
  return {
    _type: "block",
    _key: key,
    style,
    children: [{ _type: "span", _key: `${key}-s`, text }],
    markDefs: [],
  }
}

const body = [
  block(
    "Every third customer who walks into our showroom asks some version of the same question: is Lasani \"real\" furniture, or is it the cheap option? Fair question. Here's the honest answer, not the sales pitch.",
    "normal", "b1"
  ),
  block("What you're actually comparing", "h2", "b2"),
  block(
    "Solid wood furniture is cut from real timber — sheesham, mango wood, kail — and joined together the old way. Lasani, which most people use as a catch-all term for MDF, is engineered: wood fibers pressed and glued under heat into a flat board, then finished with a laminate or deco polish layer. Patex chipboard is a cousin of MDF, made from coarser wood particles bonded together — usually a step cheaper again, and common in budget wardrobes and shelving.",
    "normal", "b3"
  ),
  block(
    "None of these are fake wood. They're just built differently, at different price points, and that difference shows up in how they age.",
    "normal", "b4"
  ),
  block("Where solid wood wins", "h2", "b5"),
  block(
    "A well-made solid wood bed frame or dining table can genuinely outlast the people who bought it — thirty, forty years isn't unusual if it's cared for. It can be sanded down and refinished when it gets tired-looking, so a scratch or a stain isn't a life sentence. Termites go after real timber more readily than engineered board, so if your area has a termite problem, solid wood needs more active defense.",
    "normal", "b6"
  ),
  block(
    "That durability isn't free, and it isn't automatic either. A good solid wood piece typically costs two to three times what an equivalent Lasani MDF or Patex chipboard piece does, sometimes more, because you're paying for the raw timber itself, not just the labor to shape it. For a full bedroom set, that difference is often the gap between an order you can place this month and one you have to save toward for another year. That's not a small thing, and most comparison articles skip past it. If it wasn't seasoned properly before it left the workshop, Karachi's humidity can still warp solid wood on top of that — a rushed, cheaply made solid wood piece can actually age worse than a well-made MDF one, for a price that doesn't match the risk.",
    "normal", "b7"
  ),
  block("Where MDF actually holds its own", "h2", "b8"),
  block(
    "MDF isn't just \"the cheap one that loses.\" Beyond the price gap, it has a couple of real advantages on its own.",
    "normal", "b9"
  ),
  block(
    "It doesn't warp or crack along a grain line, because there's no grain. The fibers are uniform, so a sliding wardrobe door stays flat and a drawer front doesn't twist over a hot summer. It also resists termites better than raw timber, since there's less exposed, untreated wood fiber for them to get into once it's sealed and polished.",
    "normal", "b10"
  ),
  block(
    "What it doesn't handle well is moisture. Direct water contact, a leaking AC unit dripping onto a dresser top, a damp wall behind a wardrobe — that's what actually kills MDF furniture, not normal daily use. And unlike solid wood, once MDF swells from moisture, it can't really be sanded back and saved.",
    "normal", "b11"
  ),
  block("Why we build in Lasani MDF anyway", "h2", "b12"),
  block(
    "We use 16/17mm Lasani MDF for most of what we build, and we're not going to pretend that's because it's superior to solid wood on every axis — it isn't. We use it because a full bedroom set in solid wood is out of reach for most of the families who walk into our showroom, and we'd rather build something well in a material people can actually afford than sell solid wood at a markup few can justify. It also lets us hold workshop-direct prices without cutting corners on the hardware, the joinery, or the finish, and a consistent board gives a cleaner result on the kind of sliding-door wardrobes and detailed dressing tables we build most.",
    "normal", "b13"
  ),
  block(
    "If you want a piece that's meant to be handed down and the price works for you, ask us about solid wood options — we do build in it too. If your budget is more realistic than that, and it is for most people, Lasani is the material that looks sharp, resists warping in Karachi's climate, and doesn't ask you to spend two or three times more than you need to.",
    "normal", "b14"
  ),
  block("It also depends on the look you're going for", "h2", "b15"),
  block(
    "Budget and durability aside, the two materials naturally point toward different styles.",
    "normal", "b16"
  ),
  block(
    "If you want that old, warm, traditional wood look, polish is the way to go, whether that's real polish on solid wood or a wood-paper laminate on chipboard that mimics the grain. Either one gives you that classic finish people associate with older furniture.",
    "normal", "b17"
  ),
  block(
    "If you're after something modern, clean-lined, or in a solid color, MDF with deco polish is the better fit. Deco takes color and a smooth, even finish far more consistently than natural wood grain does, which is why most of the bold or matte-colored furniture you see in newer homes is MDF underneath, not solid wood painted over.",
    "normal", "b18"
  ),
  block(
    "Neither is the \"wrong\" choice. It just depends on whether you're decorating around a traditional look or a modern one.",
    "normal", "b19"
  ),
  block("Keeping either one alive for longer", "h2", "b20"),
  block(
    "Keep furniture a few inches off damp walls and floors, especially in ground-floor rooms during monsoon season. Wipe it with a dry cloth instead of a wet one. If you have solid wood, a light wax or polish every month or so keeps the surface sealed. If you have MDF, the polish matters less for protection and more for looks, but fix a leaking pipe or AC unit near the piece right away.",
    "normal", "b21"
  ),
  block(
    "Check the underside and back panels once every few months. It's the one place people forget to look, and the one place damage usually starts first.",
    "normal", "b22"
  ),
  block(
    "Have a specific piece in mind and want to talk through solid wood vs Lasani for your space? Message us on WhatsApp and we'll give you a straight answer.",
    "normal", "b23"
  ),
]

const post = {
  _type: "blogPost",
  _id: "blogPost-lasani-mdf-vs-solid-wood",
  title: "Lasani MDF vs Solid Wood: What Actually Holds Up in a Karachi Home",
  slug: { current: "lasani-mdf-vs-solid-wood" },
  excerpt: "An honest comparison of Lasani MDF, Patex chipboard, and solid wood — durability, termites, humidity, price, and which one actually fits your budget and style.",
  author: "Yousuf Living",
  publishedAt: new Date().toISOString(),
  body,
  tags: ["materials", "buying-guide", "mdf", "solid-wood"],
  faq: [
    {
      question: "Is Lasani MDF furniture durable?",
      answer: "It doesn't warp along a grain line and resists termites better than raw timber, but it should be kept away from direct moisture and leaks — that's what actually damages MDF over time, not normal daily use.",
    },
    {
      question: "Does Yousuf Living make solid wood furniture too?",
      answer: "Yes, we build in solid wood as well, at a different price point. Message us on WhatsApp if you want a piece that's meant to be handed down.",
    },
    {
      question: "Why is solid wood so much more expensive than MDF?",
      answer: "A good solid wood piece typically costs two to three times more than an equivalent Lasani MDF or Patex chipboard piece, because you're paying for the raw timber itself, not just the labor to shape it.",
    },
  ],
  seo: {
    metaTitle: "Lasani MDF vs Solid Wood Furniture — Which Should You Choose?",
    metaDescription: "An honest comparison of Lasani MDF, Patex chipboard, and solid wood furniture for Karachi homes — durability, termites, humidity, price, and style.",
  },
}

async function main() {
  const result = await client.createOrReplace(post)
  console.log(`Blog post published: ${result._id}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
