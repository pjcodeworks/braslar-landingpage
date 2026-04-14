import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { CategoryProductCard } from "@/components/layout/category-product-card";
import { getProductsByCategory } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cervejeiras",
  description: `Cervejeiras e expositores ${SITE.name}.`,
};

const products = getProductsByCategory("cervejeiras");

export default function CervejeirasPage() {
  return (
    <CategoryPage
      title="Cervejeiras"
      description={`Expositores e soluções para bebidas com a qualidade ${SITE.name}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <CategoryProductCard
            key={product.productSlug}
            product={product}
            href={`/cervejeiras/${product.lineSlug}/${product.productSlug}`}
          />
        ))}
      </div>
    </CategoryPage>
  );
}
