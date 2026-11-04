/* The yellow bar's lines, written by the team in the app (Admin, Settings,
   Highlights) and read from its public API. `[words](link)` marks a link.
   This parser is a copy of divergent-lms src/lib/highlight-text.ts; change
   both together. */

import { APP_URL } from "@/lib/config";

export type HighlightPiece = { text: string; href?: string };
export type HighlightLine = { id: string; text: string };

const LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/* A link we will render, or null. Paths stay on this site; only http(s)
   addresses go elsewhere, so a typo can never become a harmful link. */
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^\/(?!\/)/.test(href)) return href;
  if (/^#[\w-]*$/.test(href)) return href;
  try {
    const url = new URL(/^www\./i.test(href) ? `https://${href}` : href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function highlightPieces(text: string): HighlightPiece[] {
  const pieces: HighlightPiece[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) pieces.push({ text: text.slice(last, index) });
    const href = safeHref(match[2]);
    pieces.push(href ? { text: match[1], href } : { text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) pieces.push({ text: text.slice(last) });
  return pieces.filter((piece) => piece.text.length > 0);
}

export const highlightPlain = (text: string) => highlightPieces(text).map((piece) => piece.text).join("");

/* Live lines for the website, in order. Empty when there are none or the
   app cannot be reached, and the bar hides. */
export async function loadHighlights(): Promise<HighlightLine[]> {
  try {
    const response = await fetch(`${APP_URL}/api/public/highlights?on=site`);
    const json = await response.json();
    return json?.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}
