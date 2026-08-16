import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
} as any);

const nextConfig: NextConfig = {
  turbopack: {},
  // 301 redirects for product slugs that were renamed/removed so old URLs
  // (still in Google's index / old backlinks) pass their equity to the
  // current product instead of 404'ing. Keep in sync with live Sanity slugs.
  async redirects() {
    return [
      { source: "/products/3-door-wardrobe", destination: "/products/glass-niche-wardrobe", permanent: true },
      { source: "/products/cloud-boucle-bed", destination: "/products/cloud-bubble-bed", permanent: true },
      { source: "/products/dressing-table-with-mirror", destination: "/shop/dressing-tables", permanent: true },
      { source: "/products/king-foam-bed", destination: "/shop/beds", permanent: true },
      { source: "/products/side-table-pair", destination: "/products/cloud-flare-leg-nightstand", permanent: true },
    ]
  },
  images: {
    // Custom loader: transforms are delegated to the origin CDNs
    // (Sanity / Unsplash) via URL params instead of Vercel's optimizer,
    // keeping free-tier Image Optimization usage at ~0.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        // R2 custom domain (set R2_PUBLIC_URL to match, e.g. https://cdn.yousufliving.pk)
        protocol: "https",
        hostname: "cdn.yousufliving.pk",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withSerwist(nextConfig);
