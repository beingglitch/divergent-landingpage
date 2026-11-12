/* Course cards come from the app, which keeps the courses in its database.
   Admins edit a card (title, subtitle, thumbnail, price, link) in the app's
   admin under Courses, set the order by dragging the cards on that list, and
   pick which courses show here with "Show on divergentclasses.com". Pages
   re-read the app at most once a minute. */
import { APP_URL, COURSE_SLUG } from "./config";

export const COURSES_REVALIDATE = 60;

export type SiteCourse = {
  slug: string;
  title: string;
  subtitle: string | null;
  thumbnail: string | null;
  /* Rupees. With priceFrom, the cheapest plan today. */
  price: number;
  priceFrom: boolean;
  originalPrice: number | null;
  href: string;
  external: boolean;
  /* uceed, nid, nift, from the course's tags. */
  exams: string[];
  /* Tagged "Mock test" in the app. */
  mock: boolean;
};

/* The Type filter on /courses/. */
export type CourseType = "crash" | "nova" | "mocks" | "self" | "free";
export const TYPE_NAMES: Record<CourseType, string> = { crash: "Crash course", nova: "Class 11", mocks: "Mocks", self: "Self-learning", free: "Free" };

/* Worked out from the app's own fields: the Mock test tag, a zero price, and
   the subtitle, which the app writes as "Class 11 · ..." or "Self-learning · ...". */
export function courseType(c: SiteCourse): CourseType {
  if (c.mock) return "mocks";
  if (c.price === 0 && !c.priceFrom) return "free";
  const words = `${c.subtitle ?? ""} ${c.title}`.toLowerCase();
  if (/class 11|\bnova\b/.test(words)) return "nova";
  if (/self[- ]learning/.test(words)) return "self";
  return "crash";
}

/* The festival price of a card, shown only while the app's festival offer
   runs (src/lib/diwali.ts). The coupon codes are not shown on the cards. */
export const FESTIVAL_PRICES: Record<string, { price: number }> = {
  "crash-120-uceed-nid": { price: 21999 },
  "crash-120-uceed": { price: 15999 },
  "nova-uceed": { price: 18999 },
  "nova-uceed-nid": { price: 24999 },
  "nova-uceed-nid-nift": { price: 27999 },
  "uceed-nid-mocks-bundle": { price: 2999 },
  "nift-10-mocks": { price: 1999 },
  "uceed-self-learning": { price: 5999 },
};

/* The 75-day course is sold on the home page, so its card goes to the plans there. */
export const isMainCourse = (c: SiteCourse) => c.slug === COURSE_SLUG;

/* The cards, in the app's order. Throws when the app cannot be reached, so a
   page that was already built keeps showing its last copy rather than an
   empty list. */
export async function getCourses(): Promise<SiteCourse[]> {
  const response = await fetch(`${APP_URL}/api/public/courses`, { next: { revalidate: COURSES_REVALIDATE } });
  if (!response.ok) throw new Error(`Courses failed to load (${response.status})`);
  const body = await response.json();
  if (!body.success || !Array.isArray(body.data)) throw new Error("Courses failed to load");
  return body.data as SiteCourse[];
}
