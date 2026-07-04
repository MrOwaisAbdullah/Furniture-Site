import { db } from "../src/lib/neon"
import { reviews } from "../src/lib/neon/schema"

const sampleReviews = [
  // ── King Foam Bed (Walnut) ──────────────────────────────────────────────────
  {
    productSlug: "king-foam-bed-walnut",
    name: "Ahmed K.",
    rating: 5,
    body: "Absolutely love this bed. The walnut finish is gorgeous and the foam support is incredibly comfortable. Delivery was smooth and the team was professional. Highly recommended for anyone looking for quality bedroom furniture in Karachi.",
    photoUrl: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
  {
    productSlug: "king-foam-bed-walnut",
    name: "Fatima R.",
    rating: 4,
    body: "Great bed overall. The build quality is solid and it looks premium. Took about 2 weeks for delivery which was a bit long, but the wait was worth it. Only minor issue was a small scratch on one leg, but nothing major.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "king-foam-bed-walnut",
    name: "Bilal M.",
    rating: 2,
    body: "The bed itself looks nice but the finish started peeling after just 3 months. For the price I expected better durability. The foam is comfortable though. Had to contact support multiple times to get a response.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "king-foam-bed-walnut",
    name: "Sana A.",
    rating: 5,
    body: "Perfect king bed! We searched everywhere in Karachi and this was by far the best quality we found. The walnut color matches our room perfectly. The foam is firm but comfortable. Worth every rupee.",
    photoUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },

  // ── 3-Door Wardrobe (Walnut) ───────────────────────────────────────────────
  {
    productSlug: "3-door-wardrobe-walnut",
    name: "Usman T.",
    rating: 5,
    body: "This wardrobe is massive and beautifully crafted. The walnut finish is consistent throughout and the hinges are smooth. Fits perfectly in our master bedroom. The interior shelves are well-spaced.",
    photoUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
  {
    productSlug: "3-door-wardrobe-walnut",
    name: "Hira N.",
    rating: 3,
    body: "Decent wardrobe for the price. The doors close properly and the mirror is a nice touch. However, the delivery team damaged one corner during installation. They offered to fix it but I had to follow up multiple times.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "3-door-wardrobe-walnut",
    name: "Kamran S.",
    rating: 1,
    body: "Very disappointed. The wardrobe arrived with a broken door handle and the wood has visible knots and imperfections. For 85,000 rupees I expected much better quality control. Still waiting for a replacement handle after 2 weeks.",
    photoUrl: null,
    approved: true,
  },

  // ── Dressing Table (Walnut) ────────────────────────────────────────────────
  {
    productSlug: "dressing-table-walnut",
    name: "Ayesha B.",
    rating: 5,
    body: "This dressing table is stunning! The mirror is perfect size and the drawers are spacious. My wife absolutely loves it. The walnut finish is rich and the legs are very sturdy. Excellent craftsmanship.",
    photoUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
  {
    productSlug: "dressing-table-walnut",
    name: "Zainab F.",
    rating: 4,
    body: "Beautiful piece of furniture. The drawers have a smooth finish and the mirror is clear. Only reason for 4 stars is the assembly instructions were not very clear. Had to call their support line for help.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "dressing-table-walnut",
    name: "Omar J.",
    rating: 5,
    body: "Exactly what we were looking for. The quality is outstanding and the price is fair for solid furniture. The team delivered on time and installed everything perfectly. Will definitely buy more from Yousuf Living.",
    photoUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },

  // ── Side Table Pair (Walnut) ───────────────────────────────────────────────
  {
    productSlug: "side-table-pair-walnut",
    name: "Rashid P.",
    rating: 4,
    body: "Nice side tables, exactly as shown in the pictures. The walnut color is warm and the build is solid. Delivery was within the promised timeframe. Would have given 5 stars but the legs were slightly uneven.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "side-table-pair-walnut",
    name: "Nadia K.",
    rating: 5,
    body: "Love these side tables! They look premium and are very sturdy. The size is perfect for our bedside. The finish quality is top-notch. Highly recommend for anyone looking for matching bedroom furniture.",
    photoUrl: "https://images.unsplash.com/photo-1556909114-44c8e86f9b12?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
  {
    productSlug: "side-table-pair-walnut",
    name: "Imran A.",
    rating: 2,
    body: "The tables look good but one arrived with a visible crack on the top surface. Customer service was responsive but the replacement took almost 3 weeks. Not ideal for the price point.",
    photoUrl: null,
    approved: true,
  },

  // ── Full Bedroom Set (Tier 3) ──────────────────────────────────────────────
  {
    productSlug: "full-bedroom-set-tier-3-walnut",
    name: "Saad H.",
    rating: 5,
    body: "Bought the complete bedroom set and it transformed our room completely. Everything matches perfectly - the bed, wardrobe, dressing table, and side tables. The walnut finish is consistent across all pieces. Best furniture investment we've made.",
    photoUrl: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
  {
    productSlug: "full-bedroom-set-tier-3-walnut",
    name: "Mehreen D.",
    rating: 4,
    body: "Great value for a complete set. The quality is excellent across all pieces. Delivery took a bit longer than expected (3 weeks) but they kept us informed throughout. The set looks exactly like the showroom display.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "full-bedroom-set-tier-3-walnut",
    name: "Tariq W.",
    rating: 3,
    body: "The set looks nice but the wardrobe door was slightly misaligned out of the box. They sent someone to fix it but it still doesn't close perfectly flush. The bed and dressing table are perfect though. Mixed feelings for the price.",
    photoUrl: null,
    approved: true,
  },
  {
    productSlug: "full-bedroom-set-tier-3-walnut",
    name: "Asma G.",
    rating: 5,
    body: "Worth every penny! The set is beautiful and well-crafted. We compared prices with many showrooms in Karachi and Yousuf Living offered the best quality-to-price ratio. The bedroom looks like a hotel room now.",
    photoUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80",
    approved: true,
  },
]

async function seedReviews() {
  console.log("Seeding reviews...")
  
  for (const review of sampleReviews) {
    await db.insert(reviews).values(review)
    console.log(`  ✓ ${review.name} — ${review.productSlug} (${review.rating}★)`)
  }

  console.log(`\nDone! Seeded ${sampleReviews.length} reviews.`)
}

seedReviews().catch((err) => {
  console.error("Failed to seed reviews:", err)
  process.exit(1)
})
