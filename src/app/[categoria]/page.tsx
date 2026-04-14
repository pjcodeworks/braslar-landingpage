import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListing } from "@/components/layout/category-listing";
import { CategoryPage } from "@/components/layout/category-page";
import {
  getAllCategoryRouteParams,
  getCategoryPageDescription,
  getCategoryPageTitle,
  getProductsByCategory,
  parseCategorySlug,
} from "@/lib/products";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{ categoria: string }>;
};

export function generateStaticParams() {
  return getAllCategoryRouteParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const slug = parseCategorySlug(categoria);
  if (!slug) {
    return { title: "Categoria" };
  }
  const title = getCategoryPageTitle(slug);
  return {
    title,
    description: `${title} ${SITE.name}.`,
    alternates: {
      canonical: `/${categoria}`,
    },
  };
}

export default async function CategoryRoutePage({ params }: PageProps) {
  const { categoria } = await params;
  const slug = parseCategorySlug(categoria);
  if (!slug) {
    notFound();
  }

  const products = getProductsByCategory(slug);
  const title = getCategoryPageTitle(slug);
  const description = getCategoryPageDescription(slug);

  return (
    <CategoryPage
      title={title}
      description={description}
      breadcrumbItems={[
        { label: "Início", href: "/" },
        { label: title },
      ]}
    >
      <CategoryListing categorySlug={slug} products={products} />
    </CategoryPage>
  );
}
