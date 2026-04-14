import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function CategoryPage({
  title,
  description,
  breadcrumbItems,
  children,
}: {
  title: string;
  description?: string;
  /** Trilha antes do título; o último item normalmente sem `href` (página atual). */
  breadcrumbItems?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="min-h-full bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        {breadcrumbItems && breadcrumbItems.length > 0 ? (
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
              {breadcrumbItems.map((item, index) => (
                <Fragment key={`${item.label}-${index}`}>
                  {index > 0 ? (
                    <li aria-hidden className="text-zinc-600">
                      /
                    </li>
                  ) : null}
                  <li>
                    {item.href ? (
                      <Link href={item.href} className="hover:text-foreground">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{item.label}</span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        ) : null}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-base text-zinc-600">{description}</p>
          ) : null}
        </header>

        {children ? <section className="mt-10">{children}</section> : null}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-foreground underline underline-offset-4 hover:text-zinc-600"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

