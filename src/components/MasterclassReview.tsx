"use client";

/* "Every sheet gets a mentor's eye" on /nid-masterclass/: a real sheet from
   our batches with the kind of notes a live review gives, drawn on in red
   one by one when the sheet comes on screen. Each note is numbered like the
   yellow callouts on /aidmt/; pointing at a note lights its mark. "Before"
   hides the marks, to see the sheet as it came in. The notes are in
   lib/masterclass (review), placed on the image's own pixels. */

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Note = { good: boolean; x: number; y: number; text: string };

/* The red marks, one per note, in the same order, on the 900 by 521 sheet. */
const MARKS: string[] = [
  "M58,72 a128,46 0 1,0 256,0 a128,46 0 1,0 -256,0",
  "M362,304 q110,-16 220,0 M372,314 l14,-10 M398,316 l14,-12 M424,317 l14,-12 M450,318 l14,-12 M476,318 l14,-12 M502,317 l14,-12 M528,316 l14,-11 M554,314 l12,-10",
  "M240,362 l12,14 l24,-30",
  "M378,404 a48,48 0 1,0 0.1,0",
  "M848,108 q34,62 2,132 M850,240 l-4,-16 M850,240 l14,-8",
  "M734,382 l12,14 l24,-30",
];

export function MasterclassReview({ img, w, h, notes, mark, after }: { img: string; w: number; h: number; notes: Note[]; mark: string; after: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [marks, setMarks] = useState(true);
  const [hot, setHot] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = seen && marks;
  const fixes = notes.filter((n) => !n.good).length;
  return (
    <div className={`rw-wrap${shown ? " on" : ""}${hot !== null ? " focus" : ""}`} ref={box}>
      <figure className="rw-sheet">
        <div className="rw-paper">
          <img src={img} alt="A student’s product design sheet: a backpack called EMBIBE, with a main view, a back view and four panels showing shoe storage, straps, an organiser and 40 litres of storage." width={w} height={h} loading="lazy" />
          <svg className="rw-ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
            {MARKS.map((d, i) => (
              <path key={i} d={d} pathLength={1} className={`${notes[i]?.good ? "good" : "fix"}${hot === i ? " hot" : ""}`} style={{ "--d": `${0.25 + i * 0.45}s` } as CSSProperties} />
            ))}
          </svg>
          {notes.map((n, i) => (
            <span key={i} className={`ball rw-ball${hot === i ? " hot" : ""}`} style={{ left: `${(n.x / w) * 100}%`, top: `${(n.y / h) * 100}%`, "--d": `${0.45 + i * 0.45}s` } as CSSProperties} aria-hidden="true">{i + 1}</span>
          ))}
        </div>
        <figcaption>
          <span>A sheet from our batch, with the kind of notes you get in a live review.</span>
          <span className="rw-toggle" role="group" aria-label="Show the sheet">
            <button type="button" aria-pressed={!marks} className={!marks ? "on" : ""} onClick={() => setMarks(false)}>Before</button>
            <button type="button" aria-pressed={marks} className={marks ? "on" : ""} onClick={() => { setMarks(true); setSeen(true); }}>Mentor’s marks</button>
          </span>
        </figcaption>
      </figure>
      <div className="rw-side">
        <div className="rw-grade">
          <p><small>Mentor’s mark</small><b>{mark}</b></p>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <p className="up"><small>With the {fixes} fixes</small><b>{after}</b></p>
        </div>
        <ol className="rw-notes">
          {notes.map((n, i) => (
            <li key={i} className={`${n.good ? "good" : "fix"}${hot === i ? " hot" : ""}`} tabIndex={0} style={{ "--d": `${0.45 + i * 0.45}s` } as CSSProperties}
              onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}>
              <span className="ball" aria-hidden="true">{i + 1}</span>
              <span className="rw-kind">{n.good ? "Keep" : "Fix"}</span>
              <span className="rw-t">{n.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
