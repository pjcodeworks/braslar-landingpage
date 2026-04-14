import { SITE } from "./site";

export type CategorySlug =
  | "fogoes"
  | "cooktops"
  | "fogao-a-lenha"
  | "refrigeradores"
  | "cervejeiras"
  | "freezers-verticais";

export type LineSlug = "horus" | "supremo" | "cooktop" | "forno-a-lenha" | "freezer";

export type ProductSlug =
  | "horus-4bc"
  | "horus-5bc"
  | "horus-5bc-tc"
  | "supremo-4bc"
  | "supremo-5bc"
  | "cooktop-4bc"
  | "cooktop-5bc"
  | "forno-a-lenha"
  | "freezer-410l"
  | "freezer-510l";

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

/**
 * Valores de exemplo se um produto não tiver `measurements`.
 * Dados oficiais: L×A×P = Largura × Altura × Profundidade (cm); peso = líquido (kg).
 */
export const PLACEHOLDER_PRODUCT_MEASUREMENTS: ProductMeasurementsData = {
  withoutPackaging: {
    height: "170 cm",
    width: "60,4 cm",
    depth: "64,2 cm",
    weight: "50 kg",
  },
  withPackaging: {
    height: "175 cm",
    width: "65,0 cm",
    depth: "70,0 cm",
    weight: "52 kg",
  },
};

export type Product = {
  categorySlug: CategorySlug;
  categoryLabel: string;
  lineSlug: LineSlug;
  lineLabel: string;
  productSlug: ProductSlug;
  productName: string;
  /** Texto curto abaixo do título na página do produto. Omitido = sem parágrafo. */
  description?: string;
  /**
   * Caminhos em `/public` para fotos do produto.
   *
   * **Ordem:** a sequência neste array define a ordem do carrossel na página do produto
   * (ficheiros `.png`, `.jpg` e `.jpeg` são mostrados, na mesma ordem em que aparecem aqui).
   * A **primeira imagem** dessa ordem é também a capa na listagem de categorias.
   */
  imagePaths: ProductImageEntry[];
  /**
   * Banners de destaque em `/public` (ex.: pasta `banner`, `JPG` ou ficheiros `Banner*.jpg`).
   * Ordem = ordem de exibição, acima da tabela de especificações.
   */
  bannerImagePaths?: string[];
  /** Peso e dimensões (com/sem embalagem). Omitido = placeholder na página do produto. */
  measurements?: ProductMeasurementsData;
  /** Especificações/características do produto para exibição em tabela. */
  specs?: ProductSpec[];
};

const CAROUSEL_IMAGE_EXT = /\.(png|jpe?g)$/i;

/**
 * Imagens do carrossel (e da capa na categoria): `.png`, `.jpg`, `.jpeg`.
 * Outros formatos em `imagePaths` são ignorados na UI.
 */
export function getProductPngPathsInOrder(
  imagePaths: ProductImageEntry[],
): { src: string; fit: ProductImageFit }[] {
  return imagePaths.map(resolveImageEntry).filter(({ src }) => CAROUSEL_IMAGE_EXT.test(src));
}

/** Primeira imagem do carrossel — mesma regra que a miniatura na página de categoria. */
export function getPrimaryProductImageSrc(product: Product): string | undefined {
  const ordered = getProductPngPathsInOrder(product.imagePaths);
  return ordered[0]?.src;
}

export function getProductMeasurements(product: Product): ProductMeasurementsData {
  return product.measurements ?? PLACEHOLDER_PRODUCT_MEASUREMENTS;
}

/** Título da página de listagem por categoria (URL slug → nome amigável) */
export const CATEGORY_PAGE_TITLES: Record<CategorySlug, string> = {
  fogoes: "Fogões",
  cooktops: "Cooktops",
  "fogao-a-lenha": "Fogões a lenha",
  refrigeradores: "Refrigeradores",
  cervejeiras: "Cervejeiras",
  "freezers-verticais": "Freezers verticais",
};

/** Texto introdutório da listagem por categoria (mesmo slug que na URL). */
export const CATEGORY_PAGE_DESCRIPTIONS: Record<CategorySlug, string> = {
  fogoes: `Escolha a linha e o modelo de fogão ${SITE.name} que combina com a sua cozinha.`,
  cooktops: `Escolha o cooktop ${SITE.name} ideal para o seu projeto.`,
  "fogao-a-lenha": `Conheça o forno a lenha ${SITE.name}, pensado para aquecer e cozinhar com charme clássico.`,
  refrigeradores: `Veja os refrigeradores e freezers ${SITE.name} pensados para armazenar com segurança e estilo.`,
  cervejeiras: `Expositores e soluções para bebidas com a qualidade ${SITE.name}.`,
  "freezers-verticais": `Linha de freezers verticais para o seu negócio com a qualidade ${SITE.name}.`,
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
  // Fogões — Horus
  {
    categorySlug: "fogoes",
    categoryLabel: "Fogão",
    lineSlug: "horus",
    lineLabel: "Horus",
    productSlug: "horus-4bc",
    description: `O Fogão Horus 4BC Geral Since 1914 combina design moderno, praticidade e eficiência para valorizar sua rotina na cozinha. Com mesa em vidro temperado, forno amplo, visor panorâmico e grades individuais de ferro fundido com 6 pontos de apoio, oferece mais estabilidade, segurança e facilidade no dia a dia. Para completar, a Super Chama entrega potência extra para preparar receitas com mais agilidade.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    productName: "Horus 4 Bocas",
    imagePaths: [
      "/Produtos/Linha Horus/Horus 4BC/PNG/Horus 4Q 1.png",
      "/Produtos/Linha Horus/Horus 4BC/PNG/Horus 4Q 2.png",
      "/Produtos/Linha Horus/Horus 4BC/PNG/Horus 4Q 3.png",
      "/Produtos/Linha Horus/Horus 4BC/PNG/Horus 4Q 4.png",
      {src: "/Produtos/Linha Horus/Horus 4BC/PNG/Horus 4BC 5.png", fit: "wide"},

    ],
    bannerImagePaths: [
      "/Produtos/Linha Horus/Horus 4BC/JPG/Banner/Banner 4BC.jpg",
      "/Produtos/Linha Horus/Horus 4BC/JPG/Banner/HORUS 4 Bocas 1 copy.jpg",
      "/Produtos/Linha Horus/Horus 4BC/JPG/Banner/HORUS  4 Bocas 2 copy.jpg",
      "/Produtos/Linha Horus/Horus 4BC/JPG/Banner/HORUS 4 Bocas 3 copy.jpg",
    ],
    specs: [
      { label: "Mesa", value: "Vidro temperado 6 mm" },
      {
        label: "Trempes",
        value:
          "Individuais em arame esmaltado — não gira e não derruba panelas",
      },
      { label: "Instalação", value: "Fácil — não precisa embutir" },
      { label: "Puxador", value: "Chanfrado em alumínio" },
      { label: "Acendimento", value: "Automático total" },
      {
        label: "Queimadores",
        value: "1 × 3000 W + 1 × 2000 W + 2 × 1750 W",
      },
      { label: "Manípulos", value: "Anatômicos e removíveis" },
      { label: "Forno", value: "Easy-clean" },
      {
        label: "Luz no forno",
        value:
          "Sim (a lâmpada não acompanha o produto em função da variação de tensão 127 V ou 220 V)",
      },
      { label: "Pés", value: "Mais altos — 130 mm" },
      {
        label: "Acabamento",
        value:
          "Sem fixações aparentes (rebites, parafusos, presilhas etc.)",
      },
    ],
    measurements: {

      withoutPackaging: {
        width: "49 cm",
        height: "90 cm",
        depth: "56,5 cm",
        weight: "19,630 kg",
      },
      withPackaging: {
        width: "49,9 cm",
        height: "91,7 cm",
        depth: "57,7 cm",
        weight: "20,880 kg",
      },
    },
  },
  {
    categorySlug: "fogoes",
    categoryLabel: "Fogão",
    lineSlug: "horus",
    lineLabel: "Horus",
    productSlug: "horus-5bc",
    productName: "Horus 5 Bocas",
    description: `O Fogão Horus 5BC Geral Since 1914 combina design moderno, praticidade e eficiência para valorizar sua rotina na cozinha. Com mesa em vidro temperado, forno amplo, visor panorâmico e grades individuais de ferro fundido com 6 pontos de apoio, oferece mais estabilidade, segurança e facilidade no dia a dia. Com 5 bocas, amplia sua capacidade de preparo e traz mais versatilidade para diferentes receitas. Para completar, a Super Chama entrega potência extra para cozinhar com mais agilidade..

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Horus/Horus 5BC/PNG/Horus 5Q 1.png",
      "/Produtos/Linha Horus/Horus 5BC/PNG/Horus 5Q 2.png",
      "/Produtos/Linha Horus/Horus 5BC/PNG/Horus 5Q 3.png",
      "/Produtos/Linha Horus/Horus 5BC/PNG/Horus 5Q 4.png",
      {src: "/Produtos/Linha Horus/Horus 5BC/PNG/Horus 5BC 5.png", fit: "wide"},
    ],
    bannerImagePaths: [
      "/Produtos/Linha Horus/Horus 5BC/JPG/Banner/Banner Horus 5BC.jpg",
      "/Produtos/Linha Horus/Horus 5BC/JPG/Banner/HORUS 5Q 1.jpg",
      "/Produtos/Linha Horus/Horus 5BC/JPG/Banner/HORUS 5Q 2.jpg",
      "/Produtos/Linha Horus/Horus 5BC/JPG/Banner/HORUS 5Q 3.jpg",
    ],
    specs: [
      {
        label: "Mesa",
        value:
          "Mesa de vidro temperado 6 mm (facilita a limpeza do dia a dia)",
      },
      {
        label: "Trempes",
        value:
          "Individuais em arame esmaltado — não gira e não derruba panelas",
      },
      {
        label: "Instalação",
        value: "Fácil instalação, não precisa embutir",
      },
      { label: "Puxador", value: "Chanfrado em alumínio" },
      { label: "Acendimento", value: "Automático total" },
      { label: "Queimadores", value: "1 queimador de 3000 W" },
      { label: "Queimadores", value: "2 queimadores de 2000 W" },
      { label: "Queimadores", value: "2 queimadores de 1750 W" },
      { label: "Manípulos", value: "Anatômicos e removíveis" },
      { label: "Forno", value: "Easy-clean" },
      {
        label: "Luz no forno",
        value: "A lâmpada não acompanha o produto",
      },
      {
        label: "Pés",
        value: "Com 130 mm e encaixe via clique-rápido",
      },
      {
        label: "Acabamento",
        value:
          "Sem fixações aparentes (rebites, parafusos, presilhas etc.)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "70,5 cm",
        height: "90 cm",
        depth: "56,5 cm",
        weight: "27,470 kg",
      },
      withPackaging: {
        width: "71,7 cm",
        height: "91,7 cm",
        depth: "57,7 cm",
        weight: "27,470 kg",
      },
    },
  },
  {
    categorySlug: "fogoes",
    categoryLabel: "Fogão",
    lineSlug: "horus",
    lineLabel: "Horus",
    productSlug: "horus-5bc-tc",
    productName: "Horus 5 Bocas Tripla Chama",
    description: `O Fogão Horus 5 Bocas Tripla Chama Geral Since 1914 combina design moderno, praticidade e eficiência para valorizar sua rotina na cozinha. Com mesa em vidro temperado, forno amplo, visor panorâmico e grades individuais de ferro fundido com 6 pontos de apoio, oferece mais estabilidade, segurança e facilidade no dia a dia. Com 5 bocas, amplia sua capacidade de preparo e traz mais versatilidade para diferentes receitas. Para completar, a Super Chama entrega potência extra para cozinhar com mais agilidade.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Horus/Horus 5BC TC/PNG/Horus 5Q TC 1.png",
      "/Produtos/Linha Horus/Horus 5BC TC/PNG/Horus 5Q TC 2.png",
      "/Produtos/Linha Horus/Horus 5BC TC/PNG/Horus 5Q TC 3.png",
      "/Produtos/Linha Horus/Horus 5BC TC/PNG/Horus 5Q TC 4.png",
      {
        src: "/Produtos/Linha Horus/Horus 5BC TC/PNG/Horus 5BC TC 5.png",
        fit: "wide",
      },
    ],
    bannerImagePaths: [
      "/Produtos/Linha Horus/Horus 5BC TC/JPG/Banner/HORUS 5Q TC 1.jpg",
      "/Produtos/Linha Horus/Horus 5BC TC/JPG/Banner/HORUS 5Q TC 2.jpg",
      "/Produtos/Linha Horus/Horus 5BC TC/JPG/Banner/HORUS 5Q TC 3.jpg",
    ],
    specs: [
      {
        label: "Mesa",
        value:
          "Mesa de vidro temperado 6 mm (facilita a limpeza do dia a dia)",
      },
      {
        label: "Trempes",
        value:
          "Individuais em arame esmaltado — não gira e não derruba panelas",
      },
      {
        label: "Instalação",
        value: "Fácil instalação, não precisa embutir",
      },
      { label: "Puxador", value: "Chanfrado em alumínio" },
      { label: "Acendimento", value: "Automático total" },
      { label: "Queimadores", value: "1 queimador de 3000 W" },
      { label: "Queimadores", value: "2 queimadores de 2000 W" },
      { label: "Queimadores", value: "2 queimadores de 1750 W" },
      { label: "Manípulos", value: "Anatômicos e removíveis" },
      { label: "Forno", value: "Easy-clean" },
      {
        label: "Luz no forno",
        value: "A lâmpada não acompanha o produto",
      },
      {
        label: "Pés",
        value: "Com 130 mm e encaixe via clique-rápido",
      },
      {
        label: "Acabamento",
        value:
          "Sem fixações aparentes (rebites, parafusos, presilhas etc.)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "70,5 cm",
        height: "90 cm",
        depth: "56,5 cm",
        weight: "27,470 kg",
      },
      withPackaging: {
        width: "71,7 cm",
        height: "91,7 cm",
        depth: "57,7 cm",
        weight: "27,470 kg",
      },
    },
  },
  // Fogões — Supremo
  {
    categorySlug: "fogoes",
    categoryLabel: "Fogão",
    lineSlug: "supremo",
    lineLabel: "Supremo",
    productSlug: "supremo-4bc",
    productName: "Supremo 4 Bocas",
    description: `O Fogão Supremo Glass 4Q – cor preta, Geral Since 1914, une sofisticação, potência e praticidade para transformar sua rotina na cozinha.
Com acabamento em vidro temperado preto, valoriza o ambiente com um visual moderno, elegante e fácil de limpar.

Suas 4 bocas bem distribuídas, incluindo a Tripla Chama, oferecem mais agilidade no preparo das receitas e melhor aproveitamento no dia a dia.
O forno, com amplo espaço interno e visor panorâmico, garante mais praticidade para acompanhar o preparo sem a necessidade de abrir a porta.

As grades de ferro fundido proporcionam maior estabilidade e segurança para as panelas, enquanto o sistema Limpa Fácil torna a manutenção muito mais simples.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Supremo/Supremo 4BC/PNG/Supremo 4Q 1.png",
      "/Produtos/Linha Supremo/Supremo 4BC/PNG/Supremo 4Q 2.png",
      "/Produtos/Linha Supremo/Supremo 4BC/PNG/Supremo 4Q 3.png",
      "/Produtos/Linha Supremo/Supremo 4BC/PNG/Supremo 4Q 4.png",
      {src: "/Produtos/Linha Supremo/Supremo 4BC/PNG/Supremo 4BC 5.png", fit: "wide"},
    ],
    bannerImagePaths: [
      "/Produtos/Linha Supremo/Supremo 4BC/JPG/Banner/Banner 4Q.jpg",
      "/Produtos/Linha Supremo/Supremo 4BC/JPG/Banner/Banner Supremo 4Q 1.jpg",
      "/Produtos/Linha Supremo/Supremo 4BC/JPG/Banner/Banner Supremo 4Q 2.jpg",
      "/Produtos/Linha Supremo/Supremo 4BC/JPG/Banner/Banner Supremo 4Q 3.jpg",
    ],
    specs: [
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm (facilita a limpeza do dia a dia)",
      },
      { label: "Trempes", value: "Individuais 6P foscas" },
      { label: "Instalação", value: "Fácil — não precisa embutir" },
      { label: "Puxador", value: "Chanfrado em alumínio" },
      { label: "Acendimento", value: "Automático" },
      {
        label: "Queimadores",
        value: "2 × 2000 W + 2 × 1750 W",
      },
      { label: "Manípulos", value: "Anatômicos" },
      { label: "Forno", value: "Easy-clean" },
      {
        label: "Luz no forno",
        value: "Sim (a lâmpada não acompanha o produto)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "49 cm",
        height: "90 cm",
        depth: "62 cm",
        weight: "27,47 kg",
      },
      withPackaging: {
        width: "50 cm",
        height: "91 cm",
        depth: "63 cm",
        weight: "28,72 kg",
      },
    },
  },
  {
    categorySlug: "fogoes",
    categoryLabel: "Fogão",
    lineSlug: "supremo",
    lineLabel: "Supremo",
    productSlug: "supremo-5bc",
    productName: "Supremo 5 Bocas Tripla Chama",
    description: `O Fogão Supremo Glass 5BC Tripla Chama – cor preta, Geral Since 1914, une sofisticação, potência e praticidade para transformar sua rotina na cozinha.
Com acabamento em vidro temperado preto, valoriza o ambiente com um visual moderno, elegante e fácil de limpar.

Suas 5 bocas bem distribuídas, incluindo a Tripla Chama, oferecem mais agilidade no preparo das receitas e melhor aproveitamento no dia a dia.
O forno, com amplo espaço interno e visor panorâmico, garante mais praticidade para acompanhar o preparo sem a necessidade de abrir a porta.

As grades de ferro fundido proporcionam maior estabilidade e segurança para as panelas, enquanto o sistema Limpa Fácil torna a manutenção muito mais simples.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Supremo/Supremo 5BC/PNG/Supremo 5Q 1.png",
      "/Produtos/Linha Supremo/Supremo 5BC/PNG/Supremo 5Q 2.png",
      "/Produtos/Linha Supremo/Supremo 5BC/PNG/Supremo 5Q 3.png",
      "/Produtos/Linha Supremo/Supremo 5BC/PNG/Supremo 5Q 4.png",
      {src: "/Produtos/Linha Supremo/Supremo 5BC/PNG/Supremo 5BC 5.png", fit: "wide"},
    ],
    bannerImagePaths: [
      "/Produtos/Linha Supremo/Supremo 5BC/JPG/Banner/Banner 5Q.jpg",
      "/Produtos/Linha Supremo/Supremo 5BC/JPG/Banner/Banner Supremo 5Q 1.jpg",
      "/Produtos/Linha Supremo/Supremo 5BC/JPG/Banner/Banner Supremo 5Q 2.jpg",
      "/Produtos/Linha Supremo/Supremo 5BC/JPG/Banner/Banner Supremo 5Q 3.jpg",
    ],
    specs: [
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm (facilita a limpeza do dia a dia)",
      },
      { label: "Trempes", value: "Individuais 6P foscas" },
      { label: "Instalação", value: "Fácil — não precisa embutir" },
      { label: "Puxador", value: "Chanfrado em alumínio" },
      { label: "Acendimento", value: "Automático" },
      {
        label: "Queimadores",
        value: "1 × 3500 W + 2 × 2000 W + 2 × 1750 W",
      },
      { label: "Manípulos", value: "Anatômicos" },
      { label: "Forno", value: "Easy-clean" },
      {
        label: "Luz no forno",
        value: "Sim (a lâmpada não acompanha o produto)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "70,5 cm",
        height: "90 cm",
        depth: "62 cm",
        weight: "19,630 kg",
      },
      withPackaging: {
        width: "71,5 cm",
        height: "91 cm",
        depth: "63 cm",
        weight: "20,880 kg",
      },
    },
  },
  // Cooktops
  {
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    productSlug: "cooktop-4bc",
    productName: "Cooktop 4 Bocas",
    description: `O Cooktop Geral Since 1914 4 bocas une design, praticidade e eficiência para valorizar sua rotina na cozinha. Com mesa de vidro, visual moderno e acabamento refinado, oferece beleza e facilidade na limpeza no dia a dia.

Suas grades individuais em aço fosco com 6 pontos de apoio garantem mais estabilidade para as panelas e mais segurança no preparo das receitas. Já os botões removíveis e os queimadores com capa lisa tornam a manutenção muito prática.

Com acendimento automático, basta girar o botão para acender a chama com rapidez e facilidade.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Cooktop/Cooktop 4BC/PNG/Cooktop 4BC 1.png",
      "/Produtos/Linha Cooktop/Cooktop 4BC/PNG/Cooktop 4BC 2.png",
      "/Produtos/Linha Cooktop/Cooktop 4BC/PNG/Cooktop 4BC 3.png",
      {src: "/Produtos/Linha Cooktop/Cooktop 4BC/PNG/Cooktop 4BC 4.png", fit: "wide"},
    ],
    bannerImagePaths: ["/Produtos/Linha Cooktop/Cooktop 4BC/JPG/Banner/Banner 4BC.jpg"],
    specs: [
      {
        label: "Queimadores",
        value: "3 × 1,7 W + 1 × 3,0 W",
      },
      {
        label: "Conjunto de chamas",
        value: "Queimadores forjados e espalhadores esmaltados",
      },
      { label: "Acendimento", value: "Automático" },
      { label: "Mesa", value: "Vidro temperado 6 mm" },
      {
        label: "Trempes",
        value: "Individual redonda em arame esmaltado",
      },
      {
        label: "Suporte da trempe",
        value: "Esmaltado, fácil limpeza e não risca",
      },
      { label: "Manípulos", value: "Anatômicos" },
      {
        label: "Acabamento",
        value:
          "Sem fixações aparentes (rebites, parafusos e presilhas)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "55 cm",
        height: "11 cm",
        depth: "43 cm",
        weight: "7,300 kg",
      },
      withPackaging: {
        width: "57 cm",
        height: "12,5 cm",
        depth: "46 cm",
        weight: "8,550 kg",
      },
    },
  },
  {
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    productSlug: "cooktop-5bc",
    productName: "Cooktop 5 Bocas",
    description: `O Cooktop Geral Since 1914 5 bocas une design, praticidade e eficiência para valorizar sua rotina na cozinha. Com mesa de vidro, visual moderno e acabamento refinado, oferece beleza e facilidade na limpeza no dia a dia.

Suas grades individuais em aço fosco com 6 pontos de apoio garantem mais estabilidade para as panelas e mais segurança no preparo das receitas. Já os botões removíveis e os queimadores com capa lisa tornam a manutenção muito prática.

Com acendimento automático, basta girar o botão para acender a chama com rapidez e facilidade.

Geral Since 1914.
Mais força, elegância e eficiência para sua cozinha.`,
    imagePaths: [
      "/Produtos/Linha Cooktop/Cooktop 5BC/PNG/Cooktop 5BC 1.png",
      "/Produtos/Linha Cooktop/Cooktop 5BC/PNG/Cooktop 5BC 2.png",
      "/Produtos/Linha Cooktop/Cooktop 5BC/PNG/Cooktop 5BC 3.png",
      {src: "/Produtos/Linha Cooktop/Cooktop 5BC/PNG/Cooktop 5BC 4.png", fit: "wide"},
    ],
    bannerImagePaths: ["/Produtos/Linha Cooktop/Cooktop 5BC/JPG/Banner/Banner 5BC.jpg"],
    specs: [
      {
        label: "Queimadores",
        value: "4 × 1,7 W + 1 Tripla Chama",
      },
      {
        label: "Conjunto de chamas",
        value: "Queimadores forjados e espalhadores esmaltados",
      },
      { label: "Acendimento", value: "Automático" },
      { label: "Mesa", value: "Vidro temperado 6 mm" },
      {
        label: "Trempes",
        value: "Individual redonda em arame esmaltado",
      },
      {
        label: "Suporte da trempe",
        value: "Esmaltado, fácil limpeza e não risca",
      },
      { label: "Manípulos", value: "Anatômicos" },
      {
        label: "Acabamento",
        value:
          "Sem fixações aparentes (rebites, parafusos e presilhas)",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "68 cm",
        height: "11 cm",
        depth: "45 cm",
        weight: "9,500 kg",
      },
      withPackaging: {
        width: "70 cm",
        height: "12,5 cm",
        depth: "46 cm",
        weight: "10,750 kg",
      },
    },
  },
  // Forno a lenha
  {
    categorySlug: "fogao-a-lenha",
    categoryLabel: "Forno a lenha",
    lineSlug: "forno-a-lenha",
    lineLabel: "Forno a lenha",
    productSlug: "forno-a-lenha",
    productName: "Forno a lenha",
    imagePaths: [
      "/Produtos/Linha Forno a lenha/Forno a Lenha/PNG/Lenha 2.png",
      "/Produtos/Linha Forno a lenha/Forno a Lenha/PNG/Linha N2 1_1.png",
      "/Produtos/Linha Forno a lenha/Forno a Lenha/PNG/Lenha 1.png",
      {src: "/Produtos/Linha Forno a lenha/Forno a Lenha/PNG/Linha N2 2_1.png", fit: "wide"},
    ],
    specs: [
      { label: "Tecnologia", value: "Easy Clean" },
      { label: "Pés e guarnições", value: "Aço inox" },
      {
        label: "Design",
        value:
          "Moderno, inovador e com acabamento diferenciado em portas e almofadas",
      },
      { label: "Portas do forno", value: "Vidro temperado" },
      { label: "Economia", value: "Maior economia de lenha" },
      { label: "Chapa", value: "Vitrocerâmico" },
      {
        label: "Revestimento interno",
        value: "Tijolos e cimento refratário",
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "88 cm",
        height: "79,1 cm",
        depth: "59,5 cm",
        weight: "63,470 kg",
      },
      withPackaging: {
        width: "90 cm",
        height: "57,6 cm",
        depth: "61,7 cm",
        weight: "66,170 kg",
      },
    },
  },
  // Freezers
  {
    categorySlug: "refrigeradores",
    categoryLabel: "Freezer",
    lineSlug: "freezer",
    lineLabel: "Freezer",
    productSlug: "freezer-410l",
    productName: "Freezer 410L",
    imagePaths: [
      "/Produtos/Linha Freezer/Freezer 410L/PNG/Freezer 410L 1.png",
      "/Produtos/Linha Freezer/Freezer 410L/PNG/Freezer 410 1.png",
      {src: "/Produtos/Linha Freezer/Freezer 410L/PNG/Freezer 410 2.png", fit: "wide"},
    ],
    measurements: {
      withoutPackaging: {
        width: "142 cm",
        height: "96 cm",
        depth: "73,3 cm",
        weight: "69,000 kg",
      },
      withPackaging: {
        width: "136 cm",
        height: "90 cm",
        depth: "63,7 cm",
        weight: "72,500 kg",
      },
    },
  },
  {
    categorySlug: "refrigeradores",
    categoryLabel: "Freezer",
    lineSlug: "freezer",
    lineLabel: "Freezer",
    productSlug: "freezer-510l",
    productName: "Freezer 510L",
    imagePaths: [
      "/Produtos/Linha Freezer/Freezer 510L/PNG/Freezer 510L 1.png",
      "/Produtos/Linha Freezer/Freezer 510L/PNG/Freezer 510 1.png",
      "/Produtos/Linha Freezer/Freezer 510L/PNG/Freezer 510 2.png",
    ],
    measurements: {
      withoutPackaging: {
        width: "170 cm",
        height: "96 cm",
        depth: "73,3 cm",
        weight: "69,000 kg",
      },
      withPackaging: {
        width: "164 cm",
        height: "90 cm",
        depth: "63,7 cm",
        weight: "72,500 kg",
      },
    },
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

/** Uma linha = combinação única categoria + slug de linha (vários produtos). */
export type LineInfo = {
  categorySlug: CategorySlug;
  lineSlug: LineSlug;
  lineLabel: string;
  products: Product[];
};

export function getLineBySlugs(
  categorySlug: string,
  lineSlug: string,
): LineInfo | undefined {
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

