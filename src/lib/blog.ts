/* Blog posts come from the app, which keeps them in its database. The
   marketing team writes them in the app's admin (Blog) or through Claude with
   the blog connector. Pages here re-read the app at most once a minute, so a
   new post shows within about a minute. */
import { APP_URL } from "./config";

export type PostSummary = {
  slug: string;
  title: string;
  /* Shown as an h2 directly under the title. */
  subtitle: string | null;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string | null;
  coverWidth: number | null;
  coverHeight: number | null;
  tags: string[];
  authorName: string;
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
};

export type TocEntry = { id: string; text: string };

export type Post = PostSummary & {
  html: string;
  seoTitle: string | null;
  seoDescription: string | null;
  reviewedBy: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  toc: TocEntry[];
};

export const BLOG_REVALIDATE = 60;

/* An older app may not send the newer fields yet; fill them in so pages never see undefined. */
function summary(raw: Partial<PostSummary> & { slug: string; title: string }): PostSummary {
  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle ?? null,
    excerpt: raw.excerpt ?? "",
    coverImage: raw.coverImage ?? null,
    coverAlt: raw.coverAlt ?? null,
    coverWidth: raw.coverWidth ?? null,
    coverHeight: raw.coverHeight ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    authorName: raw.authorName || "Divergent Classes",
    publishedAt: raw.publishedAt ?? null,
    updatedAt: raw.updatedAt ?? raw.publishedAt ?? new Date(0).toISOString(),
    readingMinutes: raw.readingMinutes ?? 1,
  };
}

/* Published posts, newest first. Empty when the app cannot be reached, so the
   blog page shows "no posts yet" rather than breaking the build. */
export async function getPosts(limit?: number): Promise<PostSummary[]> {
  try {
    const query = limit ? `?limit=${limit}` : "";
    const response = await fetch(`${APP_URL}/api/public/blog${query}`, { next: { revalidate: BLOG_REVALIDATE } });
    if (!response.ok) return [];
    const body = await response.json();
    return body.success && Array.isArray(body.data) ? body.data.map(summary) : [];
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
  if (!body.success || !body.data) return null;
  const raw = body.data;
  return {
    ...summary(raw),
    html: raw.html ?? "",
    seoTitle: raw.seoTitle ?? null,
    seoDescription: raw.seoDescription ?? null,
    reviewedBy: raw.reviewedBy ?? null,
    canonicalUrl: raw.canonicalUrl ?? null,
    ogImage: raw.ogImage ?? null,
    toc: Array.isArray(raw.toc) ? raw.toc.filter((t: Partial<TocEntry>) => t && typeof t.id === "string" && typeof t.text === "string") : [],
  };
}

const DAY_FORMAT: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" };

export function postDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", DAY_FORMAT);
}

/* True when the post was changed more than a day after it went live. */
export function wasUpdated(post: Pick<PostSummary, "publishedAt" | "updatedAt">): boolean {
  if (!post.publishedAt) return false;
  return new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 24 * 60 * 60 * 1000;
}
