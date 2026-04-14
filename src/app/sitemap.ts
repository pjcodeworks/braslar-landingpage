import type { MetadataRoute } from "next";
import {
  getAllCategoryRouteParams,
  getAllLineRouteParams,
  getAllProductRouteParams,
} from "@/lib/products";
import { SITE } from "@/lib/site";

/** Data de build; páginas estáticas podem partilhar o mesmo valor. */
const lastMod = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  const routes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/imprensa`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/nossa-historia`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  for (const { categoria } of getAllCategoryRouteParams()) {
    routes.push({
      url: `${base}/${categoria}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const { categoria, linha } of getAllLineRouteParams()) {
    routes.push({
      url: `${base}/${categoria}/${linha}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const { categoria, linha, produto } of getAllProductRouteParams()) {
    routes.push({
      url: `${base}/${categoria}/${linha}/${produto}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return routes;
}
