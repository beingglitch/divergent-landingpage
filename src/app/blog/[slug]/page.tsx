import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/meta";
import { getPost, getPosts, postDate, wasUpdated, type Post } from "@/lib/blog";
import { PostCard, relatedPosts } from "@/components/BlogCards";
import "../blog.css";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

/* Nothing is built ahead of time. Each post is rendered on its first visit
   and then cached, so a post published from the admin or the connector needs no deploy. */
export async function generateStaticParams() {
  return [];
}

const absolute = (url: string) => new URL(url, SITE_URL).toString();
const canonicalOf = (post: Post) => post.canonicalUrl || `${SITE_URL}/blog/${post.slug}/`;
/* The share image: the one set for sharing, else the cover. */
const shareImageOf = (post: Post) => post.ogImage || post.coverImage;
const json = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | Divergent Classes" };
  /* An SEO title is used as written: the brief sizes it for the search
     result, and a site name after it would push it past the cut off. */
  const title = post.seoTitle || `${post.title} | Divergent Classes`;
  const description = post.seoDescription || post.excerpt;
  const url = canonicalOf(post);
  const shareImage = shareImageOf(post);
  const isCover = shareImage === post.coverImage;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Divergent Classes",
      locale: "en_IN",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      tags: post.tags,
      ...(shareImage && {
        images: [{
          url: absolute(shareImage),
          alt: (isCover ? post.coverAlt : null) ?? post.title,
          ...(isCover && post.coverWidth && post.coverHeight ? { width: post.coverWidth, height: post.coverHeight } : {}),
        }],
      }),
    },
    twitter: { card: "summary_large_image", title, description, ...(shareImage && { images: [absolute(shareImage)] }) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = canonicalOf(post);
  const shareImage = shareImageOf(post);
  const images = [...new Set([shareImage, post.coverImage].filter((x): x is string => !!x).map(absolute))];

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.subtitle ? `${post.title}: ${post.subtitle}` : post.title,
    description: post.seoDescription || post.excerpt,
    ...(images.length > 0 && { image: images }),
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: post.authorName, url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "Divergent Classes",
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.png` },
    },
    ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const updated = wasUpdated(post);
  const related = relatedPosts(await getPosts(50), post);

  return (
    <article className="section blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(breadcrumbs) }} />
      <div className="wrap">
        <a className="blog-back" href="/blog/"><svg width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>All posts</a>
        <header className="blog-post-head">
          {post.tags.length > 0 ? (
            <p className="blog-meta">
              {post.tags.map((tag) => <span className="blog-tag" key={tag}>{tag}</span>)}
            </p>
          ) : null}
          <div className="blog-titles">
            <h1>{post.title}</h1>
            {post.subtitle ? <h2 className="blog-subtitle">{post.subtitle}</h2> : null}
          </div>
          <p className="blog-byline">
            <span className="blog-by">By {post.authorName}</span>
            {post.reviewedBy ? <span>Reviewed by {post.reviewedBy}</span> : null}
            {post.publishedAt ? <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> : null}
            {updated ? <span>Updated <time dateTime={post.updatedAt}>{postDate(post.updatedAt)}</time></span> : null}
            <span>{post.readingMinutes} min read</span>
          </p>
        </header>
        {post.coverImage ? (
          <img
            className="blog-post-cover"
            src={post.coverImage}
            alt={post.coverAlt ?? ""}
            width={post.coverWidth ?? undefined}
            height={post.coverHeight ?? undefined}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        ) : null}
        {post.toc.length >= 3 ? (
          <nav className="blog-toc" aria-labelledby="toc-h">
            <p className="blog-toc-h" id="toc-h">On this page</p>
            <ol>
              {post.toc.map((entry) => <li key={entry.id}><a href={`#${entry.id}`}>{entry.text}</a></li>)}
            </ol>
          </nav>
        ) : null}
        {/* The app turns the Markdown into HTML and strips anything unsafe before sending it. */}
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        {related.length > 0 ? (
          <nav className="blog-related" aria-labelledby="related-h">
            <h2 id="related-h">Keep reading</h2>
            <ul className="blog-grid">
              {related.map((item) => <li key={item.slug}><PostCard post={item} /></li>)}
            </ul>
          </nav>
        ) : null}
        <aside className="blog-cta">
          <h2>Preparing for UCEED, NID or NIFT?</h2>
          <p>Talk to a mentor about where you stand and what to do next. It is free.</p>
          <div className="blog-cta-row">
            <a className="btn" href="/#book">Book a free call <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            <a className="btn btn--ghost" href="/courses/">See courses</a>
          </div>
        </aside>
      </div>
    </article>
  );
}
