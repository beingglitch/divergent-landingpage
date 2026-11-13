/* The mentor cards come from the LMS: Team > Website mentors. Admins add,
   edit, hide and drag them into order there; the site picks the change up
   within a minute. The home page shows the first six, each exam page and
   the About page the cards ticked for that exam. */

import { APP_URL } from "@/lib/config";
import { SITE_URL } from "@/lib/meta";

/* Categories are made and renamed in the LMS. uceed, nid and nift always exist (they have pages here). */
export type MentorTone = "blue" | "white" | "dark";
export type MentorCategory = { key: string; label: string; tone: MentorTone };
/* `tone` is the colour of the card's first category. */
export type SiteMentor = { id: string; name: string; line: string; photo: string; categories: string[]; tone: MentorTone };

const DEFAULT_CATEGORIES: MentorCategory[] = [
  { key: "uceed", label: "UCEED", tone: "blue" },
  { key: "nid", label: "NID", tone: "white" },
  { key: "nift", label: "NIFT", tone: "dark" },
];

const MENTORS_REVALIDATE = 60;

/* The card colour: blue (no class), white, dark. */
export const TONE_CLASS: Record<MentorTone, string> = { blue: "", white: "n", dark: "f" };

/* The colour of one category, for a list that shows only that category. */
export function toneOf(categories: MentorCategory[], key: string): MentorTone {
  return categories.find((category) => category.key === key)?.tone ?? DEFAULT_CATEGORIES.find((category) => category.key === key)?.tone ?? "blue";
}

/* Photos kept on this site come back as full links; serve them from here, so previews and local runs show them too. */
function localPhoto(photo: string): string {
  for (const origin of [SITE_URL, SITE_URL.replace("://www.", "://")]) {
    if (photo.startsWith(origin + "/")) return photo.slice(origin.length);
  }
  return photo;
}

const TONES: readonly string[] = ["blue", "white", "dark"];

/* Every card shown on the website, in the admin order, and the categories in
   theirs. No cards if the LMS cannot be reached, so a page still renders. */
export async function getMentorData(): Promise<{ mentors: SiteMentor[]; categories: MentorCategory[] }> {
  try {
    const response = await fetch(`${APP_URL}/api/public/mentors`, { next: { revalidate: MENTORS_REVALIDATE } });
    if (!response.ok) throw new Error(`Mentors failed to load (${response.status})`);
    const body = await response.json();
    if (!body.success || !Array.isArray(body.data)) throw new Error("Mentors failed to load");
    const listed = Array.isArray(body.categories)
      ? (body.categories as MentorCategory[]).filter((c) => typeof c?.key === "string" && typeof c?.label === "string").map((c) => ({ ...c, tone: (TONES.includes(c.tone) ? c.tone : "blue") as MentorTone }))
      : [];
    const categories = listed.length ? listed : DEFAULT_CATEGORIES;
    const mentors = (body.data as Omit<SiteMentor, "tone">[]).map((mentor) => ({
      ...mentor,
      photo: localPhoto(mentor.photo),
      tone: toneOf(categories, mentor.categories[0] ?? "uceed"),
    }));
    return { mentors, categories };
  } catch (error) {
    console.error(error);
    return { mentors: [], categories: DEFAULT_CATEGORIES };
  }
}

export async function getMentors(): Promise<SiteMentor[]> {
  return (await getMentorData()).mentors;
}
