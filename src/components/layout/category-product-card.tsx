import Image from "next/image";
import Link from "next/link";
import { getPrimaryProductImageSrc, type Product } from "@/lib/products";

export function CategoryProductCard({
  product,
  href,
}: {
  product: Product;
  href: string;
}) {
  const preview = getPrimaryProductImageSrc(product);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-[#b49ecc] hover:shadow-md"
    >
      {preview ? (
        <div className="relative aspect-[4/3] w-full shrink-0 bg-zinc-50">
          <Image
            src={preview}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-3 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full shrink-0 items-center justify-center bg-zinc-100 text-xs font-medium text-zinc-400">
          Imagem em breve
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em]">
            <span className="text-zinc-700">{product.categoryLabel}</span>
            <span className="text-[#CB634E]">
              {" "}
              · {product.lineLabel}
            </span>
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">{product.productName}</h2>
        </div>
        <span className="text-sm font-medium text-[#b49ecc] group-hover:underline">
          Ver detalhes
        </span>
      </div>
    </Link>
  );
}
