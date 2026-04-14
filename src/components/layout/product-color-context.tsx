"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductColorVariant } from "@/lib/products";
import { getProductImagePathsForColor } from "@/lib/products";
import { ProductImageGalleryProvider } from "@/components/layout/product-image-carousel";

export type ProductColorContextValue = {
  hasColors: boolean;
  variants: ProductColorVariant[] | undefined;
  colorSlug: string;
  setColorSlug: (slug: string) => void;
};

const ProductColorContext = createContext<ProductColorContextValue | null>(null);

/** `null` fora de `ProductColorGalleryWrapper` (ex.: outras páginas). */
export function useProductColor(): ProductColorContextValue | null {
  return useContext(ProductColorContext);
}

const noopContext: ProductColorContextValue = {
  hasColors: false,
  variants: undefined,
  colorSlug: "",
  setColorSlug: () => {},
};

/**
 * Estado de cor + galeria. O seletor de cor fica em `ProductMeasurements`;
 * este wrapper só fornece contexto e `ProductImageGalleryProvider`.
 */
export function ProductColorGalleryWrapper({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const variants = product.colorVariants;
  const [colorSlug, setColorSlug] = useState(() => variants?.[0]?.slug ?? "");

  useEffect(() => {
    setColorSlug(variants?.[0]?.slug ?? "");
  }, [product.productSlug, variants]);

  const images = useMemo(
    () => getProductImagePathsForColor(product, colorSlug || undefined),
    [product, colorSlug],
  );

  const ctx = useMemo<ProductColorContextValue>(
    () => ({
      hasColors: Boolean(variants?.length),
      variants,
      colorSlug,
      setColorSlug,
    }),
    [variants, colorSlug],
  );

  if (!variants?.length) {
    return (
      <ProductColorContext.Provider value={noopContext}>
        <ProductImageGalleryProvider
          key={product.productSlug}
          images={product.imagePaths}
          productName={product.productName}
        >
          {children}
        </ProductImageGalleryProvider>
      </ProductColorContext.Provider>
    );
  }

  return (
    <ProductColorContext.Provider value={ctx}>
      <ProductImageGalleryProvider
        key={`${product.productSlug}-${colorSlug}`}
        images={images}
        productName={product.productName}
      >
        {children}
      </ProductImageGalleryProvider>
    </ProductColorContext.Provider>
  );
}
