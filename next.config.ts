import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
} as any);

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    // Next 16 requires an explicit allowlist; restricting it to just 90
    // means every <Image> that doesn't set its own `quality` prop (they
    // default internally to 75) gets coerced up to this one allowed value —
    // a sitewide sharpness bump without touching every call site.
    qualities: [90],
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
