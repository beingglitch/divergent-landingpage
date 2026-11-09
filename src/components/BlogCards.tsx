/* The blog as a crit wall: each post's cover is a 4:5 poster, pinned up whole,
   with a gallery label under it. Shared by the blog list and the "Keep
   reading" links under each post. */
import { postDate, type PostSummary } from "@/lib/blog";

/* The poster: the cover, else the share image, else a blue sheet with the title. */
export function PostPoster({ post, eager = false, sizes }: { post: PostSummary; eager?: boolean; sizes?: string }) {
  const loading = eager ? { loading: "eager" as const, fetchPriority: "high" as const } : { loading: "lazy" as const };
  const src = post.coverImage ?? post.ogImage;
  return (
    <span className="wall-print">
      <span className="wall-tape" aria-hidden="true" />
      {src ? (
        <img
          src={src}
          alt={post.coverImage ? post.coverAlt ?? "" : ""}
          width={post.coverImage ? post.coverWidth ?? undefined : undefined}
          height={post.coverImage ? post.coverHeight ?? undefined : undefined}
          sizes={sizes}
          decoding="async"
          {...loading}
        />
      ) : (
        <span className="wall-blank" aria-hidden="true">{post.title}</span>
      )}
    </span>
  );
}

/* The label pinned beside a print: topic, title, one line on it, when and how long. */
export function PostLabel({ post, heading: Heading = "h3", lead = false }: { post: PostSummary; heading?: "h2" | "h3"; lead?: boolean }) {
  return (
    <span className="wall-label">
      {post.tags[0] ? <span className="wall-topic">{post.tags[0]}</span> : null}
      <Heading className="wall-title">{post.title}</Heading>
      {lead && post.subtitle ? <span className="wall-sub">{post.subtitle}</span> : null}
      <span className="wall-excerpt">{post.excerpt}</span>
      <span className="wall-facts">
        {post.publishedAt ? <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> : null}
        <span>{post.readingMinutes} min read</span>
      </span>
    </span>
  );
}

export function PostCard({ post, heading = "h3", eager = false }: { post: PostSummary; heading?: "h2" | "h3"; eager?: boolean }) {
  return (
    <a className="wall-item" href={`/blog/${post.slug}/`}>
      <PostPoster post={post} eager={eager} sizes="(min-width: 1100px) 360px, (min-width: 700px) 45vw, 90vw" />
      <PostLabel post={post} heading={heading} />
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
