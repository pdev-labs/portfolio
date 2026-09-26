/** Spring-physics vertical scroll. Interruptible, calm-motion aware. */
export function springScrollTo(dest: number) {
  dest = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, dest));
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, dest);
    return () => {};
  }
  let pos = window.scrollY;
  let vel = 0;
  let last = performance.now();
  const start = last;
  let raf = 0;
  const K = 52, C = 10;
  const step = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    vel += ((dest - pos) * K - vel * C) * dt;
    pos += vel * dt;
    if ((Math.abs(dest - pos) < 0.6 && Math.abs(vel) < 14) || now - start > 3600) {
      window.scrollTo(0, dest);
      raf = 0;
      return;
    }
    window.scrollTo(0, pos);
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
