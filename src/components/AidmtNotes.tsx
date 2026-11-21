"use client";

/* The small notes that pop up in a corner: "Aarav, Class 12, registered for
   AIDMT 2 · 4 min ago". Every one is a real event from the LMS
   (/api/public/aidmt/activity): a mock bought, a course joined, how many
   bought today, how many have sat an open mock, results out. Students show
   by first name and class only.

   When nothing happened, nothing shows: there is no filler. A visit sees at
   most a few, one at a time, none while the buy dialog is open, and none
   again once closed. The visitor's exam (picked in "Preparing for") comes
   first. */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { APP_URL } from "@/lib/config";

type Mock = { id: string; name: string; exam: string };
type Activity = {
  events: (
    | { kind: "mock"; name: string; cls: string | null; mocks: Mock[]; friends: number; at: string }
    | { kind: "course"; name: string; cls: string | null; course: string; at: string }
  )[];
  today: number;
  live: (Mock & { sat: number })[];
  results: (Mock & { sat: number; at: string })[];
};
type Note = { key: string; who: string; mark: string; line: string; at?: string; exam?: string; href: string; buy?: string };

const FIRST_AFTER = 8_000;
const EVERY = 25_000;
const SHOWN_FOR = 6_500;
const PER_VISIT = 5;
/* Counts too small to be worth saying are not said. */
const MIN_COUNT = 3;
const MIN_SAT = 10;
/* sessionStorage: the notes this visit has shown, and whether it closed them. */
const KEPT = "aidmt-notes";

const HUES = ["#209BD2", "#E0A100", "#1E9E5A", "#925FE2", "#E0533F"];
const hueOf = (text: string) => HUES[[...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % HUES.length];

function ago(at: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(at).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h ago` : "yesterday";
}

/* "AIDMT 2 (UCEED)", unless the name already says the exam. */
const mockName = (m: Mock) => (m.exam && !m.name.includes(m.exam) ? `${m.name} (${m.exam})` : m.name);

function notesOf(a: Activity, scope: "aidmt" | "home", exam: string | null): Note[] {
  const people: Note[] = [];
  for (const e of a.events) {
    const who = `${e.name}${e.cls ? `, ${e.cls}` : ""}`;
    if (e.kind === "mock") {
      const what = e.mocks.length > 1 ? `${e.mocks.length} AIDMT mocks` : mockName(e.mocks[0]);
      const friends = e.friends ? ` with ${e.friends === 1 ? "a friend" : `${e.friends} friends`}` : "";
      people.push({ key: `m:${e.name}:${e.at}`, who, mark: e.name.charAt(0), line: `registered for ${what}${friends}`, at: e.at, exam: e.mocks[0].exam, href: "/aidmt/", buy: e.mocks[0].id });
    } else if (scope === "home") {
      people.push({ key: `c:${e.name}:${e.at}`, who, mark: e.name.charAt(0), line: `joined the ${e.course}`, at: e.at, href: "/#plans" });
    }
  }
  /* The visitor's exam first; within each, newest first (the sort is stable). */
  if (exam) people.sort((x, y) => Number(y.exam === exam) - Number(x.exam === exam));
  const counts: Note[] = [];
  for (const l of a.live) if (l.sat >= MIN_SAT) counts.push({ key: `live:${l.id}`, who: `${l.sat.toLocaleString("en-IN")} students`, mark: "●", line: `have sat ${mockName(l)} so far`, href: "/aidmt/", buy: l.id });
  if (a.today >= MIN_COUNT) counts.push({ key: `today:${a.today}`, who: `${a.today} students`, mark: "↑", line: "registered for AIDMT today", href: "/aidmt/" });
  for (const r of a.results) if (r.sat >= MIN_SAT) counts.push({ key: `results:${r.id}`, who: `${mockName(r)} results are out`, mark: "★", line: `${r.sat.toLocaleString("en-IN")} students sat it`, at: r.at, href: "/aidmt/" });
  /* Two people, then a count, and so on. */
  const out: Note[] = [];
  while (people.length || counts.length) {
    out.push(...people.splice(0, 2));
    if (counts.length) out.push(counts.shift()!);
  }
  return out;
}

function kept(): { seen: string[]; off: boolean } {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEPT) || "{}");
    return { seen: Array.isArray(v.seen) ? v.seen : [], off: v.off === true };
  } catch {
    return { seen: [], off: false };
  }
}
function keep(v: { seen: string[]; off: boolean }) {
  try {
    sessionStorage.setItem(KEPT, JSON.stringify(v));
  } catch {}
}

/* scope: "aidmt" opens the buy dialog from a note, "home" links to the page.
   lift: sit above the page's bars at the foot of the screen (the home
   page's sticky bar, the AIDMT page's Register bar and sample switcher). */
export function AidmtNotes({ scope, exam = null, lift = false }: { scope: "aidmt" | "home"; exam?: string | null; lift?: boolean }) {
  const [note, setNote] = useState<Note | null>(null);
  const [on, setOn] = useState(false);
  const examRef = useRef(exam);
  useEffect(() => {
    examRef.current = exam;
  }, [exam]);
  useEffect(() => {
    if (kept().off) return;
    let queue: Note[] = [];
    let alive = true;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const show = () => {
      if (!alive) return;
      const state = kept();
      if (state.off || state.seen.length >= PER_VISIT) return;
      const busy = document.hidden || !!document.querySelector("dialog[open]");
      const next = busy ? null : queue.find((n) => !state.seen.includes(n.key));
      if (next) {
        keep({ ...state, seen: [...state.seen, next.key] });
        setNote(next);
        setOn(true);
        later(() => setOn(false), SHOWN_FOR);
      }
      later(show, EVERY);
    };
    fetch(`${APP_URL}/api/public/aidmt/activity`)
      .then((res) => res.json())
      .then((body) => {
        if (!alive || !body?.success) return;
        queue = notesOf(body.data as Activity, scope, examRef.current);
        if (queue.length) later(show, FIRST_AFTER);
      })
      .catch(() => {});
    return () => {
      alive = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [scope]);
  if (!note) return null;
  const close = () => {
    keep({ ...kept(), off: true });
    setOn(false);
  };
  return (
    <div className={`an${on ? " on" : ""}${lift ? " an--lift" : ""}`} inert={!on}>
      <a className="an-in" href={note.href} data-aidmt-buy={scope === "aidmt" && note.buy ? note.buy : undefined}>
        <span className="an-mark" aria-hidden="true" style={{ "--h": hueOf(note.who) } as CSSProperties}>{note.mark}</span>
        <span className="an-t">
          <b>{note.who}</b>
          <span>{note.line}</span>
          {note.at ? <small>{ago(note.at)}</small> : null}
        </span>
      </a>
      <button type="button" className="an-x" aria-label="Stop these notes" onClick={close}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}
