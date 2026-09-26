"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="wrap" style={{ padding: "80px 22px", textAlign: "center" }}>
      <p className="sec-label">Something broke</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,52px)", margin: "8px 0" }}>
        A part failed to load.
      </h1>
      <p className="muted" style={{ margin: "0 auto 24px" }}>Try again — or go home and navigate fresh.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" type="button" onClick={() => reset()}>Retry</button>
        <a className="btn btn-ghost" href="/">Back home</a>
      </div>
    </main>
  );
}
