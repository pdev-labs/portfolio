"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Motion system: Lenis (sole smooth-scroll engine) + GSAP ScrollTrigger.
 * Restrained by design — one orchestrated intro (CSS) and scroll reveals.
 * Fully bypassed under prefers-reduced-motion (final states render immediately).
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) { root.classList.remove("motion-on", "pre-show"); return; }

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("motion-on");

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const onLenis = () => ScrollTrigger.update();
    lenis.on("scroll", onLenis);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // batched reveals
      gsap.set(".reveal", { opacity: 0, y: 30, filter: "blur(6px)" });
      ScrollTrigger.batch(".reveal", {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out",
          stagger: 0.07, overwrite: true,
        }),
      });

      // section headings rise word by word
      gsap.utils.toArray<HTMLElement>(".sec-head h2, .contact-grid h2")
        .filter((h) => !h.closest("#work"))
        .forEach((h) => {
          const words = (h.textContent || "").trim().split(/\s+/);
          if (!words.length) return;
          h.setAttribute("aria-label", h.textContent || "");
          h.innerHTML = words.map((w) => `<span class="mword" aria-hidden="true"><span class="mword-in">${w}</span></span>`).join(" ");
          gsap.from(h.querySelectorAll(".mword-in"), {
            yPercent: 115, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.045,
            scrollTrigger: { trigger: h, start: "top 90%", once: true },
          });
        });

      // project rows
      gsap.utils.toArray<HTMLElement>(".proj-list").forEach((list) => {
        gsap.from(list.querySelectorAll(".proj"), {
          y: 24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: list, start: "top 90%", once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 800);

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
