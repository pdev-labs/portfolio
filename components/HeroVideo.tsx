"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Ambient hero film plate (Veo-generated, palette-locked to the site).
 * - Fetches only when it starts playing (preload="none" + poster).
 * - Pauses offscreen and when the tab is hidden.
 * - Reduced-motion / data-saver users get the poster still instead of video.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (calm || slow) { setStill(true); return; }

    const v = ref.current;
    if (!v) return;
    const play = () => v.play().catch(() => {});
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) play();
      else v.pause();
    }, { threshold: 0.01 });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : play());
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="hero-still" src="/media/hero-poster.jpg" alt="" />
      ) : (
        <video
          ref={ref}
          className="hero-video"
          muted
          loop
          playsInline
          preload="none"
          poster="/media/hero-poster.jpg"
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
