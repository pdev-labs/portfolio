"use client";
import { useRef, useState, type ReactNode } from "react";

/** Copy button for markdown-rendered code blocks. Reads text from the DOM. */
export default function AutoCodeBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="doc-codewrap">
      <pre ref={ref} className="doc-code">{children}</pre>
      <button type="button" className="doc-copy" onClick={copy}
        aria-label={copied ? "Code copied" : "Copy code to clipboard"}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
