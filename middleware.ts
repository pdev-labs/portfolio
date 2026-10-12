import { NextResponse, type NextRequest } from "next/server";
import { GO_LINKS } from "./data/go";

const HOME = "https://www.pdevlabs.me/";

function hostOf(req: NextRequest): string {
  return (req.headers.get("host") ?? "").toLowerCase();
}

/** Live repo lookup so new repos work without a map edit. Null on any failure. */
async function findRepo(slug: string): Promise<string | null> {
  if (!slug || slug.includes(".") || slug.includes("/")) return null;
  try {
    const headers: Record<string, string> = { "User-Agent": "pdevlabs-portfolio" };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`https://api.github.com/users/pdev-labs/repos?per_page=100`, {
      headers,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) return null;
    const data = await r.json();
    const hit = (Array.isArray(data) ? data : []).find(
      (x: any) => !x.private && !x.fork && String(x.name ?? "").toLowerCase() === slug
    );
    return hit ? String(hit.html_url) : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname === "/favicon.svg") return NextResponse.next();

  const host = hostOf(req);
  if (host === "go.pdevlabs.me") {
    const slug = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    const target = GO_LINKS[slug];
    if (target) return NextResponse.redirect(target, 308);
    const repo = await findRepo(slug);
    if (repo) return NextResponse.redirect(repo, 308);
    return NextResponse.redirect(HOME, 308);
  }
  if (host === "docs.pdevlabs.me") {
    const url = req.nextUrl.clone();
    // Idempotent: sidebar links already carry the /docs prefix.
    url.pathname = pathname === "/" ? "/docs" : pathname.startsWith("/docs") ? pathname : `/docs${pathname}`;
    url.search = search;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
