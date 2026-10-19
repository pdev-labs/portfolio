"use client";
import { useEffect, useRef } from "react";

/**
 * Full-bleed cinematic background plate: slow Ken-Burns drift + scroll parallax.
 * IO-gated (parallax only runs while visible), reduced-motion safe, lazy-loaded.
 * Purely decorative.
 */
export default function Plate({
  src,
  opacity = 0.5,
  parallax = 14,
  blur = 0,
  className = "",
}: {
  src: string;
  opacity?: number;
  parallax?: number;
  blur?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); }, { threshold: 0 });
    const onScroll = () => {
      if (ticking || !visible) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // ~ -1..1
        el.style.setProperty("--plate-shift", `${(-p * parallax).toFixed(2)}px`);
      });
    };
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax]);

  return (
    <div ref={wrap} className={`plate ${className}`} style={{ opacity, filter: blur ? `blur(${blur}px)` : undefined }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}
