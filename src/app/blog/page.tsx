import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { getPosts } from "@/lib/blog";
import { PostCard, PostLabel, PostPoster } from "@/components/BlogCards";
import "./blog.css";

export const revalidate = 60;

export const metadata: Metadata = pageMeta({
  title: "Blog | Divergent Classes",
  description: "Guides, strategy and stories for UCEED, NID and NIFT aspirants, from the mentors at Divergent Classes.",
  path: "/blog/",
});

export default async function BlogPage() {
  const posts = await getPosts();
  // The newest is pinned up large once there are enough to fill the rows under it.
  const lead = posts.length >= 4 ? posts[0] : null;
  const rest = lead ? posts.slice(1) : posts;
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

      <section className="section wall" aria-label="Posts">
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <h2 className="h2">The first posts are on their way.</h2>
              <p className="lede">Till then, join our free community for daily prompts and tips.</p>
              <a className="btn" href="/community/">Join the community <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            </div>
          ) : (
            <>
              {lead ? (
                <a className="wall-item wall-lead" href={`/blog/${lead.slug}/`}>
                  <PostPoster post={lead} eager sizes="(min-width: 900px) 420px, 90vw" />
                  <PostLabel post={lead} heading="h2" lead />
                </a>
              ) : null}
              {rest.length > 0 ? (
                <ul className="wall-grid">
                  {rest.map((post, n) => (
                    <li key={post.slug}>
                      <PostCard post={post} heading={lead ? "h3" : "h2"} eager={!lead && n < 3} />
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
