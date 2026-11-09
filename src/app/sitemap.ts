import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/meta";
import { getPosts } from "@/lib/blog";

/* Rebuilt as often as the blog list refreshes (once a minute at most), so a
   new post joins the sitemap without a deploy. */
export const revalidate = 60;

/* Every public page, with the trailing slash the site uses. Add new pages here. */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/courses/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/uceed/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/nid/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/nift/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/aidmt/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/results/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog/", priority: 0.8, changeFrequency: "daily" },
  { path: "/about/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact/", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy/", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms/", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(500);
  return [
    ...PAGES.map(({ path, priority, changeFrequency }) => ({ url: `${SITE_URL}${path}`, priority, changeFrequency })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(post.coverImage && { images: [new URL(post.coverImage, SITE_URL).toString()] }),
    })),
  ];
}
