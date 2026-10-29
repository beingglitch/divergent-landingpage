"use client";

import { useEffect, useState } from "react";
import { CONFIG, ist } from "@/lib/config";

/* The Diwali strip above the menu. It runs right to left, says what the
   Diwali bonus is, and goes away once Diwali ends (11 Nov). The date is
   read in the browser so a page built earlier still shows the right text. */
function lines(now: Date): string[] | null {
  const A = CONFIG.approvals, D = CONFIG.dates;
  if (!A.diwaliGift || now > ist(D.diwaliEnds)) return null;
  const live = now >= ist(D.diwaliStart);
  const from = `Plans from ₹${CONFIG.prices.recorded.single.price.diwali.toLocaleString("en-IN")}`;
  return [
    live ? "Diwali bonus is live till 11 November" : "Diwali bonus, 6 to 11 November",
    live ? "Use code DIWALI75 at checkout" : "Code DIWALI75 works 6 to 11 November",
    A.diwaliPrice ? `Early price returns: ${from}` : "",
    "A free extra sketch review on every plan",
    "Live and Mentor plans also get a 5-mock pack",
    !live && A.launchPrice && now <= ist(D.launchEnds) ? "Early price on now, till 2 November" : "",
    `Join with ₹${CONFIG.joinAmount.toLocaleString("en-IN")}`,
  ].filter(Boolean);
}

export function OfferBar() {
  const [items, setItems] = useState<string[] | null>(null);
  useEffect(() => {
    const show = () => {
      const next = lines(new Date());
      setItems(next);
      document.documentElement.classList.toggle("has-promo", !!next);
    };
    show();
    const timer = setInterval(show, 60_000);
    return () => clearInterval(timer);
  }, []);
  if (!items) return null;

  const run = (
    <span className="promo-run">
      {items.map((text) => (
        <span key={text} className="promo-item">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" /></svg>
          {text}
        </span>
      ))}
    </span>
  );
  return (
    <a className="promo" href="/#plans" aria-label={`${items.join(". ")}. See plans.`}>
      <span className="promo-track" aria-hidden="true">
        {run}
        {run}
      </span>
    </a>
  );
}
