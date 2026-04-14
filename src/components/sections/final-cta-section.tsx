import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section id="cta" className="py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-zinc-800 bg-foreground p-8 text-background sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Pronto para transformar visitas em conversões?
              </h2>
              <p className="mt-3 text-base/7 text-background/80">
                Ajuste o texto para sua oferta e publique. Se quiser, podemos ligar o formulário em
                um endpoint e medir conversão.
              </p>
            </div>

            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <a href="#contato">
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-background text-foreground hover:bg-background/90 focus-visible:ring-background lg:w-auto"
                >
                  Quero conversar
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

