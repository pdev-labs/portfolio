"use client";
import { useState } from "react";

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
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
      <pre className="doc-code"><code>{code}</code></pre>
      <button type="button" className="doc-copy" onClick={copy}
        aria-label={copied ? "Code copied" : "Copy code to clipboard"}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
