import { Container } from "@/components/layout/container";

type Benefit = {
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    title: "Mensagem clara",
    description: "Explique o valor em 5–10 segundos e reduza objeções logo no início.",
  },
  {
    title: "CTA guiado",
    description: "Fluxo com chamadas à ação nos pontos certos, sem distrações desnecessárias.",
  },
  {
    title: "SEO desde o começo",
    description: "Estrutura semântica + metadata para aparecer melhor nas buscas.",
  },
  {
    title: "Mobile-first",
    description: "Layout pensado para celular, com ótima legibilidade e acessibilidade.",
  },
  {
    title: "Performance",
    description: "Componentes simples e leves para entregar rápido e segurar o usuário.",
  },
  {
    title: "Reutilizável",
    description: "Seções separadas para você evoluir sem virar um arquivo gigante.",
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Benefícios</h2>
          <p className="mt-3 text-lg text-zinc-600">
            Uma estrutura pronta para vender com clareza, prova e um caminho natural até a ação.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

