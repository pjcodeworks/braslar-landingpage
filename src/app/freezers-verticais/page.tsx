import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { CategoryProductCard } from "@/components/layout/category-product-card";
import { getProductsByCategory } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Freezers verticais",
  description: `Freezers verticais comerciais ${SITE.name}.`,
};

const products = getProductsByCategory("freezers-verticais");

export default function FreezersVerticaisPage() {
  return (
    <CategoryPage
      title="Freezers verticais"
      description={`Linha de freezers verticais para o seu negócio — ${SITE.name}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <CategoryProductCard
            key={product.productSlug}
            product={product}
            href={`/freezers-verticais/${product.lineSlug}/${product.productSlug}`}
          />
        ))}
      </div>
    </CategoryPage>
  );
}
