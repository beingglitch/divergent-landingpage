import type { NextConfig } from "next";

/* Blog images are uploaded through the app into its storage. They are served
   from this site's own domain, at /images/blog/<file>, so post pages, search
   results and link previews all use divergentclasses.com links. */
const BLOG_IMAGE_ORIGIN = (process.env.BLOG_IMAGE_ORIGIN || "https://eyeoarvecdxzpwmitoof.supabase.co/storage/v1/object/public/uploads/blog").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Pages live at /courses/, /uceed/ and so on, as on the old static site.
  trailingSlash: true,
  async rewrites() {
    return [{ source: "/images/blog/:file", destination: `${BLOG_IMAGE_ORIGIN}/:file` }];
  },
};

export default nextConfig;
