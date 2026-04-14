import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategoryPageTitle, getProductMeasurements } from "@/lib/products";
import {
  ProductImageGalleryMain,
  ProductImageGalleryThumbs,
} from "@/components/layout/product-image-carousel";
import { ProductColorGalleryWrapper } from "@/components/layout/product-color-context";
import { ProductMeasurements } from "@/components/layout/product-measurements";
import { ProductBanners } from "@/components/layout/product-banners";
import { ProductDescriptionExpandable } from "@/components/layout/product-description-expandable";
import { ProductSpecsTable } from "@/components/layout/product-specs-table";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/cn";

export function ProductPageLayout({ product }: { product: Product }) {
  const categoryHref = `/${product.categorySlug}`;
  const categoryTitle = getCategoryPageTitle(product.categorySlug);
  const bannerPaths = product.bannerImagePaths ?? [];
  const hasBanners = bannerPaths.length > 0;
  const hasSpecs = product.specs != null && product.specs.length > 0;
  const hasDescription = Boolean(product.description);
  const lowerBlockVisible = hasBanners || hasSpecs || hasDescription;
  const lowerSectionCount =
    (hasBanners ? 1 : 0) + (hasDescription ? 1 : 0) + (hasSpecs ? 1 : 0);

  return (
    <div className="min-h-full bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-screen-2xl px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-12 lg:px-8 xl:px-12 2xl:px-16">
        <nav aria-label="Trilha de navegação" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
            <li>
              <Link href="/" className="hover:text-foreground">
                Início
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li>
              <Link href={categoryHref} className="hover:text-foreground">
                {categoryTitle}
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li>
              <Link
                href={`/${product.categorySlug}/${product.lineSlug}`}
                className="hover:text-foreground"
              >
                Linha {product.lineLabel}
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li className="font-medium text-foreground">
              {product.productName}
            </li>
          </ol>
        </nav>

        <header className="border-b border-zinc-200 pb-8 lg:pb-6">
          <ProductColorGalleryWrapper product={product}>
            {/*
              Mobile: título → foto → miniaturas → descrição (Conferir mais) → medidas.
              lg+: duas colunas ~50/50 — esq.: foto + miniaturas; dir.: título e medidas (scroll se preciso).
            */}
            <div className="flex flex-col gap-6 lg:hidden">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]">
                  {categoryTitle} · Linha {product.lineLabel}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {product.productName}
                </h1>
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <ProductImageGalleryMain />
                <ProductImageGalleryThumbs />
              </div>
              {product.description && (
                <ProductDescriptionExpandable
                  key={product.productSlug}
                  description={product.description}
                />
              )}
              <ProductMeasurements data={getProductMeasurements(product)} />
            </div>

            {/*
              Altura ~viewport: cabeçalho fixo (~4rem) + padding + trilha (~3,5rem) ≈ 8,5–9rem.
              Colunas iguais (1fr / 1fr); linha 1 = foto | texto+medidas; linha 2 = miniaturas na esquerda.
            */}
            <div
              className={cn(
                "hidden min-h-0 min-w-0 lg:grid",
                "lg:h-[calc(100svh-8.75rem)] lg:max-h-[calc(100svh-8.75rem)]",
                "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]",
                "lg:gap-x-10 lg:gap-y-4 lg:overflow-hidden lg:overscroll-contain",
                "xl:gap-x-14",
              )}
            >
              <div className="flex min-h-0 h-full w-full items-center justify-center lg:col-start-1 lg:row-start-1">
                <ProductImageGalleryMain
                  variant="fitHeight"
                  className="min-h-0 h-full w-full min-w-0"
                />
              </div>
              <div
                className={cn(
                  "flex min-h-0 w-full min-w-0 flex-col gap-5 overflow-y-auto overscroll-y-contain border-l border-zinc-200 pl-8 lg:col-start-2 lg:row-start-1 lg:self-stretch lg:pr-1 xl:pl-10",
                )}
              >
                <div className="shrink-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]">
                    {categoryTitle} · Linha {product.lineLabel}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {product.productName}
                  </h1>
                  {product.description && (
                    <ProductDescriptionExpandable
                      key={product.productSlug}
                      description={product.description}
                    />
                  )}
                </div>
                <div className="mt-auto shrink-0">
                  <ProductMeasurements data={getProductMeasurements(product)} />
                </div>
              </div>
              <ProductImageGalleryThumbs className="shrink-0 w-full lg:col-start-1 lg:row-start-2" />
            </div>
          </ProductColorGalleryWrapper>
        </header>

        {lowerBlockVisible ? (
          <div
            className={cn(
              "mt-8 sm:mt-10",
              lowerSectionCount > 1 && "space-y-6 sm:space-y-8",
            )}
          >
            {hasBanners && (
              <ProductBanners paths={bannerPaths} productName={product.productName} />
            )}
            {hasDescription && product.description && (
              <section
                id="produto-descricao"
                aria-labelledby="produto-descricao-heading"
                className="scroll-mt-24"
              >
                <h2
                  id="produto-descricao-heading"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]/90"
                >
                  DESCRIÇÃO
                </h2>
                <p className="mt-3 text-base whitespace-pre-line text-zinc-600">
                  {product.description}
                </p>
              </section>
            )}
            {hasSpecs && product.specs && (
              <ProductSpecsTable specs={product.specs} productSlug={product.productSlug} />
            )}
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
