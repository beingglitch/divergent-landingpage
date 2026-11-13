import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { CONTACT } from "@/lib/config";
import { aidmtDays, getAidmt, rupees } from "@/lib/aidmt";
import { AidmtRegLine, AidmtSchedule } from "@/components/Aidmt";
import { getPosts } from "@/lib/blog";

/* Everything on this page is edited on the LMS admin AIDMT tab (lib/aidmt.ts).
   Dates are IST. The parts that depend on today (what is next, what is done)
   are client components in components/Aidmt.tsx. */
export async function generateMetadata(): Promise<Metadata> {
  const a = await getAidmt();
  const paid = a.series.filter((s) => !s.free);
  const span = a.series.length ? `, ${aidmtDays(a.series[0].opens, a.series[a.series.length - 1].closes)}` : "";
  return pageMeta({
    title: "AIDMT 2027: All India Design Mock Test for UCEED, NID and NIFT | Divergent Classes",
    description: `AIDMT 2027: national design mocks set like NID, UCEED and NIFT${span}, each with an All India Rank. ${paid.length ? `${rupees(a.pricing.perSitting)} a mock, or any ${a.pricing.bundleSize} for ${rupees(a.pricing.bundlePrice)}.` : "Free to sit."}`,
    path: "/aidmt/",
  });
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>{children}</p>
  );
}

const i = (n: number) => ({ "--i": String(n) }) as CSSProperties;

/* "Asked, answered." puts the last word in the dark highlight. */
function lastWordHighlighted(text: string) {
  const at = text.trim().lastIndexOf(" ");
  if (at < 0) return <span className="hb">{text}</span>;
  return <>{text.slice(0, at + 1)}<span className="hb">{text.slice(at + 1)}</span></>;
}

export const revalidate = 60;

export default async function AidmtPage() {
  const [a, posts] = await Promise.all([getAidmt(), getPosts(100)]);
  /* Blog guides show once their post is published, so the page never sends anyone to a missing page. */
  const live = posts.map((post) => `/blog/${post.slug}/`);
  const guideUrl = a.hero.guideUrl && (!a.hero.guideUrl.startsWith("/blog/") || live.includes(a.hero.guideUrl)) ? a.hero.guideUrl : null;
  const { pricing } = a;
  const off = pricing.wasPrice && pricing.wasPrice > pricing.perSitting ? Math.round(100 - (pricing.perSitting * 100) / pricing.wasPrice) : null;
  const paid = a.series.filter((s) => !s.free);
  const free = a.series.length - paid.length;
  const seriesDays = a.series.length ? aidmtDays(a.series[0].opens, a.series[a.series.length - 1].closes) : "Dates soon";
  const allFree = paid.length === 0 || pricing.perSitting <= 0;
  const register = allFree ? "Register free" : `Register for ${rupees(pricing.perSitting)}`;
  const closed = a.registrationEnds ? new Date(a.registrationEnds) < new Date() : false;
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              {a.hero.pills.length ? (
                <p className="pills">{a.hero.pills.map((pill, n) => n === a.hero.pills.length - 1 && n > 0
                  ? <span key={pill} className="pill pill--dark"><span className="dot" aria-hidden="true"></span>{pill}</span>
                  : <span key={pill} className="pill">{pill}</span>)}</p>
              ) : null}
              <h1 className="h1" id="hero-h">{a.hero.title} {a.hero.highlight ? <span className="hl">{a.hero.highlight}<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span> : null}</h1>
              {a.hero.tagline ? <p className="hero-sub">{a.hero.tagline}</p> : null}
              {guideUrl ? <p className="aidmt-guide"><a href={guideUrl}>{a.hero.guideLabel || "Read the full guide"} <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a></p> : null}
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Series</span><b>{seriesDays}</b></li>
              <li><span>Mocks</span><b>{a.series.length}{free ? `, ${free} free` : ""}</b></li>
              <li><span>Per mock</span><b>{allFree ? "Free" : rupees(pricing.perSitting)} {!allFree && off ? <s className="aidmt-was">{rupees(pricing.wasPrice!)}</s> : null}</b></li>
              {allFree ? null : <li><span>Any {pricing.bundleSize}</span><b>{rupees(pricing.bundlePrice)}</b></li>}
            </ul>
            <div className="hero-ctas">
              {closed ? null : <a className="btn" href={a.enrolUrl}>{register} <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>}
              <a className="btn btn--ghost" href="#dates">See the schedule</a>
            </div>
            {closed ? null : <AidmtRegLine builtAt={Date.now()} series={a.series} off={off} />}
          </div>
        </div>
      </section>

      {a.why.items.length ? (
        <section className="section" id="why" data-dot="Why" aria-labelledby="why-h">
          <div className="wrap">
            <div className="head">
              <Eyebrow>Why take it</Eyebrow>
              <h2 className="h2 rv" id="why-h">{a.why.heading}</h2>
            </div>
            <dl className="kfacts kfacts--4">
              {a.why.items.map((item, n) => <div key={item.title} className="rv" style={i(n)}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}
            </dl>
          </div>
        </section>
      ) : null}

      {a.pattern.parts.length ? (
        <section className="section tint" id="pattern" data-dot="Pattern" aria-labelledby="pat-h">
          <div className="wrap">
            <div className="head head--row">
              <div>
                <Eyebrow>The paper</Eyebrow>
                <h2 className="h2 rv" id="pat-h">{a.pattern.heading}</h2>
              </div>
              {a.pattern.intro ? <p className="aidmt-total rv">{a.pattern.intro}</p> : null}
            </div>
            <div className="parts">
              {a.pattern.parts.map((part, n) => (
                <div key={part.name} className={`part rv${n % 2 ? " y" : ""}`} style={i(n)}>
                  <p className="part-k">{part.note ? `${part.name} · ${part.note}` : part.name}</p>
                  <h3>{part.marks} marks</h3>
                  <ul>{part.topics.map((topic) => <li key={topic.name}><b>{topic.name}</b><span>{topic.detail}</span></li>)}</ul>
                  {part.footnote ? <p className="aidmt-note">{part.footnote}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="dates" data-dot="Dates" aria-labelledby="dates-h">
        <div className="wrap">
          <div className="head">
            <Eyebrow>Dates</Eyebrow>
            <h2 className="h2 rv" id="dates-h">{a.dates.heading}</h2>
          </div>
          <AidmtSchedule builtAt={Date.now()} series={a.series} price={pricing.perSitting} live={live} />
          {a.dates.note ? <p className="dates-note">{a.dates.note}</p> : null}
        </div>
      </section>

      {a.steps.items.length ? (
        <section className="section tint" id="how" data-dot="How it works" aria-labelledby="how-h">
          <div className="wrap">
            <div className="head">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="h2 rv" id="how-h">{a.steps.heading}</h2>
            </div>
            <dl className="kfacts kfacts--4">
              {a.steps.items.map((item, n) => <div key={item.title} className="rv" style={i(n)}><dt>Step {n + 1} · {item.title}</dt><dd>{item.body}</dd></div>)}
            </dl>
          </div>
        </section>
      ) : null}

      {a.rules.items.length ? (
        <section className="section" id="rules" data-dot="Rules" aria-labelledby="rules-h">
          <div className="wrap">
            <div className="head">
              <Eyebrow>Rules</Eyebrow>
              <h2 className="h2 rv" id="rules-h">{a.rules.heading}</h2>
            </div>
            <dl className="kfacts">
              {a.rules.items.map((item, n) => <div key={item.title} className="rv" style={i(n)}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}
            </dl>
          </div>
        </section>
      ) : null}

      {a.madeBy.toppers.length ? (
        <section className="section tint" id="by" data-dot="Made by" aria-labelledby="by-h">
          <div className="wrap">
            <div className="head head--row">
              <div>
                <Eyebrow>Made by</Eyebrow>
                <h2 className="h2 rv" id="by-h">{a.madeBy.heading}</h2>
              </div>
              <a className="btn btn--ghost" href="/results/">See every result <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            </div>
            <ul className="toppers rv">
              {a.madeBy.toppers.map((t) => (
                <li key={`${t.name}-${t.rank}`} className="tcard">{t.photo ? <img src={t.photo} alt={t.name} width="480" height="480" loading="lazy" /> : null}{t.exam ? <span className="tk">{t.exam}</span> : null}<b>{t.rank}</b><span className="tn">{t.name}</span></li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {a.faqs.items.length ? (
        <section className="section" id="faqs" data-dot="FAQs" aria-labelledby="faq-h">
          <div className="wrap faq-grid">
            <div className="faq-side"><div className="stick">
              <Eyebrow>FAQs</Eyebrow>
              <h2 className="h2 rv" id="faq-h">{lastWordHighlighted(a.faqs.heading)}</h2>
              <div className="ask rv" style={i(1)}>
                <p className="ask-h">Still unsure?</p>
                <p>Message us on WhatsApp or call {CONTACT.phoneShown}.</p>
                <a className="btn btn--sm" href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I have a question about AIDMT.")}`} target="_blank" rel="noopener">Ask on WhatsApp</a>
              </div>
            </div></div>
            <div>
              <div className="faq-group">
                {a.faqs.items.map((faq) => (
                  <div className="faq" key={faq.question}><h4><button className="faq-q" type="button" aria-expanded="false">{faq.question}<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>{faq.answer}</p></div></div></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="enrol-wrap" id="start" data-dot="Register" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">{closed ? "Registration is closed. Watch this space for the next AIDMT." : a.cta.heading}</h2>
              {a.cta.lede && !closed ? <p className="lede">{a.cta.lede}</p> : null}
              <div className="acts">
                {closed ? null : <a className="btn btn--dark" href={a.enrolUrl}>{register} <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>}
                <a className="btn btn--light" href="/#plans">See the 75-day course</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
