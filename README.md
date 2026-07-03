# Yousuf Living

Workshop-built bedroom sets, fairly priced. Beds, wardrobes, dressing tables, and complete sets — made to order in Karachi.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity
- **Database:** Neon (PostgreSQL) + Drizzle ORM
- **Cache:** Upstash Redis
- **Storage:** Cloudflare R2
- **Auth:** BetterAuth
- **Email:** Resend
- **State:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React + React Icons
- **Deploy:** Netlify (prod) / Vercel (staging)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

See `.env.example` for the full list. Required services:

| Service | Variables |
|---------|-----------|
| Sanity CMS | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN` |
| Neon DB | `DATABASE_URL` |
| Upstash Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Cloudflare R2 | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` |
| BetterAuth | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| Resend | `RESEND_API_KEY` |

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type check
npm test                 # Run Vitest tests
npm run db:push          # Push Drizzle schema to Neon
npm run db:studio        # Open Drizzle Studio
npm run seed:sanity      # Seed Sanity CMS with sample data
npm run seed:preview     # Seed demo order + affiliate
npm run admin:create-user -- --email you@example.com --password "..."
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes (auth, account, checkout, etc.)
    admin/                # Admin dashboard
    products/             # Product detail pages
    shop/                 # Shop & category pages
    blog/                 # Blog listing & posts
  components/
    ui/                   # Reusable UI components (Button, Modal, Select, etc.)
    layout/               # Header, Footer, MobileStickyBar, CartDrawer
    home/                 # Homepage sections
    product/              # Product cards, finish swatches
    checkout/             # Checkout flow steps
    admin/                # Admin-specific components
  lib/                    # Utilities, store, auth, Sanity client, R2, email
    neon/                 # Drizzle schema & queries
  types/                  # TypeScript interfaces
  data/                   # Sample data (products, categories, blog, orders)
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `forest` | `#16352A` | Primary brand, buttons, headers |
| `gold` | `#C9A24B` | Accents, CTAs, badges |
| `bone` | `#F2EEE6` | Background, light text on dark |
| `ink` | `#1A2420` | Headings, strong text |
| `slate` | `#4A5A50` | Body text |
| `sage` | `#8A9A8E` | Muted text, borders |
| `mist` | `#D7DCD4` | Subtle backgrounds |

## License

Private — Yousuf Living.
