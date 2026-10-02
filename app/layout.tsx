import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FAQS } from "../components/Faq";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });

const SITE_URL = "https://www.pdevlabs.jo3.org";

export const metadata: Metadata = {
  title: "pdev-labs — Systems builder, 16",
  description: "16-year-old student building Linux-on-Android tools, ESP32 systems, and Python utilities. 21 public repos.",
  keywords: ["pdev-labs", "portfolio", "Linux on Android", "ESP32", "Python"],
  authors: [{ name: "pdev-labs", url: "https://github.com/pdev-labs" }],
  creator: "pdev-labs",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "pdev-labs — builds OS tools, firmware & Python utilities",
    description: "Linux-For-Android · FluxMedia · ESP32 systems",
    type: "website",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "pdev-labs", description: "Systems builder, 16. OS tools, firmware, Python." },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = { themeColor: "#3B2DFF", width: "device-width", initialScale: 1 };

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
    <html lang="en" className={`${display.variable} ${body.variable} ${code.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <noscript><style>{".reveal{opacity:1 !important;transform:none !important}"}</style></noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c={};try{c=JSON.parse(localStorage.getItem("pdev-consent")||"{}")}catch(e){};var ok=c&&c.decided&&c.preferences;var t=ok?(localStorage.getItem("pdev-theme")||"system"):"system";var d=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
