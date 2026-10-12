import type { MetadataRoute } from "next";
import { DOCS } from "../data/docs";
import { getRepos } from "../lib/github";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base = "https://www.pdevlabs.me";
  const urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];
  const seen = new Set(["docs"]);
  for (const d of DOCS) {
    seen.add(`docs/${d.slug}`);
    urls.push({
      url: `${base}/docs/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  try {
    const repos = await getRepos();
    for (const r of repos) {
      const path = `docs/${r.slug}`;
      if (seen.has(path)) continue;
      seen.add(path);
      urls.push({
        url: `${base}/${path}`,
        lastModified: r.updated ? new Date(r.updated) : now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  } catch {
    /* curated URLs already listed */
  }
  urls.push({ url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });
  return urls;
}
