import type { BlogPost } from "@/types";
import { BUSINESS_NAME, ADDRESS_FULL, PHONE_DISPLAY } from "@/lib/site-config";

const AUTHOR = `${BUSINESS_NAME} Team`;

export const sampleBlogPosts: BlogPost[] = [
  {
    _id: "blog-1",
    title: "How to Choose the Right Bedroom Set for Your Home",
    slug: "how-to-choose-bedroom-set",
    excerpt: "Choosing a bedroom set is a big decision. Here's what to consider before buying — from size and material to budget and style.",
    body: "Buying a bedroom set is one of the most important furniture decisions you'll make. The right set transforms your bedroom from a place to sleep into a sanctuary.\n\n## Consider Your Space\n\nMeasure your room first. A king bed needs at least 12x14 feet of space. If your room is smaller, consider a queen size.\n\n## Material Matters\n\nSolid wood furniture like Sheesham lasts generations. Particle board may be cheaper but won't survive a move.\n\n## The Value Proposition\n\nA complete bedroom set (bed + side tables + dressing + wardrobe) costs less than buying pieces separately. At Yousuf Living, our Full House complete set at Rs 330,000 includes everything — where others charge Rs 270,000 for just bed and tables.",
    featuredImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    author: AUTHOR,
    tags: ["bedroom", "furniture", "guide", "buying-tips"],
    publishedAt: "2026-03-15",
    updatedAt: "2026-03-15",
  },
  {
    _id: "blog-2",
    title: "Solid Wood vs Engineered Wood: What You Need to Know",
    slug: "solid-wood-vs-engineered-wood",
    excerpt: "Not all wood furniture is created equal. Learn the real differences between solid wood and engineered wood.",
    body: "The furniture market is full of confusing terminology. Let's break down what really matters.\n\n## Solid Wood\n\nSolid wood is cut directly from trees. It's durable, can be refinished, and develops character over time. Sheesham (Indian Rosewood) is popular in Pakistan for its hardness and grain.\n\n## Engineered Wood\n\nMDF, particle board, and plywood are engineered wood products. They're cheaper but less durable. They swell with moisture and can't be refinished.\n\n## The Honest Truth\n\nAt Yousuf Living, we use solid Sheesham wood for all our furniture. It costs more to make, but your furniture will last 20-30 years instead of 2-3.",
    featuredImage: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=80",
    author: AUTHOR,
    tags: ["wood", "materials", "guide"],
    publishedAt: "2026-04-10",
    updatedAt: "2026-04-10",
  },
  {
    _id: "blog-3",
    title: "Visit Our Showroom in Manzoor Colony",
    slug: "visit-showroom",
    excerpt: `See and touch our furniture before you buy. Visit our showroom at ${ADDRESS_FULL}.`,
    body: `We believe you should see furniture before you buy it. That's why we have a showroom at ${ADDRESS_FULL}.\n\n## What to Expect\n\n- Full bedroom set displays\n- All finish options available to touch and compare\n- Expert staff to help you choose\n- No pressure sales\n\n## Location\n\n${ADDRESS_FULL}. Open Monday to Saturday, 10am to 8pm.\n\n## Book a Visit\n\nWhatsApp us at ${PHONE_DISPLAY} to schedule a visit. We'll have someone ready to help you.`,
    featuredImage: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=900&q=80",
    author: AUTHOR,
    tags: ["showroom", "visit", "karachi"],
    publishedAt: "2026-05-01",
    updatedAt: "2026-05-01",
  },
];
