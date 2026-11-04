"use client";

import { useEffect, useState } from "react";
import { highlightPieces, highlightPlain, loadHighlights, type HighlightLine } from "@/lib/highlights";

/* The yellow strip above the menu. Its lines are written in the app
   (Admin, Settings, Highlights), each with its own dates, so offers start
   and stop without a deploy. It runs right to left and stops under a
   pointer or finger, so its links can be hit. No lines: no strip. */
export function OfferBar() {
  const [lines, setLines] = useState<HighlightLine[]>([]);
  useEffect(() => {
    let live = true;
    const show = async () => {
      const next = await loadHighlights();
      if (!live) return;
      setLines(next);
      document.documentElement.classList.toggle("has-promo", next.length > 0);
    };
    void show();
    // Lines start and end by their dates; look again every few minutes.
    const timer = setInterval(show, 5 * 60_000);
    return () => { live = false; clearInterval(timer); };
  }, []);
  if (!lines.length) return null;

  const run = (copy: number) => (
    <span className="promo-run" aria-hidden={copy > 0 ? true : undefined}>
      {lines.map((line) => (
        <span key={`${copy}-${line.id}`} className="promo-item">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" /></svg>
          <span>
            {highlightPieces(line.text).map((piece, index) =>
              piece.href ? <a key={index} className="promo-link" href={piece.href} tabIndex={copy > 0 ? -1 : undefined}>{piece.text}</a> : <span key={index}>{piece.text}</span>,
            )}
          </span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="promo" role="region" aria-label={`Offers: ${lines.map((line) => highlightPlain(line.text)).join(". ")}`}>
      <span className="promo-track">
        {run(0)}
        {run(1)}
      </span>
    </div>
  );
}
