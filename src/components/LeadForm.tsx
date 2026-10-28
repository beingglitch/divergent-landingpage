"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { APP_URL, BUNDLES, CONTACT, planLabel, type Batch, type Exam, type Plan } from "@/lib/config";
import { PLAN_EVENT, type PlanPick } from "@/lib/plan-event";

type Status = "CLASS_11" | "CLASS_12" | "DROPPER";
type LeadExam = "UCEED" | "NID" | "NIFT";
type Field = "name" | "phone" | "status" | "exam" | "consent";

const STATUSES: Array<[Status, string]> = [["CLASS_11", "Class 11"], ["CLASS_12", "Class 12"], ["DROPPER", "Dropper"]];
const EXAMS: Array<[LeadExam, string]> = [["UCEED", "UCEED"], ["NID", "NID"], ["NIFT", "NIFT"]];

/* Every 75-day plan, in the order the picker shows them. */
const PLAN_OPTIONS = Object.entries(BUNDLES).map(([key, slug]) => {
  const [plan, b] = key.split("-") as [Plan, string];
  const batch: Batch = b === "combo" ? "combo" : "single";
  const exam: Exam = b === "nid" ? "NID" : "UCEED";
  return { slug, label: planLabel(plan, batch, exam) };
});

/* Accepts 98765 43210, +91 98765 43210, 098765 43210 and so on. */
function normalisePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

function shownPhone(d: string): string {
  return "+91 " + d.slice(0, 5) + " " + d.slice(5);
}

export function LeadForm() {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [exams, setExams] = useState<LeadExam[]>([]);
  const [plan, setPlan] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [sentTo, setSentTo] = useState("");
  const planTouched = useRef(false);
  const examTouched = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  /* Prefill the plan (and the exam) from the plan picker above. */
  useEffect(() => {
    const apply = (p: PlanPick | undefined) => {
      if (!p) return;
      if (!planTouched.current) setPlan(p.slug);
      if (!examTouched.current) setExams(p.batch === "combo" ? ["UCEED", "NID"] : [p.exam]);
    };
    apply(window.__dcPlan);
    const on = (e: Event) => apply((e as CustomEvent<PlanPick>).detail);
    window.addEventListener(PLAN_EVENT, on);
    return () => window.removeEventListener(PLAN_EVENT, on);
  }, []);

  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
  }, [state]);

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) e.name = "Enter your name.";
    if (!phone.trim()) e.phone = "Enter your WhatsApp number.";
    else if (!normalisePhone(phone)) e.phone = "Enter a 10-digit Indian mobile number.";
    if (!status) e.status = "Pick your class.";
    if (!exams.length) e.exam = "Pick at least one exam.";
    if (!consent) e.consent = "Tick this so we can call you.";
    return e;
  }

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const e = validate();
    setErrors(e);
    const first = (Object.keys(e) as Field[])[0];
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
      return;
    }
    const digits = normalisePhone(phone)!;
    setState("sending");
    setErrorText("");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(`${APP_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: digits,
          academicStatus: status,
          exam: exams,
          plan: plan || undefined,
          source: "landing",
          page: window.location.pathname,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        let msg = "";
        try {
          const data = await res.json();
          if (data && typeof data.error === "string" && data.error.length < 160) msg = data.error;
        } catch {}
        if (!msg) msg = res.status === 429 ? "Too many tries. Please wait a minute and try again." : "We could not save your request.";
        throw new Error(msg);
      }
      setSentTo(shownPhone(digits));
      setState("done");
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      const network = err instanceof TypeError;
      setErrorText(aborted ? "That took too long." : network ? "Network error." : (err as Error).message || "Something went wrong.");
      setState("error");
    } finally {
      clearTimeout(timer);
    }
  }

  function reset() {
    setName(""); setPhone(""); setStatus(""); setConsent(false); setErrors({});
    setState("idle");
  }

  const waText = encodeURIComponent("Hi, I want to know about the 75-day crash course");
  const alt = (
    <aside className="book-alt" aria-label="Other ways to reach us">
      <p className="book-alt-k">Rather talk now?</p>
      <a href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noopener">
        <svg width="18" height="18" aria-hidden="true"><use href="#i-chat" /></svg>WhatsApp us
      </a>
      <a href={`tel:${CONTACT.phone}`}>
        <svg width="18" height="18" aria-hidden="true"><use href="#i-phone" /></svg>Call {CONTACT.phoneShown}
      </a>
    </aside>
  );

  if (state === "done") {
    return (
      <div className="book-grid">
        <div className="book-card book-done" ref={doneRef} tabIndex={-1} role="status">
          <span className="book-done-i" aria-hidden="true"><svg width="26" height="26"><use href="#tick" /></svg></span>
          <h3>Request received.</h3>
          <p>Thanks, {name.trim().split(/\s+/)[0]}. A counsellor will call you on <b>{sentTo}</b>. The call is free and takes about 10 minutes.</p>
          <button type="button" className="book-link" onClick={reset}>Book a call for someone else</button>
        </div>
        {alt}
      </div>
    );
  }

  const err = (f: Field) => (errors[f] ? <p className="book-err" id={`${uid}-${f}-e`}>{errors[f]}</p> : null);
  const desc = (f: Field) => (errors[f] ? `${uid}-${f}-e` : undefined);
  const clear = (f: Field) => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }));

  return (
    <div className="book-grid">
      <form className="book-card" ref={formRef} onSubmit={submit} noValidate aria-labelledby={`${uid}-h`}>
        <h3 id={`${uid}-h`}>Book a free call</h3>
        <p className="book-sub">Tell us a little about you. We will call you back.</p>

        <div className={"book-f" + (errors.name ? " err" : "")}>
          <label htmlFor="lead-name">Name</label>
          <input id="lead-name" data-field="name" type="text" autoComplete="name" value={name} maxLength={80}
            onChange={(e) => { setName(e.target.value); clear("name"); }}
            aria-invalid={!!errors.name} aria-describedby={desc("name")} />
          {err("name")}
        </div>

        <div className={"book-f" + (errors.phone ? " err" : "")}>
          <label htmlFor={`${uid}-phone`}>WhatsApp number</label>
          <div className="book-tel">
            <span aria-hidden="true">+91</span>
            <input id={`${uid}-phone`} data-field="phone" type="tel" inputMode="numeric" autoComplete="tel-national"
              placeholder="98765 43210" value={phone} maxLength={16}
              onChange={(e) => { setPhone(e.target.value); clear("phone"); }}
              aria-invalid={!!errors.phone} aria-describedby={desc("phone")} />
          </div>
          {err("phone")}
        </div>

        <fieldset className={"book-f" + (errors.status ? " err" : "")} aria-describedby={desc("status")}>
          <legend>Class</legend>
          <div className="book-chips">
            {STATUSES.map(([v, label], i) => (
              <label key={v}>
                <input type="radio" name="academicStatus" value={v} checked={status === v}
                  data-field={i === 0 ? "status" : undefined}
                  onChange={() => { setStatus(v); clear("status"); }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {err("status")}
        </fieldset>

        <fieldset className={"book-f" + (errors.exam ? " err" : "")} aria-describedby={desc("exam")}>
          <legend>Exam <span className="book-opt">(pick all that apply)</span></legend>
          <div className="book-chips">
            {EXAMS.map(([v, label], i) => (
              <label key={v}>
                <input type="checkbox" name="exam" value={v} checked={exams.includes(v)}
                  data-field={i === 0 ? "exam" : undefined}
                  onChange={(e) => { examTouched.current = true; const on = e.target.checked; setExams((cur) => EXAMS.map(([x]) => x).filter((x) => (x === v ? on : cur.includes(x)))); clear("exam"); }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {err("exam")}
        </fieldset>

        <div className="book-f">
          <label htmlFor={`${uid}-plan`}>Plan you&apos;re considering <span className="book-opt">(optional)</span></label>
          <select id={`${uid}-plan`} value={plan} onChange={(e) => { planTouched.current = true; setPlan(e.target.value); }}>
            <option value="">Not sure yet</option>
            {PLAN_OPTIONS.map((o) => <option key={o.slug} value={o.slug}>{o.label}</option>)}
          </select>
        </div>

        <div className={"book-f book-consent" + (errors.consent ? " err" : "")}>
          <label>
            <input type="checkbox" data-field="consent" checked={consent}
              onChange={(e) => { setConsent(e.target.checked); clear("consent"); }}
              aria-invalid={!!errors.consent} aria-describedby={desc("consent")} />
            <span>Divergent Classes may call or WhatsApp me about courses. See the <a href="/privacy/">privacy policy</a>.</span>
          </label>
          {err("consent")}
        </div>

        <button className="btn btn--block" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Sending…" : "Book my free call"}
          {state === "sending" ? null : <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>}
        </button>

        <div aria-live="assertive">
          {state === "error" ? (
            <p className="book-fail">
              {errorText} Please try again, or WhatsApp us on {CONTACT.phoneShown}.
            </p>
          ) : null}
        </div>
      </form>
      {alt}
    </div>
  );
}
