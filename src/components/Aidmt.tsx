"use client";

/* The AIDMT bits that change with the date: the home page strip, the
   registration line, the closing call to action and the schedule on
   /aidmt/. They render first with the build time (so the static HTML and
   the first client render match), then switch to the visitor's clock.
   ?preview-date=2026-11-16 (or 2026-11-16T10:00) shows another day, the
   same switch the home page uses. The series comes from lib/aidmt.ts. */
import { useSyncExternalStore } from "react";
import { APP_URL, ist } from "@/lib/config";
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

/* The one line above the home page heading that points to /aidmt/. It
   names the next mock's price and goes once the last AIDMT date has passed. */
export function AidmtHeroLink({ builtAt, series, price }: { builtAt: number; series: AidmtSitting[]; price: number }) {
  const t = useNow(builtAt);
  if (!series.length || t > ist(seriesEnds(series))) return null;
  const s = nextAidmt(series, t);
  const cost = s ? (s.free ? 0 : s.price ?? price) : null;
  const text = cost === null ? "AIDMT 2027 results soon" : cost > 0 ? `AIDMT 2027 mocks, ${rupees(cost)}` : "AIDMT 2027: free mock";
  return (
    <p className="hero-ann">
      <a href="/aidmt/"><span className="hero-ann-b">New</span>{text}<svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
    </p>
  );
}

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
    /* The sitting's own price: a ranked mock can be free too. */
    const cost = s.price ?? price;
    badge = cost > 0 ? `New · ${rupees(cost)}` : "Free";
    head = t >= ist(s.opens) ? `${label(s)} is on now${cost > 0 ? "" : ", free"}, till ${aidmtDays(s.closes)}.` : `Test yourself first: ${label(s)}, ${days(s)}.`;
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

/* "9 am to 11:59 pm": the row's date already says which days. */
function windowText(s: AidmtSitting): string {
  return `${aidmtTime(s.opens)} to ${aidmtTime(s.closes)}`;
}

/* What a sitting's pill does. On now: straight to the paper (the app asks
   the visitor to sign in first, then opens it). Still to come: Register. */
/* buy: the sitting a Register opens in the buy dialog (AidmtBuy). */
function sittingLink(s: AidmtSitting, state: AidmtState, enrolUrl: string): { href: string; text: string; buy?: string } | null {
  if (state === "live") return s.examPath ? { href: `${APP_URL}${s.examPath}`, text: "On now · Attempt" } : { href: enrolUrl, text: "On now · Register", buy: s.key };
  if (state === "next") return { href: enrolUrl, text: "Next · Register", buy: s.key };
  if (state === "later") return { href: enrolUrl, text: "Register", buy: s.key };
  return null;
}

/* The whole series, in date order, one row each: when, what, the price and
   where each sitting stands today. The solutions sessions are in the FAQs.
   live is the set of blog paths that are published, so a guide never links
   to a missing post. */
export function AidmtSchedule({ builtAt, series, price, live, enrolUrl }: { builtAt: number; series: AidmtSitting[]; price: number; live: string[]; enrolUrl: string }) {
  const t = useNow(builtAt);
  return (
    <ol className="aidmt-tl" aria-label="AIDMT schedule">
      {series.map((s) => {
        const state = aidmtState(series, s, t);
        const st = STATUS[state];
        const guide = s.guide && (!s.guide.href.startsWith("/blog/") || live.includes(s.guide.href)) ? s.guide : null;
        const link = sittingLink(s, state, enrolUrl);
        /* The sitting's own price; the series price only when the LMS did not say. */
        const cost = s.free ? 0 : s.price ?? price;
        return (
          <li key={s.key} className={`aidmt-tl-i is-${state}${cost === 0 ? " is-free" : ""}`}>
            <p className="aidmt-tl-d">{days(s)}</p>
            <div className="aidmt-tl-b">
              <p className="aidmt-tl-h"><b>{s.name}</b>{s.exam ? <span className="aidmt-tl-x">{s.exam}</span> : null}</p>
              <p className="aidmt-tl-m">
                {s.detail ? <>{s.detail} · </> : null}
                {windowText(s)}
                {s.results ? <> · Results {aidmtDays(s.results)}</> : null}
                {guide ? <> · <a href={guide.href}>{guide.label}</a></> : null}
              </p>
            </div>
            <p className="aidmt-tl-p">{cost === 0 ? "Free" : rupees(cost)}</p>
            <div className="aidmt-tl-a">
              {link ? <a className="aidmt-tl-st aidmt-tl-go" href={link.href} data-aidmt-buy={link.buy}>{link.text} <svg className="arr" width="14" height="14" aria-hidden="true"><use href="#arrow" /></svg></a> : st ? <span className="aidmt-tl-st">{st}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
