import { getRepos } from "../../../lib/github";

export const revalidate = 3600;

/** Aggregated public-repo stats. Cached hourly, token-aware server-side. */
export async function GET() {
  const repos = await getRepos();
  const stars = repos.reduce((s, r) => s + r.stars, 0);
  const langs = new Set(repos.map(r => r.language)).size;
  return Response.json({ repos: repos.length, stars, langs, at: Date.now() });
}
