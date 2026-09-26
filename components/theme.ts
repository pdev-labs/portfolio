import { storeGet, storeSet } from "./Consent";
export type SiteTheme = "light" | "dark" | "system";

const KEY = "pdev-theme";

export function storedTheme(): SiteTheme {
  if (typeof window === "undefined") return "system";
  const v = storeGet("preferences", KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function resolvedTheme(t: SiteTheme): "light" | "dark" {
  if (t !== "system") return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(t: SiteTheme) {
  const r = resolvedTheme(t);
  document.documentElement.dataset.theme = r;
  document.documentElement.style.colorScheme = r;
  storeSet("preferences", KEY, t);
  window.dispatchEvent(new CustomEvent("pdev-theme-change", { detail: t }));
}
