import type { Category } from "@/types";

export const sampleCategories: Category[] = [
  {
    _id: "cat-1",
    name: "Bedroom Sets",
    slug: "bedroom-sets",
    description: "Complete bedroom furniture sets including beds, side tables, dressing tables, and wardrobes",
    image: "/images/categories/bedroom-sets.jpg",
    productCount: 8,
  },
  {
    _id: "cat-2",
    name: "Beds",
    slug: "beds",
    description: "Single, king, and queen size beds crafted from solid wood",
    image: "/images/categories/beds.jpg",
    productCount: 6,
  },
  {
    _id: "cat-3",
    name: "Dressing Tables",
    slug: "dressing-tables",
    description: "Elegant dressing tables with mirrors and storage",
    image: "/images/categories/dressing-tables.jpg",
    productCount: 4,
  },
  {
    _id: "cat-4",
    name: "Wardrobes",
    slug: "wardrobes",
    description: "Spacious wardrobes with 2-door and 3-door options",
    image: "/images/categories/wardrobes.jpg",
    productCount: 5,
  },
  {
    _id: "cat-5",
    name: "Side Tables",
    slug: "side-tables",
    description: "Matching bedside tables and nightstands",
    image: "/images/categories/side-tables.jpg",
    productCount: 4,
  },
];
