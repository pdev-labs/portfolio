"use client";
import { useEffect, useState } from "react";

export type StoreCat = "preferences" | "history" | "cache";
export type Consent = Record<StoreCat, boolean> & { decided: boolean };

const KEY = "pdev-consent";
const DEFAULTS: Consent = { preferences: false, history: false, cache: false, decided: false };
let current: Consent = { ...DEFAULTS };
let loaded = false;

function ensure() {
  if (!loaded && typeof window !== "undefined") { loaded = true; current = read(); }
}

const CAT_KEYS: Record<StoreCat, string[]> = {
  preferences: ["pdev-theme", "pdev-term-font"],
  history: ["pdev-term-history"],
  cache: ["pdev-gh-stats"],
};

function read(): Consent {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const v = JSON.parse(raw);
    return {
      preferences: !!v.preferences,
      history: !!v.history,
      cache: !!v.cache,
      decided: true,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function write(c: Consent) {
  current = { ...c };
  try {
    if (c.decided) localStorage.setItem(KEY, JSON.stringify(c));
    else localStorage.removeItem(KEY);
  } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent("pdev-consent", { detail: { ...current } }));
}

export function getConsent(): Consent {
  ensure();
  return { ...current };
}

/** Storage access gated by consent. Reads/writes silently no-op when denied. */
export function storeGet(cat: StoreCat, key: string): string | null {
  ensure();
  if (!current[cat]) return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

export function storeSet(cat: StoreCat, key: string, value: string) {
  ensure();
  if (!current[cat]) return;
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export function storeDel(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export function decide(c: Omit<Consent, "decided">) {
  write({ ...c, decided: true });
  // wipe anything the user did not allow
  for (const cat of Object.keys(CAT_KEYS) as StoreCat[]) {
    if (!c[cat]) for (const k of CAT_KEYS[cat]) storeDel(k);
  }
}

export function resetDecision() {
  for (const k of ["pdev-consent", "pdev-theme", "pdev-term-history", "pdev-term-font", "pdev-gh-stats"]) storeDel(k);
  write({ ...DEFAULTS });
}

export function openConsent() {
  window.dispatchEvent(new Event("pdev-consent-open"));
}

const LABELS: [StoreCat, string, string][] = [
  ["preferences", "Preferences", "Theme + terminal font size"],
  ["history", "Terminal history", "Command recall across visits"],
  ["cache", "Stats cache", "GitHub star counts for 24h"],
];

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [prefs, setPrefs] = useState({ preferences: true, history: true, cache: true });

  useEffect(() => {
    ensure();
    if (!getConsent().decided) {
      const t = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const open = () => { setCustom(true); setVisible(true); };
    const onAttr = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-consent-open]")) open();
    };
    window.addEventListener("pdev-consent-open", open);
    document.addEventListener("click", onAttr);
    return () => {
      window.removeEventListener("pdev-consent-open", open);
      document.removeEventListener("click", onAttr);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="consent" role="dialog" aria-modal="false" aria-label="Storage consent">
      <p className="consent-title">Your call on storage</p>
      <p className="consent-text">
        This site works fully without storage. Optionally it can remember your theme,
        terminal history, and cached stats — only in your browser, never on a server.
      </p>
      {custom && (
        <div className="consent-opts">
          {LABELS.map(([k, label, sub]) => (
            <label key={k}>
              <input type="checkbox" checked={prefs[k]}
                onChange={e => setPrefs(p => ({ ...p, [k]: e.target.checked }))} />
              <span><strong>{label}</strong><small>{sub}</small></span>
            </label>
          ))}
        </div>
      )}
      <div className="consent-actions">
        <button type="button" className="btn btn-primary btn-small"
          onClick={() => { decide({ preferences: true, history: true, cache: true }); setVisible(false); }}>
          Accept all
        </button>
        <button type="button" className="btn btn-ghost btn-small"
          onClick={() => { decide({ preferences: false, history: false, cache: false }); setVisible(false); }}>
          Essential only
        </button>
        {custom
          ? <button type="button" className="btn btn-ghost btn-small"
              onClick={() => { decide(prefs); setVisible(false); }}>Save choices</button>
          : <button type="button" className="link-btn" onClick={() => setCustom(true)}>Customize</button>}
        <a className="link-btn" href="/privacy">Privacy notes</a>
      </div>
    </div>
  );
}
