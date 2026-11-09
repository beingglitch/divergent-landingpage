/* Diwali 2026. Everything festive on the site reads its dates from here, so
   it switches itself on and off: no deploy needed on either day.

   - The offer (struck prices, the popup, "ends 11 Nov") runs offerStart to
     offerEnds, the dates in the Diwali Offer 2026 brief.
   - The decorations (lamps, toran, fireworks, rangoli) run offerStart to
     decorEnds, ten days of festival look in all.

   To remove it for good after the festival: delete this file,
   src/components/Diwali.tsx and src/app/diwali.css, and the <Diwali />
   line and import in src/app/layout.tsx. Times are IST. */

import { ist } from "./config";

export const DIWALI = {
  offerStart: "2026-11-06T00:00:00",
  offerEnds: "2026-11-11T23:59:59",
  decorEnds: "2026-11-18T23:59:59",
  /* How long a visitor is on the site before the offer popup opens. */
  popupDelayMs: 7000,
};

export type DiwaliStage = "offer" | "decor" | "off";

/* Preview another day with ?preview-date=2026-11-07 (the same switch the home page uses). */
export function diwaliNow(): Date {
  if (typeof location === "undefined") return new Date();
  const m = /[?&]preview-date=(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?/.exec(location.search);
  return m ? ist(m[1] + (m[2] ? m[2] + ":00" : "T12:00:00")) : new Date();
}

export function diwaliStage(t: Date = diwaliNow()): DiwaliStage {
  if (t < ist(DIWALI.offerStart)) return "off";
  if (t <= ist(DIWALI.offerEnds)) return "offer";
  if (t <= ist(DIWALI.decorEnds)) return "decor";
  return "off";
}

/* The offers in the popup, from the brief's price tables. now is today's
   real price (it comes back on 12 Nov), never an inflated MRP. */
/* `offer` is what the offer is and `how` is how to get it: the popup shows
   these, never a price as if already applied. In the app the student applies
   the Diwali offer themselves, from Apply discount on the plan. */
export type DiwaliDeal = { name: string; note: string; offer: string; how: string; now: number; diwali: number; href: string; code?: string; hot?: boolean };

export const DIWALI_DEALS: DiwaliDeal[] = [
  { name: "75-Day Crash Course · Combo", note: "Live + Mentor plans get AI sketch review and free AIDMT", offer: "₹2,000 off every Combo plan", how: "At checkout, open Apply discount and apply the Diwali offer", now: 18999, diwali: 16999, href: "/#plans", hot: true },
  { name: "75-Day Crash Course · single exam", note: "₹1,000 off every plan", offer: "₹1,000 off every single-exam plan", how: "At checkout, open Apply discount and apply the Diwali offer", now: 11999, diwali: 10999, href: "/#plans" },
  { name: "120-Day Crash Course · UCEED", note: "Live classes from today, recordings of everything so far", offer: "₹4,997 off UCEED, ₹6,998 off UCEED + NID", how: "Use code DIWALI120 at checkout", now: 20996, diwali: 15999, href: "/courses/?exam=all&type=crash", code: "DIWALI120" },
  { name: "NOVA Class 11 · UCEED", note: "A calm 2-year start, for 2028", offer: "₹4,996 off UCEED, ₹6,998 off UCEED + NID", how: "Use code NOVADIWALI at checkout", now: 23995, diwali: 18999, href: "/courses/?exam=all&type=nova", code: "NOVADIWALI" },
  { name: "UCEED 2027 Self-Learning Prep", note: "Counts in full toward a course by 15 Nov", offer: "₹5,998 off", how: "Counts in full toward a course by 15 Nov", now: 11997, diwali: 5999, href: "/courses/?exam=uceed&type=self" },
];
