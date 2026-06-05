import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Prototype property + avatar imagery is served from Unsplash.
    // In production, swap for your own CDN (Cloudinary / S3).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
    qualities: [60, 75, 90],
  },
  async headers() {
    // Baseline security headers. Tighten CSP before production.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
