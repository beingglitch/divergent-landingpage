import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { CONTACT } from "@/lib/config";
import { aidmtDays, getAidmt, rupees } from "@/lib/aidmt";
import { AidmtRegLine, AidmtSchedule } from "@/components/Aidmt";
import { getPosts } from "@/lib/blog";
import { ReelFacade } from "@/components/Trailer";
import { AidmtBuy } from "@/components/AidmtBuy";
import { ExamToggle, HeroDashboard, SampleDock, SampleProvider, ScorecardTour } from "@/components/AidmtScorecard";
import { getMentors } from "@/lib/mentors";
import { VideoStories } from "@/components/VideoStories";
import { STORIES } from "@/lib/testimonials";
import { AidmtExamScreen } from "@/components/AidmtExamScreen";

/* Everything on this page except the scorecard is edited on the LMS admin
   AIDMT tab (lib/aidmt.ts). Dates are IST. The parts that depend on today
   (what is next, what is done) are client components in components/Aidmt.tsx.

   The page sells the scorecard: the hero lays the whole of it on a drafting
   table, and below it one card at a time stays pinned while its short steps
   scroll past, numbered like a drawing's callouts (lib/aidmt-scorecard). The
   students in it are made up (lib/aidmt-sample), and the page says so. "Set
   like the real exam" shows the exam screen itself (AidmtExamScreen).

   Every section says one thing. Prices and offers are in the schedule and
   the buy dialog; the detail behind the steps is in the FAQs. The admin's
   rules (Read before you start) are not shown. */
export async function generateMetadata(): Promise<Metadata> {
  const a = await getAidmt();
  const paid = a.series.filter((s) => !s.free);
  const span = a.series.length ? `, ${aidmtDays(a.series[0].opens, a.series[a.series.length - 1].closes)}` : "";
  return pageMeta({
    title: "AIDMT 2027: All India Design Mock Test for UCEED, NID and NIFT | Divergent Classes",
    description: `AIDMT 2027: national design mocks set like NID, UCEED and NIFT${span}, each with an All India Rank and a full scorecard. ${paid.length ? `${rupees(a.pricing.perSitting)} a mock${a.group ? `, or ${rupees(a.group.price)} for a group of ${a.group.size}` : ""}.` : "Free to sit."}`,
    path: "/aidmt/",
  });
}

/* "Asked, answered." puts the last word in the brand blue. */
function lastWordHighlighted(text: string) {
  const at = text.trim().lastIndexOf(" ");
  if (at < 0) return <span className="hb">{text}</span>;
  return <>{text.slice(0, at + 1)}<span className="hb">{text.slice(at + 1)}</span></>;
}

/* The hero's line. The LMS has no admin field for it any more, so the page
   says it here rather than waiting on an LMS release for a copy change. */
const HERO_LINE = "Sit a mock that feels like the real exam, from home, and see where you stand across India.";

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;

export const revalidate = 60;

export default async function AidmtPage() {
  const [a, posts, mentors] = await Promise.all([getAidmt(), getPosts(100), getMentors()]);
  /* Three mentors' faces on "Still unsure?": a person answers, not a form. */
  const faces = mentors.filter((m) => m.photo).slice(0, 3);
  /* Blog guides show once their post is published, so the page never sends anyone to a missing page. */
  const live = posts.map((post) => `/blog/${post.slug}/`);
  const guideUrl = a.hero.guideUrl && (!a.hero.guideUrl.startsWith("/blog/") || live.includes(a.hero.guideUrl)) ? a.hero.guideUrl : null;
  const { pricing } = a;
  const off = pricing.wasPrice && pricing.wasPrice > pricing.perSitting ? Math.round(100 - (pricing.perSitting * 100) / pricing.wasPrice) : null;
  const paid = a.series.filter((s) => !s.free);
  const allFree = paid.length === 0 || pricing.perSitting <= 0;
  const register = allFree ? "Register free" : `Register for ${rupees(pricing.perSitting)}`;
  const closed = a.registrationEnds ? new Date(a.registrationEnds) < new Date() : false;
  /* Every Register opens the buy dialog (AidmtBuy); the link is the fallback before it loads. */
  const registerLink = (cls: string) => (closed ? null : <a className={cls} href={a.enrolUrl} data-aidmt-buy="">{register} <Arrow /></a>);
  const parts = a.pattern.parts;
  const partsMarks = parts.reduce((sum, part) => sum + part.marks, 0);
  const steps = a.steps.items;
  return (
    <div className="am">
      <SampleProvider>
        {/* The site's split hero, as on the home page, sized to the first
            screen: on the blue arc the copy and Register on the left, and on
            the right the exam toggle over the scorecard, tilted back, for the
            exam picked. Stacked on a phone, the scorecard after Register. */}
        <section className="hero phero hero--split am-hero" id="top" data-dot="Top" aria-labelledby="hero-h">
          <div className="stage">
            <div className="arc">
              <div className="wrap hero-grid">
                <div className="hero-copy">
                  {a.hero.pills.length ? (
                    <p className="pills">{a.hero.pills.map((pill, n) => n === a.hero.pills.length - 1 && n > 0
                      ? <span key={pill} className="pill pill--dark"><span className="dot" aria-hidden="true"></span>{pill}</span>
                      : <span key={pill} className="pill">{pill}</span>)}</p>
                  ) : null}
                  <h1 className="h1" id="hero-h">{a.hero.title} {a.hero.highlight ? <span className="hl">{a.hero.highlight}<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span> : null}</h1>
                  <p className="hero-sub">{HERO_LINE}</p>
                  <div className="hero-ctas">
                    {registerLink("btn")}
                    <a className="btn btn--ghost" href="#dates">See the schedule</a>
                  </div>
                  {closed ? null : <AidmtRegLine builtAt={Date.now()} series={a.series} off={off} />}
                </div>
                <div className="hero-media">
                  <ExamToggle />
                  <HeroDashboard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {parts.length ? (
          <section className="section tint am-paper" id="pattern" data-dot="Paper" aria-labelledby="pat-h">
            <div className="wrap">
              <div className="am-head">
                <h2 className="h2" id="pat-h">{a.pattern.heading}</h2>
                {a.pattern.intro ? <p className="am-head-p">{a.pattern.intro}</p> : null}
              </div>
              {/* The exam screen itself, a working copy of the app's, right after the hero. */}
              <AidmtExamScreen />
              {/* The paper drawn to scale: each part as wide as its share of the marks. */}
              <div className="am-sheet" style={{ "--cols": parts.map((part) => `minmax(0,${part.marks}fr)`).join(" ") } as CSSProperties}>
                {parts.map((part, n) => (
                  <div key={part.name} className={`am-part${n % 2 ? " y" : ""}`}>
                    <p className="am-part-bar"><b>{part.marks}</b><span>marks{partsMarks ? ` · ${Math.round((part.marks * 100) / partsMarks)}%` : ""}</span></p>
                    <h3>{part.name}{part.note ? <small>{part.note}</small> : null}</h3>
                    <ul className="am-topics">{part.topics.map((topic) => <li key={topic.name} title={topic.detail || undefined}>{topic.name}</li>)}</ul>
                    {part.footnote ? <p className="am-note">{part.footnote}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div id="scorecard" data-dot="Scorecard">
          <section className="ft-intro" aria-labelledby="sc-h">
            <div className="wrap">
              <h2 className="h2" id="sc-h">{a.why.heading || "Know where you stand before exam day."}</h2>
              <p className="lede">Every mock ends with this scorecard. Shown here for a made-up student.</p>
            </div>
          </section>

          {/* Three chapters, one card pinned while its steps scroll past (a stack of cards on a phone). */}
          <ScorecardTour />

          <section className="ft-end" aria-labelledby="ft-end-h">
            <div className="wrap">
              <div className="ft-end-in">
                <h2 className="h2" id="ft-end-h">{closed ? "Registration is closed. Watch this space for the next AIDMT." : "Your scorecard is one mock away."}</h2>
                {registerLink("btn btn--dark")}
              </div>
            </div>
          </section>
        </div>
        <SampleDock target="scorecard" />
      </SampleProvider>

      <section className="section tint am-dates" id="dates" data-dot="Dates" aria-labelledby="dates-h">
        <div className="wrap">
          <div className="am-head">
            <h2 className="h2" id="dates-h">{a.dates.heading}</h2>
            {a.dates.note ? <p className="am-head-p">{a.dates.note}</p> : null}
          </div>
          <AidmtSchedule builtAt={Date.now()} series={a.series} price={pricing.perSitting} live={live} enrolUrl={a.enrolUrl} />
        </div>
      </section>


      {steps.length ? (
        <section className="section am-how" id="how" data-dot="How it works" aria-labelledby="how-h">
          <div className="wrap am-how-in">
            <div>
              <h2 className="h2" id="how-h">{a.steps.heading}</h2>
              <ol className="am-steps">
                {steps.map((item, n) => <li key={item.title}><span className="am-step-n" aria-hidden="true">{n + 1}</span>{item.title}</li>)}
              </ol>
            </div>
            {/* The AIDMT video: a poster until tapped, so the video loads only for those who play it. */}
            <ReelFacade src="/assets/video/aidmt.mp4" poster="/assets/video/aidmt.webp" title="AIDMT 2027 explained" caption="Watch: AIDMT explained" />
          </div>
        </section>
      ) : null}

      {/* The toppers who made the paper, then past students on our mocks in
          their own words. One section, so the tinted bands still alternate. */}
      <section className="section tint" id="by" data-dot="Made by" aria-labelledby="by-h">
        <div className="wrap">
          <div className="am-head am-head--row">
            <h2 className="h2" id="by-h">{a.madeBy.toppers.length ? a.madeBy.heading : "Toppers on our mocks."}</h2>
            <a className="btn btn--ghost" href="/results/">See every result</a>
          </div>
          {a.madeBy.toppers.length ? (
            <ul className="toppers">
              {a.madeBy.toppers.map((t) => (
                <li key={`${t.name}-${t.rank}`} className="tcard">{t.photo ? <img src={t.photo} alt={t.name} width="480" height="480" loading="lazy" /> : null}{t.exam ? <span className="tk">{t.exam}</span> : null}<b>{t.rank}</b><span className="tn">{t.name}</span></li>
              ))}
            </ul>
          ) : null}
          <div className={a.madeBy.toppers.length ? "am-stories" : undefined}>
            {a.madeBy.toppers.length ? <h3 className="am-stories-h">Toppers on our mocks</h3> : null}
            <VideoStories stories={STORIES.filter((s) => s.mocks)} reveal={false} />
          </div>
        </div>
      </section>

      {a.faqs.items.length ? (
        <section className="section" id="faqs" data-dot="FAQs" aria-labelledby="faq-h">
          <div className="wrap faq-grid">
            <div className="faq-side"><div className="stick">
              <h2 className="h2" id="faq-h">{lastWordHighlighted(a.faqs.heading)}</h2>
              <div className="am-ask">
                {faces.length ? <p className="am-ask-faces" aria-hidden="true">{faces.map((m) => <img key={m.id} src={m.photo} alt="" width="44" height="44" loading="lazy" />)}</p> : null}
                <p className="am-ask-h">Still unsure?</p>
                <p className="am-ask-p">Tell us which exam you’re preparing for, and we’ll help you pick the right mock.</p>
                <div className="am-ask-acts">
                  <a className="btn btn--sm am-ask-wa" href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, I have a question about AIDMT.")}`} target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-chat" /></svg>WhatsApp us</a>
                  <a className="btn btn--sm btn--ghost" href={`tel:${CONTACT.phone}`}><svg width="18" height="18" aria-hidden="true"><use href="#i-phone" /></svg>Call</a>
                </div>
                {guideUrl ? <a className="am-ask-guide" href={guideUrl}><span>{a.hero.guideLabel || "Read the full guide"}</span><Arrow /></a> : null}
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

      {/* Every Register above opens this: pick mocks, a mobile number, pay. No sign-in. */}
      <AidmtBuy series={a.series} offers={a.offers ?? []} perSitting={pricing.perSitting} enrolUrl={a.enrolUrl} />

      <section className="enrol-wrap" id="start" data-dot="Register" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">{closed ? "Registration is closed. Watch this space for the next AIDMT." : a.cta.heading}</h2>
              {a.cta.lede && !closed ? <p className="lede">{a.cta.lede}</p> : null}
              <div className="acts">
                {registerLink("btn btn--dark")}
                <a className="btn btn--light" href="/#plans">See the 75-day course</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
