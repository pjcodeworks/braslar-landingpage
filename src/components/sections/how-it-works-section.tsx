import { Container } from "@/components/layout/container";

type Step = {
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    title: "Defina a promessa",
    description: "O que você entrega e para quem, com uma frase simples e específica.",
  },
  {
    title: "Mostre prova",
    description: "Depoimentos, números e exemplos para aumentar a confiança.",
  },
  {
    title: "Remova fricção",
    description: "FAQ, garantias e um caminho curto para contato ou compra.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Como funciona</h2>
            <p className="mt-3 text-lg text-zinc-600">
              Um roteiro simples para transformar visitantes em leads — com conteúdo e hierarquia
              visual.
            </p>
          </div>
          <ol className="lg:col-span-7 grid gap-4">
            {STEPS.map((step, idx) => (
              <li
                key={step.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

