import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import {
  HERO_CAROUSEL_SLIDES,
  type HeroCarouselImageSlide,
} from "@/lib/hero-carousel-slides";
import { SITE } from "@/lib/site";

const ogImageSlide = HERO_CAROUSEL_SLIDES.find(
  (s): s is HeroCarouselImageSlide => s.kind === "image",
);

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-montserrat",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    ...(ogImageSlide
      ? {
          images: [
            {
              url: ogImageSlide.desktop,
              alt: ogImageSlide.alt,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    ...(ogImageSlide ? { images: [ogImageSlide.desktop] } : {}),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const heroVideoPreload =
  HERO_CAROUSEL_SLIDES[0]?.kind === "video" ? (
    <>
      <link
        rel="preload"
        href={HERO_CAROUSEL_SLIDES[0].desktop}
        as="video"
        type="video/mp4"
        media="(min-width: 768px)"
      />
      <link
        rel="preload"
        href={HERO_CAROUSEL_SLIDES[0].mobile}
        as="video"
        type="video/mp4"
        media="(max-width: 767px)"
      />
    </>
  ) : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <head>{heroVideoPreload}</head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
