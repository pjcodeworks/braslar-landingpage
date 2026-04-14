import type { NextConfig } from "next";

const oneYear = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  images: {
    /** Cache das imagens otimizadas em `/_next/image` (mesmo URL = reutilização no browser) */
    minimumCacheTTL: oneYear,
  },
  async headers() {
    return [
      {
        source: "/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
