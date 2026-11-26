"use client";

import { useEffect, useState } from "react";
import type { ExamDay } from "@/lib/home-content";

/* The live countdown tile of the home page's free tools: days left to each
   exam, counted in Indian calendar days, so it turns over at midnight IST.
   The first paint uses the time the page was built, the same on the server
   and in the browser; the browser's own clock takes over at once. An exam
   that is over drops out. */

const DAY = 86400000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const todayIst = (t: number) => Math.floor((t + 5.5 * 3600000) / DAY);
const dayNumber = (d: string) => Math.floor(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / DAY);
const label = (d: string) => `${+d.slice(8, 10)} ${MONTHS[+d.slice(5, 7) - 1]}`;

export function ExamClocks({ exams, builtAt, className = "" }: { exams: ExamDay[]; builtAt: number; className?: string }) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  const today = todayIst(now);
  const rows = exams.map((e) => ({ ...e, left: dayNumber(e.day) - today })).filter((e) => e.left >= 0);
  if (!rows.length) return null;
  return (
    <div className={"ht-tile ht-wide ht-clock " + className}>
      <span className="ht-tag ht-tag--live"><span className="ht-live" aria-hidden="true" />Live</span>
      <span className="ht-name">Exam countdown</span>
      <ul className="ht-clocks">
        {rows.map((e) => {
          const out = e.href.startsWith("http");
          return (
            <li key={e.key}>
              <a href={e.href} {...(out ? { target: "_blank", rel: "noopener" } : {})}>
                <b>{e.left === 0 ? "Today" : e.left}</b>
                {e.left === 0 ? null : <small>{e.left === 1 ? "day" : "days"}</small>}
                <span>{e.name}</span>
                <em>{label(e.day)}</em>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
