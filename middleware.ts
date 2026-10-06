import { NextResponse, type NextRequest } from "next/server";
import { GO_LINKS } from "./data/go";

const HOME = "https://www.pdevlabs.me/";

function hostOf(req: NextRequest): string {
  return (req.headers.get("host") ?? "").toLowerCase();
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname === "/favicon.svg") return NextResponse.next();

  const host = hostOf(req);
  if (host === "go.pdevlabs.me") {
    const slug = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    const target = GO_LINKS[slug];
    if (target) return NextResponse.redirect(target, 308);
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
