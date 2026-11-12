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
