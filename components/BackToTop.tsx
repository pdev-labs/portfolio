"use client";
import { useEffect, useState } from "react";
import { springScrollTo } from "./scrollSpring";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setShow(window.scrollY > window.innerHeight * 1.2);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button type="button" className="to-top" aria-label="Back to top"
      onClick={() => springScrollTo(0)}>
      ↑
    </button>
  );
}
