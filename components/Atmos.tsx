/** Fixed film-grain + vignette layers. Purely decorative, reduced-motion safe. */
export default function Atmos() {
  return (
    <>
      <div className="atmos-vignette" aria-hidden="true" />
      <div className="atmos-grain" aria-hidden="true" />
    </>
  );
}
