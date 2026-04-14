import type { Metadata } from "next";
import { CategoryPage } from "@/components/layout/category-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nossa história",
  description: `A história da ${SITE.name}.`,
  alternates: {
    canonical: `${SITE.url}/nossa-historia`,
  },
};

export default function NossaHistoriaPage() {
  return (
    <CategoryPage
      title="Nossa história"
      description={`Conheça a trajetória da ${SITE.name}. Conteúdo em breve.`}
    />
  );
}
