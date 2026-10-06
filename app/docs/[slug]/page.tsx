import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS } from "../../../data/docs";

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
    <main id="main" className="wrap prose">
      <p><a href="/docs">← All docs</a></p>
      <h1>{doc.title}</h1>
      <p className="muted">{doc.summary} <a href={doc.repo} target="_blank" rel="noreferrer">Repo ↗</a></p>
      {doc.sections.map(s => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body.map((p, i) => <p key={i}>{p}</p>)}
          {s.code && <pre className="doc-code"><code>{s.code}</code></pre>}
        </section>
      ))}
    </main>
  );
}
