"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { applyTheme, storedTheme, resolvedTheme } from "./theme";
import { storeGet, storeSet } from "./Consent";

type Line = { html: string };
type Out = { html: string; open?: string };

/* ---------- tiny virtual filesystem ---------- */
const FS: Record<string, { dirs: string[]; files: Record<string, string> }> = {
  "~": {
    dirs: ["projects"],
    files: {
      "README.md": `pdev-labs — systems developer, 16 · 21 public repos · type "projects" or "help"`,
      "skills.txt": `Shell · Python · C/C++ · ESP32-S3 · Extensions · PyPI · Next.js`,
      "contact.txt": `github.com/pdev-labs · pdev.labs@gmail.com · instagram: pdev_labs`,
      "journey.txt": `Jun 2026 FluxMedia → Jul account + systems streak → Sep embedded systems`,
    },
  },
  "~/projects": {
    dirs: [],
    files: {
      "linux-for-android.md": `Multi-distro Linux on Android via Termux. VirGL 3D, SSH, portable exports. ★3 — "open linux"`,
      "fluxmedia.md": `PyPI package + LAN QR share portal. ★2 — "open flux"`,
      "nanonas-s3.md": `ESP32-S3 NAS firmware. Chunked copy, Material UI. — "open nano"`,
      "polystream.md": `Multi-tab video enabler for Firefox + Chrome. — "open poly"`,
      "stepsnap.md": `Screenshot recorder for Linux X11/Wayland. — "open step"`,
    },
  },
};

const COMMANDS = [
  "help", "ls", "cd", "pwd", "cat", "whoami", "about", "skills", "projects",
  "experience", "journey", "services", "contact", "socials", "open",
  "banner", "neofetch", "stats", "date", "echo", "history", "hire", "theme", "font", "email", "instagram",
  "resume", "joke", "matrix", "clear",
];

const BOOT: Line[] = [
  { html: `<span class="t-cm">pdev-lab terminal · type "help"</span>` },
];

const HELP = [
  `<span class="t-kw">Files:</span> ls · cd projects · pwd · cat &lt;file&gt;`,
  `<span class="t-kw">Profile:</span> whoami · about · skills · experience · journey · services · contact · socials`,
  `<span class="t-kw">Work:</span> projects · open &lt;linux|flux|nano|poly|step&gt; · stats · resume · hire`,
  `<span class="t-kw">Fun:</span> banner · neofetch · joke · matrix · echo · date · history · clear`,
  `<span class="t-kw">Display:</span> theme &lt;light|dark|system&gt; · font +|-|reset (site theme + terminal size)`,
].join("<br>");

const JOKES = [
  `Why do programmers prefer dark mode? Because light attracts bugs.`,
  `I told my SSD a joke… it couldn't handle the cache-back.`,
  `ESP32 walked into a bar. Bartender: "We don't serve your type here." ESP32: "That's fine, I'm NOMMU."`,
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function resolve(arg: string, cwd: string): string | null {
  if (arg === "" || arg === "~" || arg === "~/") return "~";
  if (arg === "..") return cwd === "~" ? "~" : "~";
  if (arg === "." ) return cwd;
  if (arg === "projects" && cwd === "~") return "~/projects";
  if (arg === "~/projects") return "~/projects";
  if (arg.startsWith("~/")) return FS[arg] ? arg : null;
  return null;
}

export default function LabConsole() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [cwd, setCwd] = useState("~");
  const [hist, setHist] = useState<string[]>([]);
  const [termFont, setTermFont] = useState<number>(13.6);
  const [live, setLive] = useState<{ repos: number; stars: number; langs: number; fresh: boolean } | null>(null);
  const [histIdx, setHistIdx] = useState(-1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, x: 0, y: 0 });
  const bodyRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const springRaf = useRef<number | null>(null);

  const cancelSpring = () => {
    if (springRaf.current !== null) { cancelAnimationFrame(springRaf.current); springRaf.current = null; }
  };

  // spring-physics scroll (slight overshoot, user-interruptible, instant under reduced motion)
  const springTo = (el: HTMLElement, target: number) => {
    cancelSpring();
    const max = el.scrollHeight - el.clientHeight;
    const dest = Math.max(0, Math.min(max, target));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.scrollTop = dest; return; }
    let pos = el.scrollTop;
    let vel = 0;
    let last = performance.now();
    const K = 95; // stiffness — low for a slow glide
    const C = 19;  // damping — near-calm settle, whisper of overshoot
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const force = (dest - pos) * K - vel * C;
      vel += force * dt;
      pos += vel * dt;
      if (Math.abs(dest - pos) < 0.5 && Math.abs(vel) < 6) {
        el.scrollTop = dest;
        springRaf.current = null;
        return;
      }
      el.scrollTop = pos;
      springRaf.current = requestAnimationFrame(step);
    };
    springRaf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (springRaf.current !== null) cancelAnimationFrame(springRaf.current);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setLines(BOOT); return; }
    let i = 0; setLines([]);
    const t = setInterval(() => { i++; setLines(BOOT.slice(0, i)); if (i >= BOOT.length) clearInterval(t); }, 460);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el && stick.current) springTo(el, el.scrollHeight);
  }, [lines]);

  const onScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    stick.current = nearBottom;
    setShowJump(!nearBottom);
  };
  const jumpLatest = () => {
    const el = bodyRef.current;
    if (!el) return;
    stick.current = true;
    setShowJump(false);
    springTo(el, el.scrollHeight);
    inputRef.current?.focus();
  };

  // hydrate persisted terminal prefs (client-only; SSR has no localStorage)
  useEffect(() => {
    try {
      const h = JSON.parse(storeGet("history", "pdev-term-history") || "[]");
      if (Array.isArray(h)) setHist(h.filter(x => typeof x === "string").slice(-100));
      const f = Number(storeGet("preferences", "pdev-term-font"));
      if (f >= 11 && f <= 18) setTermFont(f);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      const cached = JSON.parse(storeGet("cache", "pdev-gh-stats") || "null");
      if (cached && Date.now() - cached.at < 864e5) { setLive({ ...cached, fresh: false }); return; }
    } catch { /* ignore */ }
    fetch("https://api.github.com/users/pdev-labs/repos?per_page=100")
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((repos: { stargazers_count: number; language: string | null }[]) => {
        const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        const langs = new Set(repos.map(r => r.language).filter(Boolean)).size;
        const data = { repos: repos.length, stars, langs, at: Date.now() };
        storeSet("cache", "pdev-gh-stats", JSON.stringify(data));
        setLive({ ...data, fresh: true });
      })
      .catch(() => { /* static fallback stays */ });
  }, []);

  const run = useCallback((rawInput: string) => {
    const raw = rawInput.trim();
    const prompt = cwd === "~" ? "~" : cwd.replace("~/", "~/");
    const echo: Line = { html: `<span class="t-fn">pdev@lab</span><span class="t-cm">:</span><span class="t-kw">${esc(prompt)}</span><span class="t-cm">$</span> <span>${esc(raw) || ""}</span>` };
    if (!raw) { setLines(p => [...p, echo]); return; }
    setHist(h => {
      const next = [...h.slice(-99), raw];
      storeSet("history", "pdev-term-history", JSON.stringify(next));
      return next;
    }); setHistIdx(-1);

    const parts = raw.split(/\s+/);
    const c = parts[0].toLowerCase();
    const args = parts.slice(1);
    const arg = args.join(" ");
    let out: Out[] = [];
    let newCwd: string | null = null;

    switch (c) {
      case "help": out = [{ html: HELP }]; break;
      case "whoami": out = [{ html: `pdev-labs — 16, open-source systems developer · Linux · ESP32 · Python` }]; break;
      case "about": out = [{ html: `Student + maintainer. 21 public repos, docs-first, hardware-tested. India · remote worldwide.` }]; break;
      case "skills": out = [{ html: `Systems & OS (adv) · Embedded (int) · Python (adv) · Web (int) — full list in <span class="t-kw">#expertise</span>` }]; break;
      case "experience": out = [{ html: `Building since Jul 2026 · ESP32-S3 builder · Linux on Android — see <span class="t-kw">#experience</span>` }]; break;
      case "journey": out = [{ html: `Jun 2026 first repos → Jul systems streak → Sep embedded systems. Full story below.` }]; break;
      case "services": out = [{ html: `CLI tooling · PyPI packages · ESP32 prototypes — <span class="t-kw">hire</span> for details.` }]; break;
      case "hire": out = [{ html: `Open to collabs + internships. Fastest: <span class="t-fn">github.com/pdev-labs</span> (48h reply).`, open: "https://github.com/pdev-labs" }]; break;
      case "socials": case "contact":
        out = [{ html: `GitHub: <span class="t-fn">github.com/pdev-labs</span><br>Email: <span class="t-fn">pdev.labs@gmail.com</span><br>Instagram: <span class="t-fn">@pdev_labs</span>`, open: "https://github.com/pdev-labs" }]; break;
      case "email": case "mail":
        out = [{ html: `opening mail to <span class="t-fn">pdev.labs@gmail.com</span> …`, open: "mailto:pdev.labs@gmail.com" }]; break;
      case "instagram": case "ig":
        out = [{ html: `opening <span class="t-fn">instagram.com/pdev_labs</span> …`, open: "https://instagram.com/pdev_labs" }]; break;
      case "resume":
        out = [{ html: `Resume = this site + GitHub. Start: <span class="t-fn">github.com/pdev-labs?tab=repositories</span>`, open: "https://github.com/pdev-labs?tab=repositories" }]; break;
      case "projects": case "ls": {
        if (c === "projects") { out = [{ html: `★ Linux-For-Android · FluxMedia ★2 · NanoNAS-S3 · Polystream · StepSnap — <span class="t-cm">cd projects + ls, or "open linux"</span>` }]; break; }
        const target = args[0] ? resolve(args[0].replace(/\/$/, ""), cwd) : cwd;
        if (target === null || !FS[target]) { out = [{ html: `ls: no such directory: <span class="t-str">${esc(args[0])}</span>` }]; break; }
        const d = FS[target];
        out = [{ html: `${d.dirs.map(x => `<span class="t-fn">${x}/</span>`).join(" &nbsp; ")} ${Object.keys(d.files).join(" &nbsp; ") || "<span class='t-cm'>(empty)</span>"}` }];
        break;
      }
      case "pwd": out = [{ html: `/home/pdev${cwd === "~" ? "" : cwd.slice(1)}` }]; break;
      case "cd": {
        if (!args[0]) { newCwd = "~"; break; }
        const t = resolve(args[0].replace(/\/$/, ""), cwd);
        if (!t || !FS[t]) out = [{ html: `cd: no such directory: <span class="t-str">${esc(args[0])}</span>` }];
        else newCwd = t;
        break;
      }
      case "cat": {
        if (!args[0]) { out = [{ html: `usage: <span class="t-kw">cat &lt;file&gt;</span> — try <span class="t-kw">ls</span> first` }]; break; }
        const f = FS[cwd].files[args[0]] || (cwd === "~" ? FS["~/projects"].files[args[0]] : undefined);
        out = f ? [{ html: esc(f) }] : [{ html: `cat: <span class="t-str">${esc(args[0])}</span>: no such file. <span class="t-cm">ls to see files</span>` }];
        break;
      }
      case "open": {
        const map: Record<string, string> = {
          linux: "https://github.com/pdev-labs/Linux-For-Android", "linux-for-android": "https://github.com/pdev-labs/Linux-For-Android",
          flux: "https://github.com/pdev-labs/FluxMedia", fluxmedia: "https://github.com/pdev-labs/FluxMedia",
          nano: "https://github.com/pdev-labs/NanoNAS-S3", poly: "https://github.com/pdev-labs/polystream",
          step: "https://github.com/pdev-labs/StepSnap", github: "https://github.com/pdev-labs",
        };
        const key = Object.keys(map).find(k => arg.toLowerCase().includes(k)) || (arg === "" ? "github" : "");
        out = !key
          ? [{ html: `unknown project. try: <span class="t-kw">open linux</span> · <span class="t-kw">open flux</span> · <span class="t-kw">open nano</span>` }]
          : [{ html: `opening <span class="t-fn">${map[key]}</span> …`, open: map[key] }];
        break;
      }
      case "banner":
        out = [{ html: `<span class="t-kw">██████╗ ██████╗ ███████╗██╗   ██╗</span><br><span class="t-kw">██╔══██╗██╔══██╗██╔════╝██║   ██║</span><br><span class="t-kw">██████╔╝██║  ██║█████╗  ██║   ██║</span><br><span class="t-cm">systems over slides — github.com/pdev-labs</span>` }];
        break;
      case "neofetch":
        out = [{ html: `<span class="t-fn">pdev</span>@lab<br>OS: Termux + Arch btw<br>Board: ESP32-S3<br>Repos: 21 public<br>Uptime: since Jul 2026` }];
        break;
      case "stats":
        out = live
          ? [{ html: `repos <span class="t-fn">${live.repos}</span> · stars <span class="t-fn">${live.stars}</span> · langs <span class="t-fn">${live.langs}</span> <span class="t-cm">${live.fresh ? "· live from GitHub" : "· cached"}</span><br>top: Linux-For-Android ★3, FluxMedia ★2` }]
          : [{ html: `repos <span class="t-fn">21</span> · stars <span class="t-fn">6</span> · langs <span class="t-fn">5</span> <span class="t-cm">· offline fallback</span><br>top: Linux-For-Android ★3, FluxMedia ★2` }];
        break;
      case "theme": {
        const want = arg.toLowerCase();
        if (!want) {
          const cur = storedTheme();
          out = [{ html: `site theme: <span class="t-fn">${cur}</span> (shown: ${resolvedTheme(cur)}) — usage: <span class="t-kw">theme light|dark|system</span>` }];
        } else if (want === "light" || want === "dark" || want === "system") {
          applyTheme(want);
          out = [{ html: `site theme → <span class="t-fn">${want}</span>` }];
        } else {
          out = [{ html: `usage: <span class="t-kw">theme light|dark|system</span>` }];
        }
        break;
      }
      case "font": {
        const sub = arg.trim();
        let size = termFont;
        if (sub === "+") size = Math.min(18, +(termFont + 1).toFixed(1));
        else if (sub === "-") size = Math.max(11, +(termFont - 1).toFixed(1));
        else if (sub === "reset") size = 13.6;
        else { out = [{ html: `usage: <span class="t-kw">font +|-|reset</span> (now ${termFont}px)` }]; break; }
        setTermFont(size);
        storeSet("preferences", "pdev-term-font", String(size));
        out = [{ html: `terminal font → <span class="t-fn">${size}px</span>` }];
        break;
      }
      case "date": out = [{ html: esc(new Date().toString()) }]; break;
      case "echo": out = [{ html: esc(arg) }]; break;
      case "history": out = [{ html: hist.map((h, i) => `${i + 1} &nbsp; ${esc(h)}`).join("<br>") || "(empty)" }]; break;
      case "joke": out = [{ html: esc(JOKES[Math.floor(Math.random() * JOKES.length)]) }]; break;
      case "matrix": out = [{ html: `<span class="t-fn">wake up…</span> the Termux has you. <span class="t-cm">follow the white rabbit: "open linux"</span>` }]; break;
      case "vim": case "vi": case "nano": case "emacs":
        out = [{ html: `<span class="t-cm">no editors here — this terminal is house-trained. try "cat README.md"</span>` }]; break;
      case "rm":
        out = [{ html: `<span class="t-str">permission denied.</span> <span class="t-cm">nice try though.</span>` }]; break;
      case "sudo":
        out = [{ html: `<span class="t-str">nice try.</span> <span class="t-cm">this demo grants no root 😄</span>` }]; break;
      case "exit": case "quit": case "logout":
        out = [{ html: `<span class="t-cm">there is no escape. this tab is home now.</span>` }]; break;
      case "clear": setLines([]); return;
      case "hack":
        out = [{ html: `hacking… <span class="t-fn">100%</span> — just kidding. Real hacking = <span class="t-kw">open linux</span> + read the code.` }]; break;
      default:
        out = [{ html: `not found: <span class="t-str">${esc(c)}</span> — try <span class="t-kw">help</span>` }];
    }
    if (newCwd !== null) setCwd(newCwd);
    setLines(prev => [...prev, echo, ...out]);
    const link = out.find(o => o.open);
    if (link?.open) window.open(link.open, "_blank", "noreferrer");
  }, [cwd, hist, termFont, live]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const i = histIdx === -1 ? hist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i); setValue(hist[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const i = histIdx + 1;
      if (i >= hist.length) { setHistIdx(-1); setValue(""); } else { setHistIdx(i); setValue(hist[i]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [head, ...rest] = value.split(/\s+/);
      if (rest.length === 0) {
        const m = COMMANDS.filter(x => x.startsWith(head.toLowerCase()));
        if (m.length === 1) setValue(m[0] + " ");
        else if (m.length > 1) setLines(p => [...p, { html: m.map(esc).join(" &nbsp; ") }]);
      } else {
        const frag = rest[rest.length - 1];
        const pool = [...FS[cwd].dirs.map(d => d + "/"), ...Object.keys(FS[cwd].files)];
        const m = pool.filter(x => x.startsWith(frag));
        if (m.length === 1) setValue([head, ...rest.slice(0, -1), m[0]].join(" ") + " ");
        else if (m.length > 1) setLines(p => [...p, { html: m.map(esc).join(" &nbsp; ") }]);
      }
    }
  };

  const onBarDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onBarMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({
      x: Math.max(-320, Math.min(320, dragStart.current.x + e.clientX - dragStart.current.mx)),
      y: Math.max(-120, Math.min(320, dragStart.current.y + e.clientY - dragStart.current.my)),
    });
  };

  return (
    <div className="lab-float">
      <div className="lab lab-interactive" role="region"
        aria-label="Terminal. Drag by title bar, resize from corner. Type help."
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
        <div className="lab-bar lab-drag" onPointerDown={onBarDown} onPointerMove={onBarMove}
          onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} title="Drag to move">
          <i style={{ background: "#ff5f57" }} /><i style={{ background: "#febc2e" }} /><i style={{ background: "#28c840" }} />
          <span className="lab-title">pdev — {cwd}</span>
          <button type="button" className="lab-reset" onClick={() => setPos({ x: 0, y: 0 })} title="Reset position">reset</button>
        </div>
        <div ref={bodyRef} className="lab-body lab-scroll" onScroll={onScroll}
          onWheel={cancelSpring} onTouchMove={cancelSpring} style={{ fontSize: `${termFont}px` }} onClick={() => inputRef.current?.focus()} role="log" aria-live="polite" aria-label="Terminal output">
          
            {lines.map((l, i) => <div className="t-line" key={i} dangerouslySetInnerHTML={{ __html: l.html }} />)}
            <form className="t-input-row" onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }}>
              <span className="t-ps1" aria-hidden="true"><span className="t-fn">pdev@lab</span><span className="t-cm">:</span><span className="t-kw">{cwd}</span><span className="t-cm">$</span></span>
              <input ref={inputRef} className="t-input" style={{ fontSize: `${termFont}px` }} value={value} onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey} placeholder='help · ls · open linux' aria-label="Terminal command input"
                autoComplete="off" autoCapitalize="off" spellCheck={false} />
            </form>
        </div>
{showJump && <button type="button" className="lab-jump" onClick={jumpLatest}>↓ latest</button>}
        <div className="lab-foot"><span>utf-8 · lab 2.0 · help, projects, neofetch</span><span>● live</span></div>
        <span className="lab-resize" aria-hidden="true" />
      </div>
    </div>
  );
}
