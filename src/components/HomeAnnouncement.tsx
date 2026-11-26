/* The pill above the home page's headline when it announces something of
   its own (set in the app under Highlights, Home page): a dark tag with a
   twinkling spark ("New launch"), the words, an arrow. Same shape as the
   AIDMT pill (components/Aidmt AidmtHeroLink), which shows otherwise. */
export function HomeAnnouncement({ badge, text, href }: { badge: string; text: string; href: string }) {
  return (
    <p className="hero-ann hm-ann">
      <a href={href}>
        <span className="hero-ann-b hm-ann-b">
          <svg className="hm-ann-ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .6l1.8 5.1 5.6 2.3-5.6 2.3L8 15.4l-1.8-5.1L.6 8l5.6-2.3z" /></svg>
          {badge || "New"}
        </span>
        {text}
        <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>
      </a>
    </p>
  );
}
