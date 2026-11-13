"use client";

/* The AIDMT bits that change with the date: the home page strip, the
   registration line, the closing call to action and the schedule on
   /aidmt/. They render first with the build time (so the static HTML and
   the first client render match), then switch to the visitor's clock.
   ?preview-date=2026-11-16 (or 2026-11-16T10:00) shows another day, the
   same switch the home page uses. The series comes from lib/aidmt.ts. */
import { useSyncExternalStore } from "react";
import { ist } from "@/lib/config";
import { aidmtDays, aidmtState, aidmtTime, nextAidmt, rupees, seriesEnds, type AidmtSitting, type AidmtState } from "@/lib/aidmt";

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

const label = (s: AidmtSitting) => (s.exam ? `${s.name} (${s.exam})` : s.name);
const days = (s: AidmtSitting) => aidmtDays(s.opens, s.closes);
const ranked = (series: AidmtSitting[]) => series.filter((s) => !s.free).length;

/* The home page pointer to /aidmt/, under the exam countdowns. It names the
   next sitting by date and goes once the last AIDMT date has passed. */
export function AidmtStrip({ builtAt, series, price }: { builtAt: number; series: AidmtSitting[]; price: number }) {
  const t = useNow(builtAt);
  if (!series.length || t > ist(seriesEnds(series))) return null;
  const s = nextAidmt(series, t);
  const paid = nextAidmt(series, t, true);
  let badge = `New · ${rupees(price)}`, head: string, sub: string;
  if (!s) {
    head = "AIDMT: solutions and results are on the way.";
    sub = "See every date on the AIDMT page.";
  } else if (s.free) {
    badge = "Free";
    head = t >= ist(s.opens) ? `${label(s)} is open and free till ${aidmtDays(s.closes)}.` : `Test yourself first: ${label(s)}, free, ${days(s)}.`;
    sub = (s.detail ? `${s.detail}.` : "") + (paid ? ` Then ${label(paid)}, ${days(paid)}.` : "");
  } else {
    head = t >= ist(s.opens) ? `${label(s)} is on now, till ${aidmtDays(s.closes)}.` : `Test yourself first: ${label(s)}, ${days(s)}.`;
    /* A mock just closed: say when its results are out. */
    const done = series.find((x) => x.results && aidmtState(series, x, t) === "after");
    sub = (s.detail ? `${s.detail}.` : "") + (done?.results ? ` ${done.name} results on ${aidmtDays(done.results)}.` : ` ${ranked(series)} national mocks in all.`);
  }
  return (
    <a className="aidmt-strip rv" href="/aidmt/">
      <span className="badge">{badge}</span>
      <span><b>{head}</b><span className="s">{sub.trim()}</span></span>
      <span className="btn btn--sm">See all dates <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></span>
    </a>
  );
}

/* "Registration for AIDMT 2 closes 25 Nov, 11:59 pm": the next sitting still taking registrations. */
export function AidmtRegLine({ builtAt, series, off }: { builtAt: number; series: AidmtSitting[]; off: number | null }) {
  const t = useNow(builtAt);
  const s = nextAidmt(series, t);
  if (!s) return null;
  return (
    <p className="aidmt-close"><svg width="18" height="18" aria-hidden="true"><use href="#clock" /></svg>{s.free ? `${s.name} is free, open till` : `Registration for ${s.name} closes`} {aidmtDays(s.closes)}, {aidmtTime(s.closes)}{off && !s.free ? ` · ${off}% off` : ""}</p>
  );
}

const STATUS: Record<AidmtState, string> = { done: "Done", after: "Results next", live: "On now", next: "Next", later: "" };

/* "15 Nov, 9 am to 17 Nov, 11:59 pm", or "9 Nov, 9 am to 11:59 pm" on one day. */
function windowText(s: AidmtSitting): string {
  const a = `${aidmtDays(s.opens)}, ${aidmtTime(s.opens)}`;
  return aidmtDays(s.opens) === aidmtDays(s.closes) ? `${a} to ${aidmtTime(s.closes)}` : `${a} to ${aidmtDays(s.closes)}, ${aidmtTime(s.closes)}`;
}

/* The whole series, in date order, with where each sitting stands today.
   live is the set of blog paths that are published, so a guide never links to a missing post. */
export function AidmtSchedule({ builtAt, series, price, live }: { builtAt: number; series: AidmtSitting[]; price: number; live: string[] }) {
  const t = useNow(builtAt);
  return (
    <ol className="aidmt-tl" aria-label="AIDMT schedule">
      {series.map((s) => {
        const state = aidmtState(series, s, t);
        const st = STATUS[state];
        const guide = s.guide && (!s.guide.href.startsWith("/blog/") || live.includes(s.guide.href)) ? s.guide : null;
        return (
          <li key={s.key} className={`aidmt-tl-i is-${state}${s.free ? " is-free" : ""}`}>
            <p className="aidmt-tl-d">{days(s)}</p>
            <div className="aidmt-tl-b">
              <p className="aidmt-tl-h">
                <b>{s.name}</b>
                {s.exam ? <span className="aidmt-tl-x">{s.exam}</span> : null}
                {s.free ? <span className="aidmt-tl-x">Free</span> : null}
                {st ? <span className="aidmt-tl-st">{st}</span> : null}
              </p>
              {s.detail ? <p className="aidmt-tl-t">{s.detail}.</p> : null}
              <ul className="aidmt-tl-l">
                <li><b>Window</b><span>{windowText(s)}</span></li>
                <li><b>{s.free ? "Fee" : "Register"}</b><span>{s.free ? "Free for everyone" : `${rupees(price)}, open till the window closes`}</span></li>
                {s.solutions ? <li><b>Solutions</b><span>{s.solutions}</span></li> : null}
                {s.results ? <li><b>Results</b><span>{aidmtDays(s.results)}</span></li> : null}
                {guide ? <li className="aidmt-tl-guide"><b>Guide</b><span><a href={guide.href}>{guide.label}</a></span></li> : null}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
