/** Cinematic intro curtain. Only shown (via the html.pre-show class) on a
 *  motion-enabled first visit in a session; auto-dismisses with CSS. */
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="pre-inner">
        <p className="pre-brand">pdev-labs</p>
        <p className="pre-sub">systems · firmware · python</p>
        <div className="pre-line"><span className="pre-sweep" /></div>
      </div>
    </div>
  );
}
