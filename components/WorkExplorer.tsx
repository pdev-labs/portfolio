"use client";
import { useEffect, useMemo, useState } from "react";
import { PROJECTS, type Project } from "../data/site";
import { setWorkFilter, useWorkFilter } from "./workFilter";
import { copyText } from "./Toast";

const FILTERS = ["All", "Python", "Shell", "JavaScript", "C/C++", "ESP32", "Linux"];

function matches(p: Project, f: string): boolean {
  if (f === "All") return true;
  if (f === "C/C++") return p.language === "C" || p.language === "C++";
  return p.language === f || p.tags.includes(f);
}

type SortKey = "featured" | "stars" | "year" | "name";
const SORTS: { k: SortKey; label: string }[] = [
  { k: "featured", label: "Featured" },
  { k: "stars", label: "Stars" },
  { k: "year", label: "Newest" },
  { k: "name", label: "A-Z" },
];

function sortProjects(list: Project[], s: SortKey): Project[] {
  const arr = [...list];
  if (s === "stars") arr.sort((a, b) => b.stars - a.stars);
  else if (s === "name") arr.sort((a, b) => a.title.localeCompare(b.title));
  else if (s === "year") arr.sort((a, b) => b.year.localeCompare(a.year));
  else arr.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  return arr;
}

function CopyBtn({ url, label }: { url: string; label: string }) {
  return (
    <button type="button" className="copy-btn" title={`Copy ${label} URL`}
      aria-label={`Copy ${label} URL`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); copyText(url, label); }}>
      Copy
    </button>
  );
}

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <a className="proj work-anim" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
      href={p.url} target="_blank" rel="noreferrer">
      <div>
        <div className="proj-top">
          <h3 className="proj-title">{p.title} <span className="arrow" aria-hidden="true">↗</span></h3>
          <span className="status sm">{p.status}</span>
        </div>
        <p className="proj-blurb">{p.blurb}</p>
        <div className="chips">
          <span className="chip lang">{p.language}</span>
          {p.tags.map(t => <span className="chip" key={t}>{t}</span>)}
          <span className="chip ghost">{p.outcome}</span>
        </div>
      </div>
      <div className="proj-side"><b>{p.year}</b><span className="star">★ {p.stars}</span><CopyBtn url={p.url} label={p.title} /></div>
    </a>
  );
}

export default function WorkExplorer() {
  const filter = useWorkFilter();
  const setFilter = setWorkFilter;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-filter]") as HTMLElement | null;
      if (el?.dataset.filter) setWorkFilter(el.dataset.filter);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const f of FILTERS) m[f] = PROJECTS.filter(p => matches(p, f)).length;
    return m;
  }, []);

  const [sort, setSort] = useState<SortKey>("featured");
  const shown = useMemo(() => sortProjects(PROJECTS.filter(p => matches(p, filter)), sort), [filter, sort]);
  const feats = shown.filter(p => p.featured);
  const rest = shown.filter(p => !p.featured);

  const pick = (f: string) => setFilter(f);

  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Selected work</p>
          <h2>{filter === "All" ? "Three projects that show range." : `${filter} work.`}</h2>
          <p>Showing {feats.length + rest.length} of {PROJECTS.length} — everything is open source.</p>
        </div>
        <a href="https://github.com/pdev-labs?tab=repositories" target="_blank" rel="noreferrer">All repositories ↗</a>
      </div>
      <div className="filter-sort reveal">
        <div className="sort-wrap">
          <label htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={e => setSort(e.target.value as SortKey)}>
            {SORTS.map(s => <option key={s.k} value={s.k}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="filter-row reveal" role="group" aria-label="Filter projects">
        {FILTERS.map(f => (
          <button key={f} type="button" onClick={() => pick(f)}
            className={`filter-chip${filter === f ? " on" : ""}`}
            aria-pressed={filter === f}>
            {f} <span className="filter-n">{counts[f]}</span>
          </button>
        ))}
      </div>
      {feats.length > 0 && (
        <div className="feat-grid" key={`f-${filter}`}>
          {feats.map(p => (
            <article className="feat work-anim" key={p.slug}>
              <div className="feat-head"><span className="chip lang">{p.language}</span><span className="status">{p.status}</span></div>
              <h3><a href={p.url} target="_blank" rel="noreferrer">{p.title} ↗</a></h3>
              <p>{p.blurb}</p>
              <p className="outcome"><strong>Outcome:</strong> {p.outcome}</p>
              <div className="chips">{p.tags.map(t => <span className="chip" key={t}>{t}</span>)}</div>
            </article>
          ))}
        </div>
      )}
      <div className="proj-list" key={`r-${filter}`}>
        {rest.map((p, i) => <Row key={p.slug} p={p} i={i} />)}
      </div>
    </div>
  );
}
