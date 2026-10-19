"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Whole-site motion system: Lenis smooth scroll + GSAP ScrollTrigger.
 * - Hero pins and its film plate scales/darkens as you scroll away
 * - Section plates drift and parallax
 * - Headings split into words and rise in
 * - Cards, rows, media and reveals batched on enter
 * Everything is skipped (page stays static and fully visible) under
 * prefers-reduced-motion.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) { root.classList.remove("motion-on", "pre-show"); return; }

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("motion-on");

    // ---- smooth scroll ----
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const onLenis = () => ScrollTrigger.update();
    lenis.on("scroll", onLenis);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // ---- reveal batch (replaces the CSS reveal) ----
      gsap.set(".reveal", { opacity: 0, y: 38, filter: "blur(9px)" });
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95, ease: "power3.out",
          stagger: 0.08, overwrite: true,
        }),
      });

      // ---- hero title (kinetic) ----
      const heroTitle = gsap.utils.toArray<HTMLElement>(".hero-title .hw-in");
      if (heroTitle.length) {
        gsap.set(heroTitle, { yPercent: 120 });
        gsap.to(heroTitle, { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.07, delay: 1.15 });
      }

      // ---- section headings: word-by-word rise ----
      gsap.utils.toArray<HTMLElement>(".sec-head h2, .contact-grid h2")
        .filter((h) => !h.closest("#work"))
        .forEach((h) => {
          const words = (h.textContent || "").trim().split(/\s+/);
          if (!words.length) return;
          h.innerHTML = words.map((w) => `<span class="mword"><span class="mword-in">${w}</span></span>`).join(" ");
          gsap.from(h.querySelectorAll(".mword-in"), {
            yPercent: 120, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.055,
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          });
        });

      // ---- media: clip-path reveal ----
      gsap.utils.toArray<HTMLElement>(".media").forEach((m) => {
        gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, {
          clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: m, start: "top 88%", once: true },
        });
      });

      // ---- section plates: parallax + slow drift ----
      gsap.utils.toArray<HTMLElement>(".cine").forEach((sec, i) => {
        const img = sec.querySelector<HTMLElement>(".plate > img");
        if (!img) return;
        gsap.fromTo(img, { yPercent: -10 - (i % 3) * 2 }, {
          yPercent: 10 + (i % 3) * 2, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(img, { scale: 1.08 }, {
          scale: 1.22, duration: 22, ease: "sine.inOut", repeat: -1, yoyo: true,
        });
      });

      // ---- project rows stagger ----
      gsap.utils.toArray<HTMLElement>(".proj-list").forEach((list) => {
        gsap.from(list.querySelectorAll(".proj"), {
          y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.07,
          scrollTrigger: { trigger: list, start: "top 88%", once: true },
        });
      });

      // ---- hero pin + scrub (desktop) ----
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const hero = document.querySelector<HTMLElement>(".hero");
        const media = document.querySelector<HTMLElement>(".hero-media");
        const grid = document.querySelector<HTMLElement>(".hero-grid");
        if (!hero || !media || !grid) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "+=85%", scrub: true, pin: true, anticipatePin: 1 },
        });
        tl.to(media, { scale: 1.22, filter: "brightness(0.5)", ease: "none" }, 0)
          .to(grid, { yPercent: -14, opacity: 0.12, ease: "none" }, 0);
        return () => { tl.scrollTrigger?.kill(); tl.kill(); };
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      gsap.ticker.remove(tick);
      lenis.off("scroll", onLenis);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
