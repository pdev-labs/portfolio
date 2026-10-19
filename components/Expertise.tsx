"use client";
import { SKILLS } from "../data/site";
import { SKILL_ICONS } from "./skillIcons";
import { useWorkFilter } from "./workFilter";

export default function Expertise() {
  const active = useWorkFilter();

  return (
    <div className="wrap">
      <div className="sec-head reveal">
        <div>
          <p className="sec-label">Expertise</p>
          <h2>Depth where it counts.</h2>
          <p>Four areas I can contribute to on day one — pick a row to filter the work below.</p>
        </div>
      </div>

      <div className="exp-table reveal" role="table" aria-label="Skill areas">
        <div className="exp-tr exp-th" role="row">
          <span role="columnheader">area</span>
          <span role="columnheader">level</span>
          <span role="columnheader">focus</span>
          <span role="columnheader">in action</span>
        </div>

        {SKILLS.map((s) => (
          <div
            className={`exp-tr${active === s.filter ? " is-active" : ""}`}
            role="row"
            key={s.group}
          >
            <div className="exp-td exp-area" role="cell">
              <span className={`exp-tile exp-tile-${s.icon}`} aria-hidden="true">{SKILL_ICONS[s.icon]}</span>
              <span className="exp-name">{s.group}</span>
            </div>

            <div className="exp-td exp-metric" role="cell">
              <span className="level">{s.level}</span>
              <span className="meter" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= s.meter ? "on" : undefined} />)}
              </span>
              <span className="sr-only">{s.level} — {s.meter} of 5</span>
            </div>

            <div className="exp-td exp-focus" role="cell">
              {s.items.map(i => <span className="exp-tag" key={i}>{i}</span>)}
            </div>

            <div className="exp-td exp-proof" role="cell">
              <a href={s.proof.url} target="_blank" rel="noreferrer">{s.proof.label} ↗</a>
              <a className="exp-filter" href="#work" data-filter={s.filter}>filter work ↓</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
