import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Imprensa",
  description: `Imprensa e comunicação ${SITE.name}.`,
};

export default function ImprensaPage() {
  return (
    <CategoryPage
      title="Imprensa"
      description={`Materiais e informações para a imprensa ${SITE.name}. Conteúdo em breve.`}
    />
  );
}
