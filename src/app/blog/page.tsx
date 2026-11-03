import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { getPosts, postDate } from "@/lib/blog";
import "./blog.css";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Blog | Divergent Classes",
  description: "Guides, strategy and stories for UCEED, NID and NIFT aspirants, from the mentors at Divergent Classes.",
  path: "/blog/",
});

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  return (
    <>
      <section className="hero phero" id="top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Blog</span></p>
              <h1 className="h1" id="hero-h">Notes for future designers.</h1>
              <p className="hero-sub">Exam strategy, portfolio advice and stories from UCEED, NID and NIFT toppers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Posts">
        <div className="wrap">
          {!lead ? (
            <div className="blog-empty">
              <h2 className="h2">The first posts are on their way.</h2>
              <p className="lede">Till then, join our free community for daily prompts and tips.</p>
              <a className="btn" href="/community/">Join the community <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            </div>
          ) : (
            <>
              <a className="blog-lead" href={`/blog/${lead.slug}/`}>
                {lead.coverImage ? <img src={lead.coverImage} alt={lead.coverAlt ?? ""} loading="eager" /> : <span className="blog-cover-fallback" aria-hidden="true" />}
                <div className="blog-lead-body">
                  <PostMeta tags={lead.tags} publishedAt={lead.publishedAt} minutes={lead.readingMinutes} />
                  <h2>{lead.title}</h2>
                  <p>{lead.excerpt}</p>
                  <span className="blog-more">Read the post <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></span>
                </div>
              </a>
              {rest.length > 0 ? (
                <ul className="blog-grid">
                  {rest.map((post) => (
                    <li key={post.slug}>
                      <a className="blog-card" href={`/blog/${post.slug}/`}>
                        {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt ?? ""} loading="lazy" /> : <span className="blog-cover-fallback" aria-hidden="true" />}
                        <div className="blog-card-body">
                          <PostMeta tags={post.tags} publishedAt={post.publishedAt} minutes={post.readingMinutes} />
                          <h3>{post.title}</h3>
                          <p>{post.excerpt}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function PostMeta({ tags, publishedAt, minutes }: { tags: string[]; publishedAt: string | null; minutes: number }) {
  return (
    <p className="blog-meta">
      {tags[0] ? <span className="blog-tag">{tags[0]}</span> : null}
      <span>{postDate(publishedAt)}</span>
      <span>{minutes} min read</span>
    </p>
  );
}
