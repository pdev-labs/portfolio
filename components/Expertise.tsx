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
          <p>Four areas I can contribute to on day one — pick one to filter the work below.</p>
        </div>
      </div>
      <div className="exp-grid">
        {SKILLS.map(s => (
          <article className={`exp-card reveal${active === s.filter ? " exp-active" : ""}`} key={s.group}>
            <div className="exp-head">
              <span className={`exp-icon exp-icon-${s.icon}`} aria-hidden="true">{SKILL_ICONS[s.icon]}</span>
              <div>
                <h3>{s.group}</h3>
                <p className="exp-meter" role="img" aria-label={`${s.level}: ${s.meter} of 5`}>
                  <span className="level">{s.level}</span>
                  <span className="meter" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= s.meter ? "on" : undefined} />)}
                  </span>
                </p>
              </div>
            </div>
            <ul>{s.items.map(i => <li key={i}>{i}</li>)}</ul>
            <div className="exp-foot">
              <a href={s.proof.url} target="_blank" rel="noreferrer">In action: {s.proof.label} ↗</a>
              <a href="#work" data-filter={s.filter} aria-label={`Filter work by ${s.filter}`}>Work ↓</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
