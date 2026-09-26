import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="wrap" style={{ padding: "80px 22px", textAlign: "center" }}>
      <p className="sec-label">404 — off the map</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px,7vw,72px)", margin: "8px 0", letterSpacing: "-.03em" }}>
        Nothing ships here.
      </h1>
      <p className="muted" style={{ maxWidth: "34em", margin: "0 auto 24px" }}>
        This route doesn&apos;t exist. The good stuff lives on the homepage — or in one of 21 GitHub repos.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href="/">Back home</Link>
        <a className="btn btn-ghost" href="https://github.com/pdev-labs?tab=repositories" target="_blank" rel="noreferrer">Browse repos ↗</a>
      </div>
    </main>
  );
}
