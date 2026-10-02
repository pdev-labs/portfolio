import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://pdev-labs.vercel.app", lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: "https://pdev-labs.vercel.app/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
