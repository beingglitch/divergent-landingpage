"use client";

/* The parts of /nid-masterclass/ that tick or switch.

   ExamCountdown: the time left to the program's exam, a chip in the hero
   and the big clock in the closing call to action. It is the real exam date
   (lib/masterclass examDay), nothing invented.
   MasterclassBar: on a phone, Enrol pinned to the foot of the screen while
   neither the hero's nor the closing Enrol is in view, as /aidmt/ does.
   MockSwitch: AIDMT 1, 2 and 3 for the sample student's scorecard cards
   (components/AidmtScorecard). It steps through the three on its own once on
   screen, so the rank is seen to climb, until the visitor picks one. */

import { useEffect, useRef, useState } from "react";
import { ist } from "@/lib/config";
import { split, two, useClock } from "@/components/AidmtPromo";
import { useSample } from "@/components/AidmtScorecard";

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

export function ExamCountdown({ builtAt, day, exam, big = false }: { builtAt: number; day: string; exam: string; big?: boolean }) {
  const t = useClock(builtAt);
  const left = split(ist(`${day}T00:00:00`).getTime() - t);
  const over = left.d + left.h + left.m + left.s === 0;
  if (over) return null;
  const label = `${left.d} days, ${left.h} hours and ${left.m} minutes until ${exam}`;
  if (!big) {
    return (
      <p className="mc-count" role="timer" aria-label={label}>
        <svg width="16" height="16" aria-hidden="true"><use href="#clock" /></svg>
        <b>{left.d}d {two(left.h)}h {two(left.m)}m {two(left.s)}s</b>
        <span>to {exam}</span>
      </p>
    );
  }
  const units: [number, string][] = [[left.d, left.d === 1 ? "day" : "days"], [left.h, "hours"], [left.m, "mins"], [left.s, "secs"]];
  return (
    <div className="mc-clock">
      <p className="ao-k">Until {exam}</p>
      <p className="ao-clock" role="timer" aria-label={label}>
        {units.map(([n, unit]) => <span key={unit} className="ao-u"><b>{two(n)}</b><small>{unit}</small></span>)}
      </p>
    </div>
  );
}

/* away: what hides the bar while it is on screen. href and buy as on the page's own Enrol. */
export function MasterclassBar({ away, builtAt, day, exam, label, price, href, buy }: { away: string[]; builtAt: number; day: string; exam: string; label: string; price: string | null; href: string; buy: boolean }) {
  const [shown, setShown] = useState(false);
  const t = useClock(builtAt);
  const left = split(ist(`${day}T00:00:00`).getTime() - t);
  useEffect(() => {
    const els = away.map((sel) => document.querySelector(sel)).filter((el): el is Element => !!el);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setShown(seen.size === 0 && window.scrollY > 200);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [away]);
  return (
    <div className={`abb${shown ? " on" : ""}`} inert={!shown}>
      <p className="abb-t">
        <b>{price ?? label}</b>
        <small>{exam} in {left.d}d {left.h}h {two(left.m)}m</small>
      </p>
      <a className="btn abb-btn" href={href} {...(buy ? { "data-mc-buy": "" } : href.startsWith("https://wa.me") ? { target: "_blank", rel: "noopener" } : {})}>Enrol <Arrow /></a>
    </div>
  );
}

export function MockSwitch() {
  const { s, samples, pick } = useSample();
  const box = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /* Mock 1, then 2, then 3, a few seconds apart, once; then it stays on the last. */
  useEffect(() => {
    if (!auto || !seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const at = samples.findIndex((x) => x.id === s.id);
    if (at >= samples.length - 1) return;
    const id = window.setTimeout(() => pick(samples[at + 1].id), 3200);
    return () => window.clearTimeout(id);
  }, [auto, seen, s.id, samples, pick]);
  return (
    <div className="mk-switch" ref={box} role="group" aria-label="The scorecard after">
      {samples.map((x, i) => {
        const on = x.id === s.id;
        const done = samples.findIndex((y) => y.id === s.id) > i;
        return (
          <button key={x.id} type="button" aria-pressed={on} className={`${on ? "on" : ""}${done ? " done" : ""}`} onClick={() => { setAuto(false); pick(x.id); }}>
            <small>{x.mock.split(" · ")[0]}</small>
            <b>AIR {x.rank.toLocaleString("en-IN")}</b>
          </button>
        );
      })}
    </div>
  );
}
