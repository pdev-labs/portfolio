"use client";
import { useEffect } from "react";
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    // NOTE: reveal state lives in a data attribute (not a class) so React
    // re-renders that rewrite className can never wipe a revealed element.
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.setAttribute("data-in", "true")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.setAttribute("data-in", "true"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}
