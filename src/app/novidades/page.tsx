import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Novidades",
  description: `Novidades e lançamentos ${SITE.name}.`,
};

export default function NovidadesPage() {
  return (
    <CategoryPage
      title="Novidades"
      description={`Fique a par das novidades ${SITE.name}. Conteúdo em breve.`}
    />
  );
}
