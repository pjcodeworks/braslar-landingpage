import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { CategoryProductCard } from "@/components/layout/category-product-card";
import { getProductsByCategory } from "@/lib/products";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refrigeradores",
  description: `Refrigeradores ${SITE.name}.`,
};

const products = getProductsByCategory("refrigeradores");

export default function RefrigeradoresPage() {
  return (
    <CategoryPage
      title="Refrigeradores"
      description={`Veja os refrigeradores ${SITE.name} para o seu negócio.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <CategoryProductCard
            key={product.productSlug}
            product={product}
            href={`/refrigeradores/${product.lineSlug}/${product.productSlug}`}
          />
        ))}
      </div>
    </CategoryPage>
  );
}
