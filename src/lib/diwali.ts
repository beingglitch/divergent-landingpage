/* The festival offer (Diwali and the like). Its dates, copy and deals are set
   by admins in the app and read from {APP_URL}/api/public/festival-offer, so
   it switches itself on and off and changes without a deploy.

   - offer stage, offerStart to offerEnds: struck prices, the popup, the tour
     and the decorations.
   - decor stage, offerEnds to decorEnds: the decorations only.
   - off: everything else, and while the offer is loading, when none is
     switched on, or when the app can't be reached.

   Rendering is in src/components/Diwali.tsx (styles in src/app/diwali.css)
   and the plan cards in src/lib/home.ts. Times shown are IST. */

import { APP_URL, ist } from "./config";

export type FestivalDeal = { name: string; offer: string; how: string; code: string | null; link: string; hot: boolean };

export type FestivalOffer = {
  name: string;
  offerStart: Date;
  offerEnds: Date;
  decorEnds: Date | null;
  joinRefundEnds: Date | null;
  headline: string;
  headlineAccent: string | null;
  description: string;
  courseSlug: string;
  popupDelaySeconds: number;
  giftLine: string | null;
  deals: FestivalDeal[];
};

export type FestivalStage = "offer" | "decor" | "off";

/* Preview another day with ?preview-date=2026-11-07 (or 2026-11-07T10:00),
   the same switch the home page uses. */
export function previewNow(): Date {
  if (typeof location === "undefined") return new Date();
  const m = /[?&]preview-date=(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?/.exec(location.search);
  return m ? ist(m[1] + (m[2] ? m[2] + ":00" : "T12:00:00")) : new Date();
}

export function festivalStage(o: FestivalOffer | null, t: Date = previewNow()): FestivalStage {
  if (!o || t < o.offerStart) return "off";
  if (t <= o.offerEnds) return "offer";
  if (o.decorEnds && t <= o.decorEnds) return "decor";
  return "off";
}

/* IST formatting. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const inIst = (d: Date) => new Date(d.getTime() + 330 * 60_000);

/* "11 Nov", or "11 November" with long. */
export function istDay(d: Date, long = false): string {
  const z = inIst(d), m = MONTHS[z.getUTCMonth()];
  return z.getUTCDate() + " " + (long ? m : m.slice(0, 3));
}

/* "11 Nov, 11:59 pm". */
export function istDayTime(d: Date): string {
  const z = inIst(d), h = z.getUTCHours();
  return istDay(d) + ", " + (h % 12 || 12) + ":" + String(z.getUTCMinutes()).padStart(2, "0") + (h < 12 ? " am" : " pm");
}

/* Where a deal links: "course" is this site's plans, a divergentclasses.com
   link keeps its path so it stays on the site, anything else is as given. */
export function dealHref(link: string): string {
  if (link === "course") return "/#plans";
  try {
    const u = new URL(link);
    if (/^(www\.)?divergentclasses\.com$/i.test(u.hostname)) return u.pathname + u.search + u.hash;
  } catch {
    /* Not a full URL: a path on this site. */
  }
  return link;
}

/* Loading. */
const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const when = (v: unknown): Date | null => {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

function parse(raw: unknown): FestivalOffer | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name = str(r.name), headline = str(r.headline), offerStart = when(r.offerStart), offerEnds = when(r.offerEnds);
  if (!name || !headline || !offerStart || !offerEnds) return null;
  const deals: FestivalDeal[] = (Array.isArray(r.deals) ? r.deals : []).flatMap((x): FestivalDeal[] => {
    if (!x || typeof x !== "object") return [];
    const d = x as Record<string, unknown>;
    const dn = str(d.name), offer = str(d.offer);
    if (!dn || !offer) return [];
    return [{ name: dn, offer, how: str(d.how) || "", code: str(d.code), link: str(d.link) || "course", hot: d.hot === true }];
  });
  const delay = typeof r.popupDelaySeconds === "number" && Number.isFinite(r.popupDelaySeconds) ? Math.max(0, r.popupDelaySeconds) : 8;
  return {
    name,
    offerStart,
    offerEnds,
    decorEnds: when(r.decorEnds),
    joinRefundEnds: when(r.joinRefundEnds),
    headline,
    headlineAccent: str(r.headlineAccent),
    description: str(r.description) || "",
    courseSlug: str(r.courseSlug) || "",
    popupDelaySeconds: delay,
    giftLine: str(r.giftLine),
    deals,
  };
}

/* Fetched once per page load and shared by everything that asks. A failure
   or a slow app (over 8 seconds) means no offer: nothing festive shows. */
let pending: Promise<FestivalOffer | null> | null = null;

export function loadFestivalOffer(): Promise<FestivalOffer | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!pending) {
    pending = (async () => {
      const ctl = new AbortController();
      const timer = window.setTimeout(() => ctl.abort(), 8000);
      try {
        const res = await fetch(APP_URL + "/api/public/festival-offer", { signal: ctl.signal });
        if (!res.ok) return null;
        const body = await res.json();
        return body?.success ? parse(body.data) : null;
      } catch {
        return null;
      } finally {
        window.clearTimeout(timer);
      }
    })();
  }
  return pending;
}
