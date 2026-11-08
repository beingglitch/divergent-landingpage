"use client";

/* The 75-Day Crash Course trailer (YouTube). Nothing from YouTube loads with
   the page: a thumbnail and a play button stand in, and the player (from
   youtube-nocookie.com) loads only after a tap. TrailerFacade plays in place,
   in the hero; TrailerButton opens the same video in a dialog. */
import { useEffect, useRef, useState } from "react";

const ID = "5-GSkAz6DYs";
/* The video's title on YouTube (oEmbed), without the emoji. */
export const TRAILER_TITLE = "75 Days One Goal. Your Dream College! 75-Day Crash Course Explained, Divergent Classes";
const EMBED = `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1&rel=0&playsinline=1`;
const THUMB = `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`;

function Player({ focus = false }: { focus?: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  /* The play button is gone once the player shows: keep keyboard focus on the video. */
  useEffect(() => { if (focus) ref.current?.focus(); }, [focus]);
  return (
    <iframe
      ref={ref}
      className="trailer-ifr"
      src={EMBED}
      title={TRAILER_TITLE}
      width={560}
      height={315}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

/* Plays in place. The caption sits under the video. */
export function TrailerFacade({ caption }: { caption: string }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="trailer" id="trailer">
      <div className="trailer-frame">
        {on ? <Player focus /> : (
          <button type="button" className="trailer-btn" aria-label={`Play video: ${TRAILER_TITLE}`} onClick={() => setOn(true)}>
            <img src={THUMB} alt={`Video thumbnail: ${TRAILER_TITLE}`} width={480} height={360} loading="lazy" decoding="async" fetchPriority="low" />
            <span className="trailer-play" aria-hidden="true"><svg width="30" height="30"><use href="#play" /></svg></span>
          </button>
        )}
      </div>
      <figcaption className="trailer-cap"><svg width="18" height="18" aria-hidden="true"><use href="#i-video" /></svg>{caption}</figcaption>
    </figure>
  );
}

/* A button that opens the trailer in a dialog. Closing it stops the video. */
export function TrailerButton({ label, className = "btn btn--ghost" }: { label: string; className?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <svg width="18" height="18" aria-hidden="true"><use href="#play" /></svg>{label}
      </button>
      <dialog
        ref={dlg}
        className="trailer-dlg"
        aria-labelledby="trailer-dlg-h"
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="trailer-dlg-in">
          <div className="trailer-dlg-top">
            <p className="trailer-dlg-h" id="trailer-dlg-h">How the 75 days run</p>
            <button type="button" className="trailer-x" aria-label="Close video" onClick={() => setOpen(false)}><span aria-hidden="true">×</span></button>
          </div>
          <div className="trailer-frame">{open ? <Player /> : null}</div>
        </div>
      </dialog>
    </>
  );
}
