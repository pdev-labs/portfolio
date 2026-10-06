import type { Metadata } from "next";
import { DOCS } from "../../data/docs";

export const metadata: Metadata = {
  title: "Docs — pdev-labs",
  description: "Install guides and usage notes for pdev-labs open-source projects.",
};

export default function DocsIndex() {
  return (
    <main id="main" className="wrap prose">
      <p><a href="/">← Back to portfolio</a></p>
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
    </main>
  );
}
