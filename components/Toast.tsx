"use client";
import { useEffect, useState } from "react";

export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("pdev-toast", { detail: msg }));
}

let id = 0;

export default function Toasts() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    const on = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      const nid = ++id;
      setItems(prev => [...prev.slice(-2), { id: nid, msg }]);
      window.setTimeout(() => setItems(prev => prev.filter(i => i.id !== nid)), 2600);
    };
    const onCopy = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-copy]") as HTMLElement | null;
      if (el?.dataset.copy) copyText(el.dataset.copy, el.dataset.label || "Link");
    };
    window.addEventListener("pdev-toast", on);
    document.addEventListener("click", onCopy);
    return () => {
      window.removeEventListener("pdev-toast", on);
      document.removeEventListener("click", onCopy);
    };
  }, []);

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map(i => <div key={i.id} className="toast">{i.msg}</div>)}
    </div>
  );
}

export async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(`${label} copied`);
  } catch {
    toast("Copy failed — select manually");
  }
}
