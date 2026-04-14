import { Container } from "@/components/layout/container";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ana Souza",
    role: "Marketing",
    quote:
      "A página ficou objetiva e elegante. As pessoas entendem a oferta rápido e clicam muito mais no CTA.",
  },
  {
    name: "Bruno Lima",
    role: "Founder",
    quote:
      "Performance excelente e estrutura bem organizada. Ficou fácil ajustar texto e testar variações.",
  },
  {
    name: "Carla Mendes",
    role: "Vendas",
    quote:
      "A prova social e o FAQ reduziram objeções. A qualidade dos leads melhorou bastante.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Depoimentos</h2>
          <p className="mt-3 text-lg text-zinc-600">
            Prova social para aumentar confiança e acelerar decisões.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <blockquote className="text-sm leading-6 text-zinc-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-zinc-600">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

