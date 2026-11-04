import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { AIDMT, CONTACT, aidmtWindow, ist } from "@/lib/config";

export const metadata: Metadata = pageMeta({
  title: "AIDMT 2026: All India Design Mock Test for UCEED, NID and NIFT | Divergent Classes",
  description: "A national design mock in the UCEED pattern. Part A and Part B, a 48-hour window on 17 and 18 November, and your All India Rank within 24 hours. ₹99, or ₹199 for a group of three.",
  path: "/aidmt/",
});

/* Dates in AIDMT are IST; show them the same way wherever the page is built. */
const fmt = (s: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o }).format(ist(s));
const day = (s: string) => fmt(s, { day: "numeric", month: "short" });
const time = (s: string) => fmt(s, { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase().replace(":00", "");
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const mockDays = aidmtWindow();
const off = Math.round(100 - (AIDMT.fee * 100) / AIDMT.feeWas);

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>{children}</p>
  );
}

const i = (n: number) => ({ "--i": String(n) }) as CSSProperties;

const WHY = [
  ["Your All India Rank", "Sit the paper with students across India, on the same days, and see your rank and percentile."],
  ["Topic by topic", "Your accuracy in each of the 7 Part A topics, so you know what to fix first."],
  ["Guesswork, measured", "See how many marks negative marking cost you, and where you rushed."],
  ["What to practise next", "A short list of what to work on, based on the questions you got wrong."],
];

const PART_A = [
  ["Visualisation", "3D rotation, nets, isometric and orthographic views."],
  ["Science", "Everyday physics, gears, levers and materials."],
  ["Observation", "Visual detail, proportion and design sensitivity."],
  ["Environment", "Environment and society."],
  ["Reasoning", "Analytical and logical reasoning."],
  ["Language", "Reading, grammar and communication."],
  ["Creativity", "Lateral thinking and new ideas."],
];

const STEPS = [
  ["Step 1 · Register", `Name, phone and target year. You get your admit ID straight away. Registration closes ${day(AIDMT.registrationEnds)}.`],
  ["Step 2 · Sit the mock", `Online, on a laptop or desktop, any time in the ${mockDays} window. One attempt.`],
  ["Step 3 · Get your rank", `Scorecard, All India Rank, percentile and topic report by ${day(AIDMT.results)}.`],
  ["Step 4 · Fix weak spots", "Practise the topics your report flags before the real exam."],
];

const RULES = [
  ["48-hour window", `Opens ${day(AIDMT.mock.opens)}, ${time(AIDMT.mock.opens)}. Closes ${day(AIDMT.mock.closes)}, ${time(AIDMT.mock.closes)}. Start whenever suits you.`],
  ["One attempt", "Each student sits it once, so the ranks stay fair."],
  ["Rank needs the window", "Only papers submitted inside the window get an All India Rank."],
  ["Laptop or desktop", "A recent browser and a steady connection. Phones are not supported."],
  ["Results in 24 hours", "Scorecards open in your student login a day after the window closes."],
  ["Fair test", "Full screen, and switching windows is logged."],
];

const FAQS = [
  ["What is AIDMT?", "The All India Design Mock Test, run by Divergent Classes. It follows the UCEED pattern and suits UCEED, CEED, NID and NIFT students, with a national rank at the end."],
  ["Who can take it?", "Anyone preparing for a design entrance: Class 11, Class 12, droppers, and graduates aiming for M.Des."],
  ["What is the pattern?", "Part A on computer: 180 marks across 7 topics, with MCQ, MSQ and numerical questions. Part B: 60 marks of drawing and design problems. About 150 minutes in all."],
  ["How do I register?", `Tap Register, sign in with your mobile number and pay ${rupees(AIDMT.fee)}, or ${rupees(AIDMT.groupFee)} for you and two friends. You are registered straight away.`],
  ["When can I sit it?", `Any time between ${day(AIDMT.mock.opens)}, ${time(AIDMT.mock.opens)} and ${day(AIDMT.mock.closes)}, ${time(AIDMT.mock.closes)} (IST). There is also a free Part A sectional on ${day(AIDMT.sectional.opens)}.`],
  ["Can I take it again?", "No. One attempt per student, so the ranks stay fair and the questions stay private."],
  ["What does it cost?", `${rupees(AIDMT.fee)} for one student, down from ${rupees(AIDMT.feeWas)}, or ${rupees(AIDMT.groupFee)} for a group of ${AIDMT.groupSize}. That covers the test, Part A and Part B marking, your rank, percentile and topic report. The sectional on ${day(AIDMT.sectional.opens)} is free.`],
  ["When do results come?", `Within 24 hours of the window closing, by ${day(AIDMT.results)}.`],
  ["What is in the report?", "Your total and section scores, All India Rank and percentile, accuracy in each Part A topic, and what to practise next."],
  ["Is it linked to IIT Bombay or UCEED?", "No. AIDMT is an independent mock by Divergent Classes. It is practice, not an admission test."],
];

export default function AidmtPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">UCEED · CEED · NID · NIFT</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>AIDMT 2026</span></p>
              <h1 className="h1" id="hero-h">All India <span className="hl">Design Mock.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">One national mock in the UCEED pattern. Sit it from home and get your All India Rank in 24 hours.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Mock window</span><b>{mockDays}</b></li>
              <li><span>Pattern</span><b>Part A + Part B</b></li>
              <li><span>Fee</span><b>{rupees(AIDMT.fee)} <s className="aidmt-was">{rupees(AIDMT.feeWas)}</s></b></li>
              <li><span>Group of {AIDMT.groupSize}</span><b>{rupees(AIDMT.groupFee)}</b></li>
            </ul>
            <div className="hero-ctas">
              <a className="btn" href={AIDMT.enrolUrl}>Register for {rupees(AIDMT.fee)} <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="#dates">Free sectional, {day(AIDMT.sectional.opens)}</a>
            </div>
            <p className="aidmt-close"><svg width="18" height="18" aria-hidden="true"><use href="#clock" /></svg>Registration closes {day(AIDMT.registrationEnds)} · {off}% off</p>
          </div>
        </div>
      </section>

      <section className="section" id="why" data-dot="Why" aria-labelledby="why-h">
        <div className="wrap">
          <div className="head">
            <Eyebrow>Why take it</Eyebrow>
            <h2 className="h2 rv" id="why-h">Know where you stand before exam day.</h2>
          </div>
          <dl className="kfacts kfacts--4">
            {WHY.map(([k, v], n) => <div key={k} className="rv" style={i(n)}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section tint" id="pattern" data-dot="Pattern" aria-labelledby="pat-h">
        <div className="wrap">
          <div className="head head--row">
            <div>
              <Eyebrow>The paper</Eyebrow>
              <h2 className="h2 rv" id="pat-h">Two parts. 240 marks.</h2>
            </div>
            <p className="aidmt-total rv">About 150 minutes, in one sitting.</p>
          </div>
          <div className="parts">
            <div className="part rv">
              <p className="part-k">Part A · on computer</p>
              <h3>180 marks</h3>
              <ul>{PART_A.map(([k, v]) => <li key={k}><b>{k}</b><span>{v}</span></li>)}</ul>
              <p className="aidmt-note">MCQ, MSQ and numerical questions, as in UCEED.</p>
            </div>
            <div className="part y rv" style={i(1)}>
              <p className="part-k">Part B · drawing</p>
              <h3>60 marks</h3>
              <ul>
                <li><b>Drawing</b><span>Perspective, proportion, the human figure, light and shade.</span></li>
                <li><b>Design aptitude</b><span>Solve a design problem and explain it in a sketch.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="dates" data-dot="Dates" aria-labelledby="dates-h">
        <div className="wrap">
          <div className="head">
            <Eyebrow>Dates</Eyebrow>
            <h2 className="h2 rv" id="dates-h">Two dates to mark.</h2>
          </div>
          <div className="cds">
            <div className="cd y rv">
              <div className="cd-name"><span className="cd-x">Free sectional</span><span className="cd-when">Part A only · Free</span></div>
              <div className="cd-row"><span className="cd-num">{fmt(AIDMT.sectional.opens, { day: "numeric" })}</span><span className="cd-unit">{fmt(AIDMT.sectional.opens, { month: "long" })}</span></div>
              <ul className="cd-dates">
                <li><span className="d">{time(AIDMT.sectional.opens)}</span><span className="w">Window opens</span><span className="st"></span></li>
                <li><span className="d">{time(AIDMT.sectional.closes)}</span><span className="w">Closes, report opens straight after</span><span className="st"></span></li>
              </ul>
            </div>
            <div className="cd b rv" style={i(1)}>
              <div className="cd-name"><span className="cd-x">Full mock</span><span className="cd-when">Part A + B · {rupees(AIDMT.fee)}</span></div>
              <div className="cd-row"><span className="cd-num">{mockDays.split(" ")[0]}</span><span className="cd-unit">{fmt(AIDMT.mock.closes, { month: "long" })}</span></div>
              <ul className="cd-dates">
                <li><span className="d">{day(AIDMT.registrationEnds)}</span><span className="w">Registration closes</span><span className="st"></span></li>
                <li><span className="d">{day(AIDMT.mock.opens)}</span><span className="w">Window opens, {time(AIDMT.mock.opens)}</span><span className="st"></span></li>
                <li><span className="d">{day(AIDMT.mock.closes)}</span><span className="w">Window closes, {time(AIDMT.mock.closes)}</span><span className="st"></span></li>
                <li><span className="d">{day(AIDMT.results)}</span><span className="w">Ranks and reports out</span><span className="st"></span></li>
              </ul>
            </div>
          </div>
          <p className="dates-note">Times in IST.</p>
        </div>
      </section>

      <section className="section tint" id="how" data-dot="How it works" aria-labelledby="how-h">
        <div className="wrap">
          <div className="head">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="h2 rv" id="how-h">Register to rank in four steps.</h2>
          </div>
          <dl className="kfacts kfacts--4">
            {STEPS.map(([k, v], n) => <div key={k} className="rv" style={i(n)}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section" id="rules" data-dot="Rules" aria-labelledby="rules-h">
        <div className="wrap">
          <div className="head">
            <Eyebrow>Rules</Eyebrow>
            <h2 className="h2 rv" id="rules-h">Read before you start.</h2>
          </div>
          <dl className="kfacts">
            {RULES.map(([k, v], n) => <div key={k} className="rv" style={i(n)}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section tint" id="by" data-dot="Made by" aria-labelledby="by-h">
        <div className="wrap">
          <div className="head head--row">
            <div>
              <Eyebrow>Made by</Eyebrow>
              <h2 className="h2 rv" id="by-h">Set by the team behind these ranks.</h2>
            </div>
            <a className="btn btn--ghost" href="/results/">See every result <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
          <ul className="toppers rv">
            <li className="tcard"><img src="/assets/img/toppers/ankit.webp" alt="Ankit" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 2</b><span className="tn">Ankit</span></li>
            <li className="tcard"><img src="/assets/img/toppers/priyanka.webp" alt="Priyanka" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 4</b><span className="tn">Priyanka</span></li>
            <li className="tcard"><img src="/assets/img/toppers/rudra.webp" alt="Rudra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 8</b><span className="tn">Rudra</span></li>
            <li className="tcard"><img src="/assets/img/toppers/ameya.webp" alt="Ameya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 10</b><span className="tn">Ameya</span></li>
            <li className="tcard"><img src="/assets/img/toppers/hiya.webp" alt="Hiya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 30</b><span className="tn">Hiya</span></li>
            <li className="tcard"><img src="/assets/img/toppers/debashis.webp" alt="Debashis" width="480" height="480" loading="lazy" /><span className="tk">NID</span><b>AIR 52</b><span className="tn">Debashis</span></li>
          </ul>
        </div>
      </section>

      <section className="section" id="faqs" data-dot="FAQs" aria-labelledby="faq-h">
        <div className="wrap faq-grid">
          <div className="faq-side"><div className="stick">
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="h2 rv" id="faq-h">Asked, <span className="hb">answered.</span></h2>
            <div className="ask rv" style={i(1)}>
              <p className="ask-h">Still unsure?</p>
              <p>Message us on WhatsApp or call {CONTACT.phoneShown}.</p>
              <a className="btn btn--sm" href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I have a question about AIDMT.")}`} target="_blank" rel="noopener">Ask on WhatsApp</a>
            </div>
          </div></div>
          <div>
            <div className="faq-group">
              {FAQS.map(([q, a]) => (
                <div className="faq" key={q}><h4><button className="faq-q" type="button" aria-expanded="false">{q}<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>{a}</p></div></div></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Register" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">AIDMT is on {mockDays}. Register now.</h2>
              <p className="lede">{rupees(AIDMT.fee)} for the full mock, your rank and topic report, or {rupees(AIDMT.groupFee)} for {AIDMT.groupSize} friends together. Registration closes {day(AIDMT.registrationEnds)}.</p>
              <div className="acts">
                <a className="btn btn--dark" href={AIDMT.enrolUrl}>Register for {rupees(AIDMT.fee)} <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
                <a className="btn btn--light" href="/#plans">See the 75-day course</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
