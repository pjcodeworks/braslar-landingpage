import type { NextConfig } from "next";

const oneYear = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  images: {
    /** Cache das imagens otimizadas em `/_next/image` (mesmo URL = reutilização no browser) */
    minimumCacheTTL: oneYear,
    /** Incluir 100 para `quality={100}` em galerias e hero; 75 mantém o default do Next onde não se define `quality`. */
    qualities: [75, 85, 90, 92, 96, 100],
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
