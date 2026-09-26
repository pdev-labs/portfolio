"use client";
import { useEffect, useRef } from "react";

const SECTIONS = ["about", "expertise", "work", "experience", "contact"];

/** Top progress hairline + active-section highlight in navs. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      // spy
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      }
      document.querySelectorAll(".nav-links a, .nav-panel a").forEach(a => {
        const href = a.getAttribute("href");
        if (href && href.startsWith("#")) a.classList.toggle("active", href === `#${current}`);
      });
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
