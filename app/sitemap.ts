import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://www.pdevlabs.me", lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: "https://www.pdevlabs.me/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
