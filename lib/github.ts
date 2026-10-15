const API = "https://api.github.com";
const OWNER = "pdev-labs";
const REVALIDATE = 3600;
/** Deliberately undocumented: removed language and profile card. */
const HIDDEN = new Set(["pdev", "pdev-labs"]);

export type GhRepo = {
  name: string;
  slug: string;
  description: string;
  language: string;
  stars: number;
  url: string;
  branch: string;
  created: string;
  updated: string;
};

function authHeaders(): Record<string, string> {
  const t = process.env.GITHUB_TOKEN;
  return t ? { Authorization: `Bearer ${t}`, "User-Agent": "pdevlabs-portfolio" } : { "User-Agent": "pdevlabs-portfolio" };
}

/** All public, non-fork repos. Cached for an hour. Empty array on any failure. */
export async function getRepos(): Promise<GhRepo[]> {
  try {
    const r = await fetch(`${API}/users/${OWNER}/repos?per_page=100`, {
      next: { revalidate: REVALIDATE },
      headers: authHeaders(),
    });
    if (!r.ok) return [];
    const data = await r.json();
    return (Array.isArray(data) ? data : [])
      .filter((x: any) => !x.private && !x.fork && !HIDDEN.has(String(x.name ?? "").toLowerCase()))
      .map((x: any) => ({
        name: String(x.name ?? ""),
        slug: String(x.name ?? "").toLowerCase(),
        description: String(x.description ?? ""),
        language: String(x.language ?? "Other"),
        stars: Number(x.stargazers_count ?? 0),
        url: String(x.html_url ?? `https://github.com/${OWNER}/${x.name}`),
        branch: String(x.default_branch ?? "main"),
        created: String(x.created_at ?? ""),
        updated: String(x.pushed_at ?? x.updated_at ?? ""),
      }))
      .filter((x: GhRepo) => x.name.length > 0)
      .sort((a: GhRepo, b: GhRepo) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

/** Raw README markdown, trying the default branch then main/master. Null when absent. */
export async function getReadme(repo: string, branch: string): Promise<string | null> {
  const branches = [branch, "main", "master"].filter((b, i, a) => b && a.indexOf(b) === i);
  for (const b of branches) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${OWNER}/${repo}/${b}/README.md`, {
        next: { revalidate: REVALIDATE },
        headers: { "User-Agent": "pdevlabs-portfolio" },
      });
      if (r.ok) {
        const text = (await r.text()).trim();
        if (text) return text;
      }
    } catch {
      /* try next branch */
    }
  }
  return null;
}

export type GhFile = { path: string; url: string };

/** Top-level file listing, capped. Empty on failure or huge trees. */
export async function getTree(repo: string, branch: string): Promise<{ files: GhFile[]; truncated: boolean }> {
  try {
    const r = await fetch(`${API}/repos/${OWNER}/${repo}/git/trees/${branch}?recursive=1`, {
      next: { revalidate: REVALIDATE },
      headers: authHeaders(),
    });
    if (!r.ok) return { files: [], truncated: false };
    const data = await r.json();
    const tree: any[] = Array.isArray(data.tree) ? data.tree : [];
    const blobs = tree.filter(t => t.type === "blob" && typeof t.path === "string");
    const capped = blobs.slice(0, 120);
    return {
      files: capped.map(t => ({
        path: String(t.path),
        url: `https://github.com/${OWNER}/${repo}/blob/${branch}/${t.path}`,
      })),
      truncated: blobs.length > capped.length || data.truncated === true,
    };
  } catch {
    return { files: [], truncated: false };
  }
}
