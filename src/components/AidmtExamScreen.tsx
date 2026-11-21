"use client";

/* The AIDMT exam screen on /aidmt/: a working copy of the app's own, the
   computer-based test screen in the LMS (apps/student
   dashboard/courses/[slug]/tests/[testId]/page.tsx and its test-taking
   components). Every size, colour and word below is taken from there, so the
   two match pixel for pixel at the same window size; change one, change the
   other. The clock runs while it is on screen, the options, keypad, tabs and
   question map work, and nothing is sent anywhere.

   Laid out at 1280 by 860, a laptop screen, and scaled to fit, like the hero
   scorecard. */

import { useEffect, useReducer, useRef, useState, type CSSProperties, type ReactNode } from "react";

const W = 1280;
const H = 860;
const PART_SECS = 120 * 60;
const STARTED = 9;

type State = "answered" | "not_answered" | "not_visited" | "review" | "review_answered";
const STATES: { id: State; label: string }[] = [
  { id: "answered", label: "Answered" },
  { id: "not_answered", label: "Not answered" },
  { id: "not_visited", label: "Not visited" },
  { id: "review", label: "Marked for review" },
  { id: "review_answered", label: "Answered and marked for review (will be evaluated)" },
];

/* Part A of the UCEED mock: three sections, forty questions. */
type Kind = "NUMERIC" | "MCQ" | "SCQ";
const SECTIONS: { tab: string; title: string; kind: Kind; first: number; last: number; points: number; negative: number }[] = [
  { tab: "NAT", title: "Section 1", kind: "NUMERIC", first: 0, last: 13, points: 4, negative: 0 },
  { tab: "MSQ", title: "Section 2", kind: "MCQ", first: 14, last: 23, points: 4, negative: 1 },
  { tab: "MCQ", title: "Section 3", kind: "SCQ", first: 24, last: 39, points: 3, negative: 1 },
];
const COUNT = 40;
const TYPE_LABEL: Record<Kind, string> = { SCQ: "Single correct", MCQ: "Multiple correct", NUMERIC: "Numerical" };
const sectionOf = (i: number) => SECTIONS.find((s) => i >= s.first && i <= s.last)!;

const QUESTIONS: Record<Kind, { prompt: string; options?: string[] }> = {
  NUMERIC: { prompt: "How many cubes are there in the stack shown below? Count the ones you cannot see as well." },
  MCQ: { prompt: "Which of these words mean the same as meticulous? Select all that apply.", options: ["Careful", "Careless", "Thorough", "Hasty"] },
  SCQ: { prompt: "A cube painted red on every face is cut into 27 equal smaller cubes. How many of the small cubes have exactly two red faces?", options: ["6", "8", "12", "24"] },
};

/* Where the paper stands when the visitor arrives: in Section 3, on Q27. */
const FIRST: State[] = Array.from({ length: COUNT }, (_, i) => {
  if (i < 10) return i === 4 ? "review" : i === 7 ? "not_answered" : "answered";
  if (i < 14) return "not_visited";
  if (i < 20) return i === 17 ? "review_answered" : "answered";
  if (i < 24) return "not_visited";
  return i === 24 ? "answered" : i === 25 ? "review_answered" : i === 26 ? "not_answered" : "not_visited";
});

type Answer = string | string[];
type Exam = { at: number; states: State[]; answers: Record<number, Answer> };
type Act = { t: "answer"; value: Answer } | { t: "type"; key: string } | { t: "save" } | { t: "mark" } | { t: "clear" } | { t: "flag" } | { t: "go"; i: number };

const filled = (a: Answer | undefined) => (Array.isArray(a) ? a.length > 0 : !!a);

function move(e: Exam, i: number): Exam {
  const at = Math.max(0, Math.min(COUNT - 1, i));
  return { ...e, at, states: e.states.map((s, n) => (n === at && s === "not_visited" ? "not_answered" : s)) };
}

/* The paper's state in one place, so quick presses never read a stale answer. */
function exam(e: Exam, a: Act): Exam {
  const value = e.answers[e.at];
  const mark = (st: State) => e.states.map((s, n) => (n === e.at ? st : s));
  switch (a.t) {
    case "answer":
      return { ...e, answers: { ...e.answers, [e.at]: a.value } };
    case "type": {
      const now = typeof value === "string" ? value : "";
      const next = a.key === "backspace" ? now.slice(0, -1) : a.key === "clear" ? "" : a.key === "left" || a.key === "right" ? now : now + a.key;
      return /^-?\d*\.?\d*$/.test(next) ? { ...e, answers: { ...e.answers, [e.at]: next } } : e;
    }
    case "save":
      return move({ ...e, states: mark(filled(value) ? "answered" : "not_answered") }, e.at + 1);
    case "mark":
      return move({ ...e, states: mark(filled(value) ? "review_answered" : "review") }, e.at + 1);
    case "clear":
      return { ...e, answers: { ...e.answers, [e.at]: sectionOf(e.at).kind === "MCQ" ? [] : "" }, states: mark("not_answered") };
    case "flag": {
      const flagged = e.states[e.at] === "review" || e.states[e.at] === "review_answered";
      return { ...e, states: mark(flagged ? (filled(value) ? "answered" : "not_answered") : filled(value) ? "review_answered" : "review") };
    }
    case "go":
      return move(e, a.i);
  }
}

/* "1:59:51" (the app's clockText), and the timer's own "119:51". */
const clockText = (secs: number) => {
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = String(secs % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};
const timerText = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

/* Cube stacks for the numerical question, [x, y, z]: each rests on one below. */
const STACK: [number, number, number][] = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [0, 0, 2]];
function Stack() {
  const s = 30, C = s * 0.866, S = s * 0.5;
  const p = (a: number, b: number, c: number) => `${((a - b) * C).toFixed(1)},${((a + b) * S - c * s).toFixed(1)}`;
  const order = [...STACK].sort((m, n) => m[0] + m[1] - (n[0] + n[1]) || m[2] - n[2]);
  return (
    <svg viewBox="-110 -100 220 180" width="260" height="212" role="img" aria-label="A stack of cubes">
      {order.map(([x, y, z]) => (
        <g key={`${x}${y}${z}`} className="ex-cube">
          <polygon className="t" points={[p(x, y, z + 1), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)].join(" ")} />
          <polygon className="l" points={[p(x, y + 1, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)].join(" ")} />
          <polygon className="r" points={[p(x + 1, y, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x + 1, y, z + 1)].join(" ")} />
        </g>
      ))}
    </svg>
  );
}

/* lucide-react's Timer and Flag, as the app draws them. */
const TimerIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>;
const FlagIcon = ({ on }: { on: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" /></svg>;

export function AidmtExamScreen() {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [left, setLeft] = useState(PART_SECS - STARTED);
  const [saving, setSaving] = useState(false);
  const [{ at, states, answers }, act] = useReducer(exam, { at: 26, states: FIRST, answers: { 24: "12", 25: "8", 14: ["Careful", "Thorough"] } });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    /* The whole screen fits the column; on a phone that would be too small to
       read, so it stays at a readable size and pans sideways instead. */
    const ro = new ResizeObserver(() => setK(el.clientWidth / W));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  /* The clock runs only while the screen is in view. */
  useEffect(() => {
    if (!shown) return;
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [shown]);

  /* The app's own status line: "Saving responses…", then "All responses saved". */
  useEffect(() => {
    if (!saving) return;
    const id = window.setTimeout(() => setSaving(false), 700);
    return () => window.clearTimeout(id);
  }, [saving]);
  const save = (a: Act) => {
    setSaving(true);
    act(a);
  };

  const section = sectionOf(at);
  const q = QUESTIONS[section.kind];
  const value = answers[at];
  const flagged = states[at] === "review" || states[at] === "review_answered";
  const count = (st: State) => states.filter((s) => s === st).length;
  const circumference = 2 * Math.PI * 20;
  const progress = (PART_SECS - left) / PART_SECS;

  let response: ReactNode;
  if (section.kind === "NUMERIC") {
    const typed = typeof value === "string" ? value : "";
    const press = (key: string) => () => act({ t: "type", key });
    response = (
      <div className="ex-keypad">
        <input className="ex-keypad-input" aria-label="Numerical answer" type="text" inputMode="decimal" value={typed} onChange={(e) => /^-?\d*\.?\d*$/.test(e.target.value) && act({ t: "answer", value: e.target.value })} />
        <div className="ex-keypad-keys" aria-label="Numerical keypad">
          <button type="button" className="ex-key wide" onMouseDown={(e) => e.preventDefault()} onClick={press("backspace")}>Backspace</button>
          <div className="ex-digits">{["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "-"].map((d) => <button type="button" key={d} className="ex-key" onMouseDown={(e) => e.preventDefault()} onClick={press(d)}>{d}</button>)}</div>
          <div className="ex-arrows"><button type="button" className="ex-key" aria-label="Move cursor left" onClick={press("left")}>←</button><button type="button" className="ex-key" aria-label="Move cursor right" onClick={press("right")}>→</button></div>
          <button type="button" className="ex-key wide" onMouseDown={(e) => e.preventDefault()} onClick={press("clear")}>Clear all</button>
        </div>
      </div>
    );
  } else {
    const many = section.kind === "MCQ";
    const picked = Array.isArray(value) ? value : typeof value === "string" && value ? [value] : [];
    response = (
      <fieldset className={`ex-options${many ? " many" : ""}`}>
        <legend className="sr-only">Choose your answer</legend>
        {q.options!.map((option) => {
          const on = picked.includes(option);
          return (
            <label key={option} className="ex-option">
              <input type={many ? "checkbox" : "radio"} name={`ex-q${at}`} checked={on} onChange={() => act({ t: "answer", value: many ? (on ? picked.filter((p) => p !== option) : [...picked, option]) : option })} />
              <span className={`ex-${many ? "check" : "radio"}${on ? " on" : ""}`} aria-hidden="true"></span>
              <span>{option}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }

  return (
    <>
      <div className="ex" ref={box} style={{ "--k": k ?? 0.5 } as CSSProperties} role="region" aria-label="A working copy of the AIDMT exam screen">
        <div className="ex-size" style={k ? { width: W * k, height: (H + 34) * k } : undefined}>
        <div className="ex-plane">
          <div className="ex-win">
            <div className="ex-chrome" aria-hidden="true">
              <span className="ex-dots"><i></i><i></i><i></i></span>
              <span className="ex-url">app.divergentclasses.com/dashboard/courses/aidmt-2027/tests/aidmt-2</span>
            </div>
            <div className="ex-app">
              <header className="ex-header">
                <div><strong className="ex-title">AIDMT 2: UCEED Mock</strong><p className="ex-save" role="status">{saving ? "Saving responses…" : "All responses saved"} · Session checks active · Camera and microphone enabled</p></div>
                <div className="ex-clock">
                  <span>Part A<br />Time remaining</span>
                  <div className="ex-timer">
                    <div className="ex-ring">
                      <svg viewBox="0 0 48 48" aria-hidden="true">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.12" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * progress}`} />
                      </svg>
                      <span><TimerIcon /></span>
                    </div>
                    <div className="ex-timer-t"><b>{timerText(left)}</b><span>Remaining</span></div>
                  </div>
                </div>
                <button type="button" className="ex-fbtn ex-fbtn--outline">Review paper</button>
              </header>
              <div className="ex-parts" aria-label="Paper parts">
                <button type="button" className="ex-part on" aria-current="step"><strong>Part A</strong><span>120 min · In progress</span></button>
                <button type="button" className="ex-part" disabled><strong>Part B</strong><span>60 min · Opens in {clockText(left)}</span></button>
              </div>
              <nav className="ex-tabs-nav" aria-label="Part A sections">
                <div className="ex-tabs" role="tablist">
                  {SECTIONS.map((s) => (
                    <button key={s.tab} type="button" role="tab" aria-selected={s === section} className={`ex-tab${s === section ? " on" : ""}`} onClick={() => act({ t: "go", i: s.first })}>
                      <span>{s.tab}</span><small>{s.title} · {s.last - s.first + 1} questions · Q{s.first + 1}–Q{s.last + 1}</small>
                    </button>
                  ))}
                </div>
              </nav>
              <div className="ex-sub">
                <div className="ex-sub-left">
                  <span className="ex-qnum">Q. {at + 1} of {COUNT}</span>
                  <span>Question type: <strong>{TYPE_LABEL[section.kind]}</strong></span>
                  <span className="ex-marks">Marks for correct answer: {section.points} <span className="ex-neg">| Negative marks: {section.negative ? `−${section.negative}` : 0}</span></span>
                  <button type="button" className={`ex-flag${flagged ? " on" : ""}`} onClick={() => act({ t: "flag" })} title="Mark for review" aria-label="Mark for review" aria-pressed={flagged}><FlagIcon on={flagged} /></button>
                </div>
              </div>
              <div className="ex-layout">
                <div className="ex-main">
                  <div className="ex-qa" key={at}>
                    <details className="ex-instr">
                      <summary>{section.title} · Section instructions</summary>
                      <ul>
                        <li>This section contains {section.last - section.first + 1} questions.</li>
                        <li>{section.kind === "SCQ" ? "Select only one correct option for each question." : section.kind === "MCQ" ? "Select all correct options for each question." : "Enter your numerical answer in the response field."}</li>
                        <li>Marks and negative marks are shown for each question above.</li>
                        <li>Use Save &amp; Next to proceed, or Mark for review and next to revisit a question. All sections in this part share its timer.</li>
                      </ul>
                    </details>
                    <div className="ex-card">
                      <p className="ex-prompt">{q.prompt}</p>
                      {section.kind === "NUMERIC" ? (
                        <div className="ex-figure">
                          <div className="ex-figure-img"><Stack /></div>
                          <div className="ex-figure-bar"><span></span><button type="button">View image full size</button></div>
                        </div>
                      ) : null}
                      {response}
                    </div>
                  </div>
                </div>
              </div>
              <aside className="ex-side" aria-label="Question map">
                <div className="ex-student"><div className="ex-avatar" aria-hidden="true">A</div><strong>Aarav</strong></div>
                <div className="ex-nav">
                  <div className="ex-legend" role="group" aria-label="Response status counts">
                    {STATES.map((st) => (
                      <div key={st.id} className={st.id === "review_answered" ? "wide" : ""}>
                        <span className="ex-status" data-state={st.id}>{count(st.id)}{st.id === "review_answered" ? <i>✓</i> : null}</span><span>{st.label}</span>
                      </div>
                    ))}
                  </div>
                  <section aria-label={section.title}>
                    <div className="ex-grid">
                      {Array.from({ length: section.last - section.first + 1 }, (_, n) => section.first + n).map((i) => (
                        <button key={i} type="button" className="ex-status ex-qbtn" data-state={states[i]} data-current={i === at || undefined} onClick={() => act({ t: "go", i })} aria-label={`Question ${i + 1}, ${STATES.find((x) => x.id === states[i])!.label.toLowerCase()}`} aria-current={i === at ? "step" : undefined}>
                          {i + 1}{states[i] === "review_answered" ? <i>✓</i> : null}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="ex-side-acts"><button type="button">All questions</button><button type="button">Instructions</button></div>
              </aside>
              <div className="ex-footer">
                <div className="ex-footer-left">
                  <button type="button" className={`ex-fbtn ex-fbtn--outline${flagged ? " marked" : ""}`} onClick={() => save({ t: "mark" })}>Mark for review and next</button>
                  <button type="button" className="ex-fbtn ex-fbtn--outline" onClick={() => act({ t: "clear" })}>Clear response</button>
                </div>
                <div className="ex-footer-nav">
                  <button type="button" className="ex-arrow" onClick={() => act({ t: "go", i: at - 1 })} disabled={at <= 0} aria-label="Previous question">◀</button>
                  <span>{at + 1} of {COUNT}</span>
                  <button type="button" className="ex-arrow" onClick={() => act({ t: "go", i: at + 1 })} disabled={at >= COUNT - 1} aria-label="Next question">▶</button>
                </div>
                <div className="ex-footer-right">
                  <button type="button" className="ex-fbtn ex-fbtn--primary" onClick={() => save({ t: "save" })} disabled={at >= COUNT - 1}>Save &amp; Next</button>
                  <button type="button" className="ex-fbtn ex-fbtn--primary">Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
