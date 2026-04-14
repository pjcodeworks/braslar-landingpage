import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { IMAGE_QUALITY } from "@/lib/next-image-quality";
import {
  HERO_CAROUSEL_DEFAULT_DESKTOP,
  HERO_LINE_OVERLAY_DESKTOP_BY_HREF,
} from "@/lib/hero-carousel-slides";
import { SITE } from "@/lib/site";

export function BrowseCategoriesSection() {
  const lines = SITE.categoryNav.map((item) => ({
    label: item.label,
    href: item.href,
    overlaySrc:
      HERO_LINE_OVERLAY_DESKTOP_BY_HREF[item.href] ??
      HERO_CAROUSEL_DEFAULT_DESKTOP,
  }));

  return (
    <section
      id="linhas"
      aria-labelledby="explore-linhas-heading"
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
          id="explore-linhas-heading"
          className="shrink-0 text-center text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Explore nossas linhas
        </h2>
        <p className="mx-auto mt-2 max-w-2xl shrink-0 text-center text-base text-zinc-600 sm:mt-3">
          {`Escolha uma linha e conheça os produtos ${SITE.name}.`}
        </p>

        <div
          className={cn(
            "mt-4 grid w-full grid-cols-1 justify-items-stretch gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 md:gap-5",
            "lg:mt-4 lg:min-h-0 lg:flex-1 lg:auto-rows-[minmax(0,1fr)] lg:grid-cols-4 lg:gap-6 xl:gap-8",
          )}
        >
          {lines.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm",
                "transition-[border-color,box-shadow] hover:border-zinc-400 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <div
                className={cn(
                  "relative flex w-full min-h-0 flex-1 flex-col overflow-hidden bg-white",
                  "max-lg:aspect-[3/5]",
                  "lg:h-full",
                )}
              >
                <div className="relative min-h-0 w-full flex-1 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
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
                        quality={IMAGE_QUALITY.listing}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
                <div className="shrink-0 border-t border-zinc-100 bg-white px-3 py-3 sm:py-3.5">
                  <h3 className="text-center text-sm font-semibold text-zinc-900 sm:text-base">
                    {item.label}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
