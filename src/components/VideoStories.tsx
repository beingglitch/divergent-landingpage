import type { CSSProperties } from "react";
import type { Story } from "@/lib/testimonials";

/* Video testimonial cards. Each video loads only when played; lib/site.ts
   wires the play buttons and keeps one video playing at a time.
   `reveal` (on by default) fades the cards in on scroll, staggered by --i.
   The AIDMT page turns it off: it uses no scroll reveals. */
export function VideoStories({ stories, reveal = true }: { stories: Story[]; reveal?: boolean }) {
  return (
    <ul className="vcards">
      {stories.map((s, n) => (
        <li key={s.slug} className={reveal ? "vcard rv" : "vcard"} style={reveal && n % 4 ? ({ "--i": String(n % 4) } as CSSProperties) : undefined}>
          <div className="vbox">
            <video preload="none" playsInline poster={`/assets/video/${s.slug}.webp`} src={`/assets/video/${s.slug}.mp4`}></video>
            <button className="vplay" type="button" aria-label={`Play ${s.short}'s video`}><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button>
          </div>
          <blockquote>“{s.quote}”</blockquote>
          <p className="vwho"><b>{s.name}</b><span>{s.rank}</span></p>
        </li>
      ))}
    </ul>
  );
}
