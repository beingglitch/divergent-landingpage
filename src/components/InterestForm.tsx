"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { APP_URL, CONTACT } from "@/lib/config";
import { savedUtm } from "@/lib/utm";
import { pixelCookie, track } from "@/lib/pixel";

/* A short interest form: name, WhatsApp number, class, and one choice of the
   page's own (the NIFT course, say). It sends a lead to the app's Leads
   list (APP_URL/api/leads, the same route as the home page's call form,
   components/LeadForm), tagged with the exam, the plan and the source, with
   the page and the visitor's UTM tags, so each page's leads can be told
   apart. The pixel's Lead event and the app's own server event share one
   id, so Meta counts the lead once. */

type Status = "CLASS_11" | "CLASS_12" | "DROPPER";
type Field = "name" | "phone" | "status" | "choice" | "consent";

const STATUSES: Array<[Status, string]> = [["CLASS_11", "Class 11"], ["CLASS_12", "Class 12"], ["DROPPER", "Dropper"]];

/* Accepts 98765 43210, +91 98765 43210, 098765 43210 and so on. */
function normalisePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

export function InterestForm({ exam, plan, source, title, sub, submit, done, choice, id }: {
  exam: "NID" | "UCEED" | "NIFT";
  /* What the lead is about, as the Leads list shows it ("NIFT 2027"). The choice is added in brackets. */
  plan: string;
  /* Which page or form sent it ("nift-interest"). */
  source: string;
  title: string;
  sub: string;
  submit: string;
  /* After sending: what happens next. */
  done: string;
  choice?: { label: string; options: string[] };
  id?: string;
}) {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [picked, setPicked] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [sentTo, setSentTo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) e.name = "Enter your name.";
    if (!phone.trim()) e.phone = "Enter your WhatsApp number.";
    else if (!normalisePhone(phone)) e.phone = "Enter a 10-digit Indian mobile number.";
    if (!status) e.status = "Pick your class.";
    if (choice && !picked) e.choice = `Pick one.`;
    if (!consent) e.consent = "Tick this so we can message you.";
    return e;
  }

  async function send(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const e = validate();
    setErrors(e);
    const first = (Object.keys(e) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const digits = normalisePhone(phone)!;
    const eventId = crypto.randomUUID();
    const leadPlan = picked ? `${plan} (${picked})` : plan;
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
          exam: [exam],
          plan: leadPlan,
          source,
          page: window.location.pathname,
          eventId,
          fbp: pixelCookie("_fbp"),
          fbc: pixelCookie("_fbc"),
          utm: savedUtm(),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        let msg = "";
        try {
          const data = await res.json();
          if (data && typeof data.error === "string" && data.error.length < 160) msg = data.error;
        } catch {}
        throw new Error(msg || (res.status === 429 ? "Too many tries. Please wait a minute and try again." : "We could not save your details."));
      }
      track("Lead", { content_name: leadPlan }, eventId);
      setSentTo(`+91 ${digits.slice(0, 5)} ${digits.slice(5)}`);
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

  if (state === "done") {
    return (
      <div className="book-card book-done if-card" id={id} role="status">
        <span className="book-done-i" aria-hidden="true"><svg width="26" height="26"><use href="#tick" /></svg></span>
        <h3>You’re on the list.</h3>
        <p>Thanks, {name.trim().split(/\s+/)[0]}. {done} We’ll message you on <b>{sentTo}</b>.</p>
        <a className="book-link" href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi, I just signed up for ${plan}.`)}`} target="_blank" rel="noopener">Questions now? WhatsApp us</a>
      </div>
    );
  }

  const err = (f: Field) => (errors[f] ? <p className="book-err" id={`${uid}-${f}-e`}>{errors[f]}</p> : null);
  const desc = (f: Field) => (errors[f] ? `${uid}-${f}-e` : undefined);
  const clear = (f: Field) => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }));

  return (
    <form className="book-card if-card" id={id} ref={formRef} onSubmit={send} noValidate aria-labelledby={`${uid}-h`}>
      <h3 id={`${uid}-h`}>{title}</h3>
      <p className="book-sub">{sub}</p>

      <div className={"book-f" + (errors.name ? " err" : "")}>
        <label htmlFor={`${uid}-name`}>Name</label>
        <input id={`${uid}-name`} data-field="name" type="text" autoComplete="name" value={name} maxLength={80}
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
              <input type="radio" name={`${uid}-status`} value={v} checked={status === v} data-field={i === 0 ? "status" : undefined}
                onChange={() => { setStatus(v); clear("status"); }} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {err("status")}
      </fieldset>

      {choice ? (
        <fieldset className={"book-f" + (errors.choice ? " err" : "")} aria-describedby={desc("choice")}>
          <legend>{choice.label}</legend>
          <div className="book-chips">
            {choice.options.map((o, i) => (
              <label key={o}>
                <input type="radio" name={`${uid}-choice`} value={o} checked={picked === o} data-field={i === 0 ? "choice" : undefined}
                  onChange={() => { setPicked(o); clear("choice"); }} />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {err("choice")}
        </fieldset>
      ) : null}

      <div className={"book-f book-consent" + (errors.consent ? " err" : "")}>
        <label>
          <input type="checkbox" data-field="consent" checked={consent}
            onChange={(e) => { setConsent(e.target.checked); clear("consent"); }}
            aria-invalid={!!errors.consent} aria-describedby={desc("consent")} />
          <span>Divergent Classes may call or WhatsApp me about this. See the <a href="/privacy/">privacy policy</a>.</span>
        </label>
        {err("consent")}
      </div>

      <button className="btn btn--block" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
        {state === "sending" ? "Sending…" : submit}
        {state === "sending" ? null : <Arrow />}
      </button>

      <div aria-live="assertive">
        {state === "error" ? <p className="book-fail">{errorText} Please try again, or WhatsApp us on {CONTACT.phoneShown}.</p> : null}
      </div>
    </form>
  );
}
