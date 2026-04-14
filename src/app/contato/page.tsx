import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${SITE.name}: WhatsApp, telefone, e-mail do SAC e horário de atendimento.`,
  alternates: {
    canonical: `${SITE.url}/contato`,
  },
};

const { contact } = SITE;

export default function ContatoPage() {
  return (
    <CategoryPage
      title="Contato"
      description="Atendimento comercial e suporte: escolha o canal que for mais prático para você."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
          <h2 className="text-lg font-semibold tracking-tight">Telefone e WhatsApp</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Ligue ou envie mensagem para tirar dúvidas sobre produtos e suporte.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={contact.phoneTel}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-colors sm:w-auto",
                "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              Ligar: {contact.phoneDisplay}
            </a>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-colors sm:w-auto",
                "bg-foreground text-background hover:bg-foreground/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
          <h2 className="text-lg font-semibold tracking-tight">E-mail</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Para solicitações, documentos ou acompanhamento por escrito, use o SAC.
          </p>
          <p className="mt-5">
            <a
              href={`mailto:${contact.supportEmail}`}
              className="text-base font-medium text-foreground underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-300"
            >
              {contact.supportEmail}
            </a>
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 sm:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">Horário de atendimento</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Nosso time responde nos canais acima no seguinte período:
          </p>
          <p className="mt-4 text-base font-medium text-foreground">
            {contact.hoursSummary}
          </p>
        </div>
      </div>
    </CategoryPage>
  );
}
