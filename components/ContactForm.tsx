"use client";
import { useEffect, useState } from "react";
import { toast } from "./Toast";

const TO = "pdev.labs@gmail.com";
const COOLDOWN_MS = 120_000;
const TS_KEY = "pdev-contact-ts";

function lastSent(): number {
  try { return Number(localStorage.getItem(TS_KEY)) || 0; } catch { return 0; }
}

type Errs = { name?: string; email?: string; message?: string };

export default function ContactForm() {
  const [errs, setErrs] = useState<Errs>({});
  const [sent, setSent] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    const left = COOLDOWN_MS - (Date.now() - lastSent());
    if (left > 0) setWait(Math.ceil(left / 1000));
  }, []);

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait(w => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const next: Errs = {};
    if (name.length < 2) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email doesn\u2019t look right.";
    if (message.length < 10) next.message = "Add a little detail (10+ characters).";
    if (wait > 0) {
      toast(`Slow down — one message every 2 minutes (${wait}s left)`);
      return;
    }
    setErrs(next);
    if (Object.keys(next).length > 0) {
      toast("Fix the highlighted fields");
      return;
    }
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n\u2014 ${name} (${email})`);
    try { localStorage.setItem(TS_KEY, String(Date.now())); } catch { /* ignore */ }
    setWait(120);
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    setSent(true);
    toast("Opening your email app — press Send");
    e.currentTarget.reset();
  };

  const field = (label: string, name: keyof Errs, node: React.ReactNode) => (
    <label>
      {label}
      {node}
      {errs[name] && <span className="field-err" role="alert">{errs[name]}</span>}
    </label>
  );

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {field("Your name", "name",
        <input name="name" autoComplete="name" placeholder="Aarav Sharma" aria-invalid={!!errs.name} />)}
      {field("Email", "email",
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errs.email} />)}
      {field("Project details", "message",
        <textarea name="message" rows={4} placeholder="What do you want to build, on which device, by when?" aria-invalid={!!errs.message} />)}
      <button className="btn btn-light" type="submit" disabled={wait > 0}>
        {wait > 0 ? `Wait ${wait}s to resend` : "Send to pdev.labs@gmail.com"}
      </button>
      {sent && <p className="form-ok" role="status">Draft opened in your mail app — nothing is stored here.</p>}
      <p className="form-note">Delivered through your email app · prefer GitHub? <a href="https://github.com/pdev-labs" target="_blank" rel="noreferrer">open a discussion</a></p>
    </form>
  );
}
