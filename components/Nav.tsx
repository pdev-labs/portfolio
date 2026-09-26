"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#expertise", label: "Expertise" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label="pdev-labs home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M23 21 L37 32 L23 43" fill="none" stroke="var(--paper)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><rect x="40" y="38" width="11" height="7" rx="3.5" fill="#FF4D2E"/></svg>
          </span>
          <span>pdev-labs <small className="brand-sub">· systems</small></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(l => (
            <a key={l.href} className="hide-m" href={l.href}>{l.label}</a>
          ))}
          <button type="button" className="palette-btn hide-m" title="Command palette (Ctrl+K)"
            aria-label="Open command palette"
            onClick={() => window.dispatchEvent(new Event("pdev-palette"))}>
            <span aria-hidden="true">⌘K</span>
          </button>
          <ThemeToggle />
          <a className="github-btn nav-cta" href="https://github.com/pdev-labs" target="_blank" rel="noreferrer"
            title="pdev-labs on GitHub" aria-label="pdev-labs on GitHub">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.28 1.32-.42 2-.43.68.01 1.36.15 2 .43 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(o => !o)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </nav>
      </div>
      {open && (
        <nav id="mobile-menu" className="wrap nav-panel" aria-label="Mobile">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="https://github.com/pdev-labs" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub ↗</a>
        </nav>
      )}
    </header>
  );
}
