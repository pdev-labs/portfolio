import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocsChrome from "../../../components/DocsChrome";
import { DOCS, slugify } from "../../../data/docs";

export function generateStaticParams() {
  return DOCS.map(d => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = DOCS.find(d => d.slug === params.slug);
  return {
    title: doc ? `${doc.title} — pdev-labs docs` : "Not found — pdev-labs docs",
    description: doc?.summary,
  };
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = DOCS.find(d => d.slug === params.slug);
  if (!doc) notFound();
  return (
    <main id="main">
      <DocsChrome doc={doc}>
        <div className="prose">
          <h1>{doc.title}</h1>
          <p className="muted">{doc.summary} <a href={doc.repo} target="_blank" rel="noreferrer">Repo ↗</a></p>
          {doc.sections.map(s => (
            <section key={s.heading}>
              <h2 id={slugify(s.heading)}>{s.heading}</h2>
              {s.body.map((p, i) => <p key={i}>{p}</p>)}
              {s.note && <p className="doc-note"><strong>Note:</strong> {s.note}</p>}
              {s.code && <pre className="doc-code"><code>{s.code}</code></pre>}
            </section>
          ))}
        </div>
      </DocsChrome>
    </main>
  );
}
