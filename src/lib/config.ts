/* Prices, dates, links and switches for the site. Edit here; the pages
   update themselves. Times are IST. */

export type Plan = "recorded" | "live" | "mentor";
export type Batch = "single" | "combo";
export type Exam = "UCEED" | "NID";
export type Period = "launch" | "diwali" | "list";
/* What checkout opens with: join with ₹1,000, pay in full now, or pay in parts. */
export type PayCode = "join" | "full" | "2-parts" | "3-parts";
type ByPeriod = Record<Period, number>;
/* price is the pay-in-full price. twoParts and threeParts are the total paid
   over all payments; a plan without them is pay-in-full only. */
type Tier = { price: ByPeriod; twoParts?: ByPeriod; threeParts?: ByPeriod };
/* recordedPack is Recorded with the Mock & Live Pack. */
export type TierKey = "recorded" | "recordedPack" | "live" | "mentor";

/* The main app. Leads and checkout both go here. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://app.divergentclasses.com").replace(/\/+$/, "");

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
     2 Nov), diwali is 6 to 11 Nov, list is every other day. The app sends
     the live prices on load; these are the fallback and must match it. */
  prices: {
    recorded: {
      single: { price: { list: 5999, launch: 4999, diwali: 4999 } },
      combo: { price: { list: 8999, launch: 7999, diwali: 7999 } },
    },
    recordedPack: {
      single: { price: { list: 7999, launch: 6999, diwali: 6999 } },
      combo: {
        price: { list: 10999, launch: 9999, diwali: 9999 },
        twoParts: { list: 11999, launch: 10999, diwali: 10999 },
      },
    },
    live: {
      single: {
        price: { list: 11999, launch: 10999, diwali: 10999 },
        twoParts: { list: 12999, launch: 11999, diwali: 11999 },
      },
      combo: {
        price: { list: 18999, launch: 17999, diwali: 17999 },
        twoParts: { list: 19999, launch: 18999, diwali: 18999 },
        threeParts: { list: 20999, launch: 19999, diwali: 19999 },
      },
    },
    mentor: {
      single: {
        price: { list: 19999, launch: 18999, diwali: 18999 },
        twoParts: { list: 20999, launch: 19999, diwali: 19999 },
        threeParts: { list: 21999, launch: 20999, diwali: 20999 },
      },
      combo: {
        price: { list: 24999, launch: 23999, diwali: 23999 },
        twoParts: { list: 25999, launch: 24999, diwali: 24999 },
        threeParts: { list: 26999, launch: 25999, diwali: 25999 },
      },
    },
  } as Record<TierKey, Record<Batch, Tier>>,
  /* The Mock & Live Pack on Recorded, the same in every period. */
  mockPack: 2000,
  /* Paid to join any plan. Counts toward the fee. */
  joinAmount: 1000,
  /* Struck-through price beside "Plans from". Keep 0: the page never shows one. */
  heroWasPrice: 0,

  dates: {
    launchEnds: "2026-11-02T23:59:59",
    batchStartEnd: "2026-11-03T23:59:59",
    diwaliStart: "2026-11-06T00:00:00",
    diwaliEnds: "2026-11-11T23:59:59",
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
/* "Try a free class": the app opens the course's first free class. */
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
  phone: "+918383056332",
  phoneShown: "+91 83830 56332",
  email: "support@divergentclasses.com",
};
