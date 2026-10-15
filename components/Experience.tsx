"use client";
import { useState } from "react";
import type { MonthEntry, Overview } from "../lib/experience";

const VISIBLE_MONTHS = 3;

function Points({ points }: { points: MonthEntry["points"] }) {
  return (
    <ul>
      {points.map((pt, i) => (
        <li key={i}>
          {pt.url ? (
            <><a href={pt.url} target="_blank" rel="noreferrer">{pt.name}</a> — {pt.text}</>
          ) : (
            pt.name ? <><strong>{pt.name}</strong> — {pt.text}</> : pt.text
          )}
        </li>
      ))}
    </ul>
  );
}

/** Live overview plus auto-generated monthly entries with show more. */
export default function Experience({ overview, months }: { overview: Overview; months: MonthEntry[] }) {
  const [open, setOpen] = useState(false);
  const shown = open ? months : months.slice(0, VISIBLE_MONTHS);
  const hidden = months.length - shown.length;

  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Experience</p>
          <h2>Self-directed, but structured.</h2>
        </div>
      </div>
      <div className="timeline">
        <article className="t-item reveal">
          <div className="t-period">{overview.period}</div>
          <div>
            <h3>{overview.role}</h3>
            <p className="muted">{overview.org}</p>
            <ul>{overview.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
          </div>
        </article>
        {shown.map((m, i) => (
          <article className="t-item work-anim" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} key={m.period + m.role}>
            <div className="t-period">{m.period}</div>
            <div>
              <h3>{m.role}</h3>
              <p className="muted">{m.org}</p>
              <Points points={m.points} />
            </div>
          </article>
        ))}
      </div>
      {hidden > 0 && (
        <div className="exp-more">
          <button type="button" className="link-btn" onClick={() => setOpen(true)}
            aria-expanded={open}>
            Show more ({hidden} more)
          </button>
        </div>
      )}
      {open && months.length > VISIBLE_MONTHS && (
        <div className="exp-more">
          <button type="button" className="link-btn" onClick={() => setOpen(false)}>
            Show less
          </button>
        </div>
      )}
    </div>
  );
}
