"use client";
import { useEffect } from "react";
import { springScrollTo } from "./scrollSpring";

/** Spring-physics smooth scroll for in-page anchors + springy reveals. */
export default function SpringScroll() {
  useEffect(() => {
    let cancel: (() => void) | undefined;
    const interrupt = () => { cancel?.(); cancel = undefined; };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76; // sticky nav offset
      try { history.pushState(null, "", id); } catch { /* ignore */ }
      cancel = springScrollTo(top);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    return () => {
      cancel?.();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchmove", interrupt);
      window.removeEventListener("keydown", interrupt);
    };
  }, []);

  return null;
}
