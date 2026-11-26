"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  BANDS, CATEGORIES, CLOSING_FROM, EXAMS, METER_MAX, NIFT_COURSES, PREDICTOR_SAMPLE, predict,
  type Category, type Course, type Match, type PredictorExam,
} from "@/lib/predictor";

/* The college predictor: the form sits on the blue hero (the page passes the
   hero's words in as `intro`), and the results open in a light section under
   it. The results appear on the first "Show my colleges" and then follow
   every change to the form, so trying another rank or category is instant.
   The closing ranks and the band rules are in lib/predictor. */

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Where each exam's results lead: the course for that exam. */
const NEXT: Record<PredictorExam, { href: string; label: string }> = {
  UCEED: { href: "/uceed/", label: "See the UCEED course" },
  NID: { href: "/nid-masterclass/", label: "Join the NID Masterclass" },
  NIFT: { href: "/nift-interest/", label: "Get NIFT 2027 early access" },
};

/* The meter's colour zones and the closing rank mark, as shares of the bar,
   from the same band limits the prediction uses. */
const pct = (ratio: number) => `${((ratio / METER_MAX) * 100).toFixed(2)}%`;
const ZONES = {
  "--z1": pct(BANDS[0].max),
  "--z2": pct(BANDS[1].max),
  "--t": pct(1),
} as CSSProperties;

export function CollegePredictor({ intro }: { intro: ReactNode }) {
  const uid = useId();
  const [exam, setExam] = useState<PredictorExam>("UCEED");
  const [category, setCategory] = useState<Category>("GEN");
  const [course, setCourse] = useState<Course>("B.Des");
  const [rankText, setRankText] = useState("");
  const [shown, setShown] = useState(false);
  const [error, setError] = useState("");
  const [jump, setJump] = useState(0);
  const rankRef = useRef<HTMLInputElement>(null);
  const resRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  const rank = Number(rankText);
  const valid = rankText !== "" && Number.isInteger(rank) && rank >= 1;
  const result = useMemo(() => (valid ? predict(exam, category, rank, course) : null), [valid, exam, category, rank, course]);
  const catLabel = CATEGORIES.find((c) => c.key === category)?.label ?? category;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError("Type your rank first, like 412.");
      rankRef.current?.focus();
      return;
    }
    setError("");
    setShown(true);
    setJump((n) => n + 1);
  }

  /* After a submit, bring the results up and put focus on their heading,
     once React has drawn them. */
  useEffect(() => {
    if (!jump) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    headRef.current?.focus({ preventScroll: true });
  }, [jump]);

  const counts = result ? BANDS.map((b) => result.bands[b.key].length) : [0, 0, 0];
  const none = counts.every((n) => n === 0);

  return (
    <>
      <section className="hero phero hero--split am-hero cp-hero" id="top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap hero-grid">
              <div className="hero-copy">{intro}</div>
              <div className="hero-media">
                <form className="cp-card" id="cp-form" onSubmit={submit} noValidate aria-label="College predictor">
                  {PREDICTOR_SAMPLE ? <p className="cp-flag">Preview with sample ranks</p> : null}

                  <fieldset className="cp-f">
                    <legend className="cp-lab">Exam</legend>
                    <div className="cp-seg">
                      {EXAMS.map((x) => (
                        <label key={x}>
                          <input type="radio" name={`${uid}-exam`} value={x} checked={exam === x} onChange={() => setExam(x)} />
                          <span>{x}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className={"cp-f" + (error ? " err" : "")}>
                    <label className="cp-lab" htmlFor={`${uid}-rank`}>Your category rank</label>
                    <div className="cp-rank">
                      <span aria-hidden="true">#</span>
                      <input
                        ref={rankRef}
                        id={`${uid}-rank`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        enterKeyHint="go"
                        placeholder="412"
                        value={rankText}
                        maxLength={6}
                        onChange={(e) => {
                          setRankText(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 6));
                          if (error) setError("");
                        }}
                        aria-invalid={!!error}
                        aria-describedby={`${uid}-rank-h`}
                      />
                    </div>
                    {error
                      ? <p className="cp-err" id={`${uid}-rank-h`} role="alert">{error}</p>
                      : <p className="cp-hint" id={`${uid}-rank-h`}>General category? Use your AIR.</p>}
                  </div>

                  <fieldset className="cp-f">
                    <legend className="cp-lab">Category</legend>
                    <div className="cp-chips">
                      {CATEGORIES.map((c) => (
                        <label key={c.key}>
                          <input type="radio" name={`${uid}-cat`} value={c.key} checked={category === c.key} onChange={() => setCategory(c.key)} />
                          <span>{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {exam === "NIFT" ? (
                    <fieldset className="cp-f">
                      <legend className="cp-lab">Course</legend>
                      <div className="cp-chips cp-chips--2">
                        {NIFT_COURSES.map((c) => (
                          <label key={c}>
                            <input type="radio" name={`${uid}-course`} value={c} checked={course === c} onChange={() => setCourse(c)} />
                            <span>{c}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}

                  <button className="btn btn--block" type="submit">Show my colleges <Arrow /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {shown && result ? (
        <section className="section cp-res" ref={resRef} aria-labelledby={`${uid}-res-h`} style={ZONES}>
          <div className="wrap">
            {PREDICTOR_SAMPLE ? (
              <p className="cp-banner" role="note">
                <b>Sample ranks.</b> These closing ranks are placeholders for a preview, not real cutoffs.
              </p>
            ) : null}

            <div className="cp-res-head">
              <div>
                <p className="eyebrow-l">Your colleges</p>
                <h2 className="h2" id={`${uid}-res-h`} ref={headRef} tabIndex={-1}>Where #{fmt(rank)} can take you</h2>
                <ul className="cp-tags" aria-label="Your details">
                  <li>{exam}</li>
                  <li>{catLabel}</li>
                  {exam === "NIFT" ? <li>{course}</li> : null}
                </ul>
              </div>
              <a className="cp-edit" href="#cp-form">Change details</a>
            </div>

            <ul className="cp-sum">
              {BANDS.map((b, i) => (
                <li key={b.key} data-band={b.key}>
                  {counts[i] ? (
                    <a href={`#cp-${b.key}`}><b>{counts[i]}</b><em>{b.label}</em></a>
                  ) : (
                    <span className="cp-sum-0"><b>0</b><em>{b.label}</em></span>
                  )}
                </li>
              ))}
            </ul>
            <p className="sr-only" aria-live="polite">
              {none
                ? "No colleges in reach on this rank."
                : `${counts[0]} likely, ${counts[1]} borderline and ${counts[2]} reach.`}
            </p>

            {BANDS.map((b) => {
              const list = result.bands[b.key];
              if (!list.length) return null;
              return (
                <div className="cp-band" key={b.key} id={`cp-${b.key}`} data-band={b.key}>
                  <div className="cp-band-h">
                    <h3><i aria-hidden="true"></i>{b.label}</h3>
                    <p>{b.line}</p>
                  </div>
                  <ul className="cp-grid">
                    {list.map((m, i) => <SeatCard key={m.seat.id} m={m} rank={rank} i={i} />)}
                  </ul>
                </div>
              );
            })}

            {none ? (
              <div className="cp-none">
                <h3>None in reach on this rank yet.</h3>
                <p>Ranks move fast with the right practice. A full mock shows where you stand today.</p>
              </div>
            ) : null}

            {result.beyond ? (
              <p className="cp-beyond">
                {result.beyond} more {result.beyond === 1 ? "college is" : "colleges are"} out of reach on this rank.
              </p>
            ) : null}

            <div className="cp-cta">
              <div>
                <h3>Turn a guess into a real rank.</h3>
                <p>AIDMT is a full mock with an All India Rank.</p>
              </div>
              <div className="cp-cta-acts">
                <a className="btn" href="/aidmt/">Take AIDMT <Arrow /></a>
                <a className="btn btn--light" href={NEXT[exam].href}>{NEXT[exam].label} <Arrow /></a>
              </div>
            </div>

            <p className="fine cp-src">
              From {CLOSING_FROM.year} {CLOSING_FROM.round} closing ranks{PREDICTOR_SAMPLE ? " (sample numbers for now)" : ""}. A guide, not a promise.
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}

/* One college: its photo, name and a meter. The meter's bar runs from rank 1
   to METER_MAX times the closing rank, tinted by band; the line is the
   closing rank and the dot is you, so a dot left of the line is inside last
   year's cut. */
function SeatCard({ m, rank, i }: { m: Match; rank: number; i: number }) {
  const gap = m.closing - rank;
  const style = { "--i": i, "--w": pct(Math.min(m.ratio, METER_MAX)) } as CSSProperties;
  return (
    <li className="cp-seat" data-band={m.band} style={style}>
      <img src={`/assets/img/campus/${m.seat.photo}.webp`} alt="" width="152" height="128" loading="lazy" decoding="async" />
      <div className="cp-seat-b">
        <h4>{m.seat.college}</h4>
        <p>{m.seat.place} · {m.seat.course}</p>
      </div>
      <div className="cp-meter" role="img" aria-label={`Your rank ${fmt(rank)}, closing rank ${fmt(m.closing)}`}>
        <span className="cp-meter-cut" data-k={`cutoff #${fmt(m.closing)}`}></span>
        <span className="cp-meter-you"></span>
      </div>
      <p className="cp-gap">
        {gap >= 0 ? <><b>{fmt(gap)}</b> {gap === 1 ? "rank" : "ranks"} to spare</> : <><b>{fmt(-gap)}</b> {gap === -1 ? "rank" : "ranks"} past the cutoff</>}
      </p>
    </li>
  );
}
