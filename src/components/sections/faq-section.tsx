import { Container } from "@/components/layout/container";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ: FaqItem[] = [
  {
    question: "Isso já vem pronto para SEO?",
    answer:
      "Sim: estrutura semântica e metadata base. Depois você pode evoluir com conteúdo e páginas específicas.",
  },
  {
    question: "Consigo mudar textos e seções facilmente?",
    answer:
      "Sim. Cada seção é um componente isolado, o que facilita manutenção e testes A/B básicos.",
  },
  {
    question: "Tem formulário funcional?",
    answer:
      "O formulário está preparado no layout. Você pode ligar em um endpoint interno, CRM ou serviço de e-mail depois.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h2>
          <p className="mt-3 text-lg text-zinc-600">
            Respostas rápidas para reduzir objeções antes do clique final.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <summary className="cursor-pointer list-none font-semibold">
                <span>{item.question}</span>
                <span className="ml-2 text-zinc-400 group-open:hidden" aria-hidden="true">
                  +
                </span>
                <span className="ml-2 hidden text-zinc-400 group-open:inline" aria-hidden="true">
                  –
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

