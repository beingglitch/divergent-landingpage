/* The mentor cards come from the LMS: People > Website mentors. Admins add,
   edit, hide and drag them into order there; the site picks the change up
   within a minute. The home page shows the first six, each exam page and
   the About page the cards ticked for that exam. */

import { APP_URL } from "@/lib/config";
import { SITE_URL } from "@/lib/meta";

export type MentorCategory = "uceed" | "nid" | "nift";
export type SiteMentor = { id: string; name: string; line: string; photo: string; categories: MentorCategory[] };

const MENTORS_REVALIDATE = 60;

/* The card colour: UCEED blue (no class), NID white, NIFT dark. */
export const TONE_CLASS: Record<MentorCategory, string> = { uceed: "", nid: "n", nift: "f" };

/* Photos kept on this site come back as full links; serve them from here, so previews and local runs show them too. */
function localPhoto(photo: string): string {
  for (const origin of [SITE_URL, SITE_URL.replace("://www.", "://")]) {
    if (photo.startsWith(origin + "/")) return photo.slice(origin.length);
  }
  return photo;
}

/* Every card shown on the website, in the admin order. Empty if the LMS cannot be reached, so a page still renders. */
export async function getMentors(): Promise<SiteMentor[]> {
  try {
    const response = await fetch(`${APP_URL}/api/public/mentors`, { next: { revalidate: MENTORS_REVALIDATE } });
    if (!response.ok) throw new Error(`Mentors failed to load (${response.status})`);
    const body = await response.json();
    if (!body.success || !Array.isArray(body.data)) throw new Error("Mentors failed to load");
    return (body.data as SiteMentor[]).map((mentor) => ({ ...mentor, photo: localPhoto(mentor.photo) }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
