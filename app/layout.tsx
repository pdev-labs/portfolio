import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import { FAQS } from "../components/Faq";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });
const pixel = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-pixel", display: "swap" });

const SITE_URL = "https://www.pdevlabs.me";

export const metadata: Metadata = {
  title: "pdev-labs — systems software, built to last",
  description: "16-year-old student building Linux-on-Android tools, ESP32 firmware and Python utilities. 21 public repos, all open source.",
  keywords: ["pdev-labs", "portfolio", "Linux on Android", "ESP32", "Python"],
  authors: [{ name: "pdev-labs", url: "https://github.com/pdev-labs" }],
  creator: "pdev-labs",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "pdev-labs — builds OS tools, firmware & Python utilities",
    description: "Linux-For-Android · Lazy-ESP32 · FluxMedia · ESP32 systems",
    type: "website",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "pdev-labs", description: "Systems builder, 16. OS tools, firmware, Python." },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = { themeColor: "#0e1011", width: "device-width", initialScale: 1 };

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "pdev-labs",
      url: SITE_URL,
      jobTitle: "Open-source systems developer",
      sameAs: ["https://github.com/pdev-labs", "https://instagram.com/pdev_labs"],
      knowsAbout: ["Linux", "ESP32", "Python", "Shell scripting", "Browser extensions"],
    },
    {
      "@type": "WebSite",
      name: "pdev-labs portfolio",
      url: SITE_URL,
      author: { "@type": "Person", name: "pdev-labs" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${mono.variable} ${pixel.variable}`} style={{ colorScheme: "dark" }}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <noscript><style>{".reveal{opacity:1 !important;transform:none !important;filter:none !important}"}</style></noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.classList.add("motion-on");try{if(!sessionStorage.getItem("pdev-intro")){document.documentElement.classList.add("pre-show");sessionStorage.setItem("pdev-intro","1");}}catch(e){}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
