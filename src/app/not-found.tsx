import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b49ecc]">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Página não encontrada
        </h1>
        <p className="mt-3 text-base text-zinc-600">
          O endereço pode ter sido alterado ou não existe.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-medium text-foreground underline underline-offset-4 hover:text-zinc-600"
        >
          Voltar ao início
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
