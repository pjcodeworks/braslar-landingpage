import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageLayout } from "@/components/layout/product-page";
import {
  getAllProductRouteParams,
  getCategoryPageTitle,
  getProductBySlugs,
} from "@/lib/products";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{
    categoria: string;
    linha: string;
    produto: string;
  }>;
};

export function generateStaticParams() {
  return getAllProductRouteParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria, linha, produto } = await params;
  const product = getProductBySlugs(categoria, linha, produto);
  if (!product) {
    return { title: "Produto" };
  }
  const categoryTitle = getCategoryPageTitle(product.categorySlug);
  return {
    title: `${product.productName} | ${product.lineLabel} | ${categoryTitle}`,
    description: `${product.productName} — ${product.lineLabel}, ${categoryTitle}. ${SITE.name}.`,
    alternates: {
      canonical: `/${categoria}/${linha}/${produto}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { categoria, linha, produto } = await params;
  const product = getProductBySlugs(categoria, linha, produto);
  if (!product) {
    notFound();
  }

  return <ProductPageLayout product={product} />;
}
