import { SITE } from "./site";

const B = "/Produtos/Braslar";

export type CategorySlug = "carina" | "new-sirirus" | "asiatico" | "cooktops";

export type LineSlug =
  | "front-control"
  | "top-control"
  | "sirius"
  | "sirius-plus"
  | "asiatico"
  | "cooktop";

export type ProductSlug =
  | "carina-front-4q"
  | "carina-front-5q"
  | "carina-top-4q"
  | "carina-top-5q"
  | "asiatico-mesa-esmaltada-preto"
  | "asiatico-mesa-inox-branco"
  | "asiatico-mesa-inox-preto"
  | "asiatico-mesa-vidro-branco"
  | "asiatico-mesa-vidro-preto"
  | "cooktop-2bc"
  | "cooktop-4bc"
  | "cooktop-5bc"
  | "new-sirius-4bc"
  | "new-sirius-5bc"
  | "new-sirius-plus-4bc"
  | "new-sirius-plus-5bc";

/** Uma linha de medidas já formatada para exibição (ex.: `"60,4 cm"`, `"50 kg"`). */
export type ProductMeasuresRow = {
  height: string;
  width: string;
  depth: string;
  weight: string;
};

export type ProductMeasurementsData = {
  withoutPackaging: ProductMeasuresRow;
  withPackaging: ProductMeasuresRow;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductImageFit = "square" | "wide";

export type ProductImageEntry = string | { src: string; fit: ProductImageFit };

/** Normaliza uma entrada (string ou objeto) para sempre retornar `{ src, fit }`. */
export function resolveImageEntry(
  entry: ProductImageEntry,
): { src: string; fit: ProductImageFit } {
  if (typeof entry === "string") return { src: entry, fit: "square" };
  return entry;
}

export const PLACEHOLDER_PRODUCT_MEASUREMENTS: ProductMeasurementsData = {
  withoutPackaging: {
    height: "—",
    width: "—",
    depth: "—",
    weight: "—",
  },
  withPackaging: {
    height: "—",
    width: "—",
    depth: "—",
    weight: "—",
  },
};

export type Product = {
  categorySlug: CategorySlug;
  categoryLabel: string;
  lineSlug: LineSlug;
  lineLabel: string;
  productSlug: ProductSlug;
  productName: string;
  description?: string;
  imagePaths: ProductImageEntry[];
  bannerImagePaths?: string[];
  measurements?: ProductMeasurementsData;
  specs?: ProductSpec[];
};

const CAROUSEL_IMAGE_EXT = /\.(png|jpe?g)$/i;

export function getProductPngPathsInOrder(
  imagePaths: ProductImageEntry[],
): { src: string; fit: ProductImageFit }[] {
  return imagePaths.map(resolveImageEntry).filter(({ src }) => CAROUSEL_IMAGE_EXT.test(src));
}

export function getPrimaryProductImageSrc(product: Product): string | undefined {
  const ordered = getProductPngPathsInOrder(product.imagePaths);
  return ordered[0]?.src;
}

export function getProductMeasurements(product: Product): ProductMeasurementsData {
  return product.measurements ?? PLACEHOLDER_PRODUCT_MEASUREMENTS;
}

export const CATEGORY_PAGE_TITLES: Record<CategorySlug, string> = {
  carina: "Carina",
  "new-sirirus": "New Sirirus",
  asiatico: "Asiático",
  cooktops: "Cooktop",
};

export const CATEGORY_PAGE_DESCRIPTIONS: Record<CategorySlug, string> = {
  carina: `Fogões Carina ${SITE.name} — comandos frontais ou superiores, com opções de cor.`,
  "new-sirirus": `Linha New Sirirus e New Sirirus Plus ${SITE.name} — modelos 4 e 5 bocas, com acabamentos em branco ou preto.`,
  asiatico: `Linha Asiático ${SITE.name} — diferentes mesas e acabamentos para o seu projeto.`,
  cooktops: `Cooktops ${SITE.name} — 2, 4 ou 5 bocas em vidro temperado.`,
};

export function getCategoryPageTitle(slug: CategorySlug): string {
  return CATEGORY_PAGE_TITLES[slug];
}

export function getCategoryPageDescription(slug: CategorySlug): string {
  return CATEGORY_PAGE_DESCRIPTIONS[slug];
}

export function parseCategorySlug(slug: string): CategorySlug | undefined {
  return slug in CATEGORY_PAGE_TITLES ? (slug as CategorySlug) : undefined;
}

export function getAllCategoryRouteParams(): { categoria: string }[] {
  return (Object.keys(CATEGORY_PAGE_TITLES) as CategorySlug[]).map((categoria) => ({
    categoria,
  }));
}

export const PRODUCTS: Product[] = [
  {
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "front-control",
    lineLabel: "Front Control",
    productSlug: "carina-front-4q",
    productName: "Carina Front Control — 4 bocas",
    description:
      "Disponível nas cores Preto e Titanium. Galeria com fotos das duas opções.",
    imagePaths: [
      `${B}/Carina Front Control/Carina Front  - 4Q Preto 1.png`,
      `${B}/Carina Front Control/Carina Front  - 4Q Preto 2.png`,
      `${B}/Carina Front Control/Carina Front  - 4Q Preto 3.png`,
      `${B}/Carina Front Control/Carina Front  - 4Q Titanium 1.png`,
      `${B}/Carina Front Control/Carina Front  - 4Q Titanium 2.png`,
      `${B}/Carina Front Control/Carina Front  - 4Q Titanium 3.png`,
      `${B}/Carina Front Control/Carina 4bc 2.png`,
      `${B}/Carina Front Control/Carina 4bc chama.png`,
      { src: `${B}/Carina Front Control/Carina 4bc capa ajustada.jpg`, fit: "wide" },
    ],
  },
  {
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "front-control",
    lineLabel: "Front Control",
    productSlug: "carina-front-5q",
    productName: "Carina Front Control — 5 bocas",
    description: "Disponível nas cores Preto e Titanium.",
    imagePaths: [
      `${B}/Carina Front Control/Carina Front  - 5Q Preto 1.png`,
      `${B}/Carina Front Control/Carina Front  - 5Q Preto 2.png`,
      `${B}/Carina Front Control/Carina Front  - 5Q Preto 3.png`,
      `${B}/Carina Front Control/Carina Front  - 5Q titanium 1.png`,
      `${B}/Carina Front Control/Carina Front  - 5Q titanium 2.png`,
      `${B}/Carina Front Control/Carina Front  - 5Q titanium 3.png`,
      `${B}/Carina Front Control/Carina 5Bc 1.png`,
      `${B}/Carina Front Control/Carina 5bc.png`,
      `${B}/Carina Front Control/Carina 5Bc Capa 2.png`,
    ],
  },
  {
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "top-control",
    lineLabel: "Top Control",
    productSlug: "carina-top-4q",
    productName: "Carina Top Control — 4 bocas",
    description: "Disponível nas cores Preto e Titanium.",
    imagePaths: [
      `${B}/Carina Top Control/Carina Top Control  - 4Q preto 1.png`,
      `${B}/Carina Top Control/Carina Top Control  - 4Q preto 2.png`,
      `${B}/Carina Top Control/Carina Top Control  - 4Q preto 3.png`,
      `${B}/Carina Top Control/Carina Top Control  - 4Q titanium 1.png`,
      `${B}/Carina Top Control/Carina Top Control  - 4Q titanium 2.png`,
      `${B}/Carina Top Control/Carina Top Control  - 4Q titanium 3.png`,
      `${B}/Carina Top Control/Carina topcontrol 4bc 2.png`,
      `${B}/Carina Top Control/carina topcontrol 4bc chama.png`,
      { src: `${B}/Carina Top Control/carina topcontrol 4bc capa.png`, fit: "wide" },
    ],
  },
  {
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "top-control",
    lineLabel: "Top Control",
    productSlug: "carina-top-5q",
    productName: "Carina Top Control — 5 bocas",
    description: "Disponível nas cores Preto e Titanium.",
    imagePaths: [
      `${B}/Carina Top Control/Carina Top Control  - 5Q preto  1.png`,
      `${B}/Carina Top Control/Carina Top Control  - 5Q preto  2.png`,
      `${B}/Carina Top Control/Carina Top Control  - 5Q preto  3.png`,
      `${B}/Carina Top Control/Carina Top Control  - 5Q titanium  1.png`,
      `${B}/Carina Top Control/Carina Top Control  - 5Q titanium  2.png`,
      `${B}/Carina Top Control/Carina Top Control  - 5Q titanium  3.png`,
      `${B}/Carina Top Control/Carina topcontrol 5bc 2.png`,
      `${B}/Carina Top Control/carina topcontrol 5bc chama 1.png`,
      { src: `${B}/Carina Top Control/carina topcontrol 5bc capa.png`, fit: "wide" },
    ],
  },
  {
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    productSlug: "asiatico-mesa-esmaltada-preto",
    productName: "Asiático — mesa esmaltada preto",
    imagePaths: [
      `${B}/Asiatico/Asiatico Mesa Esmatalda Preto 1.png`,
      `${B}/Asiatico/Asiatico Mesa Esmatalda Preto 2.png`,
      `${B}/Asiatico/Asiatico Mesa Esmatalda Preto 3.png`,
      `${B}/Asiatico/Asiatico Mesa Esmatalda Preto 4.png`,
    ],
  },
  {
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    productSlug: "asiatico-mesa-inox-branco",
    productName: "Asiático — mesa inox branco",
    imagePaths: [
      `${B}/Asiatico/Asiatico Mesa Inox Branco 1.png`,
      `${B}/Asiatico/Asiatico Mesa Inox Branco 2.png`,
      `${B}/Asiatico/Asiatico Mesa Inox Branco 3.png`,
      { src: `${B}/Asiatico/Asiatico Mesa Inox Branco 4.jpg`, fit: "wide" },
    ],
  },
  {
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    productSlug: "asiatico-mesa-inox-preto",
    productName: "Asiático — mesa inox preto",
    imagePaths: [
      `${B}/Asiatico/Asiatico Mesa Inox Preto 1.png`,
      `${B}/Asiatico/Asiatico Mesa Inox Preto 2.png`,
      `${B}/Asiatico/Asiatico Mesa Inox Preto 3.png`,
    ],
  },
  {
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    productSlug: "asiatico-mesa-vidro-branco",
    productName: "Asiático — mesa vidro branco",
    imagePaths: [
      `${B}/Asiatico/Asiatico Mesa Vidro Branco 1.png`,
      `${B}/Asiatico/Asiatico Mesa Vidro Branco 2.png`,
      `${B}/Asiatico/Asiatico Mesa Vidro Branco 3.png`,
    ],
  },
  {
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    productSlug: "asiatico-mesa-vidro-preto",
    productName: "Asiático — mesa vidro preto",
    imagePaths: [
      `${B}/Asiatico/Asiatico Mesa Vidro Preto 1.png`,
      `${B}/Asiatico/Asiatico Mesa Vidro Preto 2.png`,
      `${B}/Asiatico/Asiatico Mesa Vidro Preto 3.png`,
    ],
  },
  {
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    productSlug: "cooktop-2bc",
    productName: "Cooktop 2 bocas",
    imagePaths: [
      `${B}/Cooktops/Cooktop 2BC 1.png`,
      `${B}/Cooktops/Cooktop 2BC 2.png`,
      `${B}/Cooktops/Cooktop 2BC 3.png`,
      `${B}/Cooktops/cooktop 2BC 4.png`,
    ],
  },
  {
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    productSlug: "cooktop-4bc",
    productName: "Cooktop 4 bocas",
    imagePaths: [
      `${B}/Cooktops/Cooktop 4BC 1.png`,
      `${B}/Cooktops/Cooktop 4BC 2.png`,
      `${B}/Cooktops/Cooktop 4BC 3.png`,
    ],
  },
  {
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    productSlug: "cooktop-5bc",
    productName: "Cooktop 5 bocas",
    imagePaths: [
      `${B}/Cooktops/Cooktop 5BC 1.png`,
      `${B}/Cooktops/Cooktop 5BC 2.png`,
      `${B}/Cooktops/Cooktop 5BC 3.png`,
      { src: `${B}/Cooktops/cooktop 5BC 4.jpg`, fit: "wide" },
      `${B}/Cooktops/cooktops.png`,
    ],
  },
  {
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirirus",
    lineSlug: "sirius",
    lineLabel: "New Sirius",
    productSlug: "new-sirius-4bc",
    productName: "New Sirius — 4 bocas",
    description: "Disponível em branco ou preto.",
    imagePaths: [
      `${B}/New Sirius/New Sirius 4BC Branco 1.png`,
      `${B}/New Sirius/New Sirius 4BC Branco 2.png`,
      `${B}/New Sirius/New Sirius 4BC Branco 3.png`,
      `${B}/New Sirius/New Sirius 4BC Preto 1.png`,
      `${B}/New Sirius/New Sirius 4BC Preto 2.png`,
      `${B}/New Sirius/New Sirius 4BC Preto 3.png`,
      `${B}/New Sirius/New Sirius 4BC - zoom 2.png`,
      { src: `${B}/New Sirius/New Sirius 4BC - zoom 2.jpg`, fit: "wide" },
      `${B}/New Sirius/New Sirius 4BC capa.png`,
      `${B}/New Sirius/New Sirius - dupla.png`,
    ],
  },
  {
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirirus",
    lineSlug: "sirius",
    lineLabel: "New Sirius",
    productSlug: "new-sirius-5bc",
    productName: "New Sirius — 5 bocas",
    description: "Disponível em branco ou preto.",
    imagePaths: [
      `${B}/New Sirius/New Sirius 5BC Branco 1.png`,
      `${B}/New Sirius/New Sirius 5BC Branco 2.png`,
      `${B}/New Sirius/New Sirius 5BC Branco 3.png`,
      `${B}/New Sirius/New Sirius 5BC Preto 1.png`,
      `${B}/New Sirius/New Sirius 5BC Preto 2.png`,
      `${B}/New Sirius/New Sirius 5BC Preto 3.png`,
      `${B}/New Sirius/New Sirius 5BC - dupla.png`,
      { src: `${B}/New Sirius/New Sirius 5BC - zoom 1.jpg`, fit: "wide" },
      { src: `${B}/New Sirius/New Sirius 5BC - zoom 2.jpg`, fit: "wide" },
      { src: `${B}/New Sirius/new sirius 5BC capa.jpg`, fit: "wide" },
    ],
  },
  {
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirirus",
    lineSlug: "sirius-plus",
    lineLabel: "New Sirius Plus",
    productSlug: "new-sirius-plus-4bc",
    productName: "New Sirius Plus — 4 bocas",
    description: "Disponível em branco ou preto.",
    imagePaths: [
      `${B}/New Sirius Plus/New Sirius Plus 4BC Branco 1.png`,
      `${B}/New Sirius Plus/New Sirius Plus 4BC Branco 2.png`,
      `${B}/New Sirius Plus/New Sirius Plus 4BC Branco 3.png`,
      `${B}/New Sirius Plus/New Sirius Plus 4BC Preto 1.png`,
      `${B}/New Sirius Plus/New Sirius Plus 4BC Preto 2.png`,
      `${B}/New Sirius Plus/New Sirius Plus 4BC Preto 3.png`,
      `${B}/New Sirius Plus/New Sirius plus - dupla.png`,
      { src: `${B}/New Sirius Plus/New Sirius plus 4BC - zoom 1.jpg`, fit: "wide" },
      { src: `${B}/New Sirius Plus/New Sirius plus 4BC - zoom 2.jpg`, fit: "wide" },
      { src: `${B}/New Sirius Plus/New Sirius Plus 4bc capa 1.jpg`, fit: "wide" },
    ],
  },
  {
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirirus",
    lineSlug: "sirius-plus",
    lineLabel: "New Sirius Plus",
    productSlug: "new-sirius-plus-5bc",
    productName: "New Sirius Plus — 5 bocas",
    description: "Disponível em branco ou preto.",
    imagePaths: [
      `${B}/New Sirius Plus/New Sirius Plus 5BC Branco 1.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC Branco 2.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC Branco 3.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC Preto 1.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC Preto 2.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC Preto 3.png`,
      `${B}/New Sirius Plus/New Sirius Plus 5BC - dupla.png`,
      `${B}/New Sirius Plus/New Sirius plus 5BC - zoom 1.png`,
      `${B}/New Sirius Plus/New Sirius plus 5BC - zoom 2.png`,
      { src: `${B}/New Sirius Plus/New sirius plus 5BC capa.jpg`, fit: "wide" },
    ],
  },
];

export function getProductsByCategory(categorySlug: CategorySlug) {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProductBySlugs(
  categorySlug: string,
  lineSlug: string,
  productSlug: string,
): Product | undefined {
  return PRODUCTS.find(
    (p) =>
      p.categorySlug === (categorySlug as CategorySlug) &&
      p.lineSlug === (lineSlug as LineSlug) &&
      p.productSlug === (productSlug as ProductSlug),
  );
}

export function getAllProductRouteParams() {
  return PRODUCTS.map((p) => ({
    categoria: p.categorySlug,
    linha: p.lineSlug,
    produto: p.productSlug,
  }));
}

export type LineInfo = {
  categorySlug: CategorySlug;
  lineSlug: LineSlug;
  lineLabel: string;
  products: Product[];
};

export function getLineBySlugs(categorySlug: string, lineSlug: string): LineInfo | undefined {
  const products = PRODUCTS.filter(
    (p) =>
      p.categorySlug === (categorySlug as CategorySlug) &&
      p.lineSlug === (lineSlug as LineSlug),
  );
  if (products.length === 0) {
    return undefined;
  }
  const first = products[0];
  return {
    categorySlug: first.categorySlug,
    lineSlug: first.lineSlug,
    lineLabel: first.lineLabel,
    products,
  };
}

export function getAllLineRouteParams() {
  const seen = new Set<string>();
  const out: { categoria: string; linha: string }[] = [];
  for (const p of PRODUCTS) {
    const key = `${p.categorySlug}/${p.lineSlug}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({ categoria: p.categorySlug, linha: p.lineSlug });
  }
  return out;
}
