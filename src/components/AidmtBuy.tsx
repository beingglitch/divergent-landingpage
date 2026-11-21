"use client";

import { useEffect, useRef, useState } from "react";
import { APP_URL, ist } from "@/lib/config";
import { aidmtDays, rupees, type AidmtOffer, type AidmtSitting } from "@/lib/aidmt";
import { track } from "@/lib/pixel";
import { savedUtm } from "@/lib/utm";

/* AIDMT bought right here, with no sign-in. Every Register on /aidmt/ is a
   link to the app marked data-aidmt-buy (its sitting, or empty); this opens
   the dialog instead. Free mocks are listed apart and sat in the app; paid
   ones are a tick list priced like the app's cart, then a mobile number and
   Razorpay. The order belongs to that number (app lib/guest-checkout), so
   after paying the buyer signs in with it and the mocks are there.

   The Pixel: ViewContent when the dialog opens, InitiateCheckout on Pay,
   Purchase once paid. Purchase carries the Razorpay order id, the same id the
   app sends Meta from the server, so the sale counts once. */

const CHECKOUT = `${APP_URL}/api/public/aidmt/checkout`;
const VERIFY = `${APP_URL}/api/public/aidmt/verify`;
const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type Rzp = { open: () => void; on: (e: string, f: (r: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => Rzp } }

/* The app's cart pricing (lib/aidmt-offers priceCart), so the total here is
   what checkout charges. Checkout works it out again either way. */
function offerTotal(prices: number[], offer: AidmtOffer): number | null {
  const paid = prices.filter((p) => p > 0).sort((a, b) => b - a);
  if (offer.kind === "fixed") {
    if (paid.length < offer.size) return null;
    return offer.price + paid.slice(offer.size).reduce((sum, p) => sum + (offer.extra === null ? p : Math.min(p, offer.extra)), 0);
  }
  const group = offer.buy + offer.free;
  if (paid.length < group) return null;
  return paid.reduce((sum, p, i) => (i % group >= offer.buy && i < paid.length - (paid.length % group) ? sum : sum + p), 0);
}
function priceCart(prices: number[], offers: AidmtOffer[]) {
  const plain = prices.reduce((sum, p) => sum + Math.max(0, p), 0);
  let best = { plain, total: plain, offer: null as string | null };
  for (const offer of offers) {
    const total = offerTotal(prices, offer);
    if (total !== null && total < best.total) best = { plain, total, offer: offer.name };
  }
  return best;
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = RZP_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* "AIDMT 2: UCEED Mock", with its exam only when the name does not say it. */
const label = (s: AidmtSitting) => (s.exam && !s.name.toLowerCase().includes(s.exam.toLowerCase()) ? `${s.name} · ${s.exam}` : s.name);

type Step = { k: "pick" } | { k: "paying" } | { k: "done"; next: string; phone: string };

export function AidmtBuy({ series, offers, perSitting, enrolUrl }: { series: AidmtSitting[]; offers: AidmtOffer[]; perSitting: number; enrolUrl: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [now, setNow] = useState(() => Date.now());
  const [picked, setPicked] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>({ k: "pick" });

  const open = series.filter((s) => ist(s.closes).getTime() > now);
  const priceOf = (s: AidmtSitting) => (s.free ? 0 : s.price ?? perSitting);
  const free = open.filter((s) => priceOf(s) <= 0);
  const paid = open.filter((s) => priceOf(s) > 0);
  const cart = paid.filter((s) => picked.includes(s.key));
  const priced = priceCart(cart.map(priceOf), offers);
  const digits = phone.replace(/\D/g, "").slice(-10);

  /* Every Register on the page opens this, its own mock ticked. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLElement>("[data-aidmt-buy]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const t = Date.now();
      setNow(t);
      const want = a.dataset.aidmtBuy;
      const sellable = series.filter((s) => ist(s.closes).getTime() > t && (s.free ? 0 : s.price ?? perSitting) > 0);
      // Their mock, or with only one to buy, that one: there is nothing else to choose.
      setPicked(want && sellable.some((s) => s.key === want) ? [want] : sellable.length === 1 ? [sellable[0].key] : []);
      setError("");
      setStep({ k: "pick" });
      ref.current?.showModal();
      // The question, not the close button, takes focus.
      ref.current?.querySelector<HTMLElement>("h2")?.focus();
      track("ViewContent", { content_type: "product", content_ids: ["aidmt"], content_name: "AIDMT" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [series, perSitting]);

  /* After paying, on to the app: sign in with the same number, then their mocks. */
  useEffect(() => {
    if (step.k !== "done") return;
    const t = window.setTimeout(() => { location.href = step.next; }, 6000);
    return () => window.clearTimeout(t);
  }, [step]);

  const toggle = (key: string) => setPicked((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  async function pay() {
    setError("");
    if (!cart.length) return setError("Tick a mock to buy.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter your 10-digit mobile number.");
    setStep({ k: "paying" });
    track("InitiateCheckout", { content_type: "product", content_ids: ["aidmt"], content_name: "AIDMT", currency: "INR", value: priced.total, num_items: cart.length });
    try {
      const [ready, res] = await Promise.all([
        loadRazorpay(),
        fetch(CHECKOUT, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: digits, sittings: cart.map((s) => s.key), utm: savedUtm() }) }),
      ]);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setStep({ k: "pick" });
        return setError(json?.error || "Could not start the payment. Please try again.");
      }
      if (!ready || !window.Razorpay) {
        setStep({ k: "pick" });
        return setError("The payment window did not load. Check your connection and try again.");
      }
      const { orderId, amount, currency, keyId } = json.data as { orderId: string; amount: number; currency: string; keyId: string };
      // The dialog steps aside: Razorpay draws its own window on the page.
      ref.current?.close();
      const rzp = new window.Razorpay({
        key: keyId, order_id: orderId, amount, currency,
        name: "Divergent Classes",
        description: cart.map((s) => s.name).join(", "),
        prefill: { contact: `+91${digits}` },
        theme: { color: "#209bd2" },
        modal: { ondismiss: () => { setStep({ k: "pick" }); ref.current?.showModal(); } },
        handler: async (r: Record<string, string>) => {
          ref.current?.showModal();
          const v = await fetch(VERIFY, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) }).then((x) => x.json()).catch(() => null);
          track("Purchase", { content_type: "product", content_ids: ["aidmt"], content_name: "AIDMT", currency: "INR", value: amount / 100, num_items: cart.length }, orderId);
          // Paid either way: the gateway also tells the app. Only the next step differs.
          setStep({ k: "done", next: v?.data?.next || enrolUrl, phone: digits });
        },
      });
      rzp.on("payment.failed", (r) => setError(r.error?.description ? `Payment failed: ${r.error.description}. No money was taken; try again.` : "Payment failed. No money was taken; try again."));
      rzp.open();
    } catch {
      setStep({ k: "pick" });
      setError("Could not start the payment. Check your connection and try again.");
    }
  }

  const close = () => ref.current?.close();
  return (
    <dialog className="buy-dlg" ref={ref} aria-labelledby="buy-h" onClick={(e) => { if (e.target === ref.current && step.k !== "paying") close(); }}>
      {step.k === "done" ? (
        <div className="buy-in buy-done" role="status">
          <h2 id="buy-h">You are registered.</h2>
          <p>Your mocks are on <b>+91 {step.phone.slice(0, 5)} {step.phone.slice(5)}</b>. Sign in with this number on a laptop or desktop to sit them. Taking you there now.</p>
          <a className="btn" href={step.next}>Go to my mocks <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
        </div>
      ) : (
        <form className="buy-in" onSubmit={(e) => { e.preventDefault(); void pay(); }}>
          <div className="buy-top">
            <h2 id="buy-h" tabIndex={-1}>Choose your mocks</h2>
            <button type="button" className="buy-x" aria-label="Close" onClick={close}><span aria-hidden="true">×</span></button>
          </div>

          {free.length ? (
            <section aria-labelledby="buy-free-h">
              <h3 className="buy-k" id="buy-free-h">Free for everyone</h3>
              <ul className="buy-list">
                {free.map((s) => (
                  <li key={s.key} className="buy-row">
                    <span className="buy-name"><b>{label(s)}</b><span>{aidmtDays(s.opens, s.closes)}</span></span>
                    <a className="btn btn--ghost btn--sm" href={`${enrolUrl}?to=sittings`}>Sit free</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {paid.length ? (
            <section aria-labelledby="buy-paid-h">
              <h3 className="buy-k" id="buy-paid-h">Buy</h3>
              {offers.length ? <p className="buy-offers">{offers.map((o) => <span key={o.id} className={priced.offer === o.name ? "on" : ""}>{o.name}</span>)}</p> : null}
              <ul className="buy-list">
                {paid.map((s) => (
                  <li key={s.key}>
                    <label className={"buy-row buy-pick" + (picked.includes(s.key) ? " on" : "")}>
                      <input type="checkbox" checked={picked.includes(s.key)} onChange={() => toggle(s.key)} />
                      <span className="buy-name"><b>{label(s)}</b><span>{aidmtDays(s.opens, s.closes)}</span></span>
                      <span className="buy-price">{rupees(priceOf(s))}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="book-f buy-phone">
                <label htmlFor="buy-tel">Mobile number</label>
                <div className="book-tel">
                  <span aria-hidden="true">+91</span>
                  <input id="buy-tel" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={16} value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} />
                </div>
              </div>

              {error ? <p className="buy-err" role="alert">{error}</p> : null}
              <div className="buy-foot">
                <p className="buy-total">
                  <b>{rupees(priced.total)}</b>
                  {priced.offer ? <s>{rupees(priced.plain)}</s> : null}
                  <span>{priced.offer ? `${priced.offer} applied` : cart.length ? `${cart.length} ${cart.length === 1 ? "mock" : "mocks"}` : "Tick a mock"}</span>
                </p>
                <button type="submit" className="btn" disabled={!cart.length || step.k === "paying"}>
                  {step.k === "paying" ? "Opening payment…" : cart.length ? `Pay ${rupees(priced.total)}` : "Pay"}
                </button>
              </div>
            </section>
          ) : (
            <p className="buy-none">No paid mocks are open right now. New ones show here when they are announced.</p>
          )}
        </form>
      )}
    </dialog>
  );
}
