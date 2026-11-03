/* Blog posts come from the app, which keeps them in its database. Claude
   writes them through the app's blog connector. Pages here re-read the app
   at most once a minute, so a new post shows within about a minute. */
import { APP_URL } from "./config";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string | null;
  tags: string[];
  authorName: string;
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
};

export type Post = PostSummary & { html: string; seoTitle: string | null; seoDescription: string | null };

export const BLOG_REVALIDATE = 60;

/* Published posts, newest first. Empty when the app cannot be reached, so the
   blog page shows "no posts yet" rather than breaking the build. */
export async function getPosts(): Promise<PostSummary[]> {
  try {
    const response = await fetch(`${APP_URL}/api/public/blog`, { next: { revalidate: BLOG_REVALIDATE } });
    if (!response.ok) return [];
    const body = await response.json();
    return body.success && Array.isArray(body.data) ? body.data : [];
  } catch {
    return [];
  }
}

/* One post, or null when there is no such published post. Any other failure
   throws, so a page that was already built keeps showing its last copy. */
export async function getPost(slug: string): Promise<Post | null> {
  const response = await fetch(`${APP_URL}/api/public/blog/${encodeURIComponent(slug)}`, { next: { revalidate: BLOG_REVALIDATE } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Blog post ${slug} failed to load (${response.status})`);
  const body = await response.json();
  return body.success ? body.data : null;
}

export function postDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" });
}
