import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/meta";
import { getPost, postDate } from "@/lib/blog";
import "../blog.css";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

/* Nothing is built ahead of time. Each post is rendered on its first visit
   and then cached, so a post published through the connector needs no deploy. */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | Divergent Classes" };
  const title = `${post.seoTitle || post.title} | Divergent Classes`;
  const description = post.seoDescription || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      ...(post.coverImage && { images: [{ url: post.coverImage, alt: post.coverAlt ?? undefined }] }),
    },
    twitter: { card: post.coverImage ? "summary_large_image" : "summary", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.authorName },
    publisher: { "@type": "Organization", name: "Divergent Classes", logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    ...(post.coverImage && { image: post.coverImage }),
  };

  return (
    <article className="section blog-post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
      <div className="wrap">
        <a className="blog-back" href="/blog/"><svg width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>All posts</a>
        <header className="blog-post-head">
          <p className="blog-meta">
            {post.tags.map((tag) => <span className="blog-tag" key={tag}>{tag}</span>)}
          </p>
          <h1>{post.title}</h1>
          <p className="blog-byline">
            <span>{post.authorName}</span>
            <span>{postDate(post.publishedAt)}</span>
            <span>{post.readingMinutes} min read</span>
          </p>
        </header>
        {post.coverImage ? <img className="blog-post-cover" src={post.coverImage} alt={post.coverAlt ?? ""} /> : null}
        {/* The app turns the Markdown into HTML and strips anything unsafe before sending it. */}
        <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
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
