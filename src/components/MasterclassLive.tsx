"use client";

/* "Step inside a masterclass" on /nid-masterclass/: a working copy of the
   app's live-class screen (LMS apps/student dashboard/live-classes/[id]:
   the shared screen, the mentor's camera, and Chat, Details and Files with
   Everyone, Mentor only and AI mentor). It plays a sample class: a mentor
   draws a toaster in two-point perspective on the board while the chat
   fills in.

   Live runs the class once when it comes on screen, as it would happen.
   Recording turns the same screen into the player: a timeline with the
   class's chapters that can be dragged, play and pause, and 1.5× or 2×.
   The drawing and the chat follow the timeline, so dragging it back undraws
   the board. Nothing is sent anywhere; a message typed in the chat gets a
   note that doubts are answered live in class. */

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

/* ------------------------------------------------------------ the board */

type Pt = readonly [number, number];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/* Where line a1-a2 crosses line b1-b2. */
function meet(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt {
  const d = (a1[0] - a2[0]) * (b1[1] - b2[1]) - (a1[1] - a2[1]) * (b1[0] - b2[0]);
  const p = a1[0] * a2[1] - a1[1] * a2[0];
  const q = b1[0] * b2[1] - b1[1] * b2[0];
  return [(p * (b1[0] - b2[0]) - (a1[0] - a2[0]) * q) / d, (p * (b1[1] - b2[1]) - (a1[1] - a2[1]) * q) / d];
}
const f = (p: Pt) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
const seg = (a: Pt, b: Pt) => `M${f(a)} L${f(b)}`;
const quad = (...ps: Pt[]) => `M${ps.map(f).join(" L")} Z`;
const ring = (c: Pt, r: number) => `M${c[0] - r},${c[1]} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`;

/* The board is 800 by 480. The horizon sits at eye level with a vanishing
   point at each end; the box (the toaster) stands below it, so its top shows. */
const HL = 150;
const VP1: Pt = [40, HL];
const VP2: Pt = [760, HL];
const FT: Pt = [350, 250];
const FB: Pt = [350, 380];
const LT = lerp(FT, VP1, 0.3), LB = lerp(FB, VP1, 0.3);
const RT = lerp(FT, VP2, 0.42), RB = lerp(FB, VP2, 0.42);
const BT = meet(LT, VP2, RT, VP1);
/* A point on a face: along its width, then down it (or across the top). */
const onTop = (u: number, v: number) => lerp(lerp(FT, RT, u), lerp(LT, BT, u), v);
const onLeft = (s: number, h: number) => lerp(lerp(FT, LT, s), lerp(FB, LB, s), h);
const onRight = (s: number, h: number) => lerp(lerp(FT, RT, s), lerp(FB, RB, s), h);

type Kind = "guide" | "pen" | "bold" | "hatch" | "slot" | "red";
type Stroke = { d: string; kind: Kind; at: number; dur?: number };

const HATCH: Stroke[] = Array.from({ length: 12 }, (_, i) => {
  const s = 0.08 + i * 0.076;
  return { kind: "hatch" as const, d: seg(onRight(s, 0.06), onRight(s, 0.95)), at: 0.78 + i * 0.006, dur: 0.02 };
});

const STROKES: Stroke[] = [
  { kind: "guide", d: `M0,${HL} L800,${HL}`, at: 0.02, dur: 0.06 },
  { kind: "bold", d: seg(FT, FB), at: 0.16 },
  { kind: "guide", d: seg(FT, VP1), at: 0.2 },
  { kind: "guide", d: seg(FT, VP2), at: 0.23 },
  { kind: "guide", d: seg(FB, VP1), at: 0.26 },
  { kind: "guide", d: seg(FB, VP2), at: 0.29 },
  { kind: "pen", d: seg(LT, LB), at: 0.35 },
  { kind: "pen", d: seg(RT, RB), at: 0.38 },
  { kind: "bold", d: seg(FT, LT), at: 0.42 },
  { kind: "bold", d: seg(FT, RT), at: 0.44 },
  { kind: "bold", d: seg(FB, LB), at: 0.46 },
  { kind: "bold", d: seg(FB, RB), at: 0.48 },
  { kind: "bold", d: seg(LT, LB), at: 0.5 },
  { kind: "bold", d: seg(RT, RB), at: 0.51 },
  { kind: "guide", d: seg(LT, VP2), at: 0.52 },
  { kind: "guide", d: seg(RT, VP1), at: 0.54 },
  { kind: "bold", d: seg(LT, BT), at: 0.56 },
  { kind: "bold", d: seg(RT, BT), at: 0.58 },
  { kind: "slot", d: quad(onTop(0.12, 0.26), onTop(0.88, 0.26), onTop(0.88, 0.38), onTop(0.12, 0.38)), at: 0.62 },
  { kind: "slot", d: quad(onTop(0.12, 0.6), onTop(0.88, 0.6), onTop(0.88, 0.72), onTop(0.12, 0.72)), at: 0.66 },
  { kind: "pen", d: seg(onLeft(0.5, 0.14), onLeft(0.5, 0.64)), at: 0.7 },
  { kind: "slot", d: quad(onLeft(0.34, 0.22), onLeft(0.66, 0.22), onLeft(0.66, 0.31), onLeft(0.34, 0.31)), at: 0.72 },
  ...HATCH,
  { kind: "red", d: ring(VP2, 20), at: 0.88 },
  { kind: "red", d: "M205,432 Q238,352 338,326 M338,326 l-15,-1 M338,326 l-9,12", at: 0.93 },
];

/* Words on the board, in the mentor's marker. */
const WORDS: { at: number; x: number; y: number; text: string; cls: string; anchor?: "start" | "middle" | "end" }[] = [
  { at: 0, x: 26, y: 46, text: "2-point perspective: a toaster", cls: "lc-w-title" },
  { at: 0.07, x: 70, y: 138, text: "HL = eye level", cls: "lc-w-note" },
  { at: 0.09, x: VP1[0] + 4, y: HL + 30, text: "VP1", cls: "lc-w-vp" },
  { at: 0.11, x: VP2[0] - 4, y: HL + 30, text: "VP2", cls: "lc-w-vp", anchor: "end" },
  { at: 0.9, x: 730, y: 108, text: "long edges → VP2", cls: "lc-w-red", anchor: "end" },
  { at: 0.95, x: 70, y: 458, text: "nearest edge = tallest", cls: "lc-w-red" },
];

const CHAPTERS = [
  { at: 0, title: "Horizon and vanishing points" },
  { at: 0.16, title: "Construction lines" },
  { at: 0.35, title: "Blocking the box" },
  { at: 0.6, title: "Details: slots and lever" },
  { at: 0.76, title: "Rendering and review" },
];
const chapterAt = (p: number) => CHAPTERS.reduce((n, c, i) => (p >= c.at ? i : n), 0);

const local = (p: number, s: Stroke) => Math.min(1, Math.max(0, (p - s.at) / (s.dur ?? 0.035)));

function Board({ p }: { p: number }) {
  return (
    <svg className="lc-board" viewBox="0 0 800 480" role="img" aria-label="A whiteboard: the mentor draws a toaster in two-point perspective, from the horizon and two vanishing points to the shaded box, with notes in red.">
      <defs>
        <pattern id="lc-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#DCE6EF" strokeWidth="1" /></pattern>
      </defs>
      <rect width="800" height="480" fill="#fff" />
      <rect width="800" height="480" fill="url(#lc-grid)" />
      {STROKES.map((s, i) => {
        const k = local(p, s);
        if (s.kind === "slot") return <path key={i} d={s.d} className="lc-s-slot" style={{ opacity: k }} />;
        return <path key={i} d={s.d} pathLength={1} className={`lc-s-${s.kind}`} style={{ strokeDasharray: 1, strokeDashoffset: 1 - k, opacity: k > 0 ? 1 : 0 }} />;
      })}
      {[VP1, VP2].map((v, i) => <circle key={i} cx={v[0]} cy={v[1]} r="5" className="lc-s-vp" style={{ opacity: p >= 0.09 + i * 0.02 ? 1 : 0 }} />)}
      {WORDS.map((w) => (
        <text key={w.text} x={w.x} y={w.y} className={w.cls} textAnchor={w.anchor ?? "start"} style={{ opacity: p >= w.at ? 1 : 0 }}>{w.text}</text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------- the chat */

type Role = "student" | "mentor" | "you" | "ai" | "note";
type Msg = { who: string; role: Role; text: ReactNode; at?: number };

const STUDENTS: Msg[] = [
  { at: 0.06, who: "Ananya", role: "student", text: "Is the horizon always at eye level?" },
  { at: 0.12, who: "", role: "mentor", text: "Always. Draw it first. Everything else hangs off it." },
  { at: 0.27, who: "Kabir", role: "student", text: "Why do the edges go to two different points?" },
  { at: 0.33, who: "", role: "mentor", text: "Two sets of parallel edges, two vanishing points. Verticals stay vertical." },
  { at: 0.6, who: "Riya", role: "student", text: "Do the bread slots go to VP2 too?" },
  { at: 0.65, who: "", role: "mentor", text: "Yes. They run along the long side, so VP2." },
  { at: 0.8, who: "Ishaan", role: "student", text: "The hatching makes it look so real 🔥" },
  { at: 0.96, who: "", role: "mentor", text: "Homework: your kettle in 2-point. Upload it for tomorrow’s review." },
];

const PRIVATE: Msg[] = [
  { who: "You", role: "you", text: "Can you check if my VP2 is too close to the box?" },
  { who: "", role: "mentor", text: "Send a photo in Files. I’ll go through it in the review round." },
];

const AI: Msg[] = [
  { who: "You", role: "you", text: "Sum up today’s class in three lines." },
  { who: "AI mentor", role: "ai", text: "1. Draw the horizon (your eye level) first. 2. Parallel edges meet at one vanishing point. 3. In 2-point, verticals stay vertical." },
];

type Room = "everyone" | "mentor" | "ai";
type Tab = "chat" | "details" | "files";
type Mode = "live" | "rec";

const LIVE_MS = 32000;
const REC_MS = 44000;
/* What the recording's clock reads at the end: a two-hour class. */
const REC_SECS = 6900;
/* The live clock starts part-way into the class. */
const LIVE_FROM = 41 * 60 + 12;

const clock = (secs: number) => {
  const s = Math.max(0, Math.round(secs));
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, r = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(r).padStart(2, "0")}`;
};

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const Icon = {
  back: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>,
  full: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>,
  play: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" className="fill" /></svg>,
  pause: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" className="fill" /></svg>,
  mic: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v3M4 4l16 16" /></svg>,
  hand: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0" /></svg>,
  chat: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z" /></svg>,
  info: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>,
  file: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6" /></svg>,
  people: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></svg>,
  lock: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  spark: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>,
  send: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z" /></svg>,
};

export type LiveMentor = { name: string; line: string; photo: string | null };

/* program: the course as the app names it ("21 DAYS NID MASTERCLASS"). classes: masterclasses in all. */
export function MasterclassLive({ mentor, enrolHref, program, classes }: { mentor: LiveMentor | null; enrolHref: string; program: string; classes: number }) {
  const box = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLOListElement>(null);
  const [mode, setMode] = useState<Mode>("live");
  const [p, setP] = useState(0);
  const [seen, setSeen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.5);
  const [liveSecs, setLiveSecs] = useState(LIVE_FROM);
  const [hand, setHand] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [room, setRoom] = useState<Room>("everyone");
  const [typed, setTyped] = useState("");
  const [mine, setMine] = useState<Msg[]>([]);
  const mentorName = mentor?.name ?? "Mentor";
  const first = mentorName.split(" ")[0];

  /* Live starts the first time the screen is mostly in view. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The board's clock: live plays once at class speed; the recording plays while Play is on. */
  const running = mode === "live" ? seen && p < 1 : playing;
  useEffect(() => {
    if (!running) return;
    if (mode === "live" && reducedMotion()) {
      setP(1);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const dt = t - last;
      last = t;
      setP((v) => Math.min(1, v + (mode === "live" ? dt / LIVE_MS : (dt * speed) / REC_MS)));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running, mode, speed]);

  /* The recording stops at its end. */
  useEffect(() => {
    if (mode === "rec" && p >= 1) setPlaying(false);
  }, [mode, p]);

  /* The live clock ticks while live. */
  useEffect(() => {
    if (mode !== "live" || !seen) return;
    const id = window.setInterval(() => setLiveSecs((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mode, seen]);

  const timed = STUDENTS.filter((m) => (m.at ?? 0) <= p);
  const thread = room === "everyone" ? [...timed, ...mine] : room === "mentor" ? PRIVATE : AI;

  /* New messages scroll the chat, never the page. */
  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length, room, tab]);

  const switchTo = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setPlaying(false);
    /* The recording opens part-way in, so the timeline has both sides; live picks up where it was. */
    if (next === "rec") setP((v) => (v >= 1 || v < 0.1 ? 0.44 : v));
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = typed.trim();
    if (!text) return;
    setTyped("");
    setRoom("everyone");
    setTab("chat");
    setMine((m) => [...m.slice(-3), { who: "You", role: "you", text }]);
    window.setTimeout(() => {
      setMine((m) => [...m, { who: "", role: "note", text: <>In the masterclass, your mentor answers this live. <a href={enrolHref}>Enrol to ask</a></> }]);
    }, 700);
  };

  const ch = chapterAt(p);
  const live = mode === "live";
  const finished = live && p >= 1;

  return (
    <div className="lc" ref={box}>
      <div className="lc-modes" role="group" aria-label="Show the class as">
        <button type="button" aria-pressed={live} className={live ? "on" : ""} onClick={() => switchTo("live")}><span className="lc-dot" aria-hidden="true"></span>Live class</button>
        <button type="button" aria-pressed={!live} className={!live ? "on" : ""} onClick={() => switchTo("rec")}><svg width="14" height="14" aria-hidden="true"><use href="#play" /></svg>Recording</button>
      </div>
      <p className="lc-mode-p">{live ? "Learn as it happens: ask in chat, your mentor answers in class." : "Every class is recorded. Drag the timeline, replay a chapter, watch at 1.5×."}</p>

      <div className="lc-win">
        <div className="sc-chrome lc-chrome" aria-hidden="true">
          <span className="sc-dots"><i></i><i></i><i></i></span>
          <span className="sc-url">app.divergentclasses.com/dashboard/live-classes</span>
          <span className="sc-sample">Preview: a sample class</span>
        </div>
        <div className="lc-app">
          <header className="lc-head">
            <span className="lc-back" aria-hidden="true">{Icon.back}</span>
            <div>
              <p className={`lc-pill${live ? " live" : ""}`}>{live ? <><span className="lc-dot" aria-hidden="true"></span>Live now</> : "Past class"}</p>
              <p className="lc-title">Perspective &amp; everyday objects by {mentorName}</p>
              <p className="lc-sub">{program} · Masterclass 4 of {classes} · 2 hrs</p>
            </div>
          </header>

          <div className="lc-main">
            <section className="lc-stage" aria-label="Class screen">
              <div className="lc-stage-top">
                <span><span className={`lc-dot${live ? "" : " off"}`} aria-hidden="true"></span>{CHAPTERS[ch].title}<small>{ch + 1}/{CHAPTERS.length}</small></span>
                <span className="lc-fs" aria-hidden="true">{Icon.full}Full screen</span>
              </div>
              <div className="lc-screen">
                <div className="lc-boardbox">
                  <Board p={p} />
                </div>
                <figure className={`lc-cam${live && running ? " talking" : ""}`}>
                  {mentor?.photo ? <img src={mentor.photo} alt="" width="160" height="160" loading="lazy" /> : <span className="lc-cam-i" aria-hidden="true">{first.slice(0, 1)}</span>}
                  <figcaption><b>{mentorName}</b>{mentor?.line ? <small>{mentor.line}</small> : null}</figcaption>
                </figure>
              </div>
              {live ? (
                <div className="lc-bar">
                  <span className="lc-live"><span className="lc-dot" aria-hidden="true"></span>LIVE</span>
                  <span className="lc-time">{clock(liveSecs)}</span>
                  {finished ? <button type="button" className="lc-again" onClick={() => setP(0)}>Watch again</button> : null}
                  <span className="lc-gap"></span>
                  <span className="lc-ic lc-ic-off" title="Your mic is off">{Icon.mic}</span>
                  <button type="button" className={`lc-hand${hand ? " on" : ""}`} aria-pressed={hand} onClick={() => setHand((h) => !h)}>{Icon.hand}{hand ? "Hand raised" : "Raise hand"}</button>
                </div>
              ) : (
                <div className="lc-bar">
                  <button type="button" className="lc-play" aria-label={playing ? "Pause" : "Play"} onClick={() => { if (p >= 1) setP(0); setPlaying((x) => !x); }}>{playing ? Icon.pause : Icon.play}</button>
                  <div className="lc-track">
                    <input type="range" min={0} max={1000} value={Math.round(p * 1000)} aria-label="Class timeline" aria-valuetext={`${clock(p * REC_SECS)}, ${CHAPTERS[ch].title}`} onChange={(e) => setP(Number(e.target.value) / 1000)} style={{ "--p": `${p * 100}%` } as CSSProperties} />
                    <span className="lc-ticks" aria-hidden="true">{CHAPTERS.slice(1).map((c) => <i key={c.at} style={{ left: `${c.at * 100}%` }}></i>)}</span>
                  </div>
                  <span className="lc-time">{clock(p * REC_SECS)} / {clock(REC_SECS)}</span>
                  <button type="button" className="lc-speed" aria-label={`Speed ${speed}×`} onClick={() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}>{speed}×</button>
                </div>
              )}
              {!live ? (
                <ol className="lc-chapters" aria-label="Chapters">
                  {CHAPTERS.map((c, i) => (
                    <li key={c.at}><button type="button" className={i === ch ? "on" : ""} onClick={() => setP(c.at + 0.001)}><b>{i + 1}</b>{c.title}</button></li>
                  ))}
                </ol>
              ) : null}
            </section>

            <aside className="lc-side" aria-label="Class chat">
              <div className="lc-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={tab === "chat"} className={tab === "chat" ? "on" : ""} onClick={() => setTab("chat")}>{Icon.chat}Chat</button>
                <button type="button" role="tab" aria-selected={tab === "details"} className={tab === "details" ? "on" : ""} onClick={() => setTab("details")}>{Icon.info}Details</button>
                <button type="button" role="tab" aria-selected={tab === "files"} className={tab === "files" ? "on" : ""} onClick={() => setTab("files")}>{Icon.file}Files (1)</button>
              </div>
              {tab === "chat" ? (
                <>
                  {!live && room === "everyone" ? <p className="lc-replay">Chat replay</p> : null}
                  <ol className="lc-feed" ref={feed}>
                    {thread.length ? thread.map((m, i) => (
                      <li key={`${room}-${i}`} className={`lc-msg ${m.role}`}>
                        {m.role === "note" ? null : <b>{m.role === "mentor" ? <>{mentorName}<em>Mentor</em></> : m.who}</b>}
                        <span>{m.text}</span>
                      </li>
                    )) : <li className="lc-empty">{Icon.chat}<b>No messages yet</b><span>Say hello, or ask {first} a question.</span></li>}
                  </ol>
                  <div className="lc-rooms" role="group" aria-label="Send to">
                    <button type="button" aria-pressed={room === "everyone"} className={room === "everyone" ? "on" : ""} onClick={() => setRoom("everyone")}>{Icon.people}Everyone</button>
                    <button type="button" aria-pressed={room === "mentor"} className={room === "mentor" ? "on" : ""} onClick={() => setRoom("mentor")}>{Icon.lock}Mentor only</button>
                    <button type="button" aria-pressed={room === "ai"} className={room === "ai" ? "on" : ""} onClick={() => setRoom("ai")}>{Icon.spark}AI mentor</button>
                  </div>
                  <form className="lc-send" onSubmit={send}>
                    <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Message the class" aria-label="Message the class" maxLength={140} />
                    <button type="submit" aria-label="Send">{Icon.send}</button>
                  </form>
                </>
              ) : tab === "details" ? (
                <dl className="lc-details">
                  <div><dt>Masterclass</dt><dd>4 of {classes} · Perspective &amp; everyday objects</dd></div>
                  <div><dt>Mentor</dt><dd>{mentorName}{mentor?.line ? `, ${mentor.line}` : ""}</dd></div>
                  <div><dt>Length</dt><dd>2 hours, with a live review round</dd></div>
                  <div><dt>Homework</dt><dd>Your kettle in 2-point perspective</dd></div>
                </dl>
              ) : (
                <ul className="lc-files">
                  <li>{Icon.file}<span><b>toaster-2-point-steps.pdf</b><small>Class notes · 6 pages</small></span></li>
                </ul>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
