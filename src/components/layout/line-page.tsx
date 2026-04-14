import Link from "next/link";
import type { LineInfo } from "@/lib/products";
import { getCategoryPageTitle } from "@/lib/products";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/cn";

export function LinePageLayout({ line }: { line: LineInfo }) {
  const categoryHref = `/${line.categorySlug}`;
  const categoryTitle = getCategoryPageTitle(line.categorySlug);

  return (
    <div className="min-h-full bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Trilha de navegação" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
            <li>
              <Link href="/" className="hover:text-foreground">
                Início
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li>
              <Link href={categoryHref} className="hover:text-foreground">
                {categoryTitle}
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li className="font-medium text-[#FF9A42]">
              Linha {line.lineLabel}
            </li>
          </ol>
        </nav>

        <header className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]">
            {categoryTitle}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#FF9A42] sm:text-4xl">
            Linha {line.lineLabel}
          </h1>
          <p className="mt-3 text-base text-zinc-600">
            {line.products.length === 1
              ? "Um modelo disponível nesta linha."
              : `${line.products.length} modelos disponíveis nesta linha.`}
          </p>
        </header>

        <section
          aria-labelledby="ficha-linha"
          className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
        >
          <h2 id="ficha-linha" className="sr-only">
            Informações da linha
          </h2>
          <dl className="grid gap-6 sm:grid-cols-2 sm:gap-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Categoria
              </dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {categoryTitle}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Linha
              </dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {line.lineLabel}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="produtos-linha" className="mt-12">
          <h2
            id="produtos-linha"
            className="text-lg font-semibold tracking-tight"
          >
            Produtos desta linha
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {line.products.map((product) => (
              <li key={product.productSlug}>
                <Link
                  href={`/${product.categorySlug}/${product.lineSlug}/${product.productSlug}`}
                  className={cn(
                    "flex flex-col rounded-xl border border-zinc-200 bg-white p-4 transition",
                    "hover:border-[#b49ecc]/60 hover:bg-zinc-50",
                  )}
                >
                  <span className="text-base font-semibold text-foreground">
                    {product.productName}
                  </span>
                  <span className="mt-1 text-sm text-zinc-500">
                    Ver página do produto →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={categoryHref}
            className={cn(
              "inline-flex text-sm font-medium text-foreground underline underline-offset-4",
              "hover:text-zinc-600",
            )}
          >
            ← Voltar para {categoryTitle}
          </Link>
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-zinc-500 underline underline-offset-4 hover:text-foreground"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
