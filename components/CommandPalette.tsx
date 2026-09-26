"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../data/site";
import { springScrollTo } from "./scrollSpring";
import { applyTheme } from "./theme";
import { copyText } from "./Toast";

type Action = { label: string; hint: string; run: () => void };

const SECTIONS: [string, string][] = [
  ["About", "#about"], ["Expertise", "#expertise"], ["Work", "#work"],
  ["Experience", "#experience"], ["Contact", "#contact"],
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(() => [
    ...SECTIONS.map(([label, href]) => ({
      label: `Go to ${label}`, hint: "section",
      run: () => {
        const el = document.querySelector(href);
        if (el) springScrollTo(el.getBoundingClientRect().top + window.scrollY - 76);
      },
    })),
    ...PROJECTS.map(p => ({
      label: `Open ${p.title}`, hint: "repo",
      run: () => window.open(p.url, "_blank", "noreferrer"),
    })),
    { label: "Copy email address", hint: "copy", run: () => copyText("pdev.labs@gmail.com", "Email") },
    { label: "Theme: light", hint: "theme", run: () => applyTheme("light") },
    { label: "Theme: dark", hint: "theme", run: () => applyTheme("dark") },
    { label: "Theme: system", hint: "theme", run: () => applyTheme("system") },
  ], []);

  const list = actions.filter(a => (a.label + a.hint).toLowerCase().includes(q.toLowerCase())).slice(0, 9);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQ(""); setIdx(0);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onToggle = () => { setOpen(o => !o); setQ(""); setIdx(0); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pdev-palette", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pdev-palette", onToggle);
    };
  }, []);

  useEffect(() => { if (open) { setIdx(0); input.current?.focus(); } }, [open, q ]);

  if (!open) return null;
  return (
    <div className="palette-back" onClick={() => setOpen(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onClick={e => e.stopPropagation()}>
        <input ref={input} value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => {
            if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, list.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
            else if (e.key === "Enter" && list[idx]) { list[idx].run(); setOpen(false); }
          }}
          placeholder="Type a command — sections, repos, theme…" aria-label="Command input" />
        <ul>
          {list.map((a, i) => (
            <li key={a.label}>
              <button type="button" className={i === idx ? "on" : ""} onMouseEnter={() => setIdx(i)}
                onClick={() => { a.run(); setOpen(false); }}>
                <span>{a.label}</span><span className="palette-hint">{a.hint}</span>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="palette-empty">No match — try “theme” or a repo name.</li>}
        </ul>
        <p className="palette-foot">Ctrl/⌘ K to toggle · ↑↓ + Enter · Esc to close</p>
      </div>
    </div>
  );
}
