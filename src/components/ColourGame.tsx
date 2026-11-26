"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type Ref } from "react";

/* Odd colour out (the /colour-game/ page): a square of tiles in one colour
   with one tile a shade lighter or darker. Find it and the next level is a
   bigger grid with a smaller step. One 60 second clock runs for the whole
   go, and a wrong tap takes 3 seconds off it. The score is levels cleared.

   Only the lightness differs between the odd tile and the rest, so players
   who mix up some hues can still play. Colours are picked in OKLCH, where a
   lightness step looks the same size in any hue, and turned into rgb() here
   so every browser paints them the same. */

const RUN_MS = 60000;
const PENALTY_MS = 3000;
const BEST_KEY = "dv-colour-game-best";
const SHARE_URL = "https://www.divergentclasses.com/colour-game/";

/* The tiers on the end screen, by levels cleared. A typical first go lands
   around Keen or Sharp; Designer eye needs a quick and very fine eye. */
const TIERS = [
  { min: 0, name: "Beginner eye", tone: "cg-t1" },
  { min: 8, name: "Keen eye", tone: "cg-t2" },
  { min: 14, name: "Sharp eye", tone: "cg-t3" },
  { min: 19, name: "Artist’s eye", tone: "cg-t4" },
  { min: 24, name: "Designer eye", tone: "cg-t5" },
];

function tierIndex(score: number): number {
  let at = 0;
  TIERS.forEach((t, i) => { if (score >= t.min) at = i; });
  return at;
}

/* Grid size by level: 2x2 to start, a size up every few levels, and 7x7 from
   level 16, the most a phone shows at a size a thumb can still hit. */
function sizeFor(level: number): number {
  if (level >= 16) return 7;
  if (level >= 11) return 6;
  if (level >= 7) return 5;
  if (level >= 4) return 4;
  if (level >= 2) return 3;
  return 2;
}

/* The lightness step (OKLCH, 0 to 1) between the odd tile and the rest:
   0.16 on level 1, which anyone sees, shrinking 9% a level to 0.024 from
   level 22 on, close to the smallest step most eyes catch on a phone. */
function stepFor(level: number): number {
  return Math.max(0.024, 0.16 * Math.pow(0.91, level - 1));
}

type Rgb = [number, number, number];

/* OKLCH to 8 bit sRGB (Björn Ottosson's OKLab matrices). Null when the
   colour is outside what a screen can show. */
function oklchToRgb(l: number, c: number, hue: number): Rgb | null {
  const h = (hue * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  ];
  if (lin.some((v) => v < -0.0001 || v > 1.0001)) return null;
  const enc = (v: number) => {
    const x = Math.min(1, Math.max(0, v));
    return Math.round(255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055));
  };
  return [enc(lin[0]), enc(lin[1]), enc(lin[2])];
}

/* The most chroma a lightness and hue can take and still be on screen, so
   both shades of a level keep the same chroma and differ only in lightness. */
function maxChroma(l: number, hue: number): number {
  let lo = 0;
  let hi = 0.37;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (oklchToRgb(l, mid, hue)) lo = mid;
    else hi = mid;
  }
  return lo;
}

const rgb = ([r, g, b]: Rgb, alpha?: number) => (alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`);

type Board = { level: number; n: number; odd: number; base: string; oddColour: string; glow: string };

function makeBoard(level: number, n: number, odd: number, light: number, step: number, chroma: number, hue: number): Board {
  const oddLight = light + step;
  const c = Math.min(chroma, maxChroma(light, hue), maxChroma(oddLight, hue));
  const base = oklchToRgb(light, c, hue) ?? [128, 128, 128];
  const other = oklchToRgb(oddLight, c, hue) ?? [128, 128, 128];
  return { level, n, odd, base: rgb(base), oddColour: rgb(other), glow: rgb(base, 0.6) };
}

/* A new level: the hue jumps well away from the last one so levels never
   look alike, and the odd tile goes lighter or darker at random, unless one
   way would leave the pleasant middle of the lightness range. */
function randomBoard(level: number, lastHue: number | null): { board: Board; hue: number } {
  const n = sizeFor(level);
  const step = stepFor(level);
  const hue = lastHue === null ? Math.random() * 360 : (lastHue + 70 + Math.random() * 220) % 360;
  const light = 0.5 + Math.random() * 0.28;
  const canUp = light + step <= 0.9;
  const canDown = light - step >= 0.34;
  const up = canUp && (!canDown || Math.random() < 0.5);
  const board = makeBoard(level, n, Math.floor(Math.random() * n * n), light, up ? step : -step, 0.06 + Math.random() * 0.1, hue);
  return { board, hue };
}

/* The board shown before the first go. Its colours are fixed, so the page
   renders the same on the server and in the browser, and its odd tile is an
   easy one that gently pulses to show what the game is. */
const PREVIEW = makeBoard(0, 3, 2, 0.7, -0.11, 0.11, 215);

/* Paper bits for a new best, thrown out in a ring from the score. */
const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const dist = 70 + (i % 3) * 24;
  return { x: Math.round(Math.cos(angle) * dist), y: Math.round(Math.sin(angle) * dist * 0.7), r: (i * 47) % 360 };
});

function buzz(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* no vibration here */ }
}

type Mark = { key: number; x: number; y: number; s: number; colour?: string };
type Phase = "idle" | "playing" | "reveal" | "over";

/* The five tiers as a row of chips, for the hero copy on a wide screen, so
   a player knows what to aim for before the first go. */
export function ColourTiers() {
  return (
    <ol className="cg-tiers" aria-label="Score tiers, by levels cleared">
      {TIERS.map((t) => <li key={t.name} className={t.tone}><b>{t.min}+</b>{t.name}</li>)}
    </ol>
  );
}

export function ColourGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [board, setBoard] = useState<Board>(PREVIEW);
  const [score, setScore] = useState(0);
  const [secs, setSecs] = useState(RUN_MS / 1000);
  const [best, setBest] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [trail, setTrail] = useState<string[]>([]);
  const [pop, setPop] = useState<Mark | null>(null);
  const [miss, setMiss] = useState<Mark | null>(null);
  const [plus, setPlus] = useState(0);
  const [minus, setMinus] = useState(0);
  const [shake, setShake] = useState(0);
  const [focusAt, setFocusAt] = useState(0);
  const [say, setSay] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLHeadingElement>(null);
  const endAt = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const bestRef = useRef<number | null>(null);
  const hueRef = useRef<number | null>(null);
  const trailRef = useRef<string[]>([]);
  const keyboard = useRef(false);
  const reduced = useRef(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  /* The best score lives in this browser only. Storage can be blocked (a
     private window, strict settings), and then the game simply has no best. */
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      const v = raw === null ? NaN : Number(raw);
      if (Number.isInteger(v) && v >= 0) {
        bestRef.current = v;
        setBest(v);
      }
    } catch { /* storage blocked: play without a best */ }
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  /* The clock. The bar is moved straight on the element every frame, and
     React only hears about whole seconds, so the grid is not redrawn 60
     times a second. A hidden tab pauses the clock instead of burning it. */
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    const loop = () => {
      const left = Math.max(0, endAt.current - performance.now());
      if (barRef.current) barRef.current.style.transform = `scaleX(${left / RUN_MS})`;
      const s = Math.ceil(left / 1000);
      setSecs((p) => (p === s ? p : s));
      if (left <= 0) { setPhase("reveal"); return; }
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        pausedAt.current = performance.now();
      } else if (pausedAt.current !== null) {
        endAt.current += performance.now() - pausedAt.current;
        pausedAt.current = null;
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase]);

  /* Time is up: show where the odd tile was for a moment, keep the best,
     then the end screen. */
  useEffect(() => {
    if (phase !== "reveal") return;
    const final = scoreRef.current;
    const prev = bestRef.current;
    if (prev === null || final > prev) {
      bestRef.current = final;
      try { window.localStorage.setItem(BEST_KEY, String(final)); } catch { /* not kept, still shown */ }
    }
    setBest(bestRef.current);
    setNewBest(prev !== null && final > prev);
    setTrail(trailRef.current.slice());
    setSay(`Time’s up. You cleared ${final} ${final === 1 ? "level" : "levels"}.`);
    const t = window.setTimeout(() => setPhase("over"), reduced.current ? 500 : 1100);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "over") return;
    cardRef.current?.scrollIntoView({ block: "nearest", behavior: reduced.current ? "auto" : "smooth" });
    if (keyboard.current) endRef.current?.focus({ preventScroll: true });
  }, [phase]);

  /* Keyboard players keep their place in the grid from level to level (one
     tile is in the tab order, the arrow keys move between tiles). */
  useEffect(() => {
    if (phase !== "playing" || !keyboard.current) return;
    (gridRef.current?.children[focusAt] as HTMLElement | undefined)?.focus();
  }, [phase, board, focusAt]);

  const start = (e: MouseEvent<HTMLButtonElement>) => {
    keyboard.current = e.detail === 0;
    scoreRef.current = 0;
    trailRef.current = [];
    setScore(0);
    setNewBest(false);
    setPop(null);
    setMiss(null);
    setPlus(0);
    setMinus(0);
    setShake(0);
    const next = randomBoard(1, null);
    hueRef.current = next.hue;
    setBoard(next.board);
    setFocusAt(0);
    endAt.current = performance.now() + RUN_MS;
    pausedAt.current = null;
    setSecs(RUN_MS / 1000);
    if (barRef.current) barRef.current.style.transform = "scaleX(1)";
    setPhase("playing");
    setSay("Level 1. Find the tile in a different shade.");
    cardRef.current?.scrollIntoView({ block: "nearest", behavior: reduced.current ? "auto" : "smooth" });
  };

  const pick = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    if (phase !== "playing") return;
    keyboard.current = e.detail === 0;
    const { n, odd } = board;
    const at = { x: ((i % n) + 0.5) / n, y: (Math.floor(i / n) + 0.5) / n, s: 1 / n };
    const key = performance.now();
    if (i === odd) {
      const cleared = scoreRef.current + 1;
      scoreRef.current = cleared;
      if (trailRef.current.length < 60) trailRef.current.push(board.base);
      setScore(cleared);
      setPop({ key, ...at, colour: board.oddColour });
      setPlus(key);
      later(() => setPop((p) => (p?.key === key ? null : p)), 600);
      later(() => setPlus((p) => (p === key ? 0 : p)), 800);
      buzz(12);
      const next = randomBoard(cleared + 1, hueRef.current);
      hueRef.current = next.hue;
      setBoard(next.board);
      setFocusAt(Math.min(i, next.board.n * next.board.n - 1));
      setSay(`Level ${cleared + 1}.`);
    } else {
      endAt.current -= PENALTY_MS;
      setMiss({ key, ...at });
      setMinus(key);
      setShake((s) => s + 1);
      setFocusAt(i);
      later(() => setMiss((m) => (m?.key === key ? null : m)), 650);
      later(() => setMinus((m) => (m === key ? 0 : m)), 800);
      buzz([30, 40, 30]);
      setSay("Not that one. 3 seconds off.");
    }
  };

  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const { n } = board;
    const total = n * n;
    let i = focusAt;
    if (e.key === "ArrowRight") i = Math.min(total - 1, i + 1);
    else if (e.key === "ArrowLeft") i = Math.max(0, i - 1);
    else if (e.key === "ArrowDown") i = i + n < total ? i + n : i;
    else if (e.key === "ArrowUp") i = i - n >= 0 ? i - n : i;
    else if (e.key === "Home") i -= i % n;
    else if (e.key === "End") i = i - (i % n) + n - 1;
    else return;
    e.preventDefault();
    keyboard.current = true;
    setFocusAt(i);
    (gridRef.current?.children[i] as HTMLElement | undefined)?.focus();
  };

  const share = async () => {
    const text = `I scored ${score} on the Divergent colour eye test (${TIERS[tierIndex(score)].name}). Can you beat it?`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Odd colour out", text, url: SHARE_URL });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${SHARE_URL}`)}`, "_blank", "noopener,noreferrer");
  };

  if (phase === "over") {
    return (
      <div className="cg-card" ref={cardRef} style={{ "--cg-glow": board.glow } as CSSProperties}>
        <p className="sr-only" aria-live="polite">{say}</p>
        <End score={score} best={best} newBest={newBest} trail={trail} onAgain={start} onShare={share} headRef={endRef} />
      </div>
    );
  }

  const { n } = board;
  const level = phase === "idle" ? 1 : score + 1;
  const gap = n <= 3 ? 10 : n <= 5 ? 7 : 5;
  const radius = n <= 3 ? 16 : n <= 5 ? 12 : 9;
  const low = phase !== "idle" && secs <= 10;
  const beating = phase !== "idle" && best !== null && score > best;
  const boardStyle = { "--n": n, "--gap": `${gap}px`, "--r": `${radius}px` } as CSSProperties;

  return (
    <div className="cg-card" ref={cardRef} style={{ "--cg-glow": board.glow } as CSSProperties}>
      <p className="sr-only" aria-live="polite">{say}</p>
      <div className="cg-hud">
        <p className="cg-stat">
          <span>Level</span>
          <b key={level} className={phase === "playing" && level > 1 ? "cg-up" : undefined}>{level}</b>
          {plus ? <span key={plus} className="cg-float cg-float--plus" aria-hidden="true">+1</span> : null}
        </p>
        <p className={`cg-stat cg-stat--mid${beating ? " cg-beat" : ""}`}>
          <span>Best</span>
          <b>{Math.max(best ?? 0, phase === "idle" ? 0 : score)}</b>
        </p>
        <p className={`cg-stat cg-stat--end${low ? " cg-low" : ""}`}>
          <span>Time</span>
          <b>{secs}s</b>
          {minus ? <span key={minus} className="cg-float cg-float--minus" aria-hidden="true">−3s</span> : null}
        </p>
      </div>
      <span className={`cg-bar${low ? " cg-low" : ""}`} aria-hidden="true"><i ref={barRef} /></span>
      <div className="cg-board" data-shake={shake ? (shake % 2 ? "a" : "b") : undefined} style={boardStyle}>
        <div
          key={board === PREVIEW ? "preview" : board.level}
          ref={gridRef}
          className={`cg-grid${phase === "reveal" ? " cg-reveal" : ""}`}
          role="group"
          aria-label={`Level ${level}: ${n} by ${n} tiles`}
          onKeyDown={onGridKey}
        >
          {Array.from({ length: n * n }, (_, i) => {
            const odd = i === board.odd;
            const mark = odd && phase === "idle" ? " cg-hint" : odd && phase === "reveal" ? " cg-answer" : "";
            return (
              <button
                key={i}
                type="button"
                className={`cg-tile${mark}`}
                style={{ background: odd ? board.oddColour : board.base }}
                tabIndex={phase === "playing" && i === focusAt ? 0 : -1}
                disabled={phase !== "playing"}
                aria-label={`Row ${Math.floor(i / n) + 1}, column ${(i % n) + 1}`}
                onClick={(e) => pick(i, e)}
              />
            );
          })}
        </div>
        <div className="cg-fx" aria-hidden="true">
          {pop ? <span key={pop.key} className="cg-pop" style={{ "--x": pop.x, "--y": pop.y, "--s": pop.s, "--pc": pop.colour } as CSSProperties} /> : null}
          {miss ? (
            <span key={miss.key} className="cg-miss" style={{ "--x": miss.x, "--y": miss.y, "--s": miss.s } as CSSProperties}>
              <svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17" /></svg>
            </span>
          ) : null}
        </div>
        {phase === "idle" ? (
          <div className="cg-start">
            <div className="cg-start-in">
              <button type="button" className="cg-play" onClick={start}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#play" /></svg>
                Play
              </button>
              <p>Tap the tile in a different shade.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function End({ score, best, newBest, trail, onAgain, onShare, headRef }: {
  score: number;
  best: number | null;
  newBest: boolean;
  trail: string[];
  onAgain: (e: MouseEvent<HTMLButtonElement>) => void;
  onShare: () => void;
  headRef: Ref<HTMLHeadingElement>;
}) {
  const t = tierIndex(score);
  const tier = TIERS[t];
  const next = TIERS[t + 1];
  const last = trail[trail.length - 1] ?? "#209BD2";
  return (
    <div className="cg-end">
      <p className="cg-end-k">Time’s up</p>
      <h2 className="cg-end-n" ref={headRef} tabIndex={-1} style={{ "--cg-last": last } as CSSProperties}>
        <span className="cg-end-num">{score}</span>
        <span className="cg-end-lab">{score === 1 ? "level" : "levels"} cleared</span>
        {newBest ? (
          <span className="cg-confetti" aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <i key={i} style={{ "--dx": `${c.x}px`, "--dy": `${c.y}px`, "--rot": `${c.r}deg`, background: trail.length ? trail[(i * 3) % trail.length] : "#FFC500" } as CSSProperties} />
            ))}
          </span>
        ) : null}
      </h2>
      {trail.length ? (
        <p className="cg-trail" aria-hidden="true">{trail.map((c, i) => <i key={i} style={{ background: c }} />)}</p>
      ) : null}
      <p className={`cg-tier ${tier.tone}`}>{tier.name}</p>
      <p className="cg-ladder" aria-hidden="true">
        {TIERS.map((x, i) => <i key={x.name} className={i <= t ? `cg-on ${x.tone}` : undefined} />)}
      </p>
      <p className="cg-next">{next ? `${next.min - score} more for ${next.name}` : "The top tier. Take a bow."}</p>
      <p className="cg-best">Best <b>{best ?? score}</b>{newBest ? <span className="cg-new">New best</span> : null}</p>
      <div className="cg-acts">
        <button type="button" className="btn" onClick={onAgain}>Play again</button>
        <button type="button" className="btn btn--ghost" onClick={onShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
          Share
        </button>
      </div>
      <div className="cg-hook">
        <p>Colour sense is tested in UCEED and NID.</p>
        <p className="cg-hook-a">
          <a className="cg-link" href="/aidmt/">Try the AIDMT mock <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          <a className="cg-link" href="/nid-masterclass/">NID masterclass <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
        </p>
      </div>
    </div>
  );
}
