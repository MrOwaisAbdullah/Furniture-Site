/**
 * Publishes three supporting blog posts (care/maintenance, buying checklist,
 * finishes explained) so the flagship Lasani MDF post has real related/recent
 * posts to link to. Mirrors docs/draft-blog/*.md exactly. Uses createOrReplace
 * so re-running after an edit updates the live posts instead of creating
 * duplicates.
 * Usage: node_modules/.bin/tsx scripts/seed-more-blog-posts.ts
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

// ── Post 1: Care & maintenance ──────────────────────────────────────────────

const careBody = [
  block(
    "We get calls a couple of times a month from people saying their furniture \"went bad\" after a year or two. Almost none of it is a manufacturing problem. It's usually one of a handful of habits, and most of them are easy to fix once you know what to look for.",
    "normal", "c1"
  ),
  block("The real enemy is moisture, not time", "h2", "c2"),
  block(
    "An AC unit dripping onto a dresser top, a damp wall behind a wardrobe on the ground floor during monsoon, a glass of water left on a side table overnight without a coaster. That's what actually shortens the life of a piece, not normal daily use. MDF is worse off here than solid wood. Once it swells from standing water, it doesn't sand back and recover the way timber can.",
    "normal", "c3"
  ),
  block(
    "If you mop near furniture, keep the legs dry afterward instead of letting the water sit and evaporate against the wood.",
    "normal", "c4"
  ),
  block("Sun fades things faster than people expect", "h2", "c5"),
  block(
    "A piece sitting half in direct sunlight through a window will fade unevenly, usually within a year or two, not decades. Polish dulls first, laminate holds up a bit longer. If you can't move the piece out of the light, a curtain during peak afternoon hours does more than any polish or spray.",
    "normal", "c6"
  ),
  block("Cleaning habits that actually help", "h2", "c7"),
  block(
    "A dry or barely damp cloth is enough for most day-to-day cleaning. Skip ammonia-based sprays on polished surfaces, they strip the finish faster than they clean it. For upholstered headboards, a vacuum with a brush attachment once a week keeps dust from working into the fabric.",
    "normal", "c8"
  ),
  block("Hardware wears out before the wood does", "h2", "c9"),
  block(
    "Hinges and drawer channels loosen with use. Check the screws every few months and tighten what's moved. If a drawer starts sticking during monsoon, that's usually humidity swelling the wood slightly, not damage. It eases up on its own once the weather dries out. Forcing it is what actually causes damage.",
    "normal", "c10"
  ),
  block("When it's worth calling someone", "h2", "c11"),
  block(
    "Deep scratches on polish, water rings that won't wipe off, a joint that's gone wobbly. A workshop touch-up for any of these is almost always cheaper than people assume, and cheaper than replacing the piece. We do this kind of repair work too, not just new orders.",
    "normal", "c12"
  ),
  block(
    "Got a piece that needs a look? Message us on WhatsApp with a photo and we'll tell you honestly whether it's worth fixing.",
    "normal", "c13"
  ),
]

const carePost = {
  _type: "blogPost",
  _id: "blogPost-furniture-care-karachi-climate",
  title: "What Actually Damages Bedroom Furniture in Karachi (And What Doesn't)",
  slug: { current: "furniture-care-karachi-climate" },
  excerpt: "Most furniture damage we see isn't from age. It's moisture, direct sun, and a few habits people don't think twice about. Here's what actually matters.",
  author: "Yousuf Living",
  publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  body: careBody,
  tags: ["care", "maintenance", "buying-guide"],
  faq: [
    { question: "Can water really ruin MDF furniture?", answer: "Yes, if it's left standing. Wipe up spills right away — standing water is the main cause of MDF swelling, and unlike solid wood, it doesn't sand back once it's swollen." },
    { question: "How often should I polish solid wood furniture?", answer: "A light wax or polish every month or so keeps the surface sealed, especially in humid weather. MDF pieces need it less for protection, more just for looks." },
    { question: "Does direct sunlight actually damage furniture?", answer: "Yes. A piece sitting half in direct sunlight fades unevenly, often within a year or two, not decades. Polish dulls first, laminate holds up a bit longer. A curtain during peak afternoon hours helps more than any spray or polish." },
    { question: "What's the safest way to clean furniture day to day?", answer: "A dry or barely damp cloth is enough for most cleaning. Skip ammonia-based sprays on polished surfaces, they strip the finish faster than they clean it." },
    { question: "Why does my wardrobe drawer stick during monsoon?", answer: "Humidity swells the wood slightly in wet weather. It eases up on its own once things dry out. Forcing a sticking drawer is what actually causes damage, not the swelling itself." },
    { question: "How often should I check hinges and drawer hardware?", answer: "Every few months. Tighten whatever's loosened, since hardware tends to wear out before the wood itself does." },
    { question: "Do you repair or touch up existing furniture?", answer: "Yes. Message us on WhatsApp with a photo and we'll give you a straight answer on whether it's worth fixing." },
  ],
  seo: {
    metaTitle: "Furniture Care in Karachi — What Actually Causes Damage",
    metaDescription: "Most bedroom furniture damage in Karachi comes from moisture and sun, not age. A practical care guide from a Karachi furniture workshop.",
  },
}

// ── Post 2: Buying checklist ─────────────────────────────────────────────────

const buyingBody = [
  block(
    "Ordering a bedroom set is a different kind of decision than picking up a side table on a weekend trip to the market. It's a bigger order, it's usually made to order, and a few questions answered upfront save a lot of back-and-forth later.",
    "normal", "d1"
  ),
  block("Measure the room before you fall in love with a design", "h2", "d2"),
  block(
    "Door width matters for getting a wardrobe or bed frame inside, not just floor space once it's in the room. Leave enough clearance to actually open wardrobe doors and walk around the bed comfortably. We offer custom sizing at no extra cost, so it's worth measuring properly and asking for a size that fits, rather than working backward from a standard size that's close enough.",
    "normal", "d3"
  ),
  block("Decide what you actually need to store", "h2", "d4"),
  block(
    "A 2-door wardrobe is enough for one person's clothes in most cases. A 3-door with a mirror panel makes more sense for a shared room or someone with more clothes than average. Drawers in a dressing table matter more than people think when they're ordering, and matter a lot once they're actually using it daily.",
    "normal", "d5"
  ),
  block("Matching pieces vs mixing and matching", "h2", "d6"),
  block(
    "Pieces from the same design line share a finish, so a bed, wardrobe, and side tables from one set look like they belong together instead of assembled from different sources. Buying two or more matching pieces together also tends to come with a better price than ordering them one at a time over separate visits.",
    "normal", "d7"
  ),
  block("Buy smart, not just cheap", "h2", "d8"),
  block(
    "There's an Urdu saying that puts this better than any sales pitch could: \"mehnga roi ek baar, sasta roi baar baar.\" Expensive makes you wince once, at the price tag. Cheap makes you wince again and again, every time something warps, splits, or needs replacing within a year.",
    "normal", "d9"
  ),
  block(
    "That doesn't mean spend more just to spend more. It means don't chase the lowest number on the tag. A full bedroom set, bed, side tables, wardrobe, and a dressing table with mirror, going for 60-80 thousand rupees (you'll see this around Lalu Khait) usually means corners were cut somewhere. Thin board, weak joints, hardware that won't survive daily use for more than a year or two. It looks like a bedroom set in the shop. It doesn't hold up like one at home.",
    "normal", "d10"
  ),
  block(
    "This matters even more for jahez furniture. It's usually the first bedroom set a couple actually lives with, and it's often something a bride's family has put together with real care. Furniture that looks tired or falls apart within the first year reflects badly at exactly the moment it shouldn't. Spending smart here, quality that's actually built to last at a fair workshop-direct price, matters more for this kind of order than almost any other.",
    "normal", "d11"
  ),
  block(
    "None of this means the most expensive option is automatically the right one. It means matching real quality to a fair price, not chasing whatever number is lowest.",
    "normal", "d12"
  ),
  block("What actually changes the price", "h2", "d13"),
  block(
    "Material is the biggest factor. Lasani MDF versus solid wood makes the largest difference on its own. After that it's size and number of pieces, then finish. Deco patterns and detailed carving take longer to apply than a plain polish or laminate. Ask for a breakdown if a quote feels high, it's a normal question and we'd rather explain it than have you guess.",
    "normal", "d14"
  ),
  block("Delivery and installation in Karachi", "h2", "d15"),
  block(
    "We deliver and assemble on-site. Payment is typically 30-50% advance with the balance on delivery, not full payment upfront. Timeline depends on how custom the order is. A standard size usually moves faster than a fully custom set.",
    "normal", "d16"
  ),
  block(
    "Not sure what size or configuration fits your room? Send us the room dimensions on WhatsApp and we'll help you figure it out before you order.",
    "normal", "d17"
  ),
]

const buyingPost = {
  _type: "blogPost",
  _id: "blogPost-bedroom-set-buying-checklist",
  title: "What to Check Before You Order a Bedroom Set",
  slug: { current: "bedroom-set-buying-checklist" },
  excerpt: "A few questions worth answering before you place an order — room size, storage needs, why cheap sets cost more in the long run, and what actually changes the price.",
  author: "Yousuf Living",
  publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  body: buyingBody,
  tags: ["buying-guide", "bedroom", "sizing", "quality", "jahez"],
  faq: [
    { question: "Do you offer custom sizing?", answer: "Yes, free of charge. It's worth measuring your room properly and asking for a size that actually fits rather than a standard size that's close enough." },
    { question: "How does payment work?", answer: "Typically 30-50% advance with the balance due on delivery, not full payment upfront." },
    { question: "Can I order individual pieces instead of a full set?", answer: "Yes. Individual pieces are fine, though buying matched pieces together often unlocks a better price than ordering them separately over time." },
    { question: "Is cheaper furniture actually a bad deal?", answer: "Not always, but a full bedroom set priced far below workshop rates usually means thinner board, weaker joints, and hardware that won't last. \"Mehnga roi ek baar, sasta roi baar baar\" — expensive stings once, cheap stings again and again. Spend smart: good quality at a fair, workshop-direct price, not the lowest number you can find." },
    { question: "How do I know if I need a 2-door or 3-door wardrobe?", answer: "A 2-door wardrobe is usually enough for one person's clothes. A 3-door with a mirror panel makes more sense for a shared room or someone with more clothes than average." },
    { question: "Does buying a matching set actually save money?", answer: "Usually, yes. Pieces from the same design line share a finish, so buying two or more together tends to come with a better price than ordering them one at a time over separate visits." },
    { question: "How long does delivery and installation take in Karachi?", answer: "It depends on how custom the order is. A standard size usually moves faster than a fully custom set. We deliver and assemble on-site either way." },
  ],
  seo: {
    metaTitle: "Bedroom Set Buying Checklist — What to Check First",
    metaDescription: "What to measure, decide, and ask about before ordering a bedroom set — sizing, storage, why cheap sets cost more long-term, pricing, and delivery in Karachi.",
  },
}

// ── Post 3: Finishes explained ───────────────────────────────────────────────

const finishesBody = [
  block(
    "Laminate, veneer, polish, and deco get used interchangeably in most showroom conversations, but they're different processes with different price tags and different durability. Worth knowing the difference before you pick one.",
    "normal", "e1"
  ),
  block("Laminate is a printed layer bonded to the board", "h2", "e2"),
  block(
    "It's usually the cheapest of the group, comes in a wide range of finishes including wood-grain prints, and the top layer resists scratches better than paint or a thin polish coat. It doesn't chip the way paint can.",
    "normal", "e3"
  ),
  block("Veneer is a thin slice of real wood glued onto the board", "h2", "e4"),
  block(
    "It gives you an actual wood grain look at a fraction of solid wood's price, since it's a thin layer over engineered board rather than solid timber all the way through. The tradeoff is that a deep scratch can go through the veneer to the board underneath, so it needs slightly more careful handling than laminate does.",
    "normal", "e5"
  ),
  block("Solid wood gets its polish sanded on by hand", "h2", "e6"),
  block(
    "This is the traditional route: real timber, hand-sanded and polished directly, no board or laminate layer involved at all. It gives a depth and warmth no printed or synthetic layer fully copies, which is why it's still the pick for a traditional or heirloom-style look. It takes longer to apply than any board finish, which shows up in the price, and it's a thinner protective layer than laminate or deco, so scratches show more over time. That's the tradeoff for the look.",
    "normal", "e7"
  ),
  block("Lasani MDF deco is a bold, modern decorative layer", "h2", "e8"),
  block(
    "Deco is what most bright, solid-colored modern furniture is built with. Like laminate, it's a decorative layer bonded to Lasani MDF board, but deco sheets lean toward solid colors, matte finishes, and contemporary patterns rather than wood-grain prints. Want a piece in matte sage green or a clean minimal look with no wood texture at all? Deco gets you there. It holds color and an even finish more consistently than polish or natural wood grain ever does.",
    "normal", "e9"
  ),
  block("Which one fits which room", "h2", "e10"),
  block(
    "For a kid's room or anywhere that sees heavy daily use, laminate's practicality wins. For a formal bedroom where you want a real wood look without solid wood pricing, veneer is the middle ground. For a traditional or jahez-style piece where authenticity matters most, solid wood polish is worth the extra cost. For a modern, colorful bedroom set, deco on Lasani MDF is usually the better fit, and the more affordable one.",
    "normal", "e11"
  ),
  block(
    "Not sure which finish makes sense for your space? Tell us the room and the budget on WhatsApp and we'll point you toward what actually fits, not just what we have in stock.",
    "normal", "e12"
  ),
]

const finishesPost = {
  _type: "blogPost",
  _id: "blogPost-furniture-finishes-explained",
  title: "Laminate, Veneer, Solid Wood Polish, and MDF Deco: What's the Actual Difference?",
  slug: { current: "furniture-finishes-explained" },
  excerpt: "Four finishes get mentioned constantly in showrooms and mixed up just as often. Here's what each one actually is, and which fits which kind of room.",
  author: "Yousuf Living",
  publishedAt: new Date().toISOString(),
  body: finishesBody,
  tags: ["materials", "finishes", "buying-guide"],
  faq: [
    { question: "Which finish lasts longest day to day?", answer: "Laminate and deco are usually the most scratch-resistant for daily use. Solid wood polish and veneer age well too if cared for, but need more attention." },
    { question: "Is veneer real wood?", answer: "Yes. It's a thin layer of real wood glued onto engineered board, which gives a genuine wood grain look at a lower price than solid wood." },
    { question: "What's the difference between laminate and deco?", answer: "Both are decorative layers bonded to board, but laminate covers a wider range including wood-grain prints, while deco leans toward bold solid colors and modern matte patterns, and is almost always paired with Lasani MDF for contemporary furniture." },
    { question: "What's the difference between veneer and solid wood?", answer: "Veneer is a thin slice of real wood glued onto engineered board. Solid wood is real timber all the way through. Veneer gets you the same grain look for a lot less money, but a deep scratch can go through to the board underneath." },
    { question: "Is deco the same as painting MDF?", answer: "No. Deco is a decorative sheet bonded to the board, not paint applied on top, so it doesn't chip or peel the way paint can over time." },
    { question: "Which finish is best for a jahez or heirloom-style bedroom set?", answer: "Solid wood polish, if the budget allows it. It's the finish that holds up best over decades and gives that traditional, authentic look people want for a set that's meant to last a lifetime." },
    { question: "Can I mix finishes within one room?", answer: "You can, but we'd recommend sticking to one finish family per set so the room reads as put together rather than assembled from different sources." },
  ],
  seo: {
    metaTitle: "Laminate vs Veneer vs Solid Wood vs MDF Deco — Furniture Finishes Explained",
    metaDescription: "What laminate, veneer, solid wood polish, and Lasani MDF deco actually are, how they differ in durability and price, and which fits which room.",
  },
}

async function main() {
  for (const post of [carePost, buyingPost, finishesPost]) {
    const result = await client.createOrReplace(post)
    console.log(`Published: ${result._id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
