/**
 * Kinetic hero headline: words rise out of a mask, staggered.
 * Pure CSS animation (no JS), so it is safe in a server component and
 * collapses to static text under prefers-reduced-motion.
 */
export default function HeroTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="hero-title">
      {words.map((w, i) => (
        <span className="hw" key={`${w}-${i}`}>
          <span className="hw-in" style={{ animationDelay: `${(0.07 * i + 0.12).toFixed(2)}s` }}>{w}</span>
        </span>
      ))}
    </h1>
  );
}
