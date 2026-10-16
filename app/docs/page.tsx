import type { Metadata } from "next";
import DocsChrome from "../../components/DocsChrome";
import { DOCS } from "../../data/docs";
import { getRepos } from "../../lib/github";

export const metadata: Metadata = {
  title: "Docs — pdev-labs",
  description: "Install guides and usage notes for pdev-labs open-source projects.",
  alternates: { canonical: "https://docs.pdevlabs.me" },
};

export default async function DocsIndex() {
  const repos = await getRepos();
  const known = new Set(DOCS.map(d => d.slug));
  const auto = repos.filter(r => !known.has(r.slug));
  return (
    <main id="main">
      <DocsChrome doc={null} auto={auto.map(r => ({ slug: r.slug, title: r.name }))}>
        <div className="prose">
          <h1>Docs</h1>
          <p className="muted">Install guides and usage notes. Full source lives in each repo.</p>
          <div className="doc-list">
            {DOCS.map(d => (
              <a className="doc-row" key={d.slug} href={`/docs/${d.slug}`}>
                <strong>{d.title}</strong>
                <span className="muted">{d.summary}</span>
              </a>
            ))}
          </div>
          {auto.length > 0 && (
            <>
              <h2 id="all-repositories">All repositories</h2>
              <p className="muted">Every public repo, generated automatically. New repos show up here on their own.</p>
              <div className="doc-list">
                {auto.map(r => (
                  <a className="doc-row" key={r.slug} href={`/docs/${r.slug}`}>
                    <strong>{r.name}</strong>
                    <span className="muted">{r.description || "No description yet."}</span>
                    <span className="doc-meta">{r.language} · ★ {r.stars}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </DocsChrome>
    </main>
  );
}
