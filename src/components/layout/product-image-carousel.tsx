"use client";

import Image from "next/image";
import { IMAGE_QUALITY } from "@/lib/next-image-quality";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  getProductPngPathsInOrder,
  type ProductImageEntry,
  type ProductImageFit,
} from "@/lib/products";
import { cn } from "@/lib/cn";

const THUMB_STRIP_SCROLLBAR_HIDE =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]";

type GalleryContextValue = {
  pngImages: { src: string; fit: ProductImageFit }[];
  count: number;
  index: number;
  setIndex: (i: number) => void;
  go: (delta: number) => void;
  productName: string;
  stripRef: React.RefObject<HTMLDivElement | null>;
};

const ProductGalleryContext = createContext<GalleryContextValue | null>(null);

function useProductGalleryContext() {
  const ctx = useContext(ProductGalleryContext);
  if (!ctx) {
    throw new Error("Product gallery components must be used within ProductImageGalleryProvider");
  }
  return ctx;
}

type ProductImageGalleryProviderProps = {
  images: ProductImageEntry[];
  productName: string;
  children: ReactNode;
};

export function ProductImageGalleryProvider({
  images,
  productName,
  children,
}: ProductImageGalleryProviderProps) {
  const pngImages = useMemo(() => getProductPngPathsInOrder(images), [images]);
  const count = pngImages.length;
  const [index, setIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || count <= 1) return;
    const thumb = el.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, count]);

  const value = useMemo(
    () => ({
      pngImages,
      count,
      index,
      setIndex,
      go,
      productName,
      stripRef,
    }),
    [pngImages, count, index, go, productName],
  );

  return (
    <ProductGalleryContext.Provider value={value}>{children}</ProductGalleryContext.Provider>
  );
}

type ProductImageGalleryMainProps = {
  className?: string;
  /**
   * `square` — quadrado (mobile / listagens).
   * `fitHeight` — preenche a altura do pai (desktop, grelha com altura de viewport).
   */
  variant?: "square" | "fitHeight";
};

export function ProductImageGalleryMain({
  className,
  variant = "square",
}: ProductImageGalleryMainProps) {
  const { pngImages, count, index, productName } = useProductGalleryContext();
  const fitHeight = variant === "fitHeight";

  if (count === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-100 text-sm text-zinc-500",
          fitHeight ? "h-full min-h-[10rem] w-full" : "aspect-square",
          className,
        )}
      >
        Sem imagens
      </div>
    );
  }

  const current = pngImages[index];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-200 bg-[linear-gradient(to_bottom,#e4e4e7_0%,#d4d4d8_100%)]",
        fitHeight
          ? "h-full min-h-0 w-full max-h-full"
          : current.fit === "wide"
            ? "aspect-video w-full"
            : "aspect-square w-full",
        className,
      )}
      role="region"
      aria-roledescription="galeria de fotos"
      aria-label={`Fotos de ${productName}`}
    >
      <Image
        src={current.src}
        alt={`${productName} — imagem ${index + 1} de ${count}`}
        fill
        quality={IMAGE_QUALITY.max}
        className={current.fit === "wide" ? "object-cover object-center scale-110" : "object-contain"}
        sizes={
          fitHeight
            ? "(min-width: 1536px) min(720px, 45vw), (min-width: 1024px) min(42rem, 48vw), 100vw"
            : "(min-width: 1536px) 720px, (min-width: 1024px) min(720px, 55vw), 100vw"
        }
        priority={index === 0}
      />
    </div>
  );
}

export function ProductImageGalleryThumbs({ className }: { className?: string }) {
  const { pngImages, count, index, setIndex, go, stripRef } = useProductGalleryContext();

  if (count <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label="Imagem anterior"
        onClick={() => go(-1)}
        className="h-9 w-9 shrink-0 rounded-full p-0"
      >
        <span aria-hidden className="text-lg leading-none">
          ‹
        </span>
      </Button>

      <div
        ref={stripRef}
        className={cn(
          "flex min-w-0 flex-1 gap-2 overflow-x-auto overflow-y-hidden py-1",
          THUMB_STRIP_SCROLLBAR_HIDE,
        )}
        role="tablist"
        aria-label="Miniaturas"
      >
        {pngImages.map(({ src }, i) => (
          <button
            key={`${i}-${src}`}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ver imagem ${i + 1} de ${count}`}
            onClick={() => setIndex(i)}
            className={cn(
              "relative box-border h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[linear-gradient(to_bottom,#e4e4e7_0%,#d4d4d8_100%)] transition sm:h-[72px] sm:w-[72px]",
              "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b49ecc] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              i === index
                ? "border-[#CB634E]"
                : "border-zinc-200 hover:border-zinc-400",
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              quality={IMAGE_QUALITY.productThumb}
              className="object-contain p-0.5"
              sizes="72px"
            />
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label="Imagem seguinte"
        onClick={() => go(1)}
        className="h-9 w-9 shrink-0 rounded-full p-0"
      >
        <span aria-hidden className="text-lg leading-none">
          ›
        </span>
      </Button>
    </div>
  );
}

type ProductImageCarouselProps = {
  images: ProductImageEntry[];
  productName: string;
  className?: string;
};

/** Galeria completa (foto principal + miniaturas) — útil em layouts simples. */
export function ProductImageCarousel({
  images,
  productName,
  className,
}: ProductImageCarouselProps) {
  return (
    <ProductImageGalleryProvider images={images} productName={productName}>
      <div className={cn("flex flex-col gap-3", className)}>
        <ProductImageGalleryMain />
        <ProductImageGalleryThumbs />
      </div>
    </ProductImageGalleryProvider>
  );
}
