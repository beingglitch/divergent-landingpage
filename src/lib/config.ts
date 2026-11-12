/* Prices, dates, links and switches for the site. Edit here; the pages
   update themselves. Times are IST. */

export type Plan = "recorded" | "live" | "mentor";
export type Batch = "single" | "combo";
export type Exam = "UCEED" | "NID";
export type Period = "launch" | "diwali" | "list";
/* What checkout opens with when a link names it. With none, the app shows the choices, full payment first. */
export type PayCode = "join" | "full" | "2-parts" | "3-parts" | "2-installments" | "3-installments";
type ByPeriod = Record<Period, number>;
/* price is the pay-in-full price. twoParts and threeParts are the total paid
   over all payments; a plan without them is pay-in-full only. */
type Tier = { price: ByPeriod; twoParts?: ByPeriod; threeParts?: ByPeriod };
/* recordedPack is Recorded with the Mock & Live Pack. */
export type TierKey = "recorded" | "recordedPack" | "live" | "mentor";

/* The main app. Leads and checkout both go here. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.divergentclasses.com").replace(/\/+$/, "");

/* The Meta pixel, the "Divergent Classes Meta pixel" dataset. Off while
   developing, so local testing never reaches the ad account. */
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || (process.env.NODE_ENV === "production" ? "3424263194547439" : "");

export const CONFIG = {
  /* true shows the item on the page, false hides it. */
  approvals: {
    launchPrice: true,
    diwaliPrice: true,
    diwaliGift: true,
    planInclusions: true,
    gst: true,
    emi: true,
    refund: true,
    upgrades: true,
    mentorSeatsLimited: true,
  } as Record<string, boolean>,

  /* Prices in rupees, GST included. launch is the early price (until
     2 Nov), diwali is 6 to 15 Nov (extended from 11 Nov; Diwali Offer 2026 brief: ₹1,000 off
     single-exam plans, ₹2,000 off Combos), list is every other day. The app sends
     the live prices on load; these are the fallback and must match it. */
  prices: {
    recorded: {
      single: { price: { list: 5999, launch: 4999, diwali: 4999 } },
      combo: { price: { list: 8999, launch: 7999, diwali: 6999 } },
    },
    recordedPack: {
      single: { price: { list: 7999, launch: 6999, diwali: 6999 } },
      combo: {
        price: { list: 10999, launch: 9999, diwali: 8999 },
        twoParts: { list: 11999, launch: 10999, diwali: 9999 },
      },
    },
    live: {
      single: {
        price: { list: 11999, launch: 10999, diwali: 10999 },
        twoParts: { list: 12999, launch: 11999, diwali: 11999 },
      },
      combo: {
        price: { list: 18999, launch: 17999, diwali: 16999 },
        twoParts: { list: 19999, launch: 18999, diwali: 17999 },
        threeParts: { list: 20999, launch: 19999, diwali: 18999 },
      },
    },
    mentor: {
      single: {
        price: { list: 19999, launch: 18999, diwali: 18999 },
        twoParts: { list: 20999, launch: 19999, diwali: 19999 },
        threeParts: { list: 21999, launch: 20999, diwali: 20999 },
      },
      combo: {
        price: { list: 24999, launch: 23999, diwali: 22999 },
        twoParts: { list: 25999, launch: 24999, diwali: 23999 },
        threeParts: { list: 26999, launch: 25999, diwali: 24999 },
      },
    },
  } as Record<TierKey, Record<Batch, Tier>>,
  /* The Mock & Live Pack on Recorded, the same in every period. */
  mockPack: 2000,
  /* Paid to join any plan. Counts toward the fee. */
  joinAmount: 1000,
  /* A fixed struck-through price beside "Plans from". Keep 0: while an
     offer runs the page strikes through the real list price instead. */
  heroWasPrice: 0,

  dates: {
    launchEnds: "2026-11-02T23:59:59",
    batchStartEnd: "2026-11-03T23:59:59",
    diwaliStart: "2026-11-06T00:00:00",
    diwaliEnds: "2026-11-15T23:59:59",
    uceedRegEnds: "2026-10-31T23:59:59",
    uceedLateEnds: "2026-11-06T23:59:59",
    nidRegEnds: "2026-11-30T23:59:59",
  } as Record<string, string>,
};

/* A date in CONFIG (IST) as a Date. */
export const ist = (s: string) => new Date(s + "+05:30");

/* Which price is live at a moment. */
export function pricePeriod(t: Date): Period {
  const A = CONFIG.approvals, D = CONFIG.dates;
  if (A.launchPrice && t <= ist(D.launchEnds)) return "launch";
  if (A.diwaliPrice && t >= ist(D.diwaliStart) && t <= ist(D.diwaliEnds)) return "diwali";
  return "list";
}

/* The lowest plan price at a moment, for "Plans from". */
export function fromPrice(t: Date): number {
  return CONFIG.prices.recorded.single.price[pricePeriod(t)];
}

/* Shown on the "Explore other courses and mocks" buttons. */
export const OTHERS_FROM = 999;

/* The 75-day course in the app, and the link name of each of its pricing
   plans (set in the app under Courses, Pricing plans). Single-exam plans
   end in uceed or nid; pack means Recorded with the Mock & Live Pack. */
export const COURSE_SLUG = process.env.NEXT_PUBLIC_COURSE_SLUG || "75-days-cc";
export const BUNDLES: Record<string, string> = {
  "recorded-uceed": "recorded-uceed",
  "recorded-nid": "recorded-nid",
  "recorded-combo": "recorded-combo",
  "recorded-pack-uceed": "recorded-uceed+mock-live-pack",
  "recorded-pack-nid": "recorded-nid+mock-live-pack",
  "recorded-pack-combo": "recorded-combo+mock-live-pack",
  "live-uceed": "live-uceed",
  "live-nid": "live-nid",
  "live-combo": "live-combo",
  "mentor-uceed": "mentor-uceed",
  "mentor-nid": "mentor-nid",
  "mentor-combo": "mentor-combo",
};

export const PLAN_NAMES: Record<Plan, string> = { recorded: "Recorded", live: "Live", mentor: "Mentor" };

/* The pack only exists on Recorded. */
export function tierKey(plan: Plan, pack: boolean): TierKey {
  return plan === "recorded" && pack ? "recordedPack" : plan;
}

export function bundleKey(plan: Plan, batch: Batch, exam: Exam, pack = false): string {
  return plan + (plan === "recorded" && pack ? "-pack" : "") + "-" + (batch === "combo" ? "combo" : exam.toLowerCase());
}

export function bundleSlug(plan: Plan, batch: Batch, exam: Exam, pack = false): string {
  return BUNDLES[bundleKey(plan, batch, exam, pack)];
}

/* Checkout for a plan in the app. pay picks the payment option; without it
   the app asks. */
/* The course page in the app, open without signing in. */
export const COURSE_APP_URL = `${APP_URL}/dashboard/courses/${COURSE_SLUG}`;

/* "Attend a free live class": the app asks for the WhatsApp number on the
   course page, then opens the next live class, one per verified number. */
export const FREE_CLASS_URL = `${APP_URL}/dashboard/courses/${COURSE_SLUG}/free`;

/* A slug may carry add-ons after "+": "recorded-uceed+mock-live-pack" is the
   Recorded plan with the Mock & Live Pack ticked. */
export function checkoutUrl(slug: string, pay?: PayCode): string {
  const [plan, ...addOns] = slug.split("+");
  return `${APP_URL}/dashboard/courses/${COURSE_SLUG}/plans/${plan}?checkout=1` + (addOns.length ? `&addons=${addOns.join(",")}` : "") + (pay ? `&pay=${pay}` : "");
}

export function planLabel(plan: Plan, batch: Batch, exam: Exam, pack = false): string {
  return PLAN_NAMES[plan] + (plan === "recorded" && pack ? " + Mock & Live Pack" : "") + " · " + (batch === "combo" ? "UCEED + NID Combo" : exam);
}

type PlanEntry = { plan: Plan; batch: Batch; exam: Exam; pack: boolean; slug: string; label: string };

/* Every 75-day plan, in the order the call form lists them. */
export const PLAN_LIST: PlanEntry[] = (() => {
  const out: PlanEntry[] = [];
  const tiers: Array<[Plan, boolean]> = [["recorded", false], ["recorded", true], ["live", false], ["mentor", false]];
  const batches: Array<[Batch, Exam]> = [["single", "UCEED"], ["single", "NID"], ["combo", "UCEED"]];
  for (const [plan, pack] of tiers) for (const [batch, exam] of batches) {
    out.push({ plan, batch, exam, pack, slug: bundleSlug(plan, batch, exam, pack), label: planLabel(plan, batch, exam, pack) });
  }
  return out;
})();

export const CONTACT = {
  whatsapp: "918383056332",
  phone: "+919429693048",
  phoneShown: "+91 94296 93048",
  email: "support@divergentclasses.com",
};

/* AIDMT, the All India Design Mock Test. Dates are IST. Edit here and the
   /aidmt/ page and the home page strip follow. The app says the same things
   (divergent-lms src/lib/aidmt-event.ts AIDMT_SERIES); change both together.

   AIDMT 2027 is a series: a free sectional, then four ranked mocks, each set
   like the exam it is named for, listed in date order. A mock takes
   registrations until its own window closes. When a mock's solutions or
   results dates are fixed, add them here and the pages pick them up. */
export type AidmtExam = "NID" | "UCEED" | "NIFT";
export type AidmtSitting = {
  key: string;
  /* "AIDMT 1", or "Free sectional". */
  name: string;
  /* The exam the paper is set like. None for the sectional. */
  exam: AidmtExam | null;
  /* One line under the name. */
  detail: string;
  opens: string;
  closes: string;
  free: boolean;
  /* Solutions walked through after the window: when, and how. */
  solutions?: { from: string; to: string; how: string };
  /* Scorecards and ranks are out by the end of this day. */
  results?: string;
  /* Anything else worth a line on its card. */
  perk?: string;
};

export const AIDMT_SERIES: AidmtSitting[] = [
  { key: "sectional", name: "Free sectional", exam: null, detail: "Part B only (drawing and design), free for everyone", opens: "2026-11-08T09:00:00", closes: "2026-11-11T23:59:59", free: true },
  {
    key: "aidmt-1", name: "AIDMT 1", exam: "NID", detail: "NID full-length mock, ranked across India",
    opens: "2026-11-15T09:00:00", closes: "2026-11-17T23:59:59", free: false,
    solutions: { from: "2026-11-18T00:00:00", to: "2026-11-19T23:59:59", how: "on a live meet" },
    results: "2026-11-20T23:59:59",
  },
  {
    key: "aidmt-2", name: "AIDMT 2", exam: "UCEED", detail: "UCEED mock, ranked across India",
    opens: "2026-11-22T09:00:00", closes: "2026-11-25T23:59:59", free: false,
    solutions: { from: "2026-11-27T00:00:00", to: "2026-11-28T23:59:59", how: "with a review session" },
  },
  { key: "aidmt-3", name: "AIDMT 3", exam: "NIFT", detail: "NIFT mock, ranked across India", opens: "2026-11-29T09:00:00", closes: "2026-11-29T23:59:59", free: false },
  { key: "aidmt-4", name: "AIDMT 4", exam: "NID", detail: "NID mock, ranked across India", opens: "2026-11-30T09:00:00", closes: "2026-11-30T23:59:59", free: false },
];

const aidmtFirst = AIDMT_SERIES.find((s) => s.key === "aidmt-1")!;
const aidmtSectional = AIDMT_SERIES.find((s) => s.free)!;

/* The last date a sitting has anything to show: its close, solutions or results. */
export const aidmtSittingEnds = (s: AidmtSitting) => [s.closes, s.solutions?.to, s.results].filter((d): d is string => !!d).sort().at(-1)!;

export const AIDMT = {
  fee: 99,
  feeWas: 499,
  /* One person pays groupFee for a group of groupSize, themselves included. */
  groupFee: 199,
  groupSize: 3,
  /* AIDMT 1 registration stays open until its window closes. Later mocks
     each take registrations until their own window closes. */
  registrationEnds: aidmtFirst.closes,
  sectional: { opens: aidmtSectional.opens, closes: aidmtSectional.closes },
  /* AIDMT 1, the first ranked mock. */
  mock: { opens: aidmtFirst.opens, closes: aidmtFirst.closes },
  results: aidmtFirst.results!,
  series: AIDMT_SERIES,
  /* The home strip points to /aidmt/ until this: the last date anywhere in
     the series (a close, solutions or results). */
  ends: AIDMT_SERIES.map(aidmtSittingEnds).sort().at(-1)!,
  enrolUrl: `${APP_URL}/dashboard/tests?view=aidmt`,
};

/* The sitting still to close at t (the one running, or the next one), or
   null once every window has closed. ranked skips the free sectional. */
export function nextAidmt(t: Date, ranked = false): AidmtSitting | null {
  return AIDMT_SERIES.find((s) => (!ranked || !s.free) && t <= ist(s.closes)) ?? null;
}

/* Where a sitting stands at t. "after" is between its close and its last
   solutions or results date. */
export type AidmtState = "done" | "after" | "live" | "next" | "later";
export function aidmtState(s: AidmtSitting, t: Date): AidmtState {
  if (t > ist(aidmtSittingEnds(s))) return "done";
  if (t > ist(s.closes)) return "after";
  if (t >= ist(s.opens)) return "live";
  return AIDMT_SERIES.find((x) => t < ist(x.opens))?.key === s.key ? "next" : "later";
}

const aidmtFmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o });

/* "9 Nov", "15 to 17 Nov" or "30 Nov to 2 Dec", in IST. long spells the month out. */
export function aidmtDays(from: string, to: string = from, long = false): string {
  const dm = aidmtFmt({ day: "numeric", month: long ? "long" : "short" });
  const a = dm.format(ist(from)), b = dm.format(ist(to));
  if (a === b) return a;
  const m = aidmtFmt({ month: "short" });
  return m.format(ist(from)) === m.format(ist(to)) ? `${aidmtFmt({ day: "numeric" }).format(ist(from))} to ${b}` : `${a} to ${b}`;
}

/* "9 am" or "11:59 pm", in IST. Spaces are made plain: some browsers put a
   narrow no-break space before am/pm, and the client components on /aidmt/
   must render the same text as the static HTML. */
export const aidmtTime = (s: string) => aidmtFmt({ hour: "numeric", minute: "2-digit", hour12: true }).format(ist(s)).toLowerCase().replace(/\s+/g, " ").replace(":00", "");

/* "15 to 17 Nov": a sitting's window (AIDMT 1 by default), in IST. long spells the month out. */
export function aidmtWindow(long = false, s: AidmtSitting = aidmtFirst): string {
  return aidmtDays(s.opens, s.closes, long);
}
