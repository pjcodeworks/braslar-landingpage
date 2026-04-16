---
name: mover capas para banners
overview: Separar as imagens com `capa` da galeria principal dos produtos, preenchendo `bannerImagePaths` no catálogo e preservando a mesma capa como imagem principal dos cards/listagens.
todos:
  - id: catalog-split-cover-images
    content: Mapear e separar imagens `capa` das galerias em `src/lib/products.ts`
    status: completed
  - id: populate-banner-image-paths
    content: Preencher `bannerImagePaths` para os produtos afetados reutilizando os helpers de URL existentes
    status: completed
  - id: preserve-card-preview
    content: Ajustar `getPrimaryProductImageSrc()` para manter a capa como preview principal fora da galeria
    status: completed
  - id: validate-ui-flow
    content: Validar banners na página do produto e previews nas listagens sem regressão visual
    status: completed
isProject: false
---

# Mover imagens `capa` para `bannerImagePaths`

## Objetivo
Remover da galeria principal as imagens cujo nome de arquivo contém `capa`, fazer com que elas passem a aparecer como banners da página do produto e manter essa mesma capa como imagem principal nas listagens.

## Contexto confirmado
- O catálogo é estático em [src/lib/products.ts](src/lib/products.ts); não há leitura dinâmica de arquivos em `public`.
- A página do produto já consome `bannerImagePaths` em [src/components/layout/product-page.tsx](src/components/layout/product-page.tsx), então o principal trabalho fica no catálogo.
- Hoje a imagem principal dos cards/listagens vem de `getPrimaryProductImageSrc()`, também em [src/lib/products.ts](src/lib/products.ts), usando a primeira imagem da galeria ativa.

## Arquivos principais
- [src/lib/products.ts](src/lib/products.ts): separar arquivos `capa`, montar `bannerImagePaths`, ajustar preview principal dos cards.
- [src/components/layout/product-page.tsx](src/components/layout/product-page.tsx): validar que o consumo atual de `bannerImagePaths` já atende sem mudança estrutural.
- [src/components/layout/category-listing.tsx](src/components/layout/category-listing.tsx) e [src/components/layout/category-product-card.tsx](src/components/layout/category-product-card.tsx): validar que continuam corretos ao reutilizar `getPrimaryProductImageSrc()`.

## Implementação proposta
1. Em [src/lib/products.ts](src/lib/products.ts), criar um helper local para separar arrays de `GalleryImageFile` em dois grupos:
   - `galleryFiles`: arquivos normais.
   - `bannerFiles`: arquivos cujo `fileName`, normalizado para minúsculas, contém `capa`.
2. Aplicar essa separação nos produtos já identificados com `capa` no catálogo atual, incluindo os conjuntos de Carina e New Sirius/New Sirius Plus.
3. Montar `bannerImagePaths` a partir dos `bannerFiles`, reaproveitando a mesma geração de URL usada hoje (`publicImagePath` / `publicGalleryImage`).
4. Garantir que `imagePaths` e `colorVariants[].imagePaths` deixem de incluir as imagens `capa`, para que elas não apareçam no carrossel/fotos do produto.
5. Ajustar `getPrimaryProductImageSrc()` para priorizar a capa preservada fora da galeria:
   - preferir a primeira entrada de `bannerImagePaths` quando existir;
   - cair para a primeira imagem da galeria apenas quando não houver banner.
6. Validar que [src/components/layout/product-page.tsx](src/components/layout/product-page.tsx) continua renderizando a faixa de banners corretamente sem mudanças adicionais.

## Trechos essenciais

```109:130:src/lib/products.ts
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
```

```1381:1395:src/lib/products.ts
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
```

```17:24:src/components/layout/product-page.tsx
export function ProductPageLayout({ product }: { product: Product }) {
  const categoryHref = `/${product.categorySlug}`;
  const categoryTitle = getCategoryPageTitle(product.categorySlug);
  const bannerPaths = product.bannerImagePaths ?? [];
  const hasBanners = bannerPaths.length > 0;
  const hasSpecs = product.specs != null && product.specs.length > 0;
  const hasDescription = Boolean(product.description);
  const lowerBlockVisible = hasBanners || hasSpecs || hasDescription;
```

## Validação
- Confirmar que as imagens com `capa` deixam de aparecer no carrossel/fotos do produto.
- Confirmar que passam a aparecer no bloco de banners da página do produto.
- Confirmar que os cards/listagens continuam usando a mesma capa como imagem principal.
- Rodar verificação de lint nos arquivos alterados após a implementação.