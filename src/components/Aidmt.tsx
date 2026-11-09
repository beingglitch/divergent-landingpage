"use client";

/* The AIDMT bits that change with the date: the home page strip, the
   registration line, the closing call to action and the schedule on
   /aidmt/. They render first with the build time (so the static HTML and
   the first client render match), then switch to the visitor's clock.
   ?preview-date=2026-11-16 (or 2026-11-16T10:00) shows another day, the
   same switch the home page uses. Dates and copy come from lib/config.ts. */
import { useSyncExternalStore } from "react";
import { AIDMT, AIDMT_SERIES, aidmtDays, aidmtState, aidmtTime, ist, nextAidmt, type AidmtSitting, type AidmtState } from "@/lib/config";

const MINUTE = 60_000;

function clientNow(): number {
  const m = /[?&]preview-date=(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?/.exec(location.search);
  const t = m ? ist(m[1] + (m[2] ? m[2] + ":00" : "T12:00:00")).getTime() : Date.now();
  return Math.floor(t / MINUTE) * MINUTE;
}
function subscribe(tick: () => void) {
  const id = window.setInterval(tick, 30_000);
  return () => window.clearInterval(id);
}
function useNow(builtAt: number): Date {
  return new Date(useSyncExternalStore(subscribe, clientNow, () => builtAt));
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const label = (s: AidmtSitting) => (s.exam ? `${s.name} (${s.exam})` : s.name);
const days = (s: AidmtSitting) => aidmtDays(s.opens, s.closes);

/* The home page pointer to /aidmt/, under the exam countdowns. It names the
   next sitting by date and goes once the last AIDMT date has passed. */
export function AidmtStrip({ builtAt }: { builtAt: number }) {
  const t = useNow(builtAt);
  if (t > ist(AIDMT.ends)) return null;
  const s = nextAidmt(t);
  const ranked = nextAidmt(t, true);
  let badge = `New · ${rupees(AIDMT.fee)}`, head: string, sub: string;
  if (!s) {
    head = "AIDMT 2027: solutions and results are on the way.";
    sub = "See every date on the AIDMT page.";
  } else if (s.free) {
    badge = "Free";
    head = t >= ist(s.opens) ? `The free AIDMT sectional is open till ${aidmtDays(s.closes)}.` : `Test yourself first: free AIDMT sectional, ${aidmtDays(s.opens, s.closes)}.`;
    sub = `${s.detail}.` + (ranked ? ` Then ${label(ranked)}, ${days(ranked)}.` : "");
  } else {
    head = t >= ist(s.opens) ? `${label(s)} is on now, till ${aidmtDays(s.closes)}.` : `Test yourself first: ${label(s)}, ${days(s)}.`;
    /* A mock just closed: say when its results are out. */
    const done = AIDMT_SERIES.find((x) => x.results && aidmtState(x, t) === "after");
    sub = `${s.detail}.` + (done?.results ? ` ${done.name} results on ${aidmtDays(done.results)}.` : s.perk ? ` ${s.perk}` : " Four national mocks in all.");
  }
  return (
    <a className="aidmt-strip rv" href="/aidmt/">
      <span className="badge">{badge}</span>
      <span><b>{head}</b><span className="s">{sub}</span></span>
      <span className="btn btn--sm">See all dates <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></span>
    </a>
  );
}

/* "Registration for AIDMT 1 closes 17 Nov, 11:59 pm": the next ranked mock still taking registrations. */
export function AidmtRegLine({ builtAt, off }: { builtAt: number; off: number }) {
  const t = useNow(builtAt);
  const s = nextAidmt(t, true);
  if (!s) return null;
  return (
    <p className="aidmt-close"><svg width="18" height="18" aria-hidden="true"><use href="#clock" /></svg>Registration for {s.name} closes {aidmtDays(s.closes)}, {aidmtTime(s.closes)} · {off}% off</p>
  );
}

/* The closing heading on /aidmt/: what is coming up next. */
export function AidmtCtaHead({ builtAt }: { builtAt: number }) {
  const t = useNow(builtAt);
  const s = nextAidmt(t, true);
  if (!s) return <>AIDMT 2027 is over. Watch this space for the next one.</>;
  return t >= ist(s.opens)
    ? <>{label(s)} is on now, till {aidmtDays(s.closes)}. Register now.</>
    : <>{label(s)} runs {days(s)}. Register now.</>;
}

const STATUS: Record<AidmtState, string> = { done: "Done", after: "Results next", live: "On now", next: "Next", later: "" };

function status(s: AidmtSitting, state: AidmtState, t: Date): string {
  if (state === "after" && s.solutions && t >= ist(s.solutions.from) && t <= ist(s.solutions.to)) return "Solutions now";
  if (state === "after" && s.solutions && t < ist(s.solutions.from)) return "Solutions next";
  return STATUS[state];
}

/* "15 Nov, 9 am to 17 Nov, 11:59 pm", or "9 Nov, 9 am to 11:59 pm" on one day. */
function windowText(s: AidmtSitting): string {
  const a = `${aidmtDays(s.opens)}, ${aidmtTime(s.opens)}`;
  return aidmtDays(s.opens) === aidmtDays(s.closes) ? `${a} to ${aidmtTime(s.closes)}` : `${a} to ${aidmtDays(s.closes)}, ${aidmtTime(s.closes)}`;
}

/* The whole series, in date order, with where each sitting stands today. */
/* A blog guide linked from a sitting's card, keyed by the sitting's key. */
export type AidmtGuides = Partial<Record<string, { href: string; label: string }>>;

export function AidmtSchedule({ builtAt, guides = {} }: { builtAt: number; guides?: AidmtGuides }) {
  const t = useNow(builtAt);
  return (
    <ol className="aidmt-tl" aria-label="AIDMT 2027 schedule">
      {AIDMT_SERIES.map((s) => {
        const state = aidmtState(s, t);
        const st = status(s, state, t);
        const guide = guides[s.key];
        return (
          <li key={s.key} className={`aidmt-tl-i is-${state}${s.free ? " is-free" : ""}`}>
            <p className="aidmt-tl-d">{days(s)}</p>
            <div className="aidmt-tl-b">
              <p className="aidmt-tl-h">
                <b>{s.name}</b>
                {s.exam ? <span className="aidmt-tl-x">{s.exam}</span> : <span className="aidmt-tl-x">Free</span>}
                {st ? <span className="aidmt-tl-st">{st}</span> : null}
              </p>
              <p className="aidmt-tl-t">{s.detail}.</p>
              <ul className="aidmt-tl-l">
                <li><b>Window</b><span>{windowText(s)}</span></li>
                {s.free ? null : <li><b>Register</b><span>Open till the window closes</span></li>}
                {s.solutions ? <li><b>Solutions</b><span>{aidmtDays(s.solutions.from, s.solutions.to)}, {s.solutions.how}</span></li> : null}
                {s.results ? <li><b>Results</b><span>{aidmtDays(s.results)}</span></li> : null}
                {s.perk ? <li className="aidmt-tl-perk"><b>Scholarship</b><span>{s.perk}</span></li> : null}
                {guide ? <li className="aidmt-tl-guide"><b>Guide</b><span><a href={guide.href}>{guide.label}</a></span></li> : null}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
