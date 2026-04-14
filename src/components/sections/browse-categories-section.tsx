import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

type CategoryCard = {
  label: string;
  href: string;
  /** Textura / foto de fundo (opcional) */
  imageSrc?: string;
  /** Imagem por cima do fundo, ex. produto em PNG (opcional) */
  overlaySrc?: string;
};

const CATEGORIES: CategoryCard[] = [
  {
    label: "Fogões",
    href: "/fogoes",
    imageSrc: "/hero/cards/card-background.jpg",
    overlaySrc: "/hero/cards/Horus 5Q 1.png",
  },
  {
    label: "Cooktops",
    href: "/cooktops",
    imageSrc: "/hero/cards/card-background.jpg",
    overlaySrc: "/hero/cards/cooktop 5BC 2.png",
  },
  {
    label: "Fogões a lenha",
    href: "/fogao-a-lenha",
    imageSrc: "/hero/cards/card-background.jpg",
    overlaySrc: "/hero/cards/Lenha 2.png",
  },
  {
    label: "Refrigeradores",
    href: "/refrigeradores",
    imageSrc: "/hero/cards/card-background.jpg",
    overlaySrc: "/hero/cards/Freezer 510L 1.png",
  },
];

export function BrowseCategoriesSection() {
  return (
    <section
      id="categorias"
      aria-labelledby="browse-categories-heading"
      className={cn(
        "scroll-mt-16 border-t border-zinc-200 py-6 sm:py-8 lg:py-6",
        "lg:flex lg:h-[calc(100svh-4rem)] lg:min-h-0 lg:shrink-0 lg:flex-col lg:overflow-hidden",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16",
          "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col",
        )}
      >
        <h2
          id="browse-categories-heading"
          className="shrink-0 text-center text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Busque por categorias
        </h2>
        <p className="mx-auto mt-2 max-w-2xl shrink-0 text-center text-base text-zinc-600 sm:mt-3">
          {`Escolha uma categoria e explore os produtos da ${SITE.name}.`}
        </p>

        <div
          className={cn(
            "mt-4 grid w-full grid-cols-1 justify-items-stretch gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 md:gap-5",
            "lg:mt-4 lg:min-h-0 lg:flex-1 lg:auto-rows-[minmax(0,1fr)] lg:grid-cols-4 lg:gap-6 xl:gap-8",
          )}
        >
          {CATEGORIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border shadow-sm",
                "transition-[border-color,box-shadow] hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                item.overlaySrc
                  ? "border-white/15 bg-black hover:border-white/30"
                  : "border-zinc-200 bg-white hover:border-zinc-400",
              )}
            >
              {item.imageSrc ? (
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-black",
                    "max-lg:aspect-[3/5]",
                    "lg:h-full lg:min-h-0 lg:flex-1",
                  )}
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center opacity-30"
                  />
                  {item.overlaySrc ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden p-4 sm:p-6">
                      <div
                        className={cn(
                          "relative h-[72%] w-[82%] max-h-full max-w-full",
                          "origin-center will-change-transform",
                          "transition-transform duration-700 ease-out motion-reduce:transition-none",
                          "motion-safe:group-hover:scale-[1.06]",
                        )}
                      >
                        <Image
                          src={item.overlaySrc}
                          alt={`${item.label} — destaque`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain object-center"
                        />
                      </div>
                    </div>
                  ) : null}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-black/90 via-black/55 to-transparent sm:h-32"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3.5 pt-10 sm:pb-4 sm:pt-12">
                    <h3 className="text-center text-sm font-semibold text-white drop-shadow-md sm:text-base">
                      {item.label}
                    </h3>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-zinc-100",
                    "max-lg:aspect-[3/5]",
                    "lg:h-full lg:min-h-0 lg:flex-1",
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-zinc-300/40 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3.5 pt-8 sm:pb-4">
                    <h3 className="text-center text-sm font-semibold text-zinc-900 sm:text-base">
                      {item.label}
                    </h3>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
