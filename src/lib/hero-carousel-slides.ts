import { SITE } from "./site";

export type HeroCarouselImageSlide = {
  kind: "image";
  alt: string;
  desktop: string;
  mobile: string;
};

export type HeroCarouselVideoSlide = {
  kind: "video";
  alt: string;
  desktop: string;
  mobile: string;
};

export type HeroCarouselSlide = HeroCarouselImageSlide | HeroCarouselVideoSlide;

/**
 * Slides do hero: imagens com par desktop/mobile.
 * Ficheiros em `public/hero/carousel/` (braslar-slide-*).
 */
export const HERO_CAROUSEL_SLIDES: HeroCarouselSlide[] = [
  {
    kind: "image",
    desktop: "/hero/carousel/braslar-slide-1-desktop.png",
    mobile: "/hero/carousel/braslar-slide-1-mobile.png",
    alt: `Linha de cocção ${SITE.name} — conheça toda a linha`,
  },
  {
    kind: "image",
    desktop: "/hero/carousel/braslar-slide-2-desktop.png",
    mobile: "/hero/carousel/braslar-slide-2-mobile.png",
    alt: `Fogão ${SITE.name} Carina em destaque`,
  },
  {
    kind: "image",
    desktop: "/hero/carousel/braslar-slide-3-desktop.png",
    mobile: "/hero/carousel/braslar-slide-3-mobile.png",
    alt: `Cooktop ${SITE.name} — praticidade e elegância para o seu dia a dia`,
  },
  {
    kind: "image",
    desktop: "/hero/carousel/braslar-slide-4-desktop.png",
    mobile: "/hero/carousel/braslar-slide-4-mobile.png",
    alt: `Fogão ${SITE.name} em ambiente de cozinha`,
  },
];
