import { getRepos } from "./github";
import { EXPERIENCE } from "../data/site";

export type MonthPoint = { text: string; name?: string; url?: string };
export type MonthEntry = { period: string; role: string; org: string; points: MonthPoint[] };
export type Overview = { period: string; role: string; org: string; points: string[] };

/** Curated narrative covers up to Sep 2026. Newer months generate from GitHub. */
const CUTOFF = "2026-09";

function monthLabel(key: string): string {
  const d = new Date(`${key}-01T00:00:00Z`);
  const s = d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  return isNaN(d.getTime()) ? key : s;
}

function truncate(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

export async function getExperience(): Promise<{ overview: Overview; months: MonthEntry[] }> {
  const repos = await getRepos();
  const total = repos.length;
  const stars = repos.reduce((s, r) => s + r.stars, 0);
  const byStars = [...repos].sort((a, b) => b.stars - a.stars);
  const byPushed = [...repos].sort((a, b) => +new Date(b.updated || 0) - +new Date(a.updated || 0));
  const top = byStars[0];
  const recent = byPushed[0];

  const overview: Overview = {
    period: "Jul 2026 — Present",
    role: "Independent open-source developer",
    org: "pdev-labs · GitHub since Jul 2026",
    points: [
      total > 0
        ? `${total} public repositories with ★${stars} total stars, each with a README and reproducible setup.`
        : "Open-source repositories with READMEs and reproducible setups.",
      ...(top
        ? [`Flagship ${top.name} (★${top.stars}): ${truncate(top.description || top.language, 90)}`]
        : []),
      ...(recent
        ? [`Latest activity: ${recent.name}${recent.updated ? ` pushed ${recent.updated.slice(0, 10)}` : ""}.`]
        : []),
    ],
  };

  const byMonth = new Map<string, typeof repos>();
  for (const r of repos) {
    const key = (r.created || "").slice(0, 7);
    if (!key || key <= CUTOFF) continue;
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key)!.push(r);
  }
  const auto: MonthEntry[] = Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, rs]) => {
      const ordered = [...rs].sort((a, b) => b.stars - a.stars);
      const shown = ordered.slice(0, 4);
      const rest = ordered.slice(4);
      return {
        period: monthLabel(key),
        role: "New repositories",
        org: `${rs.length} shipped`,
        points: [
          ...shown.map(r => ({
            name: r.name,
            url: r.url,
            text: `${r.language} ★${r.stars}${r.description ? ` — ${truncate(r.description, 80)}` : ""}`,
          })),
          ...(rest.length > 0 ? [{ text: `+${rest.length} more: ${rest.map(r => r.name).join(", ")}` }] : []),
        ],
      };
    });

  const curated: MonthEntry[] = EXPERIENCE.slice(1)
    .reverse()
    .map(e => ({
      period: e.period,
      role: e.role,
      org: e.org,
      points: e.points.map(p => ({ text: p })),
    }));

  return { overview, months: [...auto, ...curated] };
}
