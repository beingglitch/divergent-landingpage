"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Slide } from "@/lib/home-content";

/* The home page's carousel of new programs, one poster at a time, like
   stories. The tab of the poster on show fills up while it stays; when it
   is full the next poster comes in. It waits while a mouse is over it, a
   finger is down, it has focus, it is off screen or the tab is hidden, and
   for good once the visitor presses pause or prefers reduced motion. A
   swipe, a tab or the arrow keys pick a poster. Each poster is a link. */

const HOLD = 6000;
const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

export function HomeCarousel({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [at, setAt] = useState(0);
  /* Bumped on every pick, so the tab's fill starts again from empty. */
  const [round, setRound] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [down, setDown] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const [still, setStill] = useState(false);
  const [dx, setDx] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const swipe = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  const go = useCallback((i: number) => {
    setAt(((i % n) + n) % n);
    setRound((r) => r + 1);
  }, [n]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setStill(mq.matches);
    set();
    mq.addEventListener("change", set);
    const vis = () => setHiddenTab(document.hidden);
    document.addEventListener("visibilitychange", vis);
    let io: IntersectionObserver | undefined;
    if (root.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.3 });
      io.observe(root.current);
    }
    return () => {
      mq.removeEventListener("change", set);
      document.removeEventListener("visibilitychange", vis);
      io?.disconnect();
    };
  }, []);

  const playing = !stopped && !still && !hover && !focus && !down && !offscreen && !hiddenTab;

  /* Swipes: a sideways move of more than a fifth of the poster turns it.
     An up or down move is left to the page, so it still scrolls. */
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false };
    dragged.current = false;
    if (e.pointerType !== "mouse") setDown(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    if (!s || s.id !== e.pointerId) return;
    const mx = e.clientX - s.x, my = e.clientY - s.y;
    if (!s.moved) {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      if (Math.abs(my) >= Math.abs(mx)) {
        swipe.current = null;
        setDown(false);
        return;
      }
      s.moved = true;
      dragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    /* At the ends the poster gives a little, to show there is no more that way. */
    const edge = (at === 0 && mx > 0) || (at === n - 1 && mx < 0);
    setDx(edge ? mx / 3 : mx);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    setDown(false);
    if (!s || !s.moved || s.id !== e.pointerId) return setDx(null);
    const w = view.current?.offsetWidth || 1;
    const mx = e.clientX - s.x;
    setDx(null);
    if (mx < -w / 5 && at < n - 1) go(at + 1);
    else if (mx > w / 5 && at > 0) go(at - 1);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    const next = ((to % n) + n) % n;
    go(next);
    tabs.current[next]?.focus();
  };

  return (
    <div
      ref={root}
      className={"hc" + (still ? " hc-still" : "")}
      data-on={slides[at]?.theme}
      role="region"
      aria-roledescription="carousel"
      aria-label="New programs"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(false); }}
      /* Keyboard focus holds it; a tap or a click on a tab does not hold it for good. */
      onFocus={(e) => { if ((e.target as HTMLElement).matches(":focus-visible")) setFocus(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }}
    >
      <div
        ref={view}
        className="hc-view"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}
      >
        <div className={"hc-track" + (dx === null ? "" : " hc-drag")} style={{ transform: `translate3d(calc(${-at * 100}% + ${dx ?? 0}px),0,0)` }}>
          {slides.map((s, i) => (
            <div key={s.key} className="hc-slide" id={`hc-p-${s.key}`} role="tabpanel" aria-roledescription="slide" aria-label={`${i + 1} of ${n}: ${s.title}`} inert={i !== at}>
              <Poster s={s} first={i === 0} />
            </div>
          ))}
        </div>
        <button type="button" className="hc-pause" onClick={() => setStopped((v) => !v)} aria-pressed={stopped} aria-label={stopped ? "Play the slides" : "Pause the slides"} hidden={still}>
          {stopped ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" /></svg>
          )}
        </button>
      </div>

      <div className="hc-tabs" role="tablist" aria-label="Pick a program">
        {slides.map((s, i) => (
          <button
            key={s.key}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            className="hc-tab"
            id={`hc-t-${s.key}`}
            aria-selected={i === at}
            aria-controls={`hc-p-${s.key}`}
            tabIndex={i === at ? 0 : -1}
            onClick={() => go(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {i === at && !still ? (
              <i key={round} className="hc-fill" style={{ animationDuration: `${HOLD}ms`, animationPlayState: playing ? "running" : "paused" }} onAnimationEnd={() => go(at + 1)} aria-hidden="true" />
            ) : null}
            <span>{s.tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Poster({ s, first }: { s: Slide; first: boolean }) {
  const load = first ? "eager" : "lazy";
  if (s.poster) {
    return (
      <a className="hc-poster hc-poster--img" href={s.href} draggable={false}>
        <img src={s.poster.src} alt={s.poster.alt} width={s.poster.w} height={s.poster.h} draggable={false} loading={load} />
      </a>
    );
  }
  const faces = s.pictureStyle === "faces";
  return (
    <a className={`hc-poster hc-${s.theme}${faces ? " hc-poster--faces" : ""}`} href={s.href} draggable={false}>
      {s.pictures.length ? (
        <span className="hc-art" aria-hidden="true">
          {faces ? (
            <span className="hc-faces">
              {s.pictures.map((f, j) => (
                <span key={f.src + j} className="hc-face">
                  <img src={f.src} alt="" width="120" height="150" draggable={false} loading={load} />
                  {f.caption ? <b>{f.caption}</b> : null}
                </span>
              ))}
            </span>
          ) : (
            s.pictures.map((a, j) => (
              <img key={a.src + j} className={`hc-sheet hc-sheet-${j}`} src={a.src} alt="" width="600" height="800" draggable={false} loading={load} />
            ))
          )}
        </span>
      ) : null}
      {s.kicker ? <span className="hc-kick">{s.kicker}</span> : null}
      {s.big ? (
        <span className={"hc-big" + (s.big.length > 2 ? " hc-big--word" : "")}>
          {s.big}
          {s.unit ? <small>{s.unit}</small> : null}
        </span>
      ) : null}
      <span className="hc-foot">
        <span className="hc-title">{s.title}</span>
        {s.line ? <span className="hc-line">{s.line}</span> : null}
        {s.chips.length ? <span className="hc-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</span> : null}
        {s.cta ? <span className="btn hc-cta">{s.cta} <Arrow /></span> : null}
      </span>
    </a>
  );
}
