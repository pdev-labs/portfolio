import type { MetadataRoute } from "next";
import { DOCS } from "../data/docs";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://www.pdevlabs.me", lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: "https://www.pdevlabs.me/docs", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...DOCS.map(d => ({
      url: `https://www.pdevlabs.me/docs/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: "https://www.pdevlabs.me/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
