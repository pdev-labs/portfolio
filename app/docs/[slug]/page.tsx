import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DocsChrome from "../../../components/DocsChrome";
import CodeBlock from "../../../components/CodeBlock";
import AutoCodeBlock from "../../../components/AutoCodeBlock";
import { DOCS, slugify } from "../../../data/docs";
import { getRepos, getReadme, getTree } from "../../../lib/github";

export const dynamicParams = true;

export async function generateStaticParams() {
  const curated = DOCS.map(d => ({ slug: d.slug }));
  try {
    const repos = await getRepos();
    const known = new Set(curated.map(c => c.slug));
    return [...curated, ...repos.filter(r => !known.has(r.slug)).map(r => ({ slug: r.slug }))];
  } catch {
    return curated;
  }
}

function isExternal(href?: string): boolean {
  return !!href && /^(https?:)?\/\//.test(href);
}

function mdComponents(repoUrl: string, branch: string) {
  return {
    pre: ({ children }: any) => <AutoCodeBlock>{children}</AutoCodeBlock>,
    a: ({ href, children }: any) =>
      isExternal(href)
        ? <a href={href} target="_blank" rel="noreferrer">{children}</a>
        : <a href={href}>{children}</a>,
    img: ({ src, alt }: any) => {
      const abs = src && !isExternal(src) && !src.startsWith("/")
        ? `${repoUrl}/blob/${branch}/${src}`
        : src;
      return <img src={abs} alt={alt ?? ""} loading="lazy" />;
    },
  };
}

function dropFirstH1(md: string): string {
  return md.replace(/^#[^\n]*\n/, "").trimStart();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const doc = DOCS.find(d => d.slug === slug);
  if (doc) return { title: `${doc.title} — pdev-labs docs`, description: doc.summary };
  const repos = await getRepos();
  const repo = repos.find(r => r.slug === slug);
  if (!repo) return { title: "Not found — pdev-labs docs" };
  return {
    title: `${repo.name} — pdev-labs docs`,
    description: repo.description || `Docs and files for ${repo.name}.`,
  };
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  const doc = DOCS.find(d => d.slug === slug);
  const repos = await getRepos();
  const known = new Set(DOCS.map(d => d.slug));
  const auto = repos.filter(r => !known.has(r.slug)).map(r => ({ slug: r.slug, title: r.name }));

  if (doc) {
    return (
      <main id="main">
        <DocsChrome doc={doc} auto={auto}>
          <div className="prose">
            <h1>{doc.title}</h1>
            <p className="muted">{doc.summary} <a href={doc.repo} target="_blank" rel="noreferrer">Repo ↗</a></p>
            {doc.sections.map(s => (
              <section key={s.heading}>
                <h2 id={slugify(s.heading)}>{s.heading}</h2>
                {s.body.map((p, i) => <p key={i}>{p}</p>)}
                {s.note && <p className="doc-note"><strong>Note:</strong> {s.note}</p>}
                {s.code && <CodeBlock code={s.code} />}
              </section>
            ))}
          </div>
        </DocsChrome>
      </main>
    );
  }

  const repo = repos.find(r => r.slug === slug);
  if (!repo) notFound();
  const [md, tree] = await Promise.all([getReadme(repo.name, repo.branch), getTree(repo.name, repo.branch)]);

  return (
    <main id="main">
      <DocsChrome doc={null} auto={auto} crumb={repo.name}>
        <div className="prose">
          <h1>{repo.name}</h1>
          <p className="muted">
            {repo.description || "A pdev-labs open-source repository."}{" "}
            <a href={repo.url} target="_blank" rel="noreferrer">Repo ↗</a>
          </p>
          <p className="doc-meta">{repo.language} · ★ {repo.stars}{repo.updated && <> · updated {repo.updated.slice(0, 10)}</>}</p>
          {md ? (
            <Markdown remarkPlugins={[remarkGfm]} components={mdComponents(repo.url, repo.branch)}>
              {dropFirstH1(md)}
            </Markdown>
          ) : (
            <p className="muted">No README published yet. The repo itself is the current source of truth.</p>
          )}
          <section>
            <h2 id="files">Files</h2>
            {tree.files.length === 0 ? (
              <p className="muted">File listing unavailable right now.</p>
            ) : (
              <>
                <ul className="doc-files">
                  {tree.files.map(f => (
                    <li key={f.path}><a href={f.url} target="_blank" rel="noreferrer">{f.path}</a></li>
                  ))}
                </ul>
                {tree.truncated && <p className="muted">Showing the first {tree.files.length} paths.</p>}
              </>
            )}
          </section>
        </div>
      </DocsChrome>
    </main>
  );
}
