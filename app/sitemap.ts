import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://pdev-labs.github.io", lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: "https://pdev-labs.github.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
