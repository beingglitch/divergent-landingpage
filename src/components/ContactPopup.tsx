"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { APP_URL, CONTACT } from "@/lib/config";
import { savedUtm } from "@/lib/utm";
import { pixelCookie, track } from "@/lib/pixel";

/* Accepts 98765 43210, +91 98765 43210, 098765 43210 and so on. */
function tenDigits(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

/**
 * Every Contact us link opens this card instead of leaving the page. Opening
 * /contact/ directly, or in a new tab, still shows the full page.
 */
export function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"start" | "form" | "done">("start");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  function close() {
    setOpen(false);
    setError("");
    if (step === "done") { setStep("start"); setName(""); setPhone(""); }
    returnTo.current?.focus();
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link || !/^\/contact\/?$/.test(link.getAttribute("href") ?? "")) return;
      e.preventDefault();
      e.stopPropagation();
      // The phone menu would otherwise stay open behind the card.
      const menu = document.querySelector<HTMLButtonElement>('.menu-btn[aria-expanded="true"]');
      menu?.click();
      returnTo.current = menu ?? link;
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (sending) return;
    if (name.trim().length < 2) { setError("Enter your name."); return; }
    const digits = tenDigits(phone);
    if (!digits) { setError("Enter a 10-digit Indian mobile number."); return; }
    setError("");
    setSending(true);
    /* The pixel and the app both report this lead. One id makes Meta count it once. */
    const eventId = crypto.randomUUID();
    try {
      const res = await fetch(`${APP_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: digits, source: "contact-popup", page: window.location.pathname, eventId, fbp: pixelCookie("_fbp"), fbc: pixelCookie("_fbc"), utm: savedUtm() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(typeof data?.error === "string" ? data.error : "We could not save your request.");
      }
      track("Lead", {}, eventId);
      setStep("done");
    } catch (err) {
      setError(err instanceof TypeError ? "Network error. Please try again." : (err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;
  return (
    <div className="cpop" ref={cardRef} role="dialog" aria-labelledby="cpop-title" tabIndex={-1}>
      <div className="cpop-bunny" aria-hidden="true">
        <span className="cpop-say">Try this!</span>
        <img className="cpop-body" src="/assets/mascot/bunny-body.webp" alt="" width="401" height="640" />
        <img className="cpop-arm" src="/assets/mascot/bunny-arm.webp" alt="" width="401" height="640" />
      </div>
      <button className="cpop-x" type="button" aria-label="Close" onClick={close}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>

      {step === "done" ? (
        <div className="cpop-head" role="status">
          <h2 id="cpop-title">We will call you soon</h2>
          <p>A counsellor will call {phone.trim()} shortly.</p>
        </div>
      ) : step === "form" ? (
        <form className="cpop-form" onSubmit={submit} noValidate>
          <h2 id="cpop-title">Request a call back</h2>
          <label htmlFor="cpop-name">Your name</label>
          <input id="cpop-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} autoFocus />
          <label htmlFor="cpop-phone">Mobile number</label>
          <input id="cpop-phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel-national" placeholder="98765 43210" maxLength={16} />
          {error ? <p className="cpop-err" role="alert">{error}</p> : null}
          <button className="btn btn--block" type="submit" disabled={sending}>{sending ? "Sending…" : "Call me back"}</button>
          <p className="cpop-fine">Divergent Classes may call or WhatsApp you about courses. See the <a href="/privacy/">privacy policy</a>.</p>
        </form>
      ) : (
        <>
          <div className="cpop-head">
            <h2 id="cpop-title">Have questions about your prep?</h2>
            <p>Our counsellors can answer them.</p>
          </div>
          <button className="btn btn--block" type="button" onClick={() => setStep("form")}>Request a call back</button>
          <a className="btn btn--ghost btn--block" href={`tel:${CONTACT.phone}`}>or call us @ {CONTACT.phoneShown}</a>
        </>
      )}
    </div>
  );
}
