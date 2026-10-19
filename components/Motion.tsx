"use client";
import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";

type Win = Window & { __lenis?: Lenis; __motion?: boolean };

/**
 * Motion system: Lenis as the single smooth-scroll engine, IntersectionObserver
 * for scroll reveals.
 *
 * IntersectionObserver (rather than scroll-position triggers) means content is
 * revealed reliably even when the user jumps straight to a section — via the
 * nav hash links, the command palette, or a restored scroll position — so a
 * section can never be left blank.
 *
 * Everything is bypassed under prefers-reduced-motion: elements render in their
 * final state.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const win = window as Win;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      root.classList.remove("motion-on", "pre-show");
      return;
    }

    win.__motion = true;
    root.classList.add("motion-on");

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    win.__lenis = lenis;
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anything already scrolled past stays in its final state (e.g. reload mid-page).
    const passed = (el: HTMLElement) => el.getBoundingClientRect().bottom < 8;

    const io = new IntersectionObserver((entries) => {
      const shown = entries.filter((e) => e.isIntersecting);
      shown.forEach((e) => io.unobserve(e.target));
      shown.forEach((e, i) => {
        const el = e.target as HTMLElement;
        const delay = Math.min(i * 0.06, 0.28);
        const kind = el.dataset.reveal;
        if (kind === "rows") {
          gsap.to(el.querySelectorAll(".proj"), {
            y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, delay, overwrite: true, clearProps: "transform",
          });
        } else if (kind === "words") {
          gsap.to(el.querySelectorAll(".mword-in"), {
            yPercent: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.045, delay, overwrite: true, clearProps: "transform",
          });
        } else {
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay, overwrite: true, clearProps: "transform",
          });
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });

    const ctx = gsap.context(() => {
      // batched panel / card reveals
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        if (passed(el)) return;
        gsap.set(el, { opacity: 0, y: 30 });
        io.observe(el);
      });

      // section headings rise word by word (the work list has its own animation)
      gsap.utils.toArray<HTMLElement>(".sec-head h2, .contact-grid h2")
        .filter((h) => !h.closest("#work"))
        .forEach((h) => {
          const text = h.textContent || "";
          const words = text.trim().split(/\s+/);
          if (!words.length) return;
          h.setAttribute("aria-label", text);
          h.innerHTML = words
            .map((w) => `<span class="mword" aria-hidden="true"><span class="mword-in">${w}</span></span>`)
            .join(" ");
          const inner = h.querySelectorAll(".mword-in");
          if (passed(h)) return;
          gsap.set(inner, { yPercent: 115, opacity: 0 });
          h.dataset.reveal = "words";
          io.observe(h);
        });

      // project rows
      gsap.utils.toArray<HTMLElement>(".proj-list").forEach((list) => {
        if (passed(list)) return;
        gsap.set(list.querySelectorAll(".proj"), { y: 24, opacity: 0 });
        list.dataset.reveal = "rows";
        io.observe(list);
      });
    });

    // Failsafe: never leave content hidden if an observer edge case slips through.
    const failsafe = window.setTimeout(() => {
      gsap.utils.toArray<HTMLElement>(".reveal, .proj-list, .sec-head h2").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > -8 && Number(getComputedStyle(el).opacity) < 0.05) {
          gsap.set(el, { opacity: 1, y: 0 });
          gsap.set(el.querySelectorAll(".mword-in"), { yPercent: 0, opacity: 1 });
          gsap.set(el.querySelectorAll(".proj"), { y: 0, opacity: 1 });
        }
      });
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      gsap.ticker.remove(tick);
      io.disconnect();
      win.__lenis = undefined;
      win.__motion = false;
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
