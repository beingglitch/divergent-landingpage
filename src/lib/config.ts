/* Prices, dates, links and switches for the site. Edit here; the pages
   update themselves. Times are IST. */

export type Plan = "recorded" | "live" | "mentor";
export type Batch = "single" | "combo";
export type Exam = "UCEED" | "NID";
type Price = { list: number; launch: number; diwali: number };

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

  /* Prices in rupees. Launch and Diwali prices need their approvals above. */
  prices: {
    recorded: { single: { list: 5999, launch: 5699, diwali: 5699 }, combo: { list: 8999, launch: 7999, diwali: 7999 } },
    live: { single: { list: 11999, launch: 11699, diwali: 11699 }, combo: { list: 18999, launch: 17999, diwali: 17999 } },
    mentor: { single: { list: 19999, launch: 19699, diwali: 19699 }, combo: { list: 24999, launch: 23999, diwali: 23999 } },
  } as Record<Plan, Record<Batch, Price>>,
  emiFrom: 9999,
  /* Struck-through price beside "Plans from". 0 hides it. Only use a price
     this plan has really been sold at. */
  heroWasPrice: 0,

  dates: {
    launchEnds: "2026-11-01T23:59:59",
    batchStartEnd: "2026-11-02T23:59:59",
    diwaliStart: "2026-11-06T00:00:00",
    diwaliEnds: "2026-11-11T23:59:59",
    uceedRegEnds: "2026-10-31T23:59:59",
    uceedLateEnds: "2026-11-06T23:59:59",
    nidRegEnds: "2026-11-30T23:59:59",
  } as Record<string, string>,
};

/* Shown on the "Explore other courses and mocks" buttons. */
export const OTHERS_FROM = 999;

/* The 75-day course in the app, and the link name of each of its pricing
   plans (set in the app under Courses, Pricing plans). The key is
   plan-batch, where batch is combo, uceed or nid. */
export const COURSE_SLUG = process.env.NEXT_PUBLIC_COURSE_SLUG || "75-days-cc";
export const BUNDLES: Record<string, string> = {
  "recorded-combo": "recorded-combo",
  "recorded-uceed": "recorded-uceed",
  "recorded-nid": "recorded-nid",
  "live-combo": "live-combo",
  "live-uceed": "live-uceed",
  "live-nid": "live-nid",
  "mentor-combo": "mentor-combo",
  "mentor-uceed": "mentor-uceed",
  "mentor-nid": "mentor-nid",
};

export const PLAN_NAMES: Record<Plan, string> = { recorded: "Recorded", live: "Live", mentor: "Mentor" };

export function bundleKey(plan: Plan, batch: Batch, exam: Exam): string {
  return plan + "-" + (batch === "combo" ? "combo" : exam.toLowerCase());
}

export function bundleSlug(plan: Plan, batch: Batch, exam: Exam): string {
  return BUNDLES[bundleKey(plan, batch, exam)];
}

/* Where Enrol now goes for a plan: that plan's checkout in the app. */
export function checkoutUrl(plan: Plan, batch: Batch, exam: Exam): string {
  return `${APP_URL}/dashboard/courses/${COURSE_SLUG}/plans/${bundleSlug(plan, batch, exam)}?checkout=1`;
}

export function planLabel(plan: Plan, batch: Batch, exam: Exam): string {
  return PLAN_NAMES[plan] + " · " + (batch === "combo" ? "UCEED + NID Combo" : exam);
}

export const CONTACT = {
  whatsapp: "918383056332",
  phone: "+918383056332",
  phoneShown: "+91 83830 56332",
  email: "support@divergentclasses.com",
};
