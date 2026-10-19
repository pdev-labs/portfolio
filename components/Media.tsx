/** In-flow cinematic media for cards: lazy, hover push-in, reduced-motion safe. */
export default function Media({
  src,
  ratio = "16 / 10",
  className = "",
}: {
  src: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}
