import type { Metadata } from "next";
import DocsChrome from "../../components/DocsChrome";
import { DOCS } from "../../data/docs";

export const metadata: Metadata = {
  title: "Docs — pdev-labs",
  description: "Install guides and usage notes for pdev-labs open-source projects.",
};

export default function DocsIndex() {
  return (
    <main id="main">
      <DocsChrome doc={null}>
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
        </div>
      </DocsChrome>
    </main>
  );
}
