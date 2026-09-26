"use client";
import { useEffect, useState } from "react";
import { applyTheme, storedTheme, type SiteTheme } from "./theme";

const ORDER: SiteTheme[] = ["system", "light", "dark"];
const LABEL: Record<SiteTheme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};
const ICON: Record<SiteTheme, string> = { system: "◐", light: "☀", dark: "☾" };

export default function ThemeToggle() {
  const [mode, setMode] = useState<SiteTheme>("system");

  useEffect(() => {
    setMode(storedTheme());
    const onChange = (e: Event) => setMode((e as CustomEvent<SiteTheme>).detail);
    window.addEventListener("pdev-theme-change", onChange);
    return () => window.removeEventListener("pdev-theme-change", onChange);
  }, []);

  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];

  return (
    <button
      type="button"
      className="theme-toggle"
      title={`${LABEL[mode]} — click for ${LABEL[next]}`}
      aria-label={`${LABEL[mode]} active. Activate for ${LABEL[next]}.`}
      onClick={() => { applyTheme(next); setMode(next); }}
    >
      <span aria-hidden="true">{ICON[mode]}</span>
      <span className="theme-toggle-text">{mode}</span>
    </button>
  );
}
