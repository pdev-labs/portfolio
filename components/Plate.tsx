/**
 * Full-bleed cinematic background plate. Motion (parallax + slow drift) is
 * driven by components/Motion.tsx via GSAP. Falls back to a still image when
 * motion is disabled. Decorative only.
 */
export default function Plate({
  src,
  opacity = 0.5,
  blur = 0,
  className = "",
}: {
  src: string;
  opacity?: number;
  blur?: number;
  className?: string;
}) {
  return (
    <div className={`plate ${className}`} style={{ opacity, filter: blur ? `blur(${blur}px)` : undefined }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}
