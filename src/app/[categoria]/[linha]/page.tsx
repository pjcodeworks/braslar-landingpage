import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinePageLayout } from "@/components/layout/line-page";
import {
  getAllLineRouteParams,
  getCategoryPageTitle,
  getLineBySlugs,
} from "@/lib/products";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{
    categoria: string;
    linha: string;
  }>;
};

export function generateStaticParams() {
  return getAllLineRouteParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria, linha } = await params;
  const line = getLineBySlugs(categoria, linha);
  if (!line) {
    return { title: "Linha" };
  }
  const categoryTitle = getCategoryPageTitle(line.categorySlug);
  return {
    title: `Linha ${line.lineLabel} | ${categoryTitle}`,
    description: `Linha ${line.lineLabel} — ${categoryTitle}. Modelos e produtos ${SITE.name}.`,
    alternates: {
      canonical: `/${categoria}/${linha}`,
    },
  };
}

export default async function LinePage({ params }: PageProps) {
  const { categoria, linha } = await params;
  const line = getLineBySlugs(categoria, linha);
  if (!line) {
    notFound();
  }

  return <LinePageLayout line={line} />;
}
