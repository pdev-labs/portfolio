"use client";
import { useEffect, useRef } from "react";

const FINE = () => window.matchMedia("(pointer: fine)").matches;
const CALM = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Cursor glow follower (fine pointers only) + magnetic primary buttons + hero parallax. */
export default function Effects() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!FINE() || CALM()) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current, r = ring.current;
    if (!d || !r) return;
    let mx = -100, my = -100;
    let dx = -100, dy = -100, rx = -100, ry = -100;
    let scale = 1, tScale = 1, raf = 0, shown = false;
    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; dx = rx = mx; dy = ry = my; d.style.opacity = "1"; r.style.opacity = "1"; }
    };
    const leave = () => { shown = false; d.style.opacity = "0"; r.style.opacity = "0"; };
    const over = (e: PointerEvent) => {
      const hot = (e.target as HTMLElement).closest("a, button, input, textarea, .lab-drag, .exp-card");
      tScale = hot ? 1.9 : 1;
      r.classList.toggle("hot", !!hot);
    };
    const down = () => { d.style.transform += ""; r.classList.add("pressed"); };
    const up = () => r.classList.remove("pressed");
    let idle = 0;
    const loop = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (tScale - scale) * 0.2;
      const settled = Math.abs(mx - dx) < 0.1 && Math.abs(my - dy) < 0.1 &&
        Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1 && Math.abs(tScale - scale) < 0.01;
      if (settled) {
        if (++idle > 30) { raf = 0; return; } // sleep until next pointer event
      } else idle = 0;
      d.style.transform = `translate(${dx}px, ${dy}px)`;
      r.style.transform = `translate(${rx}px, ${ry}px) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const moveWake = (e: PointerEvent) => { move(e); wake(); };
    window.addEventListener("pointermove", moveWake, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", moveWake);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useEffect(() => {
    if (!FINE() || CALM()) return;
    // magnetic pull on primary CTAs
    const btns = Array.from(document.querySelectorAll(".hero-cta .btn-primary, .contact-actions .btn-light")) as HTMLElement[];
    const clean: (() => void)[] = [];
    btns.forEach(b => {
      let raf = 0;
      const onMove = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          b.style.transform = `translate(${(dx * 0.12).toFixed(1)}px, ${(dy * 0.18).toFixed(1)}px)`;
        });
      };
      const onLeave = () => { cancelAnimationFrame(raf); b.style.transform = ""; };
      b.addEventListener("pointermove", onMove);
      b.addEventListener("pointerleave", onLeave);
      clean.push(() => { b.removeEventListener("pointermove", onMove); b.removeEventListener("pointerleave", onLeave); });
    });
    // gentle hero parallax while hero is on screen
    const hero = document.querySelector(".hero-grid") as HTMLElement | null;
    let ticking = false;
    const onScroll = () => {
      if (ticking || !hero) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = Math.min(window.scrollY, window.innerHeight);
        hero.style.transform = y < window.innerHeight ? `translateY(${(y * 0.06).toFixed(1)}px)` : "";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clean.forEach(f => f()); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (<>
    <div ref={dot} className="cursor-dot" aria-hidden="true" />
    <div ref={ring} className="cursor-ring" aria-hidden="true" />
  </>);
}
