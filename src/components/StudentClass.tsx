"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APP_URL } from "@/lib/config";
import { CLASS_EVENT, CLASSES, classLabel, isClass, markSkipped, readClass, wasSkipped, writeClass, type StudentClass } from "@/lib/student-class";

/* Who is visiting, from the app (api/public/session): signed in or not, and
   a signed-in student's class. The sign-in cookie is httpOnly, so the app
   answers. The last "signed in" is remembered for this tab so "Log in" does
   not flash on every page. */
const SEEN = "dc-signed-in";
const SESSION_URL = `${APP_URL}/api/public/session`;
/* A class picked outside the header (the courses page's filter bar). */
const PICK_EVENT = "dc-class-pick";

export type Session = { known: boolean; signedIn: boolean };

export function useStudent() {
  const [session, setSession] = useState<Session>({ known: false, signedIn: false });
  const [cls, setCls] = useState<StudentClass | null>(null);

  useEffect(() => {
    setCls(readClass());
    try { if (sessionStorage.getItem(SEEN) === "1") setSession({ known: false, signedIn: true }); } catch {}
    const onChange = (e: Event) => setCls((e as CustomEvent<StudentClass | null>).detail);
    window.addEventListener(CLASS_EVENT, onChange);
    const ctrl = new AbortController();
    fetch(SESSION_URL, { credentials: "include", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const signedIn = !!d?.signedIn;
        setSession({ known: true, signedIn });
        try { sessionStorage.setItem(SEEN, signedIn ? "1" : "0"); } catch {}
        if (!signedIn) return;
        // The account's class wins. An account without one takes the class
        // picked here before signing in.
        if (isClass(d.class)) { if (d.class !== readClass()) writeClass(d.class); }
        else { const local = readClass(); if (local) saveToAccount(local); }
      })
      .catch(() => setSession((s) => ({ ...s, known: true })));
    return () => { ctrl.abort(); window.removeEventListener(CLASS_EVENT, onChange); };
  }, []);

  const choose = useCallback((c: StudentClass) => {
    writeClass(c);
    if (session.signedIn) saveToAccount(c);
  }, [session.signedIn]);

  // The courses page's filter bar asks here, so a pick there saves to the account too.
  useEffect(() => {
    const onPick = (e: Event) => choose((e as CustomEvent<StudentClass>).detail);
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, [choose]);

  return { session, cls, choose };
}

function saveToAccount(c: StudentClass) {
  fetch(SESSION_URL, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ class: c }) }).catch(() => {});
}

/* Three big buttons, one choice. */
export function ClassOptions({ value, onPick, size = "md" }: { value: StudentClass | null; onPick: (c: StudentClass) => void; size?: "md" | "lg" }) {
  return (
    <div className={"cls-opts cls-opts--" + size} role="radiogroup" aria-label="Your class">
      {CLASSES.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onPick(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* The exam filter lives in the courses page address (?exam=nift), so a
   link can carry it; "all" is no filter. */
type Exam = "uceed" | "nid" | "nift" | "all";
const EXAM_OPTIONS: { v: Exam; label: string }[] = [
  { v: "uceed", label: "UCEED" },
  { v: "nid", label: "NID" },
  { v: "nift", label: "NIFT" },
  { v: "all", label: "All" },
];
function examFromUrl(): Exam {
  const e = new URLSearchParams(location.search).get("exam");
  return e === "uceed" || e === "nid" || e === "nift" ? e : "all";
}
/* The filter bar changed the exam in the address without a reload. */
const EXAM_EVENT = "dc-exam-change";
const coursesUrl = (e: Exam) => (e === "all" ? "/courses/" : `/courses/?exam=${e}`);
const examLabel = (e: Exam) => EXAM_OPTIONS.find((o) => o.v === e)?.label ?? "";

/* The two rows, in the desktop Courses menu and the phone menu. */
export function CourseRows({ cls, choose, onPick, size = "lg" }: { cls: StudentClass | null; choose: (c: StudentClass) => void; onPick?: () => void; size?: "md" | "lg" }) {
  const [exam, setExam] = useState<Exam>("all");
  useEffect(() => {
    const sync = () => setExam(examFromUrl());
    sync();
    window.addEventListener(EXAM_EVENT, sync);
    return () => window.removeEventListener(EXAM_EVENT, sync);
  }, []);
  const go = (e: Exam) => { onPick?.(); location.href = coursesUrl(e); };
  // "All" is every course: no class filter either.
  const pickExam = (e: Exam) => { setExam(e); if (e === "all") { markSkipped(); writeClass(null); } go(e); };
  return (
    <>
      <p className="cm-k">Your class</p>
      <ClassOptions size={size} value={cls} onPick={(c) => { choose(c); go(exam); }} />
      <p className="cm-k">Your exam</p>
      <div className={`cls-opts cls-opts--${size} cls-opts--4`} role="radiogroup" aria-label="Your exam">
        {EXAM_OPTIONS.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={exam === o.v} onClick={() => pickExam(o.v)}>{o.label}</button>
        ))}
      </div>
    </>
  );
}

/* The nav's Courses menu: two rows: class and exam. The class row shows the class already chosen
   (popup, this menu or the student's account). Any pick opens the courses
   page with both filters on. */
export function CoursesMenu({ cls, choose, current }: { cls: StudentClass | null; choose: (c: StudentClass) => void; current?: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const enter = () => { window.clearTimeout(closeTimer.current); setOpen(true); };
  const leave = () => { closeTimer.current = window.setTimeout(() => setOpen(false), 150); };

  return (
    <li className="cm" ref={box} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="cm-btn" aria-expanded={open} aria-controls="cm-pop" aria-current={current ? "page" : undefined} onClick={() => setOpen((o) => !o)}>
        Courses
        <svg width="14" height="14" aria-hidden="true"><use href="#chev" /></svg>
      </button>
      <div className="cm-pop" id="cm-pop" hidden={!open}>
        <CourseRows cls={cls} choose={choose} onPick={() => setOpen(false)} />
        <a className="cm-all" href="/courses/">See all courses <svg width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
      </div>
    </li>
  );
}

/* Asks a signed-out visitor for their class 5 seconds after landing, once.
   A signed-in student is asked in the app instead. */
const DELAY_MS = 5000;

export function ClassPopup({ session, cls, choose }: { session: Session; cls: StudentClass | null; choose: (c: StudentClass) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!session.known || session.signedIn || cls || wasSkipped()) return;
    const t = window.setTimeout(() => {
      // Not over another dialog, and not while the phone menu is open.
      if (document.querySelector("dialog[open]") || document.querySelector(".mnav.open")) return;
      ref.current?.showModal();
      // Focus the question, not the first class: a ring on "Class 11" read as already picked.
      ref.current?.querySelector<HTMLElement>("h2")?.focus();
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [session.known, session.signedIn, cls]);

  const skip = () => { markSkipped(); ref.current?.close(); };
  return (
    <dialog className="cls-dlg" ref={ref} aria-labelledby="cls-dlg-h" onCancel={markSkipped} onClick={(e) => { if (e.target === ref.current) skip(); }}>
      <div className="cls-dlg-in">
        <h2 id="cls-dlg-h" tabIndex={-1}>Which class are you in?</h2>
        <ClassOptions size="lg" value={cls} onPick={(c) => { choose(c); ref.current?.close(); }} />
        <button type="button" className="cls-skip" onClick={skip}>Skip for now</button>
      </div>
    </dialog>
  );
}

/* The courses page's filter bar: class and exam, the same choices as the
   Courses menu, applied in place. Hides the cards not for the class (a card
   with no class set is for every class) or not for the exam. The exam is
   kept in the address (?exam=nift) so the Courses menu can link to it. */
export function CourseClassFilter() {
  const [cls, setCls] = useState<StudentClass | null>(null);
  const [exam, setExam] = useState<Exam>("all");
  const [shown, setShown] = useState<number | null>(null);
  useEffect(() => {
    setCls(readClass());
    setExam(examFromUrl());
    const onChange = (e: Event) => setCls((e as CustomEvent<StudentClass | null>).detail);
    window.addEventListener(CLASS_EVENT, onChange);
    return () => window.removeEventListener(CLASS_EVENT, onChange);
  }, []);
  useEffect(() => {
    let n = 0;
    document.querySelectorAll<HTMLElement>(".ccard").forEach((card) => {
      const classes = (card.dataset.classes || "").split(" ").filter(Boolean);
      const exams = (card.dataset.exams || "").split(" ").filter(Boolean);
      const classOff = !!cls && classes.length > 0 && !classes.includes(cls);
      const examOff = exam !== "all" && !exams.includes(exam);
      card.toggleAttribute("data-class-off", classOff);
      card.toggleAttribute("data-exam-off", examOff);
      if (!classOff && !examOff) n++;
    });
    setShown(n);
  }, [cls, exam]);
  const pickClass = (c: StudentClass) => window.dispatchEvent(new CustomEvent<StudentClass>(PICK_EVENT, { detail: c }));
  const setExamUrl = (e: Exam) => { setExam(e); history.replaceState(null, "", coursesUrl(e)); window.dispatchEvent(new Event(EXAM_EVENT)); };
  // "All" is every course, so it clears the class too. Clearing is a choice:
  // the popup should not ask again after it.
  const clear = () => { markSkipped(); writeClass(null); setExamUrl("all"); };
  const pickExam = (e: Exam) => (e === "all" ? clear() : setExamUrl(e));
  return (
    <div className="cf">
      <div className="cf-row" role="radiogroup" aria-label="Your class">
        <span className="cf-k">Class</span>
        {CLASSES.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={cls === o.v} onClick={() => pickClass(o.v)}>{o.label}</button>
        ))}
      </div>
      <div className="cf-row" role="radiogroup" aria-label="Your exam">
        <span className="cf-k">Exam</span>
        {EXAM_OPTIONS.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={exam === o.v} onClick={() => pickExam(o.v)}>{o.label}</button>
        ))}
      </div>
      {shown === 0 ? (
        <p className="cf-empty">No course for that yet. <button type="button" onClick={clear}>See all courses</button> or <a href="/#book">book a free call</a> and a counsellor will help.</p>
      ) : null}
    </div>
  );
}
