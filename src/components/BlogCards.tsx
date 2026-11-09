/* The pieces of a blog post card, shared by the blog list and the "Keep
   reading" links under each post. */
import { postDate, type PostSummary } from "@/lib/blog";

/* The cover, or the share image when a post has no cover, or a blue panel. */
export function PostThumb({ post, eager = false }: { post: PostSummary; eager?: boolean }) {
  const loading = eager ? { loading: "eager" as const, fetchPriority: "high" as const } : { loading: "lazy" as const };
  if (post.coverImage) {
    return <img src={post.coverImage} alt={post.coverAlt ?? ""} width={post.coverWidth ?? undefined} height={post.coverHeight ?? undefined} decoding="async" {...loading} />;
  }
  if (post.ogImage) return <img src={post.ogImage} alt="" decoding="async" {...loading} />;
  return <span className="blog-cover-fallback" aria-hidden="true" />;
}

export function PostMeta({ tags, publishedAt, minutes }: { tags: string[]; publishedAt: string | null; minutes: number }) {
  return (
    <p className="blog-meta">
      {tags[0] ? <span className="blog-tag">{tags[0]}</span> : null}
      <span>{postDate(publishedAt)}</span>
      <span>{minutes} min read</span>
    </p>
  );
}

export function PostCard({ post, heading: Heading = "h3" }: { post: PostSummary; heading?: "h2" | "h3" }) {
  return (
    <a className="blog-card" href={`/blog/${post.slug}/`}>
      <PostThumb post={post} />
      <div className="blog-card-body">
        <PostMeta tags={post.tags} publishedAt={post.publishedAt} minutes={post.readingMinutes} />
        <Heading>{post.title}</Heading>
        <p>{post.excerpt}</p>
      </div>
    </a>
  );
}

/* Other posts for the end of a post: those sharing the most tags first, then the newest. */
export function relatedPosts(posts: PostSummary[], current: Pick<PostSummary, "slug" | "tags">, count = 3): PostSummary[] {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()));
  const shared = (post: PostSummary) => post.tags.filter((tag) => tags.has(tag.toLowerCase())).length;
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post, order) => ({ post, order, score: shared(post) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, count)
    .map(({ post }) => post);
}
