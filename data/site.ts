export const PROFILE = {
  name: "pdev-labs",
  displayName: "Pdev",
  role: "Open-source systems developer",
  tagline: "Reliable OS tools, firmware, and Python utilities — documented, tested, maintained.",
  bio: "16-year-old student and open-source maintainer. I build practical systems software: Linux on Android, ESP32 firmware, LAN media tools, and pdev — a Hinglish programming language for first-time coders. My focus is small, dependable tools with clear docs and real users.",
  github: "https://github.com/pdev-labs",
  email: "pdev.labs@gmail.com",
  instagram: "https://instagram.com/pdev_labs",
  instagramHandle: "@pdev_labs",
  location: "India · remote worldwide",
  availability: "Available for collaborations and internships",
  responseTime: "Usually replies within 48 hours via GitHub",
};

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  language: string;
  stars: number;
  url: string;
  tags: string[];
  year: string;
  status: string;
  outcome: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "linux-for-android",
    title: "Linux-For-Android",
    blurb: "One-command installer and manager for Ubuntu, Debian, Arch, Fedora, and Void on Android via Termux — with VirGL 3D acceleration, SSH access, portable exports, and a dynamic boot manager.",
    language: "Shell",
    stars: 3,
    url: "https://github.com/pdev-labs/Linux-For-Android",
    tags: ["Linux", "Termux", "Automation"],
    year: "2026",
    status: "Actively maintained",
    outcome: "6 distros · VirGL + SSH · portable backups",
    featured: true,
  },
  {
    slug: "pdev-lang",
    title: "pdev — Hinglish programming language",
    blurb: "A gentle first language in Python. Write likho(\"namaste\"), run, learn. Hindi-English keywords, instant feedback, and worked examples for classrooms.",
    language: "Python",
    stars: 0,
    url: "https://github.com/pdev-labs/pdev",
    tags: ["Language design", "Education", "Python"],
    year: "2026",
    status: "Maintained",
    outcome: "Classroom-ready examples · GPLv3",
    featured: true,
  },
  {
    slug: "fluxmedia",
    title: "FluxMedia",
    blurb: "Published PyPI package with a LAN QR-share portal and rich media player. Share and play across devices on the same network with zero configuration.",
    language: "Python",
    stars: 2,
    url: "https://github.com/pdev-labs/FluxMedia",
    tags: ["PyPI", "Networking", "Media"],
    year: "2026",
    status: "Maintained",
    outcome: "PyPI published · QR LAN sharing",
    featured: true,
  },
  {
    slug: "nanonas-s3",
    title: "NanoNAS-S3",
    blurb: "High-performance NAS firmware for ESP32-S3 with a clean Material UI, background chunked copying, and fast SDMMC throughput.",
    language: "C++",
    stars: 0,
    url: "https://github.com/pdev-labs/NanoNAS-S3",
    tags: ["ESP32", "Embedded", "Storage"],
    year: "2026",
    status: "In development",
    outcome: "Chunked copy · Material UI",
  },
  {
    slug: "linux-on-esp32",
    title: "linux-on-esp32",
    blurb: "Ultra-lightweight NOMMU Linux environment for ESP32-S3 with built-in Wi-Fi and I2C support. Research-grade systems experiment.",
    language: "C",
    stars: 0,
    url: "https://github.com/pdev-labs/linux-on-esp32",
    tags: ["ESP32", "Linux", "Systems"],
    year: "2026",
    status: "Research",
    outcome: "NOMMU · Wi-Fi + I2C",
  },
  {
    slug: "polystream",
    title: "Polystream",
    blurb: "Browser extension for Firefox and Chrome that enables reliable multi-tab video workflows and removes single-stream lockouts.",
    language: "JavaScript",
    stars: 0,
    url: "https://github.com/pdev-labs/polystream",
    tags: ["Extensions", "Web"],
    year: "2026",
    status: "Maintained",
    outcome: "Firefox + Chrome",
  },
  {
    slug: "stepsnap",
    title: "StepSnap",
    blurb: "Background screenshot recorder for Linux (X11 and Wayland) that captures throttled screenshots on click and keypress — built for tutorials and PR documentation.",
    language: "Python",
    stars: 0,
    url: "https://github.com/pdev-labs/StepSnap",
    tags: ["Linux", "Tooling"],
    year: "2026",
    status: "Maintained",
    outcome: "X11 + Wayland",
  },
  {
    slug: "controller",
    title: "Controller — phone as gamepad",
    blurb: "Cross-platform app turning an Android phone into a gamepad or trackpad over Wi-Fi, with multiplayer support and PIN authentication.",
    language: "Python",
    stars: 0,
    url: "https://github.com/pdev-labs/controller",
    tags: ["Networking", "Input", "Cross-platform"],
    year: "2026",
    status: "Stable",
    outcome: "Win / macOS / Linux · multiplayer",
  },
];

export const SKILLS = [
  { group: "Systems & OS", level: "Advanced", meter: 4, icon: "terminal", filter: "Linux", proof: { label: "Linux-For-Android ★3", url: "https://github.com/pdev-labs/Linux-For-Android" }, items: ["Linux administration", "Termux & proot", "Shell automation", "SSH & VirGL", "Boot managers"], },
  { group: "Embedded", level: "Intermediate", meter: 3, icon: "chip", filter: "ESP32", proof: { label: "NanoNAS-S3", url: "https://github.com/pdev-labs/NanoNAS-S3" }, items: ["ESP32-S3", "C / C++", "I2C · Wi-Fi · SDMMC", "NAS architecture", "Power-aware design"], },
  { group: "Python", level: "Advanced", meter: 4, icon: "python", filter: "Python", proof: { label: "FluxMedia on PyPI ★2", url: "https://github.com/pdev-labs/FluxMedia" }, items: ["CLI design", "PyPI packaging", "Automation & scraping", "Testing & docs", "LAN networking"], },
  { group: "Web", level: "Intermediate", meter: 3, icon: "globe", filter: "JavaScript", proof: { label: "Polystream", url: "https://github.com/pdev-labs/polystream" }, items: ["JavaScript & Node.js", "Extensions (MV3)", "Puppeteer & Selenium", "Next.js & Astro", "REST basics"], },
];

export const EXPERIENCE = [
  {
    role: "Independent open-source developer",
    org: "pdev-labs · GitHub since Jul 2026",
    period: "Jul 2026 — Present",
    points: ["21 public repositories in about 3 months, each with a README and reproducible setup.", "Flagship Linux-For-Android (most-starred, ★3): multi-distro installer with VirGL 3D, SSH, portable exports — still actively pushed.", "FluxMedia (★2): PyPI package with LAN QR sharing; facebook-media-extractor (★1)."],
  },
  {
    role: "Systems & automation tools",
    org: "Termux · CI · desktop utilities",
    period: "Jul — Aug 2026",
    points: ["Linux-on-Android track: ubuntu-for-termux, Arch installer configs, dynamic boot manager work.", "Actions RDP lab: GUI desktops inside GitHub Actions runners for app testing across Linux, Windows, macOS.", "Controller (phone as gamepad/trackpad over Wi-Fi, active through Sep) plus media utilities later folded into FluxMedia."],
  },
  {
    role: "Embedded & language design",
    org: "ESP32-S3 · education",
    period: "Sep 2026",
    points: ["ESP32-S3 streak: NanoNAS-S3 firmware (C++), NOMMU Linux experiment, Needle tooling, Lazy-ESP32 helpers, StepSnap.", "Designed pdev (.pl), a Hinglish programming language in Python (GPLv3) for first-time coders.", "Shipped Polystream, a multi-tab video extension for Firefox and Chrome (latest push)."],
  },
];

export const SERVICES = [
  { title: "Open-source tooling", text: "Small CLI tools, installers, and automation with docs your team can actually run.", },
  { title: "Python packages & scripts", text: "PyPI-ready packages, scrapers, and LAN utilities — tested and versioned.", },
  { title: "Embedded prototypes", text: "ESP32-S3 firmware experiments, NAS concepts, and hardware bring-up notes.", },
];

export const PROCESS = [
  { title: "Scope clearly", text: "One problem, one README, acceptance steps agreed up front." },
  { title: "Build & document", text: "Working code plus setup guide, tested on a clean machine." },
  { title: "Test & hand over", text: "Repro steps, known limits, and maintenance notes — no black boxes." },
];

export const JOURNEY = [
  { year: "Sep 2026", title: "Embedded + language", text: "ESP32-S3 systems (NanoNAS, NOMMU Linux), pdev Hinglish language, Polystream extension, StepSnap." },
  { year: "Jul 2026", title: "Systems streak", text: "Account opened Jul 7. Python media tools → Linux-For-Android (★3), Termux distros, RDP lab, controller." },
  { year: "Jun 2026", title: "First repos", text: "Started with FluxMedia (Python, ★2) — LAN sharing and media playback that later hit PyPI." },
];