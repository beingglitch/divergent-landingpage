"use client";

/* The NID readiness check on /nid-masterclass/: eight quick questions, all
   answered with one tap (nothing to draw or upload). Seven are NID-style
   questions with one right answer (perspective, light and shadow, nets,
   mirror images, a sequence, colour, counting cubes) and one asks how many
   mock papers they have sat. Then a readiness score out of 100, a level, a
   skill map against where the 21 days aim, and the masterclasses to start
   with. It gives a level, never a rank: there is no data behind a rank.
   Nothing is stored or sent; "Ask a mentor" opens WhatsApp with the result
   written out. */

import { useEffect, useMemo, useState, type ReactNode } from "react";

type Axis = "drawing" | "visual" | "observe" | "create" | "design" | "exam";
const AXES: { key: Axis; name: string; topic: string }[] = [
  { key: "drawing", name: "Drawing", topic: "Drawing & sketching" },
  { key: "visual", name: "Visualisation", topic: "Visualization & perspective" },
  { key: "observe", name: "Observation", topic: "Observation & visual understanding" },
  { key: "create", name: "Problem-solving", topic: "Creative thinking & problem-solving" },
  { key: "design", name: "Design sense", topic: "Composition, colour & form" },
  { key: "exam", name: "Exam craft", topic: "NID question practice & strategy" },
];

type Option = { label: ReactNode; say: string; pts: number };
/* tiles: answers are pictures. bare: answers are one letter or number, in a row of four. */
type Question = { key: string; kind: "self" | "puzzle"; tag: string; axes: Axis[]; text: string; figure?: ReactNode; options: Option[]; tiles?: boolean; bare?: boolean; why?: string };

/* ---------------------------------------------------------------- figures */

/* Six squares of a cube net, on a unit grid. */
function Net({ cells }: { cells: [number, number][] }) {
  const w = Math.max(...cells.map((c) => c[0])) + 1, h = Math.max(...cells.map((c) => c[1])) + 1;
  return (
    <svg className="rq-net" viewBox={`-0.1 -0.1 ${w + 0.2} ${h + 0.2}`} aria-hidden="true">
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)}
    </svg>
  );
}

/* The F shape, turned (r quarter turns) and maybe flipped. */
const F_CELLS: [number, number][] = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]];
function shapeOf(turns: number, flip: boolean): [number, number][] {
  let cells = F_CELLS.map(([x, y]) => [flip ? -x : x, y] as [number, number]);
  for (let i = 0; i < turns; i++) cells = cells.map(([x, y]) => [-y, x]);
  const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]);
}
function Shape({ turns, flip, base = false }: { turns: number; flip: boolean; base?: boolean }) {
  return (
    <svg className={`rq-shape${base ? " base" : ""}`} viewBox="-0.15 -0.15 3.3 3.3" aria-hidden="true">
      {shapeOf(turns, flip).map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.08" />)}
    </svg>
  );
}

/* A word on a colour, for the contrast question. */
function Swatch({ fg, bg }: { fg: string; bg: string }) {
  return <span className="rq-swatch" style={{ color: fg, background: bg }} aria-hidden="true">STOP</span>;
}

/* A stack of cubes, drawn isometric, back ones first. */
const CUBES: [number, number, number][] = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 0, 2]];
const U = 26;
const iso = (x: number, y: number, z: number) => `${((x - y) * 0.866 * U).toFixed(1)},${((x + y) * 0.5 * U - z * U).toFixed(1)}`;
function Stack() {
  const order = [...CUBES].sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2]);
  return (
    <svg className="rq-fig rq-stack" viewBox="-70 -84 160 160" aria-hidden="true">
      {order.map(([x, y, z]) => (
        <g key={`${x}${y}${z}`}>
          <polygon className="t" points={[iso(x, y, z + 1), iso(x + 1, y, z + 1), iso(x + 1, y + 1, z + 1), iso(x, y + 1, z + 1)].join(" ")} />
          <polygon className="l" points={[iso(x, y + 1, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, z + 1), iso(x, y + 1, z + 1)].join(" ")} />
          <polygon className="r" points={[iso(x + 1, y, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, z + 1), iso(x + 1, y, z + 1)].join(" ")} />
        </g>
      ))}
    </svg>
  );
}

/* A box in two-point perspective where one edge misses its vanishing point
   (B: the bottom right edge runs too flat). Labels sit on the edges. */
type P = readonly [number, number];
const mix = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function cross(a1: P, a2: P, b1: P, b2: P): P {
  const d = (a1[0] - a2[0]) * (b1[1] - b2[1]) - (a1[1] - a2[1]) * (b1[0] - b2[0]);
  const p = a1[0] * a2[1] - a1[1] * a2[0], q = b1[0] * b2[1] - b1[1] * b2[0];
  return [(p * (b1[0] - b2[0]) - (a1[0] - a2[0]) * q) / d, (p * (b1[1] - b2[1]) - (a1[1] - a2[1]) * q) / d];
}
const VL: P = [12, 36], VR: P = [228, 36];
const FT: P = [112, 76], FB: P = [112, 140];
const LT = mix(FT, VL, 0.34), LB = mix(FB, VL, 0.34);
const RT = mix(FT, VR, 0.4);
const RB: P = [mix(FB, VR, 0.4)[0], mix(FB, VR, 0.4)[1] + 14];
const BT = cross(LT, VR, RT, VL);
const EDGES: [P, P][] = [[FT, FB], [FT, LT], [LT, LB], [FB, LB], [FT, RT], [RT, RB], [FB, RB], [LT, BT], [RT, BT]];
const LABELS: [string, P][] = [["A", mix(FT, LT, 0.5)], ["B", mix(FB, RB, 0.5)], ["C", mix(RT, BT, 0.5)], ["D", mix(FB, LB, 0.5)]];
function PerspectiveBox() {
  return (
    <svg className="rq-fig rq-box" viewBox="0 0 240 158" aria-hidden="true">
      <line x1="0" y1={VL[1]} x2="240" y2={VR[1]} className="hl" />
      <circle cx={VL[0]} cy={VL[1]} r="3.5" className="vp" /><circle cx={VR[0]} cy={VR[1]} r="3.5" className="vp" />
      <text x={VL[0] - 2} y={VL[1] - 8} className="lab">VP1</text><text x={VR[0] + 2} y={VR[1] - 8} className="lab" textAnchor="end">VP2</text>
      {EDGES.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="edge" />)}
      {LABELS.map(([l, [x, y]]) => <g key={l}><circle cx={x} cy={y} r="8.5" className="tag" /><text x={x} y={y} dy="0.35em" textAnchor="middle" className="tagt">{l}</text></g>)}
    </svg>
  );
}

/* A ball lit from one side, with its shadow on the ground. hx, hy place the
   highlight (-1 to 1), sx moves the shadow. */
function Ball({ id, hx, hy, sx }: { id: string; hx: number; hy: number; sx: number }) {
  return (
    <svg className="rq-ball" viewBox="0 0 100 76" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.5" r="0.62" fx={0.5 + hx * 0.3} fy={0.5 + hy * 0.3}>
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.3" stopColor="#9FD6F0" /><stop offset="1" stopColor="#135E80" />
        </radialGradient>
      </defs>
      <line x1="4" y1="64" x2="96" y2="64" className="gr" />
      <ellipse cx={50 + sx} cy="65" rx="24" ry="5.5" className="sh" />
      <circle cx="50" cy="42" r="20" fill={`url(#${id})`} />
    </svg>
  );
}
function Sun() {
  return (
    <svg className="rq-fig rq-sun" viewBox="0 0 160 110" aria-hidden="true">
      <circle cx="26" cy="24" r="12" className="sun" />
      {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={26 + Math.cos(a) * 17} y1={24 + Math.sin(a) * 17} x2={26 + Math.cos(a) * 23} y2={24 + Math.sin(a) * 23} className="ray" />; })}
      <path d="M46 40 L118 86" className="beam" />
      <path d="M118 86 l-13 -2 M118 86 l-4 -12" className="beam" />
      <text x="24" y="104" className="lab">light from the top left</text>
    </svg>
  );
}

/* An arrow, turned `deg` clockwise from pointing up, in ink or blue. */
function Arrowhead({ deg, blue }: { deg: number; blue: boolean }) {
  return (
    <svg className="rq-arrow" viewBox="-20 -20 40 40" aria-hidden="true">
      <path transform={`rotate(${deg})`} d="M0,-15 L10,-3 L3.5,-3 L3.5,14 L-3.5,14 L-3.5,-3 L-10,-3 Z" className={blue ? "b" : "k"} />
    </svg>
  );
}
function Sequence() {
  return (
    <div className="rq-seq" aria-hidden="true">
      <Arrowhead deg={0} blue={false} /><Arrowhead deg={45} blue /><Arrowhead deg={90} blue={false} /><span className="rq-seq-q">?</span>
    </div>
  );
}

const self = (a: string, b: string, c: string, d: string): Option[] => [a, b, c, d].map((label, n) => ({ label, say: label, pts: 3 - n }));

const QUESTIONS: Question[] = [
  {
    key: "perspective", kind: "puzzle", tag: "Perspective", axes: ["drawing", "design"], bare: true,
    text: "One edge of this box misses its vanishing point. Which one?",
    figure: <PerspectiveBox />,
    why: "B. Edges that run to the right must meet at VP2; B runs too flat, so the box’s base twists.",
    options: ["A", "B", "C", "D"].map((label, n) => ({ label, say: `Edge ${label}`, pts: n === 1 ? 3 : 0 })),
  },
  {
    key: "shadow", kind: "puzzle", tag: "Light and shadow", axes: ["drawing", "observe"], tiles: true,
    text: "The light comes from the top left. Which ball is lit and shadowed correctly?",
    figure: <Sun />,
    why: "C. The bright spot faces the light (top left) and the shadow falls away from it, to the right.",
    options: [
      { label: <Ball id="rq-b1" hx={-1} hy={-1} sx={-22} />, say: "A: highlight top left, shadow to the left", pts: 0 },
      { label: <Ball id="rq-b2" hx={1} hy={-1} sx={22} />, say: "B: highlight top right, shadow to the right", pts: 0 },
      { label: <Ball id="rq-b3" hx={-1} hy={-1} sx={22} />, say: "C: highlight top left, shadow to the right", pts: 3 },
      { label: <Ball id="rq-b4" hx={-1} hy={1} sx={22} />, say: "D: highlight bottom left, shadow to the right", pts: 0 },
    ],
  },
  {
    key: "net", kind: "puzzle", tag: "Visualisation", axes: ["visual", "exam"], tiles: true,
    text: "Which of these folds into a closed cube?",
    why: "C, the cross. In A and D two squares land on the same face, and B’s strip of five wraps over itself.",
    options: [
      { label: <Net cells={[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]} />, say: "A, a 2 by 3 block", pts: 0 },
      { label: <Net cells={[[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [2, 0]]} />, say: "B, a strip of five", pts: 0 },
      { label: <Net cells={[[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]]} />, say: "C, a cross", pts: 3 },
      { label: <Net cells={[[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 0]]} />, say: "D, a strip of four with two squares on top", pts: 0 },
    ],
  },
  {
    key: "mirror", kind: "puzzle", tag: "Observation", axes: ["observe", "visual"], tiles: true,
    text: "Three of these are this shape, turned. Which one is flipped?",
    figure: <Shape turns={0} flip={false} base />,
    why: "B is the mirror image: no amount of turning makes it match. A, C and D are the same shape turned.",
    options: [
      { label: <Shape turns={1} flip={false} />, say: "A", pts: 0 },
      { label: <Shape turns={2} flip />, say: "B", pts: 3 },
      { label: <Shape turns={2} flip={false} />, say: "C", pts: 0 },
      { label: <Shape turns={3} flip={false} />, say: "D", pts: 0 },
    ],
  },
  {
    key: "sequence", kind: "puzzle", tag: "Reasoning", axes: ["create", "exam"], tiles: true,
    text: "What comes next?",
    figure: <Sequence />,
    why: "A. Each arrow turns 45° clockwise, and the colour swaps between black and blue.",
    options: [
      { label: <Arrowhead deg={135} blue />, say: "A: pointing down right, blue", pts: 3 },
      { label: <Arrowhead deg={135} blue={false} />, say: "B: pointing down right, black", pts: 0 },
      { label: <Arrowhead deg={180} blue />, say: "C: pointing down, blue", pts: 0 },
      { label: <Arrowhead deg={315} blue />, say: "D: pointing up left, blue", pts: 0 },
    ],
  },
  {
    key: "contrast", kind: "puzzle", tag: "Design sense", axes: ["design", "create"], tiles: true,
    text: "Which sign is easiest to read from far away?",
    why: "D. Yellow on black has the biggest jump in lightness, which is why hazard signs use it. Red on green looks bright but the two are almost equally light.",
    options: [
      { label: <Swatch fg="#C7CDD3" bg="#FFFFFF" />, say: "Light grey on white", pts: 0 },
      { label: <Swatch fg="#E5484D" bg="#2E8B57" />, say: "Red on green", pts: 0 },
      { label: <Swatch fg="#3B5BDB" bg="#7B2CBF" />, say: "Blue on purple", pts: 0 },
      { label: <Swatch fg="#FFC500" bg="#0B0B0C" />, say: "Yellow on black", pts: 3 },
    ],
  },
  {
    key: "cubes", kind: "puzzle", tag: "Visualisation", axes: ["visual", "observe", "exam"], bare: true,
    text: "How many cubes are in this stack? Every cube rests on the floor or on another cube.",
    figure: <Stack />,
    why: "8: five on the floor, two on the second level and one on top. The one under the tower is hidden, but the tower needs it.",
    options: ["6", "7", "8", "9"].map((label, n) => ({ label, say: label, pts: n === 2 ? 3 : 0 })),
  },
  {
    key: "papers", kind: "self", tag: "About you", axes: ["exam"],
    text: "How many full NID mock papers have you sat against the clock?",
    options: self("Three or more", "One or two", "Only parts of one", "None yet"),
  },
];

const PUZZLES = QUESTIONS.filter((q) => q.kind === "puzzle");

type Result = { score: number; axes: { key: Axis; name: string; topic: string; v: number }[]; right: number };

function resultOf(picks: number[]): Result {
  const pts = QUESTIONS.map((q, i) => q.options[picks[i]]?.pts ?? 0);
  const score = Math.round((pts.reduce((a, b) => a + b, 0) * 100) / (QUESTIONS.length * 3));
  const axes = AXES.map((a) => {
    const mine = QUESTIONS.map((q, i) => (q.axes.includes(a.key) ? pts[i] / 3 : null)).filter((v): v is number => v !== null);
    return { ...a, v: mine.reduce((x, y) => x + y, 0) / mine.length };
  });
  const right = QUESTIONS.filter((q, i) => q.kind === "puzzle" && pts[i] === 3).length;
  return { score, axes, right };
}

function levelOf(score: number) {
  if (score >= 75) return { name: "Mains-ready", line: "You have the base. The 21 days add speed, finish and strategy: what turns a pass into a top rank." };
  if (score >= 45) return { name: "Almost there", line: "You’re closer than you think. Close the gaps below and you’re in the Mains zone." };
  return { name: "Ready to climb", line: "Good news: almost all of NID can be learnt. 21 focused days move every line on this chart." };
}

/* 0 to 1 over `ms` once `on`, eased. */
function useGrow(on: boolean, ms = 1100) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!on) {
      setP(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const x = Math.min(1, (t - t0) / ms);
      setP(1 - Math.pow(1 - x, 3));
      if (x < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on, ms]);
  return p;
}

const TARGET = 0.85;
function Radar({ axes, p }: { axes: Result["axes"]; p: number }) {
  const R = 86, N = axes.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    return [Math.cos(a) * R * v, Math.sin(a) * R * v] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).map((c) => c.toFixed(1)).join(",")).join(" ");
  const you = axes.map((a) => Math.max(0.1, a.v) * p);
  return (
    <svg className="rq-radar" viewBox="-160 -118 320 236" role="img" aria-label={`Your skills: ${axes.map((a) => `${a.name} ${Math.round(a.v * 100)}%`).join(", ")}.`}>
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={poly(axes.map(() => f))} className="rq-ring" />)}
      {axes.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1="0" y1="0" x2={x} y2={y} className="rq-spoke" />; })}
      <polygon points={poly(axes.map(() => TARGET * p))} className="rq-target" />
      <polygon points={poly(you)} className="rq-you" />
      {you.map((v, i) => { const [x, y] = pt(i, v); return <circle key={i} cx={x} cy={y} r="4" className="rq-dot" />; })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 1.18);
        return <text key={a.key} x={x} y={y} textAnchor={Math.abs(x) < 8 ? "middle" : x > 0 ? "start" : "end"} dominantBaseline="middle" className="rq-axis">{a.name}</text>;
      })}
    </svg>
  );
}

export function MasterclassQuiz({ enrolHref, whatsapp }: { enrolHref: string; whatsapp: string }) {
  const [step, setStep] = useState(-1);
  const [picks, setPicks] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState(false);
  const done = step >= QUESTIONS.length;
  const result = useMemo(() => (done ? resultOf(picks) : null), [done, picks]);
  const p = useGrow(done);

  const choose = (n: number) => {
    if (chosen !== null) return;
    setChosen(n);
    window.setTimeout(() => {
      setPicks((list) => {
        const next = [...list];
        next[step] = n;
        return next;
      });
      setChosen(null);
      setStep((s) => s + 1);
    }, 260);
  };
  const restart = () => {
    setPicks([]);
    setAnswers(false);
    setStep(0);
  };

  if (step < 0) {
    return (
      <div className="rq rq--intro">
        <div className="rq-intro-art" aria-hidden="true">
          <Radar axes={AXES.map((a, i) => ({ ...a, v: [0.7, 0.45, 0.8, 0.55, 0.65, 0.4][i] }))} p={1} />
        </div>
        <div className="rq-intro-c">
          <p className="rq-k">NID readiness check</p>
          <h3>Find your gaps in 2 minutes.</h3>
          <ul className="rq-facts"><li>8 questions</li><li>One tap each</li><li>No sign-up</li></ul>
          <button type="button" className="btn btn--dark" onClick={() => setStep(0)}>Start the check <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></button>
        </div>
      </div>
    );
  }

  if (result) {
    const level = levelOf(result.score);
    const weak = [...result.axes].sort((a, b) => a.v - b.v).slice(0, 3);
    const ask = `Hi, I took the NID readiness check: ${result.score}/100 (${level.name}). Weakest: ${weak.map((w) => w.name).join(", ")}. Which masterclass program suits me?`;
    return (
      <div className="rq rq--done" role="status">
        <div className="rq-score">
          <div className="rq-ring-big" style={{ "--v": `${result.score * p}` } as React.CSSProperties}>
            <b>{Math.round(result.score * p)}</b><small>/100</small>
          </div>
          <div>
            <p className="rq-k">Your NID readiness</p>
            <p className="rq-level">{level.name}</p>
            <p className="rq-line">{level.line}</p>
            <p className="rq-puz">Correct: <b>{result.right} of {PUZZLES.length}</b> · <button type="button" className="rq-link" aria-expanded={answers} onClick={() => setAnswers((a) => !a)}>{answers ? "Hide the answers" : "See the answers"}</button></p>
          </div>
        </div>
        {answers ? (
          <ol className="rq-why">{PUZZLES.map((q) => <li key={q.key}><b>{q.text}</b><span>{q.why}</span></li>)}</ol>
        ) : null}
        <div className="rq-grid">
          <figure className="rq-map">
            <Radar axes={result.axes} p={p} />
            <figcaption><span className="rq-key you"></span>You <span className="rq-key target"></span>Where the 21 days aim</figcaption>
          </figure>
          <div className="rq-focus">
            <p className="rq-k">{result.score >= 75 ? "Sharpen these in the 21 days" : "Start with these masterclasses"}</p>
            <ol>
              {weak.map((w, i) => (
                <li key={w.key}><span className="rq-n">{i + 1}</span><span><b>{w.topic}</b><small>{w.name} today: {Math.round(w.v * 100)}%</small></span></li>
              ))}
            </ol>
            <div className="rq-acts">
              <a className="btn btn--dark" href={enrolHref}>Close these gaps in 21 days <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(ask)}`} target="_blank" rel="noopener">Ask a mentor about it</a>
            </div>
            <button type="button" className="rq-link rq-again" onClick={restart}>Take it again</button>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="rq rq--q">
      <div className="rq-top">
        <ol className="rq-steps" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
          {QUESTIONS.map((x, i) => <li key={x.key} className={i < step ? "done" : i === step ? "on" : ""}></li>)}
        </ol>
        <span className="rq-count">{step + 1}/{QUESTIONS.length}</span>
      </div>
      <p className="rq-tag">{q.tag}</p>
      <div className={`rq-body${q.figure ? " has-fig" : ""}`} key={q.key}>
        {q.figure ? <div className="rq-figbox">{q.figure}</div> : null}
        <p className="rq-q">{q.text}</p>
      </div>
      <div className={`rq-opts${q.tiles ? " tiles" : ""}${q.bare ? " bare" : ""}`} role="group" aria-label="Answers">
        {q.options.map((o, n) => (
          <button key={`${q.key}-${n}`} type="button" className={`rq-o${chosen === n ? " on" : ""}`} aria-label={o.say} onClick={() => choose(n)}>
            {q.bare ? null : <span className="rq-l" aria-hidden="true">{"ABCD"[n]}</span>}
            <span className="rq-ol">{o.label}</span>
          </button>
        ))}
      </div>
      {step > 0 ? <button type="button" className="rq-link rq-back" onClick={() => setStep((s) => s - 1)}>Back</button> : null}
    </div>
  );
}
