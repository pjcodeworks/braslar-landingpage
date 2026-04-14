import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY } from "@/lib/next-image-quality";
import { getPrimaryProductImageSrc, type CategorySlug, type Product } from "@/lib/products";

const cardClassName =
  "group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-[#b49ecc] hover:shadow-md";

function ProductCategoryCard({
  product,
  categorySlug,
  heading: Heading,
}: {
  product: Product;
  categorySlug: CategorySlug;
  heading: "h2" | "h3";
}) {
  const src = getPrimaryProductImageSrc(product);
  return (
    <Link
      href={`/${categorySlug}/${product.lineSlug}/${product.productSlug}`}
      className={cardClassName}
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-50">
        {src ? (
          <Image
            src={src}
            alt={product.productName}
            fill
            quality={IMAGE_QUALITY.listing}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-contain p-3"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em]">
            <span className="text-zinc-600">{product.categoryLabel}</span>
            <span className="text-[#5D2E78]">
              {" "}
              · {product.lineLabel}
            </span>
          </p>
          <Heading className="mt-2 text-lg font-semibold text-zinc-900">
            {product.productName}
          </Heading>
        </div>
        <span className="text-sm font-medium text-[#b49ecc] group-hover:underline">
          Ver detalhes
        </span>
      </div>
    </Link>
  );
}

export function CategoryListing({
  categorySlug,
  products,
}: {
  categorySlug: CategorySlug;
  products: Product[];
}) {
  if (categorySlug === "carina" || categorySlug === "new-sirirus") {
    const lines = Array.from(
      new Map(
        products.map((p) => [p.lineSlug, { lineSlug: p.lineSlug, lineLabel: p.lineLabel }]),
      ).values(),
    );
    return (
      <div className="space-y-8">
        {lines.map((line) => (
          <section key={line.lineSlug} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#CB634E]">
              Linha {line.lineLabel}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.lineSlug === line.lineSlug)
                .map((product) => (
                  <ProductCategoryCard
                    key={product.productSlug}
                    product={product}
                    categorySlug={categorySlug}
                    heading="h3"
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCategoryCard
          key={product.productSlug}
          product={product}
          categorySlug={categorySlug}
          heading="h2"
        />
      ))}
    </div>
  );
}
