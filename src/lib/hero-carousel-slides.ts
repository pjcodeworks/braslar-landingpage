import { SITE } from "./site";

export type HeroCarouselImageSlide = {
  kind: "image";
  alt: string;
  desktop: string;
  mobile: string;
  /** Classes Tailwind extra só na `<Image>` desktop (ex.: `object-position`). */
  desktopImageClassName?: string;
  /** Qualidade do `next/image` na variante desktop (1–100). */
  desktopImageQuality?: number;
};

export type HeroCarouselVideoSlide = {
  kind: "video";
  alt: string;
  desktop: string;
  mobile: string;
};

export type HeroCarouselSlide = HeroCarouselImageSlide | HeroCarouselVideoSlide;

/**
 * Mídia do carrossel em `public/hero/carousel/`.
 * Mantém a ordem de exibição do hero e combina variantes mobile/desktop quando existirem.
 */
const HERO_CAROUSEL_MEDIA = [
  {
    desktop: "/hero/carousel/slide-01-desktop.jpg",
    mobile: "/hero/carousel/slide-01-mobile.jpg",
    alt: `Linha de cocção ${SITE.name} — conheça toda a linha`,
  },
  {
    desktop: "/hero/carousel/slide-02-desktop.jpg",
    mobile: "/hero/carousel/Mobile 2 (2).jpg",
    alt: `Fogão ${SITE.name} Carina em destaque`,
    /** Herói mais alto que 16:9: desloca o recorte para favorecer o produto. */
    desktopImageClassName: "object-[center_50%_46%]",
    desktopImageQuality: 100,
  },
  {
    desktop: "/hero/carousel/slide-03-desktop.jpg",
    mobile: "/hero/carousel/slide-03-mobile.jpg",
    alt: `Cooktop ${SITE.name} — praticidade e elegância para o seu dia a dia`,
  },
  {
    desktop: "/hero/carousel/slide-04-desktop.jpg",
    mobile: "/hero/carousel/slide-04-mobile.jpg",
    alt: `Fogão ${SITE.name} em ambiente de cozinha`,
  },
  {
    desktop: "/hero/carousel/Desktop 5.jpg",
    mobile: "/hero/carousel/Mobile 5.jpg",
    alt: `Pessoa em cozinha com produtos ${SITE.name} ao fundo`,
  },
  {
    desktop: "/hero/carousel/Desktop 6.jpg",
    mobile: "/hero/carousel/Mobile 6.jpg",
    alt: `Pessoa preparando alimentos em cozinha com eletrodomésticos ${SITE.name}`,
  },
  {
    desktop: "/hero/carousel/Desktop 7.jpg",
    mobile: "/hero/carousel/Mobile 7.jpg",
    alt: `Família cozinhando em casa com ${SITE.name}`,
  },
] as const;

export const HERO_CAROUSEL_SLIDES: HeroCarouselSlide[] = HERO_CAROUSEL_MEDIA.map(
  (m) => ({
    kind: "image" as const,
    desktop: m.desktop,
    mobile: m.mobile,
    alt: m.alt,
    ...("desktopImageClassName" in m && m.desktopImageClassName
      ? { desktopImageClassName: m.desktopImageClassName }
      : {}),
    ...("desktopImageQuality" in m && m.desktopImageQuality != null
      ? { desktopImageQuality: m.desktopImageQuality }
      : {}),
  }),
);

/** Imagem desktop do slide 1 (fallback em secções que referenciam o hero). */
export const HERO_CAROUSEL_DEFAULT_DESKTOP =
  HERO_CAROUSEL_MEDIA[0].desktop;

/**
 * Overlay do bloco “Linhas” por rota de categoria (`SITE.categoryNav`).
 * Cartão Carina: arte Carina Top Control (fundo branco), `public/hero/lines/carina-top-control.png`.
 * Rota dedicada (se existir no menu): mesma arte.
 */
const HERO_LINE_CARINA_TOP_CONTROL_DESKTOP =
  "/hero/lines/carina-top-control.png";

/** Cartão Asiático na secção “Linhas”, `public/hero/lines/asiatico.png`. */
const HERO_LINE_ASIATICO_DESKTOP = "/hero/lines/asiatico.png";

/** Cartão New Sirirus na secção “Linhas”, `public/hero/lines/new-sirirus.png`. */
const HERO_LINE_NEW_SIRIRUS_DESKTOP = "/hero/lines/new-sirirus.png";

/** Cartão Cooktop na secção “Linhas”, `public/hero/lines/cooktops.png`. */
const HERO_LINE_COOKTOPS_DESKTOP = "/hero/lines/cooktops.png";

export const HERO_LINE_OVERLAY_DESKTOP_BY_HREF: Record<string, string> = {
  "/carina": HERO_LINE_CARINA_TOP_CONTROL_DESKTOP,
  "/carina-top-control": HERO_LINE_CARINA_TOP_CONTROL_DESKTOP,
  "/new-sirirus": HERO_LINE_NEW_SIRIRUS_DESKTOP,
  "/asiatico": HERO_LINE_ASIATICO_DESKTOP,
  "/cooktops": HERO_LINE_COOKTOPS_DESKTOP,
};
