import type { ReactNode } from "react";

export type DocSection = { id: string; title: string; body: ReactNode };

/* A policy page: the usual page hero, a contents list, then the sections. */
export function LegalDoc({ pill, title, lead, mark, sub, updated, sections, foot }: {
  pill: string;
  title: string;
  lead: string;
  mark: string;
  sub: string;
  updated: string;
  sections: DocSection[];
  foot?: ReactNode;
}) {
  return (
    <>
      <section className="hero phero" id="top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">{pill}</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Updated {updated}</span></p>
              <h1 className="h1" id="hero-h">{lead} <span className="hl">{mark}<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">{sub}</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Last updated</span><b>{updated}</b></li>
              <li><span>Applies to</span><b>Website and app</b></li>
              <li><span>Questions</span><b>support@divergentclasses.com</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-label={title}>
        <div className="wrap">
          <article className="doc">
            <nav className="doc-toc" aria-label="Contents">
              <p>Contents</p>
              <ol>
                {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
              </ol>
            </nav>
            {sections.map((s, i) => (
              <section className="doc-s" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{i + 1}. {s.title}</h2>
                {s.body}
              </section>
            ))}
            {foot ? <div className="doc-foot">{foot}</div> : null}
          </article>
        </div>
      </section>
    </>
  );
}
