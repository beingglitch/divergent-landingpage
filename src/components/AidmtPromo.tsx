"use client";

/* The parts of /aidmt/ that ask for the sale (app/aidmt/page.tsx).

   AidmtOffer: the next mock's registration deadline as a live countdown,
   Register, then the price against what it was and the bundle offer. In the
   hero, and again in the closing call to action.
   AidmtBuyBar: on a phone, the same Register pinned to the foot of the
   screen while neither of those two is in view.
   AidmtChallenge: one question against a 60 second clock, the way the mock
   asks it. The answer is drawn on the cube once it is in.

   Every number is real: the deadline is the sitting's close from the LMS,
   the old price and the bundle are the admin's. Nothing here invents
   scarcity or a crowd. */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ist } from "@/lib/config";
import { nextAidmt, rupees, type AidmtSitting } from "@/lib/aidmt";

const SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE, DAY = 24 * HOUR;

/* One clock for the page, ticking each second while anything shows it.
   ?preview-date=2026-11-24T22:00 stops it at another moment, the same
   switch components/Aidmt reads. */
let now = 0;
let timer = 0;
const listeners = new Set<() => void>();
function read(): number {
  const m = /[?&]preview-date=(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?/.exec(location.search);
  return m ? ist(m[1] + (m[2] ? m[2] + ":00" : "T12:00:00")).getTime() : Math.floor(Date.now() / SECOND) * SECOND;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = read();
    timer = window.setInterval(() => {
      now = read();
      listeners.forEach((l) => l());
    }, SECOND);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.clearInterval(timer);
      timer = 0;
    }
  };
}
const snapshot = () => now || (now = read());
/* The build time first, so the static HTML and the first client render match. */
const useClock = (builtAt: number) => useSyncExternalStore(subscribe, snapshot, () => builtAt);

function split(ms: number) {
  const t = Math.max(0, ms);
  return { d: Math.floor(t / DAY), h: Math.floor(t / HOUR) % 24, m: Math.floor(t / MINUTE) % 60, s: Math.floor(t / SECOND) % 60 };
}
const two = (n: number) => String(n).padStart(2, "0");

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

type Sale = {
  builtAt: number;
  series: AidmtSitting[];
  /* The series price, for a sitting the LMS gave no price of its own. */
  price: number;
  wasPrice: number | null;
  enrolUrl: string;
};

/* The sitting Register is for right now, what it costs, and the cut from the old price. */
function useSale({ builtAt, series, price, wasPrice }: Sale) {
  const t = useClock(builtAt);
  const s = nextAidmt(series, new Date(t));
  if (!s) return null;
  const cost = s.free ? 0 : s.price ?? price;
  const off = cost && wasPrice && wasPrice > cost ? Math.round(100 - (cost * 100) / wasPrice) : 0;
  return { t, s, cost, off, on: t >= ist(s.opens).getTime(), left: split(ist(s.closes).getTime() - t) };
}

export function AidmtOffer({ id, deal, ...sale }: Sale & { id?: string; deal: string | null }) {
  const now = useSale(sale);
  if (!now) return null;
  const { s, cost, off, on, left } = now;
  const units: [number, string][] = [[left.h, "hours"], [left.m, "mins"], [left.s, "secs"]];
  if (left.d) units.unshift([left.d, left.d === 1 ? "day" : "days"]);
  return (
    <div className="ao" id={id}>
      <p className="ao-k">{on ? <span className="ao-live" aria-hidden="true"></span> : null}{s.name} closes in</p>
      <p className="ao-clock" role="timer" aria-label={`${left.d ? `${left.d} days, ` : ""}${left.h} hours and ${left.m} minutes left`}>
        {units.map(([n, unit]) => <span key={unit} className="ao-u"><b>{two(n)}</b><small>{unit}</small></span>)}
      </p>
      <a className="btn ao-btn" href={sale.enrolUrl} data-aidmt-buy={s.key}>{cost ? `Register for ${rupees(cost)}` : "Register free"} <Arrow /></a>
      {off || (cost && deal) ? (
        <p className="ao-deal">
          {off ? <><s>{rupees(sale.wasPrice!)}</s><span className="ao-off">{off}% off</span></> : null}
          {cost && deal ? <span className="ao-bundle">{deal}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

/* away: what hides the bar while it is on screen (the two offers, the footer). */
export function AidmtBuyBar({ away, ...sale }: Sale & { away: string[] }) {
  const now = useSale(sale);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const els = away.map((sel) => document.querySelector(sel)).filter((el): el is Element => !!el);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setShown(seen.size === 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [away]);
  if (!now) return null;
  const { s, cost, left } = now;
  return (
    <div className={`abb${shown ? " on" : ""}`} inert={!shown}>
      <p className="abb-t">
        <b>{cost ? rupees(cost) : "Free"}{cost && sale.wasPrice && sale.wasPrice > cost ? <s>{rupees(sale.wasPrice)}</s> : null}</b>
        <small>Closes in {left.d ? `${left.d}d ` : ""}{left.h}h {two(left.m)}m{left.d ? "" : ` ${two(left.s)}s`}</small>
      </p>
      <a className="btn abb-btn" href={sale.enrolUrl} data-aidmt-buy={s.key}>Register <Arrow /></a>
    </div>
  );
}

/* ------------------------------------------------------------ the question */

/* Practice questions in the style of UCEED's Part A, one picked per visit
   (one the visitor has not seen, while any are left). say is the answer as
   it reads inside a sentence. figure names a drawing that shows the answer
   once it is in. Every answer here is worked out in its why. */
type Question = { topic: string; text: string; options: string[]; answer: number; why: string; say?: string; figure?: "cube" | "clock" | "square" };
const QUESTIONS: Question[] = [
  { topic: "Visualisation", figure: "cube", text: "A cube painted red on every face is cut into 27 equal smaller cubes. How many of the small cubes have exactly two red faces?", options: ["6", "8", "12", "24"], answer: 2, why: "One sits in the middle of each of the cube’s 12 edges." },
  { topic: "Reasoning", figure: "clock", text: "What is the angle between the hour and minute hands of a clock at 3:40?", options: ["120°", "130°", "140°", "150°"], answer: 1, why: "The minute hand is at 240°. The hour hand has moved on from 3 to 110°. That leaves 130° between them." },
  { topic: "Observation", figure: "square", text: "How many triangles can you find in a square with both its diagonals drawn?", options: ["4", "6", "8", "10"], answer: 2, why: "Four small ones meet in the middle, and each diagonal cuts the square into two big ones." },
  { topic: "Visualisation", text: "A square sheet of paper is folded in half, then in half again. One hole is punched through all the layers. How many holes are there when it is unfolded?", options: ["2", "3", "4", "8"], answer: 2, why: "Two folds make four layers, and the punch goes through all of them." },
  { topic: "Visualisation", text: "How many edges does a triangular prism have?", options: ["6", "8", "9", "12"], answer: 2, why: "Three round each triangular end, and three joining the ends." },
  { topic: "Reasoning", text: "What comes next: 2, 6, 12, 20, 30, …?", options: ["36", "40", "42", "48"], answer: 2, why: "The gaps grow by two each time: 4, 6, 8, 10, then 12." },
  { topic: "Reasoning", text: "What comes next: B, D, G, K, P, …?", options: ["T", "U", "V", "W"], answer: 2, why: "The gaps grow by one: two letters, three, four, five, then six after P." },
  { topic: "Reasoning", text: "On a map drawn to a scale of 1:50,000, two towns are 6 cm apart. How far apart are they on the ground?", options: ["300 m", "1.5 km", "3 km", "30 km"], answer: 2, why: "6 cm × 50,000 is 300,000 cm, which is 3 km." },
  { topic: "Science", text: "A gear with 20 teeth drives a gear with 40 teeth. When the small gear turns 10 times, how many times does the big gear turn?", options: ["5", "10", "20", "40"], answer: 0, why: "Both pass the same number of teeth: 20 × 10 is 40 × 5." },
  { topic: "Science", text: "A steel ball and a plastic ball of the same size are dropped together in a vacuum. Which one lands first?", options: ["The steel ball", "The plastic ball", "They land together", "It depends on the height"], answer: 2, say: "they land together", why: "With no air to slow them, everything falls with the same acceleration." },
  { topic: "Observation", text: "Which of these is a primary colour of light, the kind a screen mixes?", options: ["Yellow", "Green", "Magenta", "Cyan"], answer: 1, say: "green", why: "Screens mix red, green and blue light. Yellow, magenta and cyan are the primaries of printing ink." },
  { topic: "Design awareness", text: "Who drew up the master plan of Chandigarh?", options: ["Le Corbusier", "B. V. Doshi", "Charles Correa", "Laurie Baker"], answer: 0, why: "Le Corbusier planned the city in the early 1950s." },
  { topic: "Language", text: "Which of these words is spelt correctly?", options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"], answer: 1, say: "accommodate", why: "It has a double c and a double m." },
];
const LIMIT = 60;

/* A question the visitor has not had yet (remembered in this browser), and
   never the one just played. Storage can be missing; then any will do. */
const SEEN = "aidmt-try-seen";
function nextQuestion(current: number | null): number {
  let seen: number[] = [];
  try {
    const kept = JSON.parse(localStorage.getItem(SEEN) || "[]");
    if (Array.isArray(kept)) seen = kept.filter((n): n is number => typeof n === "number");
  } catch {}
  const all = QUESTIONS.map((_, n) => n).filter((n) => n !== current);
  let pool = all.filter((n) => !seen.includes(n));
  if (!pool.length) {
    seen = [];
    pool = all;
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  try {
    localStorage.setItem(SEEN, JSON.stringify([...seen, pick]));
  } catch {}
  return pick;
}

/* The 3 by 3 by 3 cube, drawn isometric. Once the answer is in, the small
   cubes in the middle of each edge light up: the 12 that have two red faces
   (9 of them in view). */
const U = 22;
const at = (x: number, y: number, z: number) => `${((x - y) * 0.866 * U).toFixed(1)},${((x + y) * 0.5 * U - z * U).toFixed(1)}`;
const FACES = [
  { name: "top", fill: "#F07867", corners: (a: number, b: number) => [at(a, b, 3), at(a + 1, b, 3), at(a + 1, b + 1, 3), at(a, b + 1, 3)] },
  { name: "left", fill: "#DA4F3D", corners: (a: number, b: number) => [at(a, 3, b), at(a + 1, 3, b), at(a + 1, 3, b + 1), at(a, 3, b + 1)] },
  { name: "right", fill: "#B9392B", corners: (a: number, b: number) => [at(3, a, b), at(3, a + 1, b), at(3, a + 1, b + 1), at(3, a, b + 1)] },
];
const CELLS = FACES.flatMap((face) =>
  [0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => ({
    key: `${face.name}-${a}-${b}`,
    points: face.corners(a, b).join(" "),
    fill: face.fill,
    /* One index in the middle and the other on the border: the middle of an edge. */
    mid: (a === 1) !== (b === 1),
  }))),
).map((cell, n, all) => ({ ...cell, delay: cell.mid ? all.slice(0, n).filter((c) => c.mid).length * 60 : 0 }));

function Cube() {
  return (
    <svg className="ach-fig ach-cube" viewBox="-60 -69 120 138" aria-hidden="true">
      {CELLS.map((c) => (
        <polygon key={c.key} className={c.mid ? "mid" : undefined} points={c.points} fill={c.fill} style={c.mid ? { animationDelay: `${c.delay}ms` } : undefined} />
      ))}
    </svg>
  );
}

/* A clock at 3:40. Once the answer is in, the 130° between the hands fills in. */
const hand = (deg: number, r: number) => [r * Math.sin((deg * Math.PI) / 180), -r * Math.cos((deg * Math.PI) / 180)].map((v) => +v.toFixed(2));
function Clock() {
  const [hx, hy] = hand(110, 22), [mx, my] = hand(240, 34);
  const [ax, ay] = hand(110, 30), [bx, by] = hand(240, 30);
  return (
    <svg className="ach-fig ach-clock" viewBox="-50 -50 100 100" aria-hidden="true">
      <circle className="face" r="46" />
      <path className="gap" d={`M0,0 L${ax},${ay} A30,30 0 0,1 ${bx},${by} Z`} />
      {Array.from({ length: 12 }, (_, n) => {
        const [x1, y1] = hand(n * 30, n % 3 ? 40 : 37), [x2, y2] = hand(n * 30, 44);
        return <line key={n} className="tick" x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      <line className="hour" x1="0" y1="0" x2={hx} y2={hy} />
      <line className="min" x1="0" y1="0" x2={mx} y2={my} />
      <circle className="pin" r="3.2" />
    </svg>
  );
}

/* A square and its diagonals. Once the answer is in, the four small triangles take colour. */
function Square() {
  return (
    <svg className="ach-fig ach-square" viewBox="-4 -4 108 108" aria-hidden="true">
      <polygon className="t t1" points="0,0 100,0 50,50" />
      <polygon className="t t2" points="100,0 100,100 50,50" />
      <polygon className="t t1" points="100,100 0,100 50,50" />
      <polygon className="t t2" points="0,100 0,0 50,50" />
      <rect className="edge" x="0" y="0" width="100" height="100" />
      <line className="edge" x1="0" y1="0" x2="100" y2="100" />
      <line className="edge" x1="100" y1="0" x2="0" y2="100" />
    </svg>
  );
}

const FIGURES = { cube: Cube, clock: Clock, square: Square };

export function AidmtChallenge({ enrolUrl, register }: { enrolUrl: string; register: string }) {
  /* The first question in the static HTML; the visitor's own once the page
     is running. It sits under a blur until the clock starts, so the swap
     never shows. */
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"ready" | "on" | "done">("ready");
  const [pick, setPick] = useState<number | null>(null);
  const [left, setLeft] = useState(LIMIT);
  const [took, setTook] = useState(0);
  const started = useRef(0);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setQi(nextQuestion(null));
  }, []);
  useEffect(() => {
    if (phase !== "on") return;
    first.current?.focus();
    const id = window.setInterval(() => {
      const l = Math.max(0, LIMIT - Math.floor((Date.now() - started.current) / SECOND));
      setLeft(l);
      if (!l) setPhase("done");
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, qi]);
  const begin = (question = qi) => {
    started.current = Date.now();
    setQi(question);
    setLeft(LIMIT);
    setPick(null);
    setPhase("on");
  };
  const choose = (n: number) => {
    if (phase !== "on") return;
    setPick(n);
    setTook(Math.max(1, Math.round((Date.now() - started.current) / SECOND)));
    setPhase("done");
  };
  const q = QUESTIONS[qi];
  const Figure = q.figure ? FIGURES[q.figure] : null;
  const right = pick === q.answer;
  const answer = q.say ?? q.options[q.answer];
  const result = phase !== "done" ? null
    : right ? { head: `Correct, in ${took} ${took === 1 ? "second" : "seconds"}.`, line: "Now try a whole paper, and see where it puts you in India." }
    : pick === null ? { head: `Time’s up. It’s ${answer}.`, line: `${q.why} The real paper won’t wait either.` }
    : { head: `Not quite. It’s ${answer}.`, line: `${q.why} Better to slip here than in the exam.` };
  const long = q.options.some((o) => o.length > 7);
  return (
    <div className={`ach is-${phase}`}>
      <div className="ach-top">
        <span className="ach-meta">{q.topic} · Single correct</span>
        <span className={`ach-timer${phase === "on" && left <= 10 ? " low" : ""}`} role="timer" aria-label={`${left} seconds left`}>
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle className="ach-tr" cx="18" cy="18" r="15.9" />
            <circle className="ach-tf" cx="18" cy="18" r="15.9" pathLength="100" style={{ strokeDashoffset: 100 - (left * 100) / LIMIT }} />
          </svg>
          0:{two(left)}
        </span>
      </div>
      <div className={`ach-body${Figure ? "" : " plain"}`} aria-hidden={phase === "ready"}>
        {Figure ? <Figure /> : null}
        <p className="ach-q">{q.text}</p>
      </div>
      <div className={`ach-opts${long ? " long" : ""}`} role="group" aria-label="Answers" aria-hidden={phase === "ready"}>
        {q.options.map((option, n) => (
          <button
            key={`${qi}-${option}`}
            ref={n === 0 ? first : undefined}
            type="button"
            className={`ach-o${phase === "done" && n === q.answer ? " right" : ""}${phase === "done" && n === pick && !right ? " wrong" : ""}`}
            disabled={phase !== "on"}
            onClick={() => choose(n)}
          >
            <span className="ach-l" aria-hidden="true">{"ABCD"[n]}</span>{option}
          </button>
        ))}
      </div>
      {phase === "ready" ? (
        <div className="ach-gate">
          <button type="button" className="btn btn--dark" onClick={() => begin()}>Start the clock</button>
          <small>60 seconds. One try.</small>
        </div>
      ) : null}
      {result ? (
        <div className="ach-res" role="status">
          <p className="ach-res-h">{result.head}</p>
          <p className="ach-res-p">{result.line}</p>
          <div className="ach-acts">
            <a className="btn" href={enrolUrl} data-aidmt-buy="">{register} <Arrow /></a>
            <button type="button" className="btn btn--ghost" onClick={() => begin(nextQuestion(qi))}>Try another</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ the FAQs */

/* The FAQs past the first few wait behind one button, so the page stays
   short. They are in the HTML all along: for search, and for site.ts, which
   wires every question up at load. */
export function AidmtFaqMore({ group, total }: { group: string; total: number }) {
  const [all, setAll] = useState(false);
  if (all) return null;
  return (
    <button
      className="btn btn--ghost btn--sm am-faq-more"
      type="button"
      onClick={() => {
        document.getElementById(group)?.setAttribute("data-all", "");
        setAll(true);
      }}
    >
      Show all {total} questions
    </button>
  );
}
