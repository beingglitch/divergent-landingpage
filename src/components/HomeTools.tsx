import type { CSSProperties, ReactNode } from "react";
import { EXAM_DAYS, type Tool, type ToolIcon } from "@/lib/home-content";
import { ExamClocks } from "@/components/ExamClocks";
import { ToolWaitlist } from "@/components/ToolWaitlist";

/* The home page's free tools, as app-like tiles in one grid: each opens its
   tool (on this site, in the app or on LeetDesign), the live exam countdown
   sits among them, and a tool that is not built yet asks for a WhatsApp
   number instead (components/ToolWaitlist). A few tiles carry a small
   picture of what is inside. */

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

const GLYPHS: Record<ToolIcon, ReactNode> = {
  sketch: <path d="M4 20l1.2-4.8L15.6 4.8a2.1 2.1 0 013 3L8.2 18.2zM13.6 6.8l3.2 3.2" />,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 114 2c-.9.6-1.6 1.1-1.6 2.3" /><path d="M12 17.2v.1" /></>,
  palette: <><rect x="4" y="4" width="7" height="7" rx="1.6" /><rect x="13" y="4" width="7" height="7" rx="1.6" /><rect x="4" y="13" width="7" height="7" rx="1.6" /><rect x="13" y="13" width="7" height="7" rx="1.6" className="ht-g-fill" /></>,
  swords: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5.5h2.5v1.8A3.2 3.2 0 0117 10.4M7 5.5H4.5v1.8A3.2 3.2 0 007 10.4" />,
  papers: <path d="M8 3h7.5L20 7.5V19a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zM15 3v5h5M9.5 12.5h7M9.5 16h4.5" />,
  chart: <path d="M4 19.5V12M10 19.5V5M16 19.5V9.5M21 19.5H3" />,
  gauge: <><path d="M4.5 16a7.5 7.5 0 1115 0" /><path d="M12 16l3.6-4.2" /><path d="M4 19.5h16" /></>,
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.6 10.6L6 3h4l2 4.2L14 3h4l-2.6 7.6" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z" /></>,
  spark: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />,
  live: <><rect x="3" y="5" width="18" height="13" rx="2.4" /><path d="M10.2 9.2l4.6 2.6-4.6 2.6z" /><path d="M8 21h8" /></>,
};

function Glyph({ name }: { name: ToolIcon }) {
  return <svg className="ht-glyph" viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[name]}</svg>;
}

/* What a few tiles show besides their name: a peek of what is inside. */
function Peek({ t }: { t: Tool }) {
  switch (t.key) {
    case "sketch":
      return <img className="ht-peek-sketch" src="/assets/img/work/work-01.webp" alt="" width="900" height="1200" loading="lazy" />;
    case "qotd":
      return (
        <span className="ht-peek-abcd" aria-hidden="true">
          {["A", "B", "C", "D"].map((l) => <i key={l} className={l === "C" ? "ok" : undefined}>{l}</i>)}
        </span>
      );
    case "predictor":
      return (
        <span className="ht-peek-campus" aria-hidden="true">
          <img src="/assets/img/campus/iit-bombay.webp" alt="" width="720" height="553" loading="lazy" />
          <img src="/assets/img/campus/nid-ahmedabad.webp" alt="" width="402" height="257" loading="lazy" />
          <img src="/assets/img/campus/nift-delhi.webp" alt="" width="720" height="467" loading="lazy" />
        </span>
      );
    case "prep-ai":
      return (
        <span className="ht-peek-chat" aria-hidden="true">
          <span className="q">How do I draw a cube in two-point perspective?</span>
          <span className="a"><i /><i /><i /></span>
        </span>
      );
    default:
      return null;
  }
}

function Inside({ t }: { t: Tool }) {
  return (
    <>
      <span className="ht-top">
        <span className="ht-ic"><Glyph name={t.icon} /></span>
        <span className={"ht-tag" + (t.soon ? " ht-tag--soon" : "")}>{t.tag}</span>
      </span>
      <span className="ht-name">{t.name}</span>
      <span className="ht-sub">{t.sub}</span>
      <Peek t={t} />
      <span className="ht-go" aria-hidden="true"><Arrow /></span>
    </>
  );
}

export function HomeTools({ tools, builtAt }: { tools: Tool[]; builtAt: number }) {
  const tiles = tools.map((t, i) => {
    const cls = `ht-tile ht-${t.tone} ht-k-${t.key}${t.wide ? " ht-wide" : ""} rv`;
    const style = { "--i": String(i % 4) } as CSSProperties;
    const cell = "ht-cell" + (t.wide ? " ht-cell--wide" : "");
    if (t.soon) {
      return (
        <li key={t.key} style={style} className={cell}>
          <ToolWaitlist tool={t} className={cls}><Inside t={t} /></ToolWaitlist>
        </li>
      );
    }
    const out = t.href.startsWith("http");
    return (
      <li key={t.key} style={style} className={cell}>
        <a className={cls} href={t.href} {...(out && !t.href.includes("divergentclasses.com") ? { target: "_blank", rel: "noopener" } : {})}>
          <Inside t={t} />
        </a>
      </li>
    );
  });
  /* The countdown goes in as the fourth tile, a wide one. */
  tiles.splice(3, 0, (
    <li key="clock" className="ht-cell ht-cell--wide" style={{ "--i": "3" } as CSSProperties}>
      <ExamClocks exams={EXAM_DAYS} builtAt={builtAt} className="rv" />
    </li>
  ));
  return <ul className="ht-grid">{tiles}</ul>;
}
