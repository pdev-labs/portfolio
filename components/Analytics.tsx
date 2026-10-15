"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getConsent } from "./Consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let injected = false;

function inject() {
  if (injected || !GA_ID) return;
  injected = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer ?? [];
  const gtag = (...args: unknown[]) => window.dataLayer!.push(args);
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

/** Google Analytics, loaded only after explicit analytics opt-in. */
export default function Analytics() {
  const path = usePathname();

  useEffect(() => {
    if (!GA_ID) return;
    if (getConsent().analytics) inject();
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail?.analytics) inject();
    };
    window.addEventListener("pdev-consent", onChange);
    return () => window.removeEventListener("pdev-consent", onChange);
  }, []);

  useEffect(() => {
    if (injected && window.gtag && GA_ID) window.gtag("event", "page_view", { page_path: path });
  }, [path]);

  return null;
}
