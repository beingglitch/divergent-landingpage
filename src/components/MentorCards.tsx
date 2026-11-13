import type { CSSProperties } from "react";
import { TONE_CLASS, type MentorTone, type SiteMentor } from "@/lib/mentors";

/* A row of mentor cards (ul.pmentors). `tone` colours every card for one
   category's list; without it each card takes its first category's colour. `stagger`
   gives each card the reveal and the four-step delay the exam lists use. */
export function MentorCards({ mentors, tone, stagger = false, reveal = false }: {
  mentors: SiteMentor[];
  tone?: MentorTone;
  stagger?: boolean;
  /* Reveal the list as one, as the home page does. */
  reveal?: boolean;
}) {
  if (!mentors.length) return null;
  return (
    <ul className={reveal ? "pmentors rv" : "pmentors"}>
      {mentors.map((mentor, index) => {
        const colour = TONE_CLASS[tone ?? mentor.tone] ?? "";
        const step = index % 4;
        return (
          <li
            key={mentor.id}
            className={["pm", colour, stagger ? "rv" : ""].filter(Boolean).join(" ")}
            style={stagger && step ? ({ "--i": String(step) } as CSSProperties) : undefined}
          >
            <img src={mentor.photo} alt={mentor.name} width="480" height="600" loading="lazy" />
            <b>{mentor.name}</b>
            <span>{mentor.line}</span>
          </li>
        );
      })}
    </ul>
  );
}
