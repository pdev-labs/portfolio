/** Decorative infinite marquee band. CSS-driven; motion disabled under reduced-motion. */
export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-item" key={`${t}-${i}`}>{t}<i className="marquee-dot" /></span>
        ))}
      </div>
    </div>
  );
}
