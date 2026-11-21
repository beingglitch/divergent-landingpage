"use client";

/* The AIDMT scorecard on /aidmt/, filled with made-up students
   (lib/aidmt-sample). HeroDashboard is the whole scorecard, tilted, in the
   hero; each card is drawn again, larger, in its own section below
   (FeatureCard, FEATURES in lib/aidmt-scorecard). One sample student shows
   everywhere at once: SampleSwitch in the hero and SampleDock, which floats
   over the card sections, change it.

   Charts are plain SVG and HTML. You is the brand blue, the topper amber
   (#C98A00, darker than the logo yellow so it holds up on white), the
   average a grey reference. Every coloured mark also has a label, a key or a
   tooltip, and every chart a sentence for screen readers. A card draws
   itself the first time it is on screen, and again for each new student. */

import {
  createContext, useContext, useEffect, useId, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode, type RefObject,
} from "react";
import {
  CATEGORIES, SAMPLES, avgOf, bandOf, likelyRank, maxOf, percentileOf, questionsOf, scoreOf, topperOf,
  type Band, type CategoryKey, type SampleQuestion, type SampleScorecard,
} from "@/lib/aidmt-sample";
import { FEATURES, type FeatureId } from "@/lib/aidmt-scorecard";

const n0 = (v: number) => Math.round(v).toLocaleString("en-IN");
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
/* A later part of a reveal: 0 until `from`, then up to 1. */
const after = (p: number, from: number) => clamp((p - from) / (1 - from));

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* 0 to 1, eased, over `ms`. Starts again whenever `key` changes, once `run`. */
function useGrow(run: boolean, key: string, ms = 1300) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reducedMotion()) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const x = clamp((t - t0) / ms);
      setP(1 - Math.pow(1 - x, 3));
      if (x < 1) raf = requestAnimationFrame(step);
    };
    setP(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, key, ms]);
  return p;
}

/* Inside the hero every card starts together, once the dashboard is on
   screen (true). Elsewhere (null) each card starts when a quarter of it is. */
const Together = createContext<boolean | null>(null);

function useReveal(ref: RefObject<Element | null>, key: string) {
  const together = useContext(Together);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (together !== null) return;
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, together]);
  return useGrow(together ?? seen, key);
}

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* One floating note per card, placed by the pointer or the focused mark. */
type Tip = { x: number; y: number; body: ReactNode } | null;
function useTip() {
  const box = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const at = (clientX: number, clientY: number, body: ReactNode) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ x: clamp(clientX - r.left, 70, r.width - 70), y: clientY - r.top, body });
  };
  const near = (el: Element, body: ReactNode) => {
    const e = el.getBoundingClientRect();
    at(e.left + e.width / 2, e.top, body);
  };
  const view = tip ? <div className="sc-tip" role="status" style={{ left: tip.x, top: tip.y }}>{tip.body}</div> : null;
  return { box, at, near, hide: () => setTip(null), view };
}

/* ------------------------------------------------------- sample student */

type Lens = "all" | "class" | "women" | "cat";
type Sample = {
  s: SampleScorecard;
  pick: (id: string) => void;
  lens: Lens;
  setLens: (l: Lens) => void;
  cat: CategoryKey;
  setCat: (c: CategoryKey) => void;
};
const SampleCtx = createContext<Sample | null>(null);

export function SampleProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(SAMPLES[0].id);
  const [lens, setLens] = useState<Lens>("all");
  const [cat, setCat] = useState<CategoryKey>("GEN");
  const s = SAMPLES.find((x) => x.id === id)!;
  const pick = (next: string) => {
    setId(next);
    if (lens === "women" && !SAMPLES.find((x) => x.id === next)!.woman) setLens("all");
  };
  return <SampleCtx.Provider value={{ s, pick, lens, setLens, cat, setCat }}>{children}</SampleCtx.Provider>;
}

function useSample(): Sample {
  const c = useContext(SampleCtx);
  if (!c) throw new Error("AIDMT scorecard cards need a SampleProvider");
  return c;
}

export function SampleSwitch({ dock = false }: { dock?: boolean }) {
  const { s, pick } = useSample();
  return (
    <div className={`sc-switch${dock ? " sc-switch--dock" : ""}`} role="group" aria-label="Your exam">
      {SAMPLES.map((x) => (
        <button key={x.id} type="button" aria-pressed={x.id === s.id} className={x.id === s.id ? "on" : ""} onClick={() => pick(x.id)}>
          <b>{x.exam}</b><small>{x.name}, {x.cls}</small>
        </button>
      ))}
    </div>
  );
}

/* "Preparing for UCEED, NID or NIFT" in the hero: picks whose sample
   scorecard the whole page shows. */
export function ExamToggle() {
  const { s, pick } = useSample();
  return (
    <div className="ah-exam" role="group" aria-label="Choose your exam">
      <span>Preparing for</span>
      <div className="ah-exam-seg">
        {SAMPLES.map((x) => (
          <button key={x.id} type="button" aria-pressed={x.id === s.id} className={x.id === s.id ? "on" : ""} onClick={() => pick(x.id)}>{x.exam}</button>
        ))}
      </div>
    </div>
  );
}

/* The student picker, floating at the foot of the screen while `target` (the card sections) is in view. */
export function SampleDock({ target }: { target: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div className={`sc-dock${on ? " on" : ""}`} inert={!on}>
      <span className="sc-dock-k">Your exam</span>
      <SampleSwitch dock />
    </div>
  );
}

/* ------------------------------------------------------------ card parts */

function Card({ id, title, note, box, tip, children }: { id: FeatureId; title: string; note?: ReactNode; box: RefObject<HTMLElement | null>; tip?: ReactNode; children: ReactNode }) {
  return (
    <section className={`sc-card sc-${id}`} ref={box}>
      <header className="sc-card-h">
        <h4>{title}</h4>
        {note ? <div className="sc-card-note">{note}</div> : null}
      </header>
      {children}
      {tip}
    </section>
  );
}

function Key({ items }: { items: { label: string; kind: "you" | "avg" | "top" }[] }) {
  return (
    <ul className="sc-key">
      {items.map((it) => <li key={it.label}><i className={`k-${it.kind}`} aria-hidden="true"></i>{it.label}</li>)}
    </ul>
  );
}

/* A dropdown in the manner of shadcn's Select: a button that opens a list,
   the chosen option ticked. Arrow keys, Home and End move, Enter or Space
   picks, Escape closes, and a letter jumps to the next option starting with
   it. A click outside closes it. Built here rather than taken from shadcn,
   which needs Tailwind and Radix, neither of which this site uses. */
function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const at = Math.max(0, options.findIndex((o) => o.value === value));
  const show = () => {
    setActive(at);
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    close(true);
  };
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);
  const keys = (e: RKeyboardEvent) => {
    const last = options.length - 1;
    if (e.key === "ArrowDown") setActive((i) => Math.min(last, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") close(true);
    else if (e.key === "Tab") return close(false);
    else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const next = options.findIndex((o, i) => i > active && o.label.toLowerCase().startsWith(k));
      const first = options.findIndex((o) => o.label.toLowerCase().startsWith(k));
      if (next >= 0 || first >= 0) setActive(next >= 0 ? next : first);
    } else return;
    e.preventDefault();
  };
  return (
    <div className="sc-sel" ref={root}>
      <span className="sc-sel-l" id={`${id}l`}>{label}</span>
      <span className="sc-sel-w">
        <button
          ref={button}
          type="button"
          id={`${id}b`}
          className="sc-sel-b"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}l ${id}b`}
          onClick={() => (open ? close(true) : show())}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              show();
            }
          }}
        >
          <span>{options[at].label}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {open ? (
          <ul ref={list} className="sc-sel-list" role="listbox" tabIndex={-1} aria-labelledby={`${id}l`} aria-activedescendant={`${id}o${active}`} onKeyDown={keys}>
            {options.map((o, i) => (
              <li key={o.value} id={`${id}o${i}`} data-i={i} role="option" aria-selected={o.value === value} className={i === active ? "on" : ""} onPointerMove={() => setActive(i)} onClick={() => choose(i)}>
                {o.label}
                {o.value === value ? <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </span>
    </div>
  );
}

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.key, label: c.label }));

/* ------------------------------------------------------------------ rank */

function RankCard() {
  const { s, lens, setLens, cat, setCat } = useSample();
  const box = useRef<HTMLElement>(null);
  const share = CATEGORIES.find((c) => c.key === cat)!.share;
  const view = useMemo(() => {
    if (lens === "class") return { rank: s.classRank, of: s.classSize, who: `${s.cls} students` };
    if (lens === "women" && s.womenRank && s.womenSize) return { rank: s.womenRank, of: s.womenSize, who: "women" };
    if (lens === "cat") {
      const label = CATEGORIES.find((c) => c.key === cat)!.label;
      return { rank: Math.max(1, Math.round(s.rank * share * 0.92)), of: Math.round(s.takers * share), who: `${label} students` };
    }
    return { rank: s.rank, of: s.takers, who: "students across India" };
  }, [s, lens, cat, share]);
  const p = useReveal(box, `${s.id}-${lens}-${cat}`);
  const shown = Math.round(view.of - (view.of - view.rank) * p);
  const pct = percentileOf(view.rank, view.of);
  const lenses: { k: Lens; label: string; off?: boolean }[] = [
    { k: "all", label: "All India" },
    { k: "class", label: s.cls },
    { k: "women", label: "Women", off: !s.woman },
    { k: "cat", label: "Category" },
  ];
  return (
    <section className="sc-card sc-rank" ref={box}>
      <div className="sc-lens" role="group" aria-label="Rank among">
        {lenses.filter((l) => !l.off).map((l) => (
          <button key={l.k} type="button" aria-pressed={lens === l.k} className={lens === l.k ? "on" : ""} onClick={() => setLens(l.k)}>{l.label}</button>
        ))}
      </div>
      {lens === "cat" ? <Select label="Your category" value={cat} options={CATEGORY_OPTIONS} onChange={setCat} /> : null}
      <p className="sc-rank-k">{lens === "all" ? "All India Rank" : "Your rank"}</p>
      <p className="sc-rank-n"><span aria-hidden="true">{n0(shown)}</span><span className="sr-only">{n0(view.rank)}</span><small>of {n0(view.of)}</small></p>
      <div className="sc-pct">
        <svg viewBox="0 0 120 12" aria-hidden="true" preserveAspectRatio="none">
          <rect x="0" y="3" width="120" height="6" rx="3" className="sc-pct-bg" />
          <rect x="0" y="3" width={Math.max(6, 120 * (pct / 100) * p)} height="6" rx="3" className="sc-pct-fg" />
        </svg>
        <p><b>{(pct * p).toFixed(1)}</b> percentile</p>
      </div>
      <p className="sc-rank-s">Ahead of <b>{n0((view.of - view.rank) * p)}</b> {view.who}.</p>
    </section>
  );
}

/* ----------------------------------------------------- where in the crowd */

function normal(x: number, m: number, sd: number) {
  return Math.exp(-0.5 * ((x - m) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
}

function CrowdCard() {
  const { s } = useSample();
  const clip = useId();
  const [wrap, w] = useWidth<HTMLDivElement>(560);
  const t = useTip();
  const p = useReveal(t.box, s.id);
  const [hover, setHover] = useState<number | null>(null);
  const max = maxOf(s), you = scoreOf(s), avg = avgOf(s), top = topperOf(s);
  const BINS = 30;
  const step = max / BINS;
  const bins = Array.from({ length: BINS }, (_, i) => Math.round(s.takers * normal((i + 0.5) * step, s.mean, s.sd) * step));
  const H = 190, padT = 44, padB = 26, padX = 10;
  const peak = Math.max(...bins);
  const x = (v: number) => padX + (v / max) * (w - padX * 2);
  const y = (c: number) => H - padB - (c / peak) * (H - padT - padB) * after(p, 0.05);
  const pts = bins.map((c, i) => `${x((i + 0.5) * step).toFixed(1)},${y(c).toFixed(1)}`);
  const area = `M${x(0)},${H - padB} L${x(0)},${y(bins[0])} L${pts.join(" L")} L${x(max)},${y(bins[BINS - 1])} L${x(max)},${H - padB} Z`;
  const line = `M${x(0)},${y(bins[0])} L${pts.join(" L")} L${x(max)},${y(bins[BINS - 1])}`;
  const q = after(p, 0.35);
  const narrow = w < 420;
  const marks = [
    { v: avg, label: `${narrow ? "Avg" : "Average"} ${avg}`, kind: "avg", row: 1 },
    { v: top, label: `${narrow ? "Top" : "Topper"} ${top}`, kind: "top", row: 1 },
    { v: you, label: `You ${you}`, kind: "you", row: 0 },
  ] as const;
  /* Average reads to the left of its line and topper to the right, so the
     two never run into each other; each flips at the chart's edge. */
  const place = (v: number, kind: "you" | "avg" | "top") => {
    const at = x(v);
    if (kind === "you") return { x: at, anchor: at < 60 ? "start" : at > w - 60 ? "end" : "middle" } as const;
    const room = narrow ? 64 : 110;
    const left = kind === "avg" ? at > room : at > w - room;
    return left ? ({ x: at - 5, anchor: "end" } as const) : ({ x: at + 5, anchor: "start" } as const);
  };
  const move = (e: RPointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = clamp(Math.floor(((e.clientX - r.left) / r.width) * BINS), 0, BINS - 1);
    setHover(i);
    t.at(e.clientX, e.clientY - 8, <><b>{Math.round(i * step)} to {Math.round((i + 1) * step)} marks</b><span>{n0(bins[i])} students</span></>);
  };
  return (
    <Card id="crowd" title="Where you are in the crowd" note={<>Shaded: the <b>{n0(s.takers - s.rank)}</b> students you scored above.</>} box={t.box} tip={t.view}>
      <div ref={wrap} className="sc-svgbox">
        <svg width={w} height={H} role="img" aria-label={`Scores of ${n0(s.takers)} students. Average ${avg}, topper ${top}, you ${you} out of ${max}.`}>
          <defs>
            <clipPath id={clip}><rect x="0" y="0" width={x(you) * q} height={H} /></clipPath>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={x(max * f)} x2={x(max * f)} y1={padT - 6} y2={H - padB} className="sc-gl" />)}
          <path d={area} className="sc-area" />
          <path d={area} className="sc-area-you" clipPath={`url(#${clip})`} />
          <path d={line} className="sc-area-line" />
          {hover !== null ? <rect x={x(hover * step)} y={padT - 6} width={x(step) - padX} height={H - padB - padT + 6} className="sc-hoverband" /> : null}
          {marks.map((m) => (
            <g key={m.kind} className={`sc-mark sc-mark-${m.kind}`} style={{ opacity: q }}>
              <line x1={x(m.v)} x2={x(m.v)} y1={m.row ? 30 : 14} y2={H - padB} />
              {m.kind === "you" ? <circle cx={x(m.v)} cy={H - padB} r="5" /> : null}
              <text x={place(m.v, m.kind).x} y={m.row ? 26 : 10} textAnchor={place(m.v, m.kind).anchor}>{m.label}</text>
            </g>
          ))}
          <line x1={padX} x2={w - padX} y1={H - padB} y2={H - padB} className="sc-axis" />
          {[0, 0.25, 0.5, 0.75, 1].map((f) => <text key={f} x={x(max * f)} y={H - 8} className="sc-tick" textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"}>{Math.round(max * f)}</text>)}
          <rect x={padX} y={0} width={w - padX * 2} height={H} fill="transparent" onPointerMove={move} onPointerLeave={() => { setHover(null); t.hide(); }} />
        </svg>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------- part by part */

function PartsCard() {
  const { s } = useSample();
  const t = useTip();
  const p = useReveal(t.box, s.id);
  const q = after(p, 0.15);
  /* Strongest and weakest against the topper, so a short part is judged fairly. */
  const ratio = s.parts.map((part) => part.you / part.top);
  const best = ratio.indexOf(Math.max(...ratio));
  const worst = ratio.indexOf(Math.min(...ratio));
  return (
    <Card id="parts" title="Part by part" note={<Key items={[{ label: "You", kind: "you" }, { label: "Average", kind: "avg" }, { label: "Topper", kind: "top" }]} />} box={t.box} tip={t.view}>
      <ul className="sc-bars">
        {s.parts.map((part, n) => {
          const body = <><b>{part.name}</b><span>You {part.you} · Average {part.avg} · Topper {part.top}</span><span>Out of {part.max}</span></>;
          const show = (el: Element) => t.near(el, body);
          const k = after(q, n * 0.08);
          return (
            <li key={part.name} tabIndex={0} onPointerEnter={(e) => show(e.currentTarget)} onPointerLeave={t.hide} onFocus={(e) => show(e.currentTarget)} onBlur={t.hide}>
              <p className="sc-bar-h"><span>{part.name}{n === best ? <em className="sc-tag ok">Strongest</em> : n === worst ? <em className="sc-tag bad">Weakest</em> : null}</span><b>{part.you}<small>/{part.max}</small></b></p>
              <span className="sc-bar sc-bar-you" style={{ width: `${(part.you / part.max) * 100 * k}%` }}></span>
              <span className="sc-bar sc-bar-avg" style={{ width: `${(part.avg / part.max) * 100 * k}%` }}></span>
              <span className="sc-bar sc-bar-top" style={{ width: `${(part.top / part.max) * 100 * k}%` }}></span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ------------------------------------------------------------- skill map */

const weakestOf = (s: SampleScorecard) => [...s.skills].sort((a, b) => a.you / a.top - b.you / b.top)[0];

function SkillsCard() {
  const { s } = useSample();
  const t = useTip();
  const p = useReveal(t.box, s.id);
  const [hot, setHot] = useState<number | null>(null);
  const R = 92;
  const N = s.skills.length;
  const q = after(p, 0.2);
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    return [Math.cos(a) * R * v, Math.sin(a) * R * v] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).map((c) => c.toFixed(1)).join(",")).join(" ");
  const weakest = weakestOf(s);
  return (
    <Card id="skills" title="Skill map" note={<Key items={[{ label: "You", kind: "you" }, { label: "Topper", kind: "top" }]} />} box={t.box} tip={t.view}>
      <svg viewBox="-168 -128 336 252" className="sc-radar" role="img" aria-label={`Skills, you against the topper. Furthest from the topper: ${weakest.name}, ${weakest.you} against ${weakest.top}.`}>
        {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={poly(s.skills.map(() => f))} className="sc-ring" />)}
        {s.skills.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1="0" y1="0" x2={x} y2={y} className="sc-spoke" />; })}
        <polygon points={poly(s.skills.map((k) => (k.top / 100) * q))} className="sc-poly-top" />
        <polygon points={poly(s.skills.map((k) => (k.you / 100) * q))} className="sc-poly-you" />
        {s.skills.map((k, i) => { const [x, y] = pt(i, (k.you / 100) * q); return <circle key={k.name} cx={x} cy={y} r={hot === i ? 6 : 4.5} className="sc-dot-you" />; })}
        {s.skills.map((k, i) => {
          const [x, y] = pt(i, 1.2);
          const body = <><b>{k.name}</b><span>You {k.you}% · Topper {k.top}%</span></>;
          const on = (el: Element) => { setHot(i); t.near(el, body); };
          const off = () => { setHot(null); t.hide(); };
          return (
            <g key={k.name} className={`sc-axis-l${k === weakest ? " weak" : ""}${hot === i ? " hot" : ""}`} tabIndex={0} onPointerEnter={(e) => on(e.currentTarget)} onPointerLeave={off} onFocus={(e) => on(e.currentTarget)} onBlur={off}>
              <circle cx={x} cy={y} r="22" fill="transparent" />
              <text x={x} y={y} textAnchor={Math.abs(x) < 8 ? "middle" : x > 0 ? "start" : "end"} dominantBaseline="middle">{k.name}</text>
            </g>
          );
        })}
      </svg>
      <p className="sc-foot">Furthest from the topper: <b>{weakest.name}</b> ({weakest.you}% against {weakest.top}%).</p>
    </Card>
  );
}

/* -------------------------------------------------------------- accuracy */

function AccuracyCard() {
  const { s } = useSample();
  const box = useRef<HTMLElement>(null);
  const p = useReveal(box, s.id);
  const { correct, wrong, skipped, negative, topper } = s.accuracy;
  const total = correct + wrong + skipped;
  const q = after(p, 0.25);
  const segs = [
    { k: "ok", label: "Correct", v: correct },
    { k: "bad", label: "Wrong", v: wrong },
    { k: "skip", label: "Skipped", v: skipped },
  ];
  const acc = Math.round((correct / (correct + wrong)) * 100);
  return (
    <Card id="accuracy" title="Accuracy" note="Objective questions" box={box}>
      <p className="sc-big"><b>{Math.round(acc * q)}%</b> of your answers were right</p>
      <div className="sc-stack" role="img" aria-label={`${correct} correct, ${wrong} wrong, ${skipped} skipped.`}>
        {segs.map((g) => <span key={g.k} className={`sc-seg sc-seg-${g.k}`} style={{ flexGrow: g.v * q + 0.001 }}></span>)}
      </div>
      <ul className="sc-legend">
        {segs.map((g) => <li key={g.k}><i className={`sc-seg-${g.k}`} aria-hidden="true"></i>{g.label} <b>{g.v}</b><small>/{total}</small></li>)}
      </ul>
      <dl className="sc-mini">
        <div><dt>Attempted</dt><dd>{correct + wrong}<small>/{total}</small></dd></div>
        <div><dt>Topper&rsquo;s accuracy</dt><dd>{topper}%</dd></div>
      </dl>
      <p className="sc-warn"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 15 14H1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 6v3.6M8 11.4v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg><span>Negative marking cost you <b>{negative} marks</b>.</span></p>
    </Card>
  );
}

/* --------------------------------------------------------- time vs marks */

const ROWS = [
  { k: "right", label: "Earned" },
  { k: "wrong", label: "Lost" },
  { k: "skipped", label: "Skipped" },
] as const;
const mmss = (secs: number) => `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, "0")}s`;
const marksText = (m: number) => (m > 0 ? `+${+m.toFixed(2)}` : m < 0 ? `−${+(-m).toFixed(2)}` : "0");
const listOf = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

/* Every objective question on one line by the time it took, in rows for the
   marks it brought. Slow questions that still lost marks or were left blank
   are the time sinks: the ones to mark and move past next time. */
function TimeCard() {
  const { s } = useSample();
  const [wrap, w] = useWidth<HTMLDivElement>(460);
  const t = useTip();
  const p = useReveal(t.box, s.id);
  const qs = useMemo(() => questionsOf(s), [s]);
  const H = 160, padL = 62, padR = 10, padT = 18, padB = 24;
  const rowH = (H - padT - padB) / ROWS.length;
  const span = Math.ceil(Math.max(...qs.map((x) => x.secs)) / 60) * 60;
  const x = (secs: number) => padL + (secs / span) * (w - padL - padR);
  const median = [...qs].map((x) => x.secs).sort((m, n) => m - n)[Math.floor(qs.length / 2)];
  const cut = median * 2;
  const sinks = qs.filter((x) => x.outcome !== "right" && x.secs >= cut).sort((m, n) => n.secs - m.secs).slice(0, 3);
  const sinkMins = Math.round(sinks.reduce((sum, x) => sum + x.secs, 0) / 60);
  const sinkMarks = sinks.reduce((sum, x) => sum + x.marks, 0);
  const q = after(p, 0.1);
  const rowOf = (o: SampleQuestion["outcome"]) => ROWS.findIndex((r) => r.k === o);
  const jitter = (n: number) => ((((n * 37) % 13) / 12) - 0.5) * rowH * 0.55;
  return (
    <Card id="time" title="Marks against time" note="Each dot is a question" box={t.box} tip={t.view}>
      <div ref={wrap} className="sc-svgbox">
        <svg width={w} height={H} role="img" aria-label={`${qs.length} questions by the time each took. ${sinks.length} slow ones earned nothing.`}>
          <rect x={x(cut)} y={padT + rowH} width={Math.max(0, w - padR - x(cut))} height={rowH * 2} rx="6" className="sc-sink" style={{ opacity: q }} />
          <text x={w - padR - 6} y={H - padB - 6} textAnchor="end" className="sc-sink-l" style={{ opacity: q }}>Time sinks</text>
          {ROWS.map((r, i) => (
            <g key={r.k}>
              <line x1={padL} x2={w - padR} y1={padT + rowH * (i + 0.5)} y2={padT + rowH * (i + 0.5)} className="sc-gl" />
              <text x={padL - 10} y={padT + rowH * (i + 0.5)} textAnchor="end" dominantBaseline="middle" className="sc-row-l">{r.label}</text>
            </g>
          ))}
          <line x1={x(median)} x2={x(median)} y1={padT - 6} y2={H - padB} className="sc-med" />
          <text x={x(median)} y={padT - 8} textAnchor="middle" className="sc-tick">Your usual {mmss(median)}</text>
          {qs.map((one) => {
            const sink = sinks.includes(one);
            const body = <><b>Q{one.n} · {one.part}</b><span>{mmss(one.secs)} · {marksText(one.marks)} marks</span></>;
            return (
              <circle key={one.n} cx={padL + (x(one.secs) - padL) * q} cy={padT + rowH * (rowOf(one.outcome) + 0.5) + jitter(one.n)} r={sink ? 6 : 4.5}
                className={`sc-qd sc-qd-${one.outcome}${sink ? " sink" : ""}`} onPointerEnter={(e) => t.near(e.currentTarget, body)} onPointerLeave={t.hide} />
            );
          })}
          <text x={padL} y={H - 6} className="sc-tick">0 min</text>
          <text x={w - padR} y={H - 6} textAnchor="end" className="sc-tick">{span / 60} min</text>
        </svg>
      </div>
      {sinks.length ? (
        <p className="sc-foot">{listOf(sinks.map((x) => `Q${x.n}`))} took <b>{sinkMins} minutes</b> and {sinkMarks < 0 ? <>cost you <b>{+(-sinkMarks).toFixed(2)} marks</b></> : "earned nothing"}. Next time, mark them for review and move on.</p>
      ) : null}
    </Card>
  );
}

/* ------------------------------------------------------- easy ones missed */

function MissedCard() {
  const { s } = useSample();
  const box = useRef<HTMLElement>(null);
  const p = useReveal(box, s.id);
  const q = after(p, 0.35);
  return (
    <Card id="missed" title="Easy ones you missed" note="Most students got these right" box={box}>
      <ol className="sc-miss">
        {s.easyMissed.map((m) => (
          <li key={m.q}>
            <span className="sc-q">{m.q}</span>
            <span className="sc-miss-t"><b>{m.topic}</b><span className="sc-meter" aria-hidden="true"><span style={{ width: `${m.right * q}%` }}></span></span><small>{m.right}% got it right</small></span>
          </li>
        ))}
      </ol>
      <p className="sc-foot">Every question is solved in the mock’s solutions session.</p>
    </Card>
  );
}

/* -------------------------------------------------------------- progress */

function ProgressCard() {
  const { s } = useSample();
  const [wrap, w] = useWidth<HTMLDivElement>(420);
  const t = useTip();
  const p = useReveal(t.box, s.id);
  const H = 170, padX = 34, padT = 26, padB = 30;
  const n = s.progress.length;
  const vals = s.progress.map((x) => x.percentile);
  const lo = Math.max(0, Math.floor((Math.min(...vals) - 10) / 10) * 10);
  const x = (i: number) => (n === 1 ? w / 2 : padX + (i / (n - 1)) * (w - padX * 2));
  const y = (v: number) => padT + (1 - (v - lo) / (100 - lo)) * (H - padT - padB);
  const d = s.progress.map((pt, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(pt.percentile).toFixed(1)}`).join(" ");
  const q = after(p, 0.25);
  const last = s.progress[n - 1];
  const first = s.progress[0];
  const gain = Math.round((last.percentile - first.percentile) * 10) / 10;
  const ticks = [lo, Math.round((lo + 100) / 2), 100];
  const edge = (i: number) => (n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "middle");
  return (
    <Card id="progress" title="Mock to mock" note={gain > 0 ? <>Up <b>{gain}</b> percentile since {first.mock}</> : "Percentile in each mock"} box={t.box} tip={t.view}>
      <div ref={wrap} className="sc-svgbox">
        <svg width={w} height={H} role="img" aria-label={`Percentile: ${s.progress.map((pt) => `${pt.mock} ${pt.percentile}`).join(", ")}.`}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={padX} x2={w - padX} y1={y(v)} y2={y(v)} className="sc-gl" />
              <text x={padX - 8} y={y(v)} className="sc-tick" textAnchor="end" dominantBaseline="middle">{v}</text>
            </g>
          ))}
          <path d={d} pathLength={1} className="sc-line" style={{ strokeDasharray: 1, strokeDashoffset: 1 - q }} />
          {s.progress.map((pt, i) => {
            const vis = q >= (n === 1 ? 0 : i / (n - 1)) - 0.001;
            const body = <><b>{pt.mock}</b><span>{pt.percentile} percentile</span></>;
            return (
              <g key={pt.mock} className="sc-pt" style={{ opacity: vis ? 1 : 0 }} tabIndex={0}
                onPointerEnter={(e) => t.near(e.currentTarget, body)} onPointerLeave={t.hide} onFocus={(e) => t.near(e.currentTarget, body)} onBlur={t.hide}>
                <circle cx={x(i)} cy={y(pt.percentile)} r="16" fill="transparent" />
                <circle cx={x(i)} cy={y(pt.percentile)} r="5.5" className="sc-pt-dot" />
                <text x={x(i)} y={H - 8} className="sc-tick" textAnchor={edge(i)} dx={edge(i) === "start" ? -padX + 6 : edge(i) === "end" ? padX - 6 : 0}>{pt.mock}</text>
              </g>
            );
          })}
          <text x={x(n - 1)} y={y(last.percentile) - 14} className="sc-direct" textAnchor="end" style={{ opacity: q }}>{last.percentile}</text>
        </svg>
      </div>
      <ol className="sc-steps">
        {[...s.progress].reverse().map((pt, i, list) => {
          const prev = list[i + 1];
          const up = prev ? Math.round((pt.percentile - prev.percentile) * 10) / 10 : null;
          return (
            <li key={pt.mock}>
              <span>{pt.mock}</span>
              <b>{pt.percentile}</b>
              {up !== null ? <em className={up >= 0 ? "up" : "down"}>{up >= 0 ? "+" : "−"}{Math.abs(up)}</em> : <em>First</em>}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* -------------------------------------------------------------- colleges */

const BAND: Record<Band, { label: string; icon: ReactNode }> = {
  likely: { label: "Likely", icon: <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /> },
  possible: { label: "Possible", icon: <path d="M3 8h10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /> },
  reach: { label: "Reach", icon: <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /> },
  far: { label: "Not yet", icon: <circle cx="8" cy="8" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" /> },
};

function CollegesCard() {
  const { s, cat, setCat } = useSample();
  const box = useRef<HTMLElement>(null);
  const p = useReveal(box, s.id);
  const c = CATEGORIES.find((x) => x.key === cat)!;
  const range = likelyRank(s, c.share);
  const rows = s.colleges.map((col) => ({ ...col, band: bandOf(range, col.close) }));
  const inRange = rows.filter((r) => r.band !== "far").length;
  const q = after(p, 0.3);
  return (
    <Card id="colleges" title="Colleges in range" note="An estimate from one mock, never a promise" box={box}>
      <div className="sc-est">
        <p>Likely {s.exam} 2027 rank<b>{n0(range.low)} to {n0(range.high)}</b></p>
        <Select label="Category" value={cat} options={CATEGORY_OPTIONS} onChange={setCat} />
      </div>
      <ul className="sc-col-list">
        {rows.map((r, i) => {
          const k = clamp(q * 4 - i * 0.35);
          return (
            <li key={r.name} className={`b-${r.band}`} style={{ opacity: k, transform: `translateY(${(1 - k) * 8}px)` }}>
              <span className="sc-col-n">{r.name}<small>Closed near {n0(r.close)} last year</small></span>
              <span className="sc-band"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">{BAND[r.band].icon}</svg>{BAND[r.band].label}</span>
            </li>
          );
        })}
      </ul>
      <p className="sc-foot">{inRange ? `${inRange} of ${rows.length} in range now.` : s.cls === "Class 11" ? "None in range yet. With a year to go, that is normal: each mock shows how far you have closed the gap." : "None in range yet. The next mock shows how far you have closed the gap."} Closing ranks here are examples.</p>
    </Card>
  );
}

/* ------------------------------------------------------- rank card to share */

function drawCard(s: SampleScorecard): Promise<Blob | null> {
  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return Promise.resolve(null);
  const disp = '"Bricolage Grotesque", system-ui, sans-serif';
  const body = '"Instrument Sans", system-ui, sans-serif';
  g.fillStyle = "#0B0B0C";
  g.fillRect(0, 0, W, H);
  const grad = g.createRadialGradient(W / 2, -120, 40, W / 2, -120, 900);
  grad.addColorStop(0, "#6FCBF0");
  grad.addColorStop(0.45, "#209BD2");
  grad.addColorStop(1, "rgba(32,155,210,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#FFC500";
  g.beginPath();
  g.roundRect(80, 90, 300, 64, 32);
  g.fill();
  g.fillStyle = "#0B0B0C";
  g.font = `700 30px ${body}`;
  g.fillText("AIDMT 2027", 118, 133);
  g.fillStyle = "#fff";
  g.font = `600 44px ${body}`;
  g.fillText(s.mock, 80, 300);
  g.font = `500 40px ${body}`;
  g.fillStyle = "rgba(255,255,255,.7)";
  g.fillText("All India Rank", 80, 520);
  g.fillStyle = "#fff";
  g.font = `760 300px ${disp}`;
  g.fillText(String(s.rank), 66, 800);
  g.font = `600 56px ${disp}`;
  g.fillStyle = "#FFC500";
  g.fillText(`${percentileOf(s.rank, s.takers)} percentile`, 80, 920);
  g.fillStyle = "rgba(255,255,255,.7)";
  g.font = `500 40px ${body}`;
  g.fillText(`of ${n0(s.takers)} students · ${s.name}, ${s.cls}`, 80, 990);
  g.fillStyle = "rgba(255,255,255,.55)";
  g.font = `500 34px ${body}`;
  g.fillText("divergentclasses.com/aidmt", 80, H - 90);
  return new Promise((res) => c.toBlob(res, "image/png"));
}

function ShareCard() {
  const { s } = useSample();
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      await document.fonts?.ready;
      const blob = await drawCard(s);
      if (!blob) return;
      const file = new File([blob], `aidmt-rank-${s.id}.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare?.({ files: [file] }) && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ files: [file], title: "My AIDMT rank" }).catch(() => {});
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="sc-card sc-share">
      <div className="sc-story" aria-hidden="true">
        <span className="sc-story-tag">AIDMT 2027</span>
        <span className="sc-story-m">{s.mock}</span>
        <span className="sc-story-k">All India Rank</span>
        <b>{s.rank}</b>
        <span className="sc-story-p">{percentileOf(s.rank, s.takers)} percentile</span>
      </div>
      <div className="sc-share-t">
        <h4>A rank card to share</h4>
        <p>Made for an Instagram story. Download it the moment results are out.</p>
        <button type="button" className="btn btn--sm btn--ghost" onClick={save} disabled={busy}>{busy ? "Making the card…" : "Download this sample"}</button>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- the AI plan */

/* The study plan the scorecard's AI analysis writes from the paper: the
   topics worth the most marks back, and the weeks to win them. */
function PlanCard() {
  const { s } = useSample();
  const box = useRef<HTMLElement>(null);
  const p = useReveal(box, s.id);
  const score = scoreOf(s);
  const most = Math.max(...s.plan.focus.map((f) => f.gain));
  return (
    <section className="sc-card sc-plan" ref={box}>
      <header className="sc-card-h">
        <h4>Your plan</h4>
        <span className="sc-ai"><svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" fill="currentColor" /></svg>AI analysis</span>
      </header>
      <p className="sc-plan-up">Your score could rise from <b>{score}</b> to <b>{Math.round(score + (s.plan.to - score) * p)}</b></p>
      <ol className="sc-focus">
        {s.plan.focus.map((f, i) => (
          <li key={f.topic}>
            <span className="sc-focus-t"><b>{f.topic}</b><small>{f.why}</small></span>
            <span className="sc-focus-g">+{f.gain}</span>
            <span className="sc-meter" aria-hidden="true"><span style={{ width: `${(f.gain / most) * 100 * after(p, 0.2 + i * 0.12)}%` }}></span></span>
          </li>
        ))}
      </ol>
      <ol className="sc-weeks">
        {s.plan.weeks.map((week, i) => <li key={week}><span>Week {i + 1}</span>{week}</li>)}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------------- export */

const CARDS: Record<FeatureId, () => ReactNode> = {
  rank: RankCard,
  crowd: CrowdCard,
  parts: PartsCard,
  skills: SkillsCard,
  accuracy: AccuracyCard,
  time: TimeCard,
  missed: MissedCard,
  progress: ProgressCard,
  colleges: CollegesCard,
  plan: PlanCard,
  share: ShareCard,
};

/* One card on its own. */
export function FeatureCard({ id }: { id: FeatureId }) {
  const C = CARDS[id];
  return <C />;
}

/* The scorecard one card at a time, in three chapters so a long scroll reads
   as a story: where you stand, why marks slipped, what to do next. Each
   chapter is its own stage (dark, white, tint, as the site alternates).
   Its steps scroll past on the left; the card for the step in the middle of
   the screen stays pinned on the right, shrunk to fit a short screen. On a
   narrow screen there is no pinning: each step shows its own card. Steps keep
   their dashboard numbers, as on the hero's callouts. */
const CHAPTERS: { key: string; title: string; line: string; tone: "dark" | "light" | "tint"; ids: FeatureId[] }[] = [
  { key: "stand", title: "Where you stand", line: "Your rank, and the crowd it came from.", tone: "dark", ids: ["rank", "crowd"] },
  { key: "why", title: "Why marks slipped", line: "Part by part, skill by skill, answer by answer.", tone: "light", ids: ["parts", "skills", "accuracy", "time", "missed"] },
  { key: "next", title: "What to do next", line: "Where you’re heading, and how to get there sooner.", tone: "tint", ids: ["progress", "colleges", "plan", "share"] },
];
const numberOf = new Map(FEATURES.map((f, n) => [f.id, n + 1]));

export function ScorecardTour() {
  const [on, setOn] = useState<FeatureId>(FEATURES[0].id);
  const steps = useRef(new Map<FeatureId, HTMLElement>());
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setOn(e.target.getAttribute("data-step") as FeatureId);
    }, { rootMargin: "-48% 0px -48% 0px" });
    steps.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const keep = (id: FeatureId) => (el: HTMLElement | null) => {
    if (el) steps.current.set(id, el);
    else steps.current.delete(id);
  };
  return (
    <>
      {CHAPTERS.map((chapter, n) => (
        <Chapter key={chapter.key} chapter={chapter} index={n} on={on} keep={keep} />
      ))}
    </>
  );
}

function Chapter({ chapter, index, on, keep }: { chapter: (typeof CHAPTERS)[number]; index: number; on: FeatureId; keep: (id: FeatureId) => (el: HTMLElement | null) => void }) {
  const features = chapter.ids.map((id) => FEATURES.find((f) => f.id === id)!);
  // The pinned card: the step in view, or this chapter's first while another chapter is in view.
  const shown = chapter.ids.includes(on) ? on : chapter.ids[0];
  const pin = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ k: 1, h: 0 });
  useEffect(() => {
    const p = pin.current, c = card.current;
    if (!p || !c) return;
    const measure = () => {
      const h = c.offsetHeight;
      /* Room under the card for the dots and the floating exam switcher. */
      setFit({ k: Math.min(1, (p.clientHeight - 120) / Math.max(1, h)), h });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(p);
    ro.observe(c);
    return () => ro.disconnect();
  }, [shown]);
  const go = (id: FeatureId) => document.getElementById(`f-${id}`)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
  return (
    <section className={`sct-ch sct-ch--${chapter.tone}`} aria-labelledby={`ch-${chapter.key}`}>
      <div className="sct-ch-in">
        <div className="wrap">
          <header className="sct-ch-h">
            <p className="sct-ch-n">Chapter {index + 1} of {CHAPTERS.length}</p>
            <h3 id={`ch-${chapter.key}`}>{chapter.title}</h3>
            <p className="sct-ch-l">{chapter.line}</p>
          </header>
          <div className="sct">
            <ol className="sct-steps">
              {features.map((f) => (
                <li key={f.id} id={`f-${f.id}`} data-step={f.id} ref={keep(f.id)} className={`sct-step${f.id === on ? " on" : ""}`}>
                  <span className="sct-k"><span className="ball" aria-hidden="true">{numberOf.get(f.id)}</span>{f.soon ? <span className="sct-soon">Coming soon</span> : null}</span>
                  <h4 className="sct-h">{f.heading}</h4>
                  <ul className="sct-pts">{f.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                  <div className="sct-inline ft-mat"><FeatureCard id={f.id} /></div>
                </li>
              ))}
            </ol>
            <div className="sct-stage">
              <div className="sct-pin" ref={pin}>
                <div className="sct-fit" style={fit.h ? { height: fit.h * fit.k } : undefined}>
                  <div className="sct-card ft-mat" ref={card} key={shown} style={fit.k < 1 ? { transform: `scale(${fit.k})` } : undefined}>
                    <FeatureCard id={shown} />
                  </div>
                </div>
                {features.length > 1 ? (
                  <div className="sct-dots">
                    {features.map((f) => (
                      <button key={f.id} type="button" className={f.id === shown ? "on" : ""} aria-label={`${numberOf.get(f.id)}. ${f.title}`} aria-current={f.id === shown ? "step" : undefined} onClick={() => go(f.id)}></button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The dashboard is laid out at this width and scaled to fit, so it keeps its
   desktop shape on a phone too. */
const PLANE = 1200;

/* The whole scorecard, tilted on the hero's drafting table. Each card is a
   link to its own section, numbered like a drawing's callouts. The cards
   themselves are inert here: the sections below are where they are used. */
export function HeroDashboard() {
  const { s } = useSample();
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    /* Fills its box; on a phone a little wider than the screen. The phone
       test reads the window, not the box: on a desktop the box is the
       hero's right column, narrower than 700px but not a phone. */
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setK(Math.min(1, (w * (window.innerWidth < 700 ? 1.08 : 0.92)) / PLANE));
    });
    ro.observe(el);
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        setOn(true);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    /* Scrolling down lays it a little flatter (--t, 0 to 1). */
    let raf = 0;
    const tilt = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--t", clamp(-r.top / Math.max(1, r.height)).toFixed(3));
      });
    };
    if (!reducedMotion()) {
      tilt();
      window.addEventListener("scroll", tilt, { passive: true });
    }
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", tilt);
      cancelAnimationFrame(raf);
    };
  }, []);
  const p = useGrow(on, s.id, 1400);
  return (
    <div ref={box} className={`hd${k ? " ready" : ""}`} style={k ? ({ "--k": k } as CSSProperties) : undefined}>
      <div className="hd-plane">
        <div className="sc-win">
          <div className="sc-chrome" aria-hidden="true">
            <span className="sc-dots"><i></i><i></i><i></i></span>
            <span className="sc-url">app.divergentclasses.com/dashboard/aidmt</span>
            <span className="sc-sample">Sample: made-up student</span>
          </div>
          <div className="sc-body" key={s.id}>
            <div className="sc-head" aria-hidden="true">
              <div>
                <p className="sc-who">{s.name} · {s.cls}</p>
                <p className="sc-mock">{s.mock}</p>
              </div>
              <p className="sc-score"><b>{Math.round(scoreOf(s) * p)}</b><span>/{maxOf(s)}</span><small>Your score</small></p>
            </div>
            <Together.Provider value={on}>
              <div className="sc-grid">
                {FEATURES.map((f, n) => (
                  <div key={f.id} className={`hd-cell c-${f.id}`}>
                    <div className="hd-card" inert><FeatureCard id={f.id} /></div>
                    <a className="hd-hit" href={`#f-${f.id}`} aria-label={`${n + 1}. ${f.title}`}><span className="ball" aria-hidden="true">{n + 1}</span></a>
                  </div>
                ))}
              </div>
            </Together.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
