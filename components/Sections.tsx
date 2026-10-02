import LabConsole from "./LabConsole";
import ContactForm from "./ContactForm";
import { JOURNEY, EXPERIENCE, SERVICES, PROCESS, PROFILE } from "../data/site";

export function Hero() {
  return (
    <div className="wrap hero-grid" id="top">
      <div>
        <span className="kicker"><span className="dot" aria-hidden="true" />{PROFILE.availability}</span>
        <p className="hero-eyebrow">{PROFILE.role} · {PROFILE.location}</p>
        <h1>Practical systems software, documented and maintained.</h1>
        <p className="hero-sub"><strong>{PROFILE.tagline}</strong> {PROFILE.bio}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#work">View selected work</a>
          <a className="btn btn-ghost" href="https://github.com/pdev-labs?tab=repositories" target="_blank" rel="noreferrer">GitHub · 21 repositories ↗</a>
        </div>
        <dl className="hero-meta">
          <div><dt>Repositories</dt><dd><strong>21</strong> public</dd></div>
          <div><dt>Focus</dt><dd><strong>Linux</strong> · Embedded · Python</dd></div>
          <div><dt>Response</dt><dd><strong>48h</strong> via GitHub</dd></div>
        </dl>
      </div>
      <div>
        <LabConsole />
        <p className="lab-caption">Featured: <strong>Lazy-ESP32</strong> — zero-config ESP32 flash toolkit. <a href="https://github.com/pdev-labs/Lazy-ESP32" target="_blank" rel="noreferrer">Read the source ↗</a></p>
      </div>
    </div>
  );
}

export function CredibilityBar() {
  const items = [
    { k: "Linux-For-Android", v: "multi-distro · VirGL" },
    { k: "FluxMedia", v: "published on PyPI" },
    { k: "Lazy-ESP32", v: "flash · OTA · partitions" },
    { k: "ESP32-S3", v: "NAS + Linux research" },
  ];
  return (
    <div className="cred">
      <div className="wrap cred-inner">
        {items.map(i => (
          <div className="cred-item" key={i.k}><strong>{i.k}</strong><span>{i.v}</span></div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">About</p>
          <h2>A maintainer&apos;s mindset, not just projects.</h2>
        </div>
      </div>
      <div className="about-grid">
        <div className="card reveal">
          <h3>What I do</h3>
          <p>I design small tools that remove real friction — installing Linux on a phone, sharing media over LAN, documenting a setup so it works the second time. Shell for OS glue, Python for delivery speed, C/C++ where hardware requires it.</p>
          <div className="stat-row">
            <div className="stat"><b>21</b><span>public repositories</span></div>
            <div className="stat"><b>4</b><span>core domains</span></div>
            <div className="stat"><b>100%</b><span>with READMEs</span></div>
          </div>
        </div>
        <div className="card reveal">
          <h3>How I work</h3>
          <ul className="ticks">
            <li>Scope to one problem with clear acceptance steps</li>
            <li>Ship working code plus a setup guide tested clean</li>
            <li>Triage issues, keep releases noted, state limits honestly</li>
          </ul>
          <p className="muted" style={{ marginTop: 12 }}>Currently hardening the Linux-For-Android boot manager and preparing FluxMedia 2.x.</p>
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Experience</p>
          <h2>Self-directed, but structured.</h2>
        </div>
      </div>
      <div className="timeline">
        {EXPERIENCE.map(e => (
          <article className="t-item reveal" key={e.role}>
            <div className="t-period">{e.period}</div>
            <div>
              <h3>{e.role}</h3>
              <p className="muted">{e.org}</p>
              <ul>{e.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Collaboration</p>
          <h2>What I can help with.</h2>
        </div>
      </div>
      <div className="svc-grid">
        {SERVICES.map(s => (
          <div className="card reveal" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>
        ))}
      </div>
    </div>
  );
}

export function Process() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Process</p>
          <h2>Predictable delivery.</h2>
        </div>
      </div>
      <ol className="proc-grid">
        {PROCESS.map((s, i) => (
          <li className="reveal" key={s.title}><span className="proc-n" aria-hidden="true">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
    </div>
  );
}

export function Journey() {
  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Background</p>
          <h2>Trajectory.</h2>
        </div>
      </div>
      <div className="journey reveal">
        <div className="j-side"><h3>Student, shipping since Jul 2026</h3><p>Account opened Jul 2026 · 21 repos in ~3 months — devices, docs, and deadlines I set for myself.</p></div>
        <div className="j-main">
          {JOURNEY.map(j => (
            <div className="j-item" key={j.year + j.title}>
              <div className="j-year">{j.year}</div>
              <div><strong>{j.title}</strong><br /><span className="muted">{j.text}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="wrap">
      <div className="contact-grid reveal" id="contact">
        <div>
          <p className="sec-label light">Contact</p>
          <h2>Let&apos;s build something maintainable.</h2>
          <p>Best channel is GitHub — open an issue or discussion on any repo. I triage regularly and reply within 48 hours.</p>
          <ul className="contact-list">
            <li><strong>GitHub</strong> — <a href="https://github.com/pdev-labs" target="_blank" rel="noreferrer">github.com/pdev-labs</a></li>
            <li><strong>Email</strong> — <a href="mailto:pdev.labs@gmail.com">pdev.labs@gmail.com</a></li>
            <li><button type="button" className="link-btn" data-copy="pdev.labs@gmail.com" data-label="Email">Copy email</button></li>
            <li><strong>Instagram</strong> — <a href="https://instagram.com/pdev_labs" target="_blank" rel="noreferrer">@pdev_labs</a></li>
            <li><strong>Location</strong> — {PROFILE.location}</li>
            <li><strong>Status</strong> — {PROFILE.availability}</li>
          </ul>
          <div className="contact-actions">
            <a className="btn btn-light" href="mailto:pdev.labs@gmail.com">Email me ↗</a>
            <button type="button" className="btn btn-outline-light" data-copy="https://www.pdevlabs.jo3.org" data-label="Page link">Copy page link ⧉</button>
            <a className="btn btn-outline-light" href="https://github.com/pdev-labs/Linux-For-Android" target="_blank" rel="noreferrer">Try Linux-For-Android</a>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <p className="foot-brand"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="15" fill="var(--ink)"/><path d="M23 21 L37 32 L23 43" fill="none" stroke="var(--paper)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="40" y="38" width="11" height="7" rx="3.5" fill="#FF4D2E"/></svg>pdev-labs</p>
          <p className="muted">Open-source systems software.</p>
        </div>
        <nav aria-label="Footer">
          <p className="foot-h">Site</p>
          <a href="#about">About</a><a href="#expertise">Expertise</a><a href="#work">Work</a><a href="#experience">Experience</a>
        </nav>
        <div>
          <p className="foot-h">Elsewhere</p>
          <a href="https://github.com/pdev-labs" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://github.com/pdev-labs?tab=repositories" target="_blank" rel="noreferrer">All repos ↗</a>
          <a href="mailto:pdev.labs@gmail.com">Email ↗</a>
          <a href="https://instagram.com/pdev_labs" target="_blank" rel="noreferrer">Instagram ↗</a>
        </div>
      </div>
      <div className="wrap foot-base"><span>© {new Date().getFullYear()} pdev-labs</span><span>Docs-first · GPLv3 where noted</span></div>
    </footer>
  );
}
