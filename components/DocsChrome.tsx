import { DOCS, slugify, type Doc } from "../data/docs";
import ThemeToggle from "./ThemeToggle";

/** Wiki shell: guide sidebar with on-page contents, breadcrumb, prev/next. */
export default function DocsChrome({ doc, children }: { doc: Doc | null; children: React.ReactNode }) {
  const idx = doc ? DOCS.findIndex(d => d.slug === doc.slug) : -1;
  const prev = idx > 0 ? DOCS[idx - 1] : null;
  const next = idx >= 0 && idx < DOCS.length - 1 ? DOCS[idx + 1] : null;
  return (
    <div className="docs-theme">
    <div className="wrap doc-shell">
      <aside className="doc-side" aria-label="Guides">
        <p className="doc-side-h">Guides</p>
        <nav aria-label="All guides">
          <ul>
            {DOCS.map(d => (
              <li key={d.slug}>
                <a href={`/docs/${d.slug}`} className={d.slug === doc?.slug ? "on" : undefined}
                  aria-current={d.slug === doc?.slug ? "page" : undefined}>{d.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        {doc && (
          <nav className="doc-toc" aria-label="On this page">
            <p className="doc-side-h">On this page</p>
            <ul>
              {doc.sections.map(s => (
                <li key={s.heading}><a href={`#${slugify(s.heading)}`}>{s.heading}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
      <div className="doc-main">
        <div className="doc-topbar">
          <p className="doc-crumb"><a href="/">Portfolio</a> / <a href="/docs">Docs</a>{doc && <> / {doc.title}</>}</p>
          <ThemeToggle />
        </div>
        {children}
        {doc && (
          <nav className="doc-pager" aria-label="More guides">
            {prev
              ? <a href={`/docs/${prev.slug}`}><span className="doc-pager-k">Previous</span><strong>{prev.title}</strong></a>
              : <span />}
            {next
              ? <a href={`/docs/${next.slug}`} className="next"><span className="doc-pager-k">Next</span><strong>{next.title}</strong></a>
              : <span />}
          </nav>
        )}
      </div>
    </div>
    </div>
  );
}
