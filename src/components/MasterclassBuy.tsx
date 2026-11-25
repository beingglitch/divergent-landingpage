"use client";

import { useEffect, useRef, useState } from "react";
import { APP_URL } from "@/lib/config";
import { MASTERCLASS_COURSE, rupees, type MasterclassMode, type ModeKey, type Prices } from "@/lib/masterclass";
import { track } from "@/lib/pixel";
import { savedUtm } from "@/lib/utm";

/* The 21 Days NID Masterclass bought right here, in one tap, as AIDMT is on
   /aidmt/ (components/AidmtBuy): every Enrol on /nid-masterclass/ is a link
   to the course in the app marked data-mc-buy (its program, or empty), and
   this opens the dialog instead. Live or Recorded, a mobile number, then
   Razorpay. The order belongs to that number (app lib/guest-checkout and
   api/public/course-checkout), so after paying the buyer signs in with it
   and the course is there. Prices are the app's (lib/masterclass
   getMasterclassPrices); checkout works them out again either way.

   The Pixel: ViewContent when the dialog opens, InitiateCheckout on Pay,
   Purchase once paid, with the Razorpay order id the app sends Meta too. */

const CHECKOUT = `${APP_URL}/api/public/course-checkout`;
const VERIFY = `${APP_URL}/api/public/course-checkout/verify`;
const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const CONTENT = { content_type: "product", content_ids: ["nid-masterclass"], content_name: "21 Days NID Masterclass" };

type Rzp = { open: () => void; on: (e: string, f: (r: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => Rzp } }

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

type Step = { k: "pick" } | { k: "paying" } | { k: "done"; next: string; phone: string };

export function MasterclassBuy({ modes, prices, enrolUrl }: { modes: MasterclassMode[]; prices: Prices; enrolUrl: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const sellable = modes.filter((m) => prices[m.key]);
  const [picked, setPicked] = useState<ModeKey | null>(sellable[0]?.key ?? null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>({ k: "pick" });
  const mode = sellable.find((m) => m.key === picked) ?? null;
  const price = mode ? prices[mode.key]! : null;
  const digits = phone.replace(/\D/g, "").slice(-10);

  /* Every Enrol on the page opens this, its own program picked. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLElement>("[data-mc-buy]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const want = a.dataset.mcBuy as ModeKey | "";
      if (want && modes.some((m) => m.key === want && prices[m.key])) setPicked(want);
      setError("");
      setStep({ k: "pick" });
      ref.current?.showModal();
      // The question, not the close button, takes focus.
      ref.current?.querySelector<HTMLElement>("h2")?.focus();
      track("ViewContent", CONTENT);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [modes, prices]);

  /* After paying, on to the app: sign in with the same number, then the course. */
  useEffect(() => {
    if (step.k !== "done") return;
    const t = window.setTimeout(() => { location.href = step.next; }, 6000);
    return () => window.clearTimeout(t);
  }, [step]);

  async function pay() {
    setError("");
    if (!mode || !price) return setError("Pick Live or Recorded.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter your 10-digit mobile number.");
    setStep({ k: "paying" });
    track("InitiateCheckout", { ...CONTENT, currency: "INR", value: price.price, num_items: 1 });
    try {
      const [ready, res] = await Promise.all([
        loadRazorpay(),
        fetch(CHECKOUT, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: digits, course: MASTERCLASS_COURSE, plan: mode.plan, utm: savedUtm() }) }),
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
        description: `21 Days NID Masterclass · ${mode.short}`,
        prefill: { contact: `+91${digits}` },
        theme: { color: "#209bd2" },
        modal: { ondismiss: () => { setStep({ k: "pick" }); ref.current?.showModal(); } },
        handler: async (r: Record<string, string>) => {
          ref.current?.showModal();
          const v = await fetch(VERIFY, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) }).then((x) => x.json()).catch(() => null);
          track("Purchase", { ...CONTENT, currency: "INR", value: amount / 100, num_items: 1 }, orderId);
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
    <dialog className="buy-dlg" ref={ref} aria-labelledby="mc-buy-h" onClick={(e) => { if (e.target === ref.current && step.k !== "paying") close(); }}>
      {step.k === "done" ? (
        <div className="buy-in buy-done" role="status">
          <h2 id="mc-buy-h">You’re in.</h2>
          <p>The masterclass is on <b>+91 {step.phone.slice(0, 5)} {step.phone.slice(5)}</b>. Sign in with this number to see your classes and register for your 3 AIDMT mocks. Taking you there now.</p>
          <a className="btn" href={step.next}>Go to my masterclass <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
        </div>
      ) : (
        <form className="buy-in" onSubmit={(e) => { e.preventDefault(); void pay(); }}>
          <div className="buy-top">
            <h2 id="mc-buy-h" tabIndex={-1}>Join the 21 Days NID Masterclass</h2>
            <button type="button" className="buy-x" aria-label="Close" onClick={close}><span aria-hidden="true">×</span></button>
          </div>
          <fieldset className="mcb-modes">
            <legend className="buy-k">Choose your program</legend>
            {sellable.map((m) => {
              const p = prices[m.key]!;
              return (
                <label key={m.key} className={"buy-row buy-pick mcb-mode" + (picked === m.key ? " on" : "")}>
                  <input type="radio" name="mc-mode" checked={picked === m.key} onChange={() => setPicked(m.key)} />
                  <span className="buy-name"><b>{m.name}</b><span>{m.line}</span></span>
                  <span className="mcb-price">
                    <b>{rupees(p.price)}</b>
                    {p.listPrice > p.price ? <s>{rupees(p.listPrice)}</s> : null}
                  </span>
                </label>
              );
            })}
          </fieldset>
          <p className="mcb-incl">Both include 13–14 masterclasses, recordings and 3 AIDMT NID mocks.</p>

          <div className="book-f buy-phone">
            <label htmlFor="mc-buy-tel">Mobile number</label>
            <div className="book-tel">
              <span aria-hidden="true">+91</span>
              <input id="mc-buy-tel" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={16} value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} />
            </div>
            <small className="mcb-hint">No sign-up. The course goes on this number; sign in with it after paying.</small>
          </div>

          {error ? <p className="buy-err" role="alert">{error}</p> : null}
          <div className="buy-foot">
            <p className="buy-total">
              <b>{price ? rupees(price.price) : "₹0"}</b>
              {price && price.listPrice > price.price ? <s>{rupees(price.listPrice)}</s> : null}
              <span>{price?.offer ? `${price.offer} applied` : mode ? `${mode.short} program` : "Pick a program"}</span>
            </p>
            <button type="submit" className="btn" disabled={!mode || step.k === "paying"}>
              {step.k === "paying" ? "Opening payment…" : price ? `Pay ${rupees(price.price)}` : "Pay"}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
