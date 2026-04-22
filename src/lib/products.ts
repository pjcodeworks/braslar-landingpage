/**
 * Catálogo de produtos, rotas estáticas e helpers de UI.
 * Imagens: `public/Produtos/<category>/<produto>/01.png` ou, com variantes de cor,
 * `public/Produtos/<category>/<produto>/<cor>/01.png` … (ver `colorVariants` no produto).
 */

export type CategorySlug = "carina" | "new-sirirus" | "asiatico" | "cooktops";

export type ProductImageFit = "square" | "wide";

export type ProductImageEntry = {
  src: string;
  fit?: ProductImageFit;
};

/**
 * Ficheiro numa pasta `public/` (via `publicGalleryImages`): `fit` omisso = quadrado.
 * Útil para catálogos com nomes irregulares e poucas imagens wide.
 */
export type GalleryImageFile = {
  readonly fileName: string;
  readonly fit?: ProductImageFit;
};

/** Variante de cor: cada uma com a sua galeria de imagens (pastas `.../<productSlug>/<slugCor>/01.png`). */
export type ProductColorVariant = {
  slug: string;
  label: string;
  imagePaths: ProductImageEntry[];
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductMeasurementsData = {
  withoutPackaging: {
    width: string;
    height: string;
    depth: string;
    weight: string;
  };
  withPackaging: {
    width: string;
    height: string;
    depth: string;
    weight: string;
  };
};

export type Product = {
  productSlug: string;
  productName: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  lineSlug: string;
  lineLabel: string;
  description: string;
  specs?: ProductSpec[];
  imagePaths: ProductImageEntry[];
  /** Se definido, a página do produto mostra seletor de cor e usa estas galerias em vez de só `imagePaths`. */
  colorVariants?: ProductColorVariant[];
  bannerImagePaths?: string[];
  measurements: ProductMeasurementsData;
};

export type LineInfo = {
  categorySlug: CategorySlug;
  lineSlug: string;
  lineLabel: string;
  products: Product[];
};

const CATEGORY_SLUGS = new Set<CategorySlug>([
  "carina",
  "new-sirirus",
  "asiatico",
  "cooktops",
]);

const CATEGORY_TITLES: Record<CategorySlug, string> = {
  carina: "Fogões Carina",
  "new-sirirus": "Fogões New Sirius",
  asiatico: "Linha Asiático",
  cooktops: "Cooktops",
};

const CATEGORY_DESCRIPTIONS: Record<CategorySlug, string> = {
  carina:
    "Fogões a gás Carina — linhas Top Control e Front Control, com forno Easy-clean e mesa em vidro temperado.",
  "new-sirirus":
    "Fogões com mesa em inox, trempe dupla esmaltada e forno Easy-clean — linha New Sirius e New Sirius Plus.",
  asiatico:
    "Fogão compacto estilo cooktop com mesa em vidro temperado, ideal para cozinhas com espaço reduzido.",
  cooktops:
    "Cooktops a gás com mesa em vidro temperado, queimadores forjados e acendimento automático.",
};

function img(product: Pick<Product, "categorySlug" | "productSlug">): ProductImageEntry[] {
  return [
    {
      src: `/Produtos/${product.categorySlug}/${product.productSlug}/01.png`,
      fit: "square",
    },
  ];
}

/** Caminho em `public/` com segmentos codificados (espaços e nomes especiais). */
function publicImagePath(parts: readonly string[]): string {
  return `/${parts.map((p) => encodeURIComponent(p)).join("/")}`;
}

function publicGalleryImage(
  baseParts: readonly string[],
  subFolders: readonly string[],
  file: GalleryImageFile,
): ProductImageEntry {
  return {
    src: publicImagePath([...baseParts, ...subFolders, file.fileName]),
    fit: file.fit ?? "square",
  };
}

function publicGalleryImages(
  baseParts: readonly string[],
  subFolders: readonly string[],
  files: readonly GalleryImageFile[],
): ProductImageEntry[] {
  return files.map((f) => publicGalleryImage(baseParts, subFolders, f));
}

/**
 * `public/Produtos/Braslar/Carina …/<pastaModelo>/`: ficheiro principal na raiz (por omissão
 * `principal.png`) + pastas `Titanio` / `Preto` conforme as listas.
 */
function braslarCarinaColorGallery(
  modelFolderParts: readonly string[],
  titanioFiles: readonly GalleryImageFile[],
  pretoFiles: readonly GalleryImageFile[],
  principalFile: GalleryImageFile = { fileName: "principal.png" },
): (color: "titanio" | "preto") => ProductImageEntry[] {
  const principal = publicGalleryImage(modelFolderParts, [], principalFile);
  return (color) => {
    const folder = color === "titanio" ? "Titanio" : "Preto";
    const files = color === "titanio" ? titanioFiles : pretoFiles;
    return [principal, ...publicGalleryImages(modelFolderParts, [folder], files)];
  };
}

/** Medidas da régua + cubagem (complementam a tabela «Este produto inclui»). */
function measureSpecs(
  m: ProductMeasurementsData,
  cubagemM3: string,
): ProductSpec[] {
  const w = (s: string) => s.replace(/\s*cm$/i, "").trim();
  const k = (s: string) => s.replace(/\s*kg$/i, "").trim();
  return [
    {
      label: "Dimensões com embalagem (L × A × P)",
      value: `${w(m.withPackaging.width)} × ${w(m.withPackaging.height)} × ${w(m.withPackaging.depth)} cm`,
    },
    {
      label: "Dimensões do produto (L × A × P)",
      value: `${w(m.withoutPackaging.width)} × ${w(m.withoutPackaging.height)} × ${w(m.withoutPackaging.depth)} cm`,
    },
    { label: "Peso líquido", value: `${k(m.withoutPackaging.weight)} kg` },
    { label: "Peso bruto (aprox., embalado)", value: `${k(m.withPackaging.weight)} kg` },
    { label: "Cubagem (aprox., m³)", value: cubagemM3 },
  ];
}

function buildProduct(
  input: Omit<Product, "specs"> & {
    cubagem: string;
    extraSpecs: ProductSpec[];
  },
): Product {
  const { cubagem, extraSpecs, ...base } = input;
  return {
    ...base,
    specs: [...extraSpecs, ...measureSpecs(base.measurements, cubagem)],
  };
}

const SPEC_CARINA_VIDRO_COMUM: ProductSpec[] = [
  { label: "Mesa", value: "Vidro temperado 6 mm" },
  { label: "Trempe", value: "Individual redonda em arame esmaltado" },
  {
    label: "Suporte da trempe",
    value: "Esmaltado — fácil limpeza, não risca",
  },
  { label: "Manípulos", value: "Anatómicos" },
  { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
  { label: "Forno", value: "Easy-clean" },
  { label: "Puxador", value: "Aço pintado" },
  {
    label: "Fixações aparentes",
    value: "Não — sem rebites, parafusos e presilhas à vista",
  },
];

const SPEC_NEW_SIRIURUS_COMUM: ProductSpec[] = [
  { label: "Mesa", value: "Inox" },
  { label: "Trempe", value: "Dupla esmaltada" },
  { label: "Manípulos", value: "Anatómicos" },
  { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
  { label: "Forno", value: "Easy-clean" },
  { label: "Puxador", value: "Aço pintado" },
  {
    label: "Fixações aparentes",
    value: "Não — sem rebites, parafusos e presilhas à vista",
  },
];

const SPEC_COOKTOP_COMUM: ProductSpec[] = [
  {
    label: "Queimadores / espalhadores",
    value: "Forjados; espalhadores esmaltados",
  },
  { label: "Acendimento automático", value: "Sim" },
  { label: "Mesa", value: "Vidro temperado 6 mm" },
  { label: "Trempe", value: "Individual redonda em arame esmaltado" },
  {
    label: "Suporte da trempe",
    value: "Esmaltado — fácil limpeza, não risca",
  },
  { label: "Manípulos", value: "Anatómicos" },
  {
    label: "Fixações aparentes",
    value: "Não — sem rebites, parafusos e presilhas à vista",
  },
];

/** Imagens em `public/Produtos/Braslar/Carina Top Control/5BC/` (pastas Titanio / Preto). */
const BRASLAR_CARINA_5BC_PARTS = [
  "Produtos",
  "Braslar",
  "Carina Top Control",
  "5BC",
] as const;

const CARINA_5BC_TC_TITANIO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Top Control  - 5Q titanium  1.png" },
  { fileName: "Carina Top Control  - 5Q titanium  2.png" },
  { fileName: "Carina Top Control  - 5Q titanium  3.png" },
  { fileName: "carina topcontrol 5bc chama 1.png", fit: "wide" },
];

const CARINA_5BC_TC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Top Control  - 5Q preto  1.png" },
  { fileName: "Carina Top Control  - 5Q preto  2.png" },
  { fileName: "Carina Top Control  - 5Q preto  3.png" },
];

const carina5BcTcGallery = braslarCarinaColorGallery(
  BRASLAR_CARINA_5BC_PARTS,
  CARINA_5BC_TC_TITANIO_FILES,
  CARINA_5BC_TC_PRETO_FILES,
);

/** Imagens em `public/Produtos/Braslar/Carina Top Control/4BC/`. */
const BRASLAR_CARINA_4BC_PARTS = [
  "Produtos",
  "Braslar",
  "Carina Top Control",
  "4BC",
] as const;

const CARINA_4BC_TC_TITANIO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Top Control  - 4Q titanium 1.png" },
  { fileName: "Carina Top Control  - 4Q titanium 2.png" },
  { fileName: "Carina Top Control  - 4Q titanium 3.png" },
  { fileName: "carina topcontrol 4bc chama.png", fit: "wide" },
];

const CARINA_4BC_TC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Top Control  - 4Q preto 1.png" },
  { fileName: "Carina Top Control  - 4Q preto 2.png" },
  { fileName: "Carina Top Control  - 4Q preto 3.png" },
];

const carina4BcTcGallery = braslarCarinaColorGallery(
  BRASLAR_CARINA_4BC_PARTS,
  CARINA_4BC_TC_TITANIO_FILES,
  CARINA_4BC_TC_PRETO_FILES,
);

/** Imagens em `public/Produtos/Braslar/Carina Front Control/4BC/` (`Principal.png` na raiz). */
const BRASLAR_CARINA_FRONT_4BC_PARTS = [
  "Produtos",
  "Braslar",
  "Carina Front Control",
  "4BC",
] as const;

const CARINA_FRONT_4BC_TITANIO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Front  - 4Q Titanium 1.png" },
  { fileName: "Carina Front  - 4Q Titanium 2.png" },
  { fileName: "Carina Front  - 4Q Titanium 3.png" },
  { fileName: "Carina 4bc chama.png", fit: "wide" },
];

const CARINA_FRONT_4BC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Front  - 4Q Preto 1.png" },
  { fileName: "Carina Front  - 4Q Preto 2.png" },
  { fileName: "Carina Front  - 4Q Preto 3.png" },
];

const carinaFrontControl4BcGallery = braslarCarinaColorGallery(
  BRASLAR_CARINA_FRONT_4BC_PARTS,
  CARINA_FRONT_4BC_TITANIO_FILES,
  CARINA_FRONT_4BC_PRETO_FILES,
  { fileName: "Principal.png" },
);

/** Pasta do modelo 5 bocas: `5Q` em `public/`; slugs do site mantêm `5bc`. */
const BRASLAR_CARINA_FRONT_5Q_PARTS = [
  "Produtos",
  "Braslar",
  "Carina Front Control",
  "5Q",
] as const;

const CARINA_FRONT_5Q_TITANIO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Front  - 5Q titanium 1.png" },
  { fileName: "Carina Front  - 5Q titanium 2.png" },
  { fileName: "Carina Front  - 5Q titanium 3.png" },
  { fileName: "Carina 5Bc 1.png" },
];

const CARINA_FRONT_5Q_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Carina Front  - 5Q Preto 1.png" },
  { fileName: "Carina Front  - 5Q Preto 2.png" },
  { fileName: "Carina Front  - 5Q Preto 3.png" },
];

const carinaFrontControl5QGallery = braslarCarinaColorGallery(
  BRASLAR_CARINA_FRONT_5Q_PARTS,
  CARINA_FRONT_5Q_TITANIO_FILES,
  CARINA_FRONT_5Q_PRETO_FILES,
  { fileName: "Principal.png" },
);

/** `public/Produtos/Braslar/New Sirius/` — variantes Preto e Branco (5BC: pastas separadas). */
const BRASLAR_NEW_SIRIUS_4BC_PARTS = [
  "Produtos",
  "Braslar",
  "New Sirius",
  "4BC",
] as const;

const NEW_SIRIUS_4BC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius 4BC Preto 1.png" },
  { fileName: "New Sirius 4BC Preto 2.png" },
  { fileName: "New Sirius 4BC Preto 3.png" },
];

const NEW_SIRIUS_4BC_BRANCO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius 4BC Branco 1.png" },
  { fileName: "New Sirius 4BC Branco 2.png" },
  { fileName: "New Sirius 4BC Branco 3.png" },
  { fileName: "New Sirius 4BC - zoom 2.png", fit: "wide" },
  { fileName: "New Sirius 4BC - zoom 2.jpg", fit: "wide" },
];

function newSirius4BcGallery(color: "preto" | "branco"): ProductImageEntry[] {
  const principal = publicGalleryImage(BRASLAR_NEW_SIRIUS_4BC_PARTS, [], {
    fileName: "Principal.png",
  });
  const folder = color === "preto" ? "Preto" : "Branco";
  const files = color === "preto" ? NEW_SIRIUS_4BC_PRETO_FILES : NEW_SIRIUS_4BC_BRANCO_FILES;
  return [principal, ...publicGalleryImages(BRASLAR_NEW_SIRIUS_4BC_PARTS, [folder], files)];
}

const BRASLAR_NEW_SIRIUS_5BC_PARTS = [
  "Produtos",
  "Braslar",
  "New Sirius",
  "5BC",
] as const;

const NEW_SIRIUS_5BC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius 5BC Preto 1.png" },
  { fileName: "New Sirius 5BC Preto 2.png" },
  { fileName: "New Sirius 5BC Preto 3.png" },
];

const NEW_SIRIUS_5BC_BRANCO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius 5BC Branco 1.png" },
  { fileName: "New Sirius 5BC Branco 2.png" },
  { fileName: "New Sirius 5BC Branco 3.png" },
  { fileName: "New Sirius 5BC - zoom 1.jpg", fit: "wide" },
  { fileName: "New Sirius 5BC - zoom 2.jpg", fit: "wide" },
];

function newSirius5BcGallery(color: "preto" | "branco"): ProductImageEntry[] {
  const principal = publicGalleryImage(BRASLAR_NEW_SIRIUS_5BC_PARTS, [], {
    fileName: "Principal.png",
  });
  const folder = color === "preto" ? "Preto" : "Branco";
  const files = color === "preto" ? NEW_SIRIUS_5BC_PRETO_FILES : NEW_SIRIUS_5BC_BRANCO_FILES;
  return [principal, ...publicGalleryImages(BRASLAR_NEW_SIRIUS_5BC_PARTS, [folder], files)];
}

/** `public/Produtos/Braslar/New Sirius Plus/5BC/` — Preto / Branco. */
const BRASLAR_NEW_SIRIUS_PLUS_5BC_PARTS = [
  "Produtos",
  "Braslar",
  "New Sirius Plus",
  "5BC",
] as const;

const NEW_SIRIUS_PLUS_5BC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius Plus 5BC Preto 1.png" },
  { fileName: "New Sirius Plus 5BC Preto 2.png" },
  { fileName: "New Sirius Plus 5BC Preto 3.png" },
];

const NEW_SIRIUS_PLUS_5BC_BRANCO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius Plus 5BC Branco 1.png" },
  { fileName: "New Sirius Plus 5BC Branco 2.png" },
  { fileName: "New Sirius Plus 5BC Branco 3.png" },
  { fileName: "New Sirius plus 5BC - zoom 1.png", fit: "wide" },
  { fileName: "New Sirius plus 5BC - zoom 2.png", fit: "wide" },
];

function newSiriusPlus5BcGallery(color: "preto" | "branco"): ProductImageEntry[] {
  const principal = publicGalleryImage(BRASLAR_NEW_SIRIUS_PLUS_5BC_PARTS, [], {
    fileName: "Principal.png",
  });
  const folder = color === "preto" ? "Preto" : "Branco";
  const files = color === "preto" ? NEW_SIRIUS_PLUS_5BC_PRETO_FILES : NEW_SIRIUS_PLUS_5BC_BRANCO_FILES;
  return [principal, ...publicGalleryImages(BRASLAR_NEW_SIRIUS_PLUS_5BC_PARTS, [folder], files)];
}

/** `public/Produtos/Braslar/New Sirius Plus/4BC/` — Preto / Branco. */
const BRASLAR_NEW_SIRIUS_PLUS_4BC_PARTS = [
  "Produtos",
  "Braslar",
  "New Sirius Plus",
  "4BC",
] as const;

const NEW_SIRIUS_PLUS_4BC_PRETO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius Plus 4BC Preto 1.png" },
  { fileName: "New Sirius Plus 4BC Preto 2.png" },
  { fileName: "New Sirius Plus 4BC Preto 3.png" },
];

const NEW_SIRIUS_PLUS_4BC_BRANCO_FILES: readonly GalleryImageFile[] = [
  { fileName: "New Sirius Plus 4BC Branco 1.png" },
  { fileName: "New Sirius Plus 4BC Branco 2.png" },
  { fileName: "New Sirius Plus 4BC Branco 3.png" },
  { fileName: "New Sirius plus 4BC - zoom 1.jpg", fit: "wide" },
  { fileName: "New Sirius plus 4BC - zoom 2.jpg", fit: "wide" },
];

function newSiriusPlus4BcGallery(color: "preto" | "branco"): ProductImageEntry[] {
  const principal = publicGalleryImage(BRASLAR_NEW_SIRIUS_PLUS_4BC_PARTS, [], {
    fileName: "Principal.png",
  });
  const folder = color === "preto" ? "Preto" : "Branco";
  const files = color === "preto" ? NEW_SIRIUS_PLUS_4BC_PRETO_FILES : NEW_SIRIUS_PLUS_4BC_BRANCO_FILES;
  return [principal, ...publicGalleryImages(BRASLAR_NEW_SIRIUS_PLUS_4BC_PARTS, [folder], files)];
}

/** `public/Produtos/Braslar/Asiatico/<pasta>/` — uma pasta por acabamento/cor da mesa. */
const BRASLAR_ASIATICO_PARTS = ["Produtos", "Braslar", "Asiatico"] as const;

const ASIATICO_VIDRO_BRANCO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Asiatico Mesa Vidro Branco 1.png" },
  { fileName: "Asiatico Mesa Vidro Branco 2.png" },
  { fileName: "Asiatico Mesa Vidro Branco 3.png" },
];

const ASIATICO_BRANCO_INOX_FILES: readonly GalleryImageFile[] = [
  { fileName: "Asiatico Mesa Inox Branco 1.png" },
  { fileName: "Asiatico Mesa Inox Branco 2.png" },
  { fileName: "Asiatico Mesa Inox Branco 3.png" },
];

const ASIATICO_PRETO_VIDRO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Asiatico Mesa Vidro Preto 1.png" },
  { fileName: "Asiatico Mesa Vidro Preto 2.png" },
  { fileName: "Asiatico Mesa Vidro Preto 3.png" },
];

const ASIATICO_PRETO_INOX_FILES: readonly GalleryImageFile[] = [
  { fileName: "Asiatico Mesa Inox Preto 1.png" },
  { fileName: "Asiatico Mesa Inox Preto 2.png" },
  { fileName: "Asiatico Mesa Inox Preto 3.png" },
];

/** Nome do ficheiro no repositório: «Esmatalda» (grafia da origem). */
const ASIATICO_PRETO_ESMALTADO_FILES: readonly GalleryImageFile[] = [
  { fileName: "Asiatico Mesa Esmatalda Preto 1.png" },
  { fileName: "Asiatico Mesa Esmatalda Preto 2.png" },
  { fileName: "Asiatico Mesa Esmatalda Preto 3.png" },
  { fileName: "Asiatico Mesa Esmatalda Preto 4.png" },
];

function asiaticoGallery(subFolder: string, files: readonly GalleryImageFile[]): ProductImageEntry[] {
  const principal = publicGalleryImage(BRASLAR_ASIATICO_PARTS, [], {
    fileName: "Principal.png",
  });
  return [principal, ...publicGalleryImages(BRASLAR_ASIATICO_PARTS, [subFolder], files)];
}

/** `public/Produtos/Braslar/Cooktops/<2BC|4BC|5BC>/` — principal = primeira vista; `Final.png` no fim. */
type BraslarCooktopModelFolder = "2BC" | "4BC" | "5BC";

const BRASLAR_COOKTOP_2BC_PARTS = ["Produtos", "Braslar", "Cooktops", "2BC"] as const;
const BRASLAR_COOKTOP_4BC_PARTS = ["Produtos", "Braslar", "Cooktops", "4BC"] as const;
const BRASLAR_COOKTOP_5BC_PARTS = ["Produtos", "Braslar", "Cooktops", "5BC"] as const;

const COOKTOP_2BC_FILES: readonly GalleryImageFile[] = [
  { fileName: "Cooktop 2BC 1.png" },
  { fileName: "Cooktop 2BC 2.png" },
  { fileName: "Cooktop 2BC 3.png" },
  { fileName: "cooktop 2BC 4.png" },
];

const COOKTOP_4BC_FILES: readonly GalleryImageFile[] = [
  { fileName: "Cooktop 4BC 1.png" },
  { fileName: "Cooktop 4BC 2.png" },
  { fileName: "Cooktop 4BC 3.png" },
];

const COOKTOP_5BC_FILES: readonly GalleryImageFile[] = [
  { fileName: "Cooktop 5BC 1.png" },
  { fileName: "Cooktop 5BC 2.png" },
  { fileName: "Cooktop 5BC 3.png" },
];

function braslarCooktopGallery(
  model: BraslarCooktopModelFolder,
  files: readonly GalleryImageFile[],
): ProductImageEntry[] {
  const parts =
    model === "2BC"
      ? BRASLAR_COOKTOP_2BC_PARTS
      : model === "4BC"
        ? BRASLAR_COOKTOP_4BC_PARTS
        : BRASLAR_COOKTOP_5BC_PARTS;
  const mainAndDetails = publicGalleryImages(parts, [], files);
  const finalShot = publicGalleryImage(parts, [], { fileName: "Final.png" });
  return [...mainAndDetails, finalShot];
}

function braslarCooktopBannerImagePath(model: BraslarCooktopModelFolder): string {
  const parts =
    model === "2BC"
      ? BRASLAR_COOKTOP_2BC_PARTS
      : model === "4BC"
        ? BRASLAR_COOKTOP_4BC_PARTS
        : BRASLAR_COOKTOP_5BC_PARTS;

  return publicImagePath([...parts, "cooktop braslar capa.jpg"]);
}

const PRODUCTS: Product[] = [
  buildProduct({
    productSlug: "fogao-5bc-carina-top-control",
    productName: "Fogão 5 Bocas Carina Top Control",
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "carina-top-control",
    lineLabel: "Carina Top Control",
    description: [
      "04 queimadores de 2000W",
      "01 queimador central super rápido 3000W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manipulos Anatômicos",
      "",
      "Pés com 130mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites,parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,325 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Titânio",
      },
      {
        label: "Queimadores",
        value:
          "04 × 2000 W; 01 central super rápido 3000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm",
      },
      { label: "Trempe", value: "Individual redonda em arame esmaltado" },
      {
        label: "Suporte da trempe",
        value: "Esmaltado — fácil limpeza, não risca",
      },
      { label: "Manipulos", value: "Anatómicos" },
      { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
      { label: "Forno", value: "Easy-clean" },
      { label: "Puxador", value: "Aço pintado" },
      {
        label: "Fixações aparentes",
        value: "Não — sem rebites, parafusos e presilhas à vista",
      },
    ],
    imagePaths: carina5BcTcGallery("titanio"),
    bannerImagePaths: [
      publicImagePath([...BRASLAR_CARINA_5BC_PARTS, "Preto", "carina topcontrol 5bc capa.png"]),
    ],
    colorVariants: [
      { slug: "titanio", label: "Titânio", imagePaths: carina5BcTcGallery("titanio") },
      { slug: "preto", label: "Preto", imagePaths: carina5BcTcGallery("preto") },
    ],
    measurements: {
      withoutPackaging: {
        width: "71,000 cm",
        height: "85,000 cm",
        depth: "56,000 cm",
        weight: "31,000 kg",
      },
      withPackaging: {
        width: "72,000 cm",
        height: "73,000 cm",
        depth: "57,000 cm",
        weight: "32,250 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-4bc-carina-top-control",
    productName: "Fogão 4 Bocas Carina Top Control",
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "carina-top-control",
    lineLabel: "Carina Top Control",
    description: [
      "04 queimadores de 2000W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manipulos Anatômicos",
      "",
      "Pés com 130mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites,parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,216 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Titânio",
      },
      {
        label: "Queimadores",
        value: "04 × 2000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm",
      },
      { label: "Trempe", value: "Individual redonda em arame esmaltado" },
      {
        label: "Suporte da trempe",
        value: "Esmaltado — fácil limpeza, não risca",
      },
      { label: "Manipulos", value: "Anatómicos" },
      { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
      { label: "Forno", value: "Easy-clean" },
      { label: "Puxador", value: "Aço pintado" },
      {
        label: "Fixações aparentes",
        value: "Não — sem rebites, parafusos e presilhas à vista",
      },
    ],
    imagePaths: carina4BcTcGallery("titanio"),
    bannerImagePaths: [
      publicImagePath([...BRASLAR_CARINA_4BC_PARTS, "Preto", "carina topcontrol 4bc capa.png"]),
    ],
    colorVariants: [
      { slug: "titanio", label: "Titânio", imagePaths: carina4BcTcGallery("titanio") },
      { slug: "preto", label: "Preto", imagePaths: carina4BcTcGallery("preto") },
    ],
    measurements: {
      withoutPackaging: {
        width: "47,000 cm",
        height: "85,000 cm",
        depth: "56,000 cm",
        weight: "17,100 kg",
      },
      withPackaging: {
        width: "48,000 cm",
        height: "73,000 cm",
        depth: "57,000 cm",
        weight: "18,350 kg",
      },
    },
  }),
  /* Texto/medidas alinhados ao Top Control até haver ficha específica Front Control. */
  buildProduct({
    productSlug: "fogao-4bc-carina-front-control",
    productName: "Fogão 4 Bocas Carina Front Control",
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "carina-front-control",
    lineLabel: "Carina Front Control",
    description: [
      "04 queimadores de 2000W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manipulos Anatômicos",
      "",
      "Pés com 130mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites,parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,216 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Titânio",
      },
      {
        label: "Queimadores",
        value: "04 × 2000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm",
      },
      { label: "Trempe", value: "Individual redonda em arame esmaltado" },
      {
        label: "Suporte da trempe",
        value: "Esmaltado — fácil limpeza, não risca",
      },
      { label: "Manipulos", value: "Anatómicos" },
      { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
      { label: "Forno", value: "Easy-clean" },
      { label: "Puxador", value: "Aço pintado" },
      {
        label: "Fixações aparentes",
        value: "Não — sem rebites, parafusos e presilhas à vista",
      },
    ],
    imagePaths: carinaFrontControl4BcGallery("titanio"),
    bannerImagePaths: [
      publicImagePath([
        ...BRASLAR_CARINA_FRONT_4BC_PARTS,
        "Titanio",
        "Carina 4bc capa ajustada.jpg",
      ]),
    ],
    colorVariants: [
      {
        slug: "titanio",
        label: "Titânio",
        imagePaths: carinaFrontControl4BcGallery("titanio"),
      },
      { slug: "preto", label: "Preto", imagePaths: carinaFrontControl4BcGallery("preto") },
    ],
    measurements: {
      withoutPackaging: {
        width: "47,000 cm",
        height: "85,000 cm",
        depth: "56,000 cm",
        weight: "17,100 kg",
      },
      withPackaging: {
        width: "48,000 cm",
        height: "73,000 cm",
        depth: "57,000 cm",
        weight: "18,350 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-5bc-carina-front-control",
    productName: "Fogão 5 Bocas Carina Front Control",
    categorySlug: "carina",
    categoryLabel: "Carina",
    lineSlug: "carina-front-control",
    lineLabel: "Carina Front Control",
    description: [
      "04 queimadores de 2000W",
      "01 queimador central super rápido 3000W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manipulos Anatômicos",
      "",
      "Pés com 130mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites,parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,325 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Titânio",
      },
      {
        label: "Queimadores",
        value:
          "04 × 2000 W; 01 central super rápido 3000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm",
      },
      { label: "Trempe", value: "Individual redonda em arame esmaltado" },
      {
        label: "Suporte da trempe",
        value: "Esmaltado — fácil limpeza, não risca",
      },
      { label: "Manipulos", value: "Anatómicos" },
      { label: "Pés", value: "130 mm com encaixe via clique-rápido" },
      { label: "Forno", value: "Easy-clean" },
      { label: "Puxador", value: "Aço pintado" },
      {
        label: "Fixações aparentes",
        value: "Não — sem rebites, parafusos e presilhas à vista",
      },
    ],
    imagePaths: carinaFrontControl5QGallery("titanio"),
    bannerImagePaths: [
      publicImagePath([
        ...BRASLAR_CARINA_FRONT_5Q_PARTS,
        "Titanio",
        "Carina 5Bc Capa 2.png",
      ]),
    ],
    colorVariants: [
      {
        slug: "titanio",
        label: "Titânio",
        imagePaths: carinaFrontControl5QGallery("titanio"),
      },
      { slug: "preto", label: "Preto", imagePaths: carinaFrontControl5QGallery("preto") },
    ],
    measurements: {
      withoutPackaging: {
        width: "71,000 cm",
        height: "85,000 cm",
        depth: "56,000 cm",
        weight: "31,000 kg",
      },
      withPackaging: {
        width: "72,000 cm",
        height: "73,000 cm",
        depth: "57,000 cm",
        weight: "32,250 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-5bc-new-sirirus",
    productName: "Fogão 5 Bocas New Sirius",
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirius",
    lineSlug: "new-sirirus",
    lineLabel: "New Sirius",
    description: [
      "04 queimadores de 2000 W",
      "01 queimador central super rápido 3000 W",
      "Queimadores estampados e espalhadores esmaltados",
      "",
      "Mesa em inox",
      "Trempe dupla esmaltada",
      "Manípulos anatómicos",
      "",
      "Pés com 130 mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,320 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Branco",
      },
      {
        label: "Queimadores",
        value:
          "04 × 2000 W; 01 central super rápido 3000 W; estampados; espalhadores esmaltados",
      },
      ...SPEC_NEW_SIRIURUS_COMUM,
    ],
    imagePaths: newSirius5BcGallery("preto"),
    bannerImagePaths: [
      publicImagePath([...BRASLAR_NEW_SIRIUS_5BC_PARTS, "Preto", "new sirius 5BC capa.jpg"]),
    ],
    colorVariants: [
      { slug: "preto", label: "Preto", imagePaths: newSirius5BcGallery("preto") },
      { slug: "branco", label: "Branco", imagePaths: newSirius5BcGallery("branco") },
    ],
    measurements: {
      withoutPackaging: {
        width: "71,000 cm",
        height: "85,000 cm",
        depth: "53,000 cm",
        weight: "23,000 kg",
      },
      withPackaging: {
        width: "72,000 cm",
        height: "73,000 cm",
        depth: "54,000 cm",
        weight: "24,250 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-4bc-new-sirirus",
    productName: "Fogão 4 Bocas New Sirius",
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirius",
    lineSlug: "new-sirirus",
    lineLabel: "New Sirius",
    description: [
      "04 queimadores família de 2000 W",
      "Queimadores estampados e espalhadores esmaltados",
      "",
      "Mesa em inox",
      "Trempe dupla esmaltada",
      "Manípulos anatómicos",
      "",
      "Pés com 130 mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,208 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Branco",
      },
      {
        label: "Queimadores",
        value: "04 × família 2000 W; estampados; espalhadores esmaltados",
      },
      ...SPEC_NEW_SIRIURUS_COMUM,
    ],
    imagePaths: newSirius4BcGallery("preto"),
    bannerImagePaths: [
      publicImagePath([...BRASLAR_NEW_SIRIUS_4BC_PARTS, "Preto", "New Sirius 4b capa.png"]),
    ],
    colorVariants: [
      { slug: "preto", label: "Preto", imagePaths: newSirius4BcGallery("preto") },
      { slug: "branco", label: "Branco", imagePaths: newSirius4BcGallery("branco") },
    ],
    measurements: {
      withoutPackaging: {
        width: "47,000 cm",
        height: "85,000 cm",
        depth: "52,000 cm",
        weight: "15,250 kg",
      },
      withPackaging: {
        width: "48,000 cm",
        height: "73,000 cm",
        depth: "54,000 cm",
        weight: "16,500 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-4bc-new-sirirus-plus",
    productName: "Fogão 4 Bocas New Sirius Plus",
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirius",
    lineSlug: "new-sirirus-plus",
    lineLabel: "New Sirius Plus",
    description: [
      "04 queimadores família de 2000 W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa em inox",
      "Trempe dupla esmaltada",
      "Manípulos anatómicos",
      "",
      "Pés com 130 mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,208 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Branco",
      },
      {
        label: "Queimadores",
        value: "04 × família 2000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      ...SPEC_NEW_SIRIURUS_COMUM,
    ],
    imagePaths: newSiriusPlus4BcGallery("preto"),
    bannerImagePaths: [
      publicImagePath([
        ...BRASLAR_NEW_SIRIUS_PLUS_4BC_PARTS,
        "Preto",
        "New Sirius Plus 4bc capa 1.jpg",
      ]),
    ],
    colorVariants: [
      { slug: "preto", label: "Preto", imagePaths: newSiriusPlus4BcGallery("preto") },
      { slug: "branco", label: "Branco", imagePaths: newSiriusPlus4BcGallery("branco") },
    ],
    measurements: {
      withoutPackaging: {
        width: "47,000 cm",
        height: "85,000 cm",
        depth: "52,000 cm",
        weight: "15,250 kg",
      },
      withPackaging: {
        width: "48,000 cm",
        height: "73,000 cm",
        depth: "54,000 cm",
        weight: "16,500 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-5bc-new-sirirus-plus",
    productName: "Fogão 5 Bocas New Sirius Plus",
    categorySlug: "new-sirirus",
    categoryLabel: "New Sirius",
    lineSlug: "new-sirirus-plus",
    lineLabel: "New Sirius Plus",
    description: [
      "04 queimadores família de 2000 W",
      "01 queimador central super rápido 3000 W",
      "Queimadores estampados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa em inox",
      "Trempe dupla esmaltada",
      "Manípulos anatómicos",
      "",
      "Pés com 130 mm e encaixe via clique-rápido",
      "Forno Easy-clean",
      "Puxador de aço pintado",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,325 m³",
    extraSpecs: [
      {
        label: "Cores disponíveis",
        value: "Preto e Branco",
      },
      {
        label: "Queimadores",
        value:
          "04 × 2000 W; 01 central super rápido 3000 W; estampados; espalhadores esmaltados",
      },
      { label: "Acendimento automático", value: "Sim" },
      ...SPEC_NEW_SIRIURUS_COMUM,
    ],
    imagePaths: newSiriusPlus5BcGallery("preto"),
    bannerImagePaths: [
      publicImagePath([
        ...BRASLAR_NEW_SIRIUS_PLUS_5BC_PARTS,
        "Preto",
        "New sirius plus 5BC capa.jpg",
      ]),
    ],
    colorVariants: [
      { slug: "preto", label: "Preto", imagePaths: newSiriusPlus5BcGallery("preto") },
      { slug: "branco", label: "Branco", imagePaths: newSiriusPlus5BcGallery("branco") },
    ],
    measurements: {
      withoutPackaging: {
        width: "71,000 cm",
        height: "85,000 cm",
        depth: "53,000 cm",
        weight: "27,900 kg",
      },
      withPackaging: {
        width: "72,000 cm",
        height: "73,000 cm",
        depth: "54,000 cm",
        weight: "29,150 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "fogao-4bc-asiatico",
    productName: "Fogão 4 Bocas Asiático",
    categorySlug: "asiatico",
    categoryLabel: "Asiático",
    lineSlug: "asiatico",
    lineLabel: "Asiático",
    description: [
      "04 queimadores de 2000 W",
      "Queimadores estampados e espalhadores esmaltados",
      "",
      "Mesa em vidro temperado 6 mm, inox ou esmalte — conforme a variante escolhida",
      "Trempe dupla redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manípulos anatómicos",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,030 m³",
    extraSpecs: [
      {
        label: "Acabamentos de mesa",
        value: "Vidro branco, vidro preto, inox preto, inox branco ou esmalte preto",
      },
      {
        label: "Queimadores",
        value: "04 × 2000 W; estampados; espalhadores esmaltados",
      },
      {
        label: "Mesa",
        value: "Vidro temperado 6 mm, inox ou esmalte — conforme a variante",
      },
      { label: "Trempe", value: "Dupla redonda em arame esmaltado" },
      {
        label: "Suporte da trempe",
        value: "Esmaltado — fácil limpeza, não risca",
      },
      { label: "Manípulos", value: "Anatómicos" },
      {
        label: "Fixações aparentes",
        value: "Não — sem rebites, parafusos e presilhas à vista",
      },
    ],
    imagePaths: asiaticoGallery("Vidro Branco", ASIATICO_VIDRO_BRANCO_FILES),
    bannerImagePaths: [
      publicImagePath([
        ...BRASLAR_ASIATICO_PARTS,
        "Branco Inox",
        "Asiatico Mesa Inox Branco 4 capa.jpg",
      ]),
    ],
    colorVariants: [
      {
        slug: "vidro-branco",
        label: "Vidro branco",
        imagePaths: asiaticoGallery("Vidro Branco", ASIATICO_VIDRO_BRANCO_FILES),
      },
      {
        slug: "inox-branco",
        label: "Inox branco",
        imagePaths: asiaticoGallery("Branco Inox", ASIATICO_BRANCO_INOX_FILES),
      },
      {
        slug: "vidro-preto",
        label: "Vidro preto",
        imagePaths: asiaticoGallery("Preto Vidro", ASIATICO_PRETO_VIDRO_FILES),
      },
      {
        slug: "inox-preto",
        label: "Inox preto",
        imagePaths: asiaticoGallery("Preto Inox", ASIATICO_PRETO_INOX_FILES),
      },
      {
        slug: "esmalte-preto",
        label: "Esmalte preto",
        imagePaths: asiaticoGallery("Preto Esmaltado", ASIATICO_PRETO_ESMALTADO_FILES),
      },
    ],
    measurements: {
      withoutPackaging: {
        width: "47,000 cm",
        height: "12,770 cm",
        depth: "49,300 cm",
        weight: "6,470 kg",
      },
      withPackaging: {
        width: "49,400 cm",
        height: "12,000 cm",
        depth: "48,700 cm",
        weight: "7,720 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "cooktop-2bc",
    productName: "Cooktop 2 bocas",
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    description: [
      "1 queimador de 1,7 kW",
      "1 queimador de 3,0 kW",
      "Queimadores forjados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6 mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manípulos anatómicos",
      "",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,017 m³",
    extraSpecs: [
      { label: "Queimadores", value: "01 × 1,7 kW; 01 × 3,0 kW" },
      ...SPEC_COOKTOP_COMUM,
    ],
    imagePaths: braslarCooktopGallery("2BC", COOKTOP_2BC_FILES),
    bannerImagePaths: [braslarCooktopBannerImagePath("2BC")],
    measurements: {
      withoutPackaging: {
        width: "51,000 cm",
        height: "11,000 cm",
        depth: "29,500 cm",
        weight: "4,400 kg",
      },
      withPackaging: {
        width: "52,000 cm",
        height: "12,500 cm",
        depth: "30,500 cm",
        weight: "5,650 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "cooktop-4bc",
    productName: "Cooktop 4 bocas",
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    description: [
      "3 queimadores de 1,7 kW",
      "1 queimador de 3,0 kW",
      "Queimadores forjados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6 mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manípulos anatómicos",
      "",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,026 m³",
    extraSpecs: [
      { label: "Queimadores", value: "03 × 1,7 kW; 01 × 3,0 kW" },
      ...SPEC_COOKTOP_COMUM,
    ],
    imagePaths: braslarCooktopGallery("4BC", COOKTOP_4BC_FILES),
    bannerImagePaths: [braslarCooktopBannerImagePath("4BC")],
    measurements: {
      withoutPackaging: {
        width: "55,000 cm",
        height: "11,000 cm",
        depth: "43,000 cm",
        weight: "7,300 kg",
      },
      withPackaging: {
        width: "57,000 cm",
        height: "12,500 cm",
        depth: "46,000 cm",
        weight: "8,550 kg",
      },
    },
  }),
  buildProduct({
    productSlug: "cooktop-5bc",
    productName: "Cooktop 5 bocas",
    categorySlug: "cooktops",
    categoryLabel: "Cooktop",
    lineSlug: "cooktop",
    lineLabel: "Cooktop",
    description: [
      "4 queimadores de 1,7 kW",
      "1 queimador de 3,0 kW",
      "Queimadores forjados e espalhadores esmaltados",
      "Com acendimento automático",
      "",
      "Mesa de vidro temperado 6 mm",
      "Trempe individual redonda em arame esmaltado",
      "Suporte da trempe esmaltado, fácil limpeza, não risca",
      "Manípulos anatómicos",
      "",
      "Sem fixações aparentes (rebites, parafusos e presilhas)",
    ].join("\n"),
    cubagem: "0,034 m³",
    extraSpecs: [
      { label: "Queimadores", value: "04 × 1,7 kW; 01 × 3,0 kW" },
      ...SPEC_COOKTOP_COMUM,
    ],
    imagePaths: braslarCooktopGallery("5BC", COOKTOP_5BC_FILES),
    bannerImagePaths: [braslarCooktopBannerImagePath("5BC")],
    measurements: {
      withoutPackaging: {
        width: "68,000 cm",
        height: "11,000 cm",
        depth: "45,000 cm",
        weight: "9,500 kg",
      },
      withPackaging: {
        width: "70,000 cm",
        height: "12,500 cm",
        depth: "46,000 cm",
        weight: "10,750 kg",
      },
    },
  }),
];

function productKey(categoria: string, linha: string, produto: string): string {
  return `${categoria}/${linha}/${produto}`;
}

const productByRoute = new Map<string, Product>();
for (const p of PRODUCTS) {
  productByRoute.set(
    productKey(p.categorySlug, p.lineSlug, p.productSlug),
    p,
  );
}

export function parseCategorySlug(categoria: string): CategorySlug | null {
  if (CATEGORY_SLUGS.has(categoria as CategorySlug)) {
    return categoria as CategorySlug;
  }
  return null;
}

export function getCategoryPageTitle(slug: CategorySlug): string {
  return CATEGORY_TITLES[slug];
}

export function getCategoryPageDescription(slug: CategorySlug): string {
  return CATEGORY_DESCRIPTIONS[slug];
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug).sort((a, b) => {
    const line = a.lineLabel.localeCompare(b.lineLabel, "pt");
    if (line !== 0) return line;
    return a.productName.localeCompare(b.productName, "pt");
  });
}

export function getProductBySlugs(
  categoria: string,
  linha: string,
  produto: string,
): Product | undefined {
  return productByRoute.get(productKey(categoria, linha, produto));
}

export function getLineBySlugs(
  categoria: string,
  linha: string,
): LineInfo | undefined {
  const slug = parseCategorySlug(categoria);
  if (!slug) return undefined;
  const products = PRODUCTS.filter(
    (p) => p.categorySlug === slug && p.lineSlug === linha,
  ).sort((a, b) => a.productName.localeCompare(b.productName, "pt"));
  if (products.length === 0) return undefined;
  const first = products[0];
  return {
    categorySlug: first.categorySlug,
    lineSlug: first.lineSlug,
    lineLabel: first.lineLabel,
    products,
  };
}

export function getAllCategoryRouteParams(): { categoria: string }[] {
  return (Array.from(CATEGORY_SLUGS) as CategorySlug[]).map((categoria) => ({
    categoria,
  }));
}

export function getAllLineRouteParams(): {
  categoria: string;
  linha: string;
}[] {
  const seen = new Set<string>();
  const out: { categoria: string; linha: string }[] = [];
  for (const p of PRODUCTS) {
    const k = `${p.categorySlug}/${p.lineSlug}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ categoria: p.categorySlug, linha: p.lineSlug });
  }
  return out;
}

export function getAllProductRouteParams(): {
  categoria: string;
  linha: string;
  produto: string;
}[] {
  return PRODUCTS.map((p) => ({
    categoria: p.categorySlug,
    linha: p.lineSlug,
    produto: p.productSlug,
  }));
}

/** Imagens da galeria para a cor escolhida (ou `imagePaths` se não houver variantes). */
export function getProductImagePathsForColor(
  product: Product,
  colorSlug: string | undefined,
): ProductImageEntry[] {
  const variants = product.colorVariants;
  if (!variants?.length) return product.imagePaths;
  const match = colorSlug
    ? variants.find((v) => v.slug === colorSlug)
    : undefined;
  return match?.imagePaths ?? variants[0]!.imagePaths;
}

export function getPrimaryProductImageSrc(product: Product): string | undefined {
  const paths = getProductImagePathsForColor(product, product.colorVariants?.[0]?.slug);
  return paths[0]?.src;
}

/**
 * Imagens da galeria na ordem definida. Aceita `.png`, `.jpg`, `.jpeg`, `.webp` em `public/`.
 */
export function getProductPngPathsInOrder(
  images: ProductImageEntry[],
): { src: string; fit: ProductImageFit }[] {
  return images.map((e) => ({
    src: e.src,
    fit: e.fit ?? "square",
  }));
}

export function getProductMeasurements(product: Product): ProductMeasurementsData {
  return product.measurements;
}
