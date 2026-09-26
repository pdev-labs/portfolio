import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy \u2014 pdev-labs",
  description: "Privacy notes for the pdev-labs portfolio: no cookies, no tracking, no analytics. Terminal history stays in your browser.",
};

export default function Privacy() {
  return (
    <main id="main" className="wrap" style={{ padding: "64px 22px", maxWidth: 760 }}>
      <p className="sec-label">Privacy</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,52px)", margin: "8px 0 16px", letterSpacing: "-.03em" }}>
        No tracking, no cookies.
      </h1>
      <div className="prose">
        <p>This site runs no analytics, sets no cookies, and stores nothing about you on any server.</p>
        <ul>
          <li><strong>Preferences stay local.</strong> Theme choice, terminal history, and font size live only in your browser&apos;s localStorage.</li>
          <li><strong>Live stats are anonymous.</strong> Star counts come from the public GitHub API; no identifier is sent or stored.</li>
          <li><strong>Outbound links leave this site.</strong> GitHub, Instagram, and your email client apply their own policies once you click through.</li>
          <li><strong>Fonts are self-hosted.</strong> Nothing is fetched from third-party font servers.</li>
          <li><strong>Always-on anti-spam stamp.</strong> After you send a message, one timestamp is kept for 2 minutes so the form can&apos;t be spammed — it can&apos;t be switched off, and it holds no personal data.</li>
        </ul>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "28px 0 8px" }}>What can be stored, and why</h2>
        <ul>
          <li><strong>Preferences</strong> — theme choice and terminal font size. Without it, the site uses your system theme each visit.</li>
          <li><strong>Terminal history</strong> — your typed commands, for arrow-key recall. Without it, history lasts one visit.</li>
          <li><strong>Stats cache</strong> — GitHub star counts for 24 hours, to avoid refetching. Without it, counts load live every time.</li>
        </ul>
        <p><button type="button" className="btn btn-ghost btn-small" data-consent-open>Change storage choices</button></p>
        <p>Questions: <a href="mailto:pdev.labs@gmail.com">pdev.labs@gmail.com</a></p>
      </div>
    </main>
  );
}
