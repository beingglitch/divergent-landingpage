import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { getMentors } from "@/lib/mentors";
import { getAidmt } from "@/lib/aidmt";
import { STORIES } from "@/lib/testimonials";
import { samplesFor } from "@/lib/masterclass-sample";
import { PREDICTOR_SAMPLE } from "@/lib/predictor";
import { EXAM_CARDS, STATS, TOPPERS, homeTools, loadHome } from "@/lib/home-content";
import { AidmtHeroLink } from "@/components/Aidmt";
import { HomeCarousel } from "@/components/HomeCarousel";
import { HomeAnnouncement } from "@/components/HomeAnnouncement";
import { HomeTools } from "@/components/HomeTools";
import { FeatureCard, SampleProvider } from "@/components/AidmtScorecard";
import { MockSwitch } from "@/components/MasterclassPromo";
import { VideoStories } from "@/components/VideoStories";
import { MentorCards } from "@/components/MentorCards";
import { LeadForm } from "@/components/LeadForm";

/* The home page: who we are, in pictures more than words. The pill above
   the headline and the carousel of new programs (components/HomeCarousel),
   both set in the app under Highlights, Home page; the proof (ranks,
   numbers, faces, video stories), the three exams, the free tools
   (components/HomeTools), a sample mock scorecard, the mentors, and a free
   call. The words and pictures are in lib/home-content. The 75-day course
   that used to be here is at /75-days/ (lib/config COURSE_PATH). */
export const metadata: Metadata = pageMeta({
  title: "Divergent Classes | UCEED, NID and NIFT coaching",
  description: "Coaching for UCEED, NID and NIFT by mentors from IIT, NID and NIFT. Live classes, AIDMT mocks with an All India Rank, and free daily practice.",
  path: "/",
});

export const revalidate = 60;

const MOCK_CARDS = ["rank", "progress", "skills", "parts"] as const;
const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;
const Underline = () => <svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg>;
const Dots = () => (
  <svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{ "--k": "0" } as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{ "--k": "1" } as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{ "--k": "2" } as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>
);
const FACES = ["ankit", "priyanka", "rudra", "ameya"];

export default async function HomePage() {
  const builtAt = Date.now();
  const [mentors, aidmt, home] = await Promise.all([getMentors(), getAidmt(), loadHome()]);
  const { announcement, slides } = home;
  const tools = homeTools({ predictorReady: !PREDICTOR_SAMPLE });
  return (
    <>
      <section className="hero hero--split hm-hero" id="top" data-dot="Home" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className={"wrap hero-grid" + (slides.length ? "" : " hm-solo")}>
              <div className="hero-copy">
                {/* The pill: the app's own announcement, or the next AIDMT mock, or nothing (Highlights, Home page). */}
                {announcement?.kind === "custom" ? (
                  <HomeAnnouncement badge={announcement.badge} text={announcement.text} href={announcement.href} />
                ) : announcement?.kind === "auto" ? (
                  <AidmtHeroLink builtAt={builtAt} series={aidmt.series} price={aidmt.pricing.perSitting} />
                ) : null}
                <h1 className="h1" id="hero-h"><span className="num">From sketchbook</span> to <span className="hl">design school.<Underline /></span></h1>
                <p className="hero-sub">Coaching for UCEED, NID and NIFT, by mentors who cleared them.</p>
                <p className="am-proof hm-proof">
                  <span className="am-proof-faces" aria-hidden="true">{FACES.map((f) => <img key={f} src={`/assets/img/toppers/${f}.webp`} alt="" width="36" height="36" />)}</span>
                  <span>UCEED AIR 2, 4, 8 and 10 were our students</span>
                </p>
                <div className="hero-ctas">
                  <a className="btn btn--dark" href="#exams">Find your course <Arrow /></a>
                  <a className="btn btn--ghost" href="#tools">Free tools</a>
                </div>
              </div>
              {slides.length ? (
                <div className="hero-media">
                  <HomeCarousel slides={slides} />
                </div>
              ) : null}
            </div>
          </div>
          <div className="wrap hero-low hm-low">
            <ul className="hm-stats rv">
              {STATS.map((s, i) => (
                <li key={s.label} style={{ "--i": String(i) } as CSSProperties}>
                  <b><span data-count={s.n}>{s.n.toLocaleString("en-IN")}</span><em>+</em></b>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hm-wall" id="ranks" data-dot="Ranks" aria-labelledby="wall-h">
        <div className="wrap hm-wall-head">
          <div>
            <p className="eyebrow-l"><Dots />Results</p>
            <h2 className="h2 rv" id="wall-h">Ranks, not promises.</h2>
          </div>
          <a className="btn btn--ghost" href="/results/">Every result <Arrow /></a>
        </div>
        <div className="hm-marquee">
          <ul className="hm-track">
            {[...TOPPERS, ...TOPPERS].map((t, i) => (
              <li key={i} className="hm-tp" aria-hidden={i >= TOPPERS.length || undefined}>
                <img src={t.src} alt={i < TOPPERS.length ? `${t.name}, ${t.exam} ${t.rank}` : ""} width="200" height="250" loading="lazy" />
                <span className="hm-tp-b"><em>{t.exam}</em><b>{t.rank}</b><span>{t.name}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section hm-exams" id="exams" data-dot="Exams" aria-labelledby="ex-h">
        <div className="wrap">
          <div className="head hm-head">
            <p className="eyebrow-l"><Dots />Courses</p>
            <h2 className="h2 rv" id="ex-h">Pick your exam.</h2>
          </div>
          <ul className="hm-exam-grid">
            {EXAM_CARDS.map((e, i) => (
              <li key={e.key} className="rv" style={{ "--i": String(i) } as CSSProperties}>
                <a className={`hm-exam hm-exam--${e.key}`} href={e.href}>
                  <img src={e.img} alt={e.campus} width={e.w} height={e.h} loading="lazy" />
                  <span className="hm-exam-b">
                    <em>{e.when}</em>
                    <b>{e.name}</b>
                    <span>{e.line}</span>
                  </span>
                  <span className="hm-exam-go" aria-hidden="true"><Arrow /></span>
                </a>
              </li>
            ))}
          </ul>
          <p className="hm-exam-more">Or see <a href="/courses/">every course</a>.</p>
        </div>
      </section>

      <section className="section tint hm-tools" id="tools" data-dot="Free tools" aria-labelledby="tools-h">
        <div className="wrap">
          <div className="head hm-head">
            <p className="eyebrow-l"><Dots />Free for everyone</p>
            <h2 className="h2 rv" id="tools-h">Practise free, every day.</h2>
          </div>
          <HomeTools tools={tools} builtAt={builtAt} />
        </div>
      </section>

      <SampleProvider samples={samplesFor("UCEED")}>
        <section className="sct-ch sct-ch--dark mk hm-mk" id="mocks" data-dot="Mocks" aria-labelledby="mocks-h">
          <div className="sct-ch-in">
            <div className="wrap">
              <div className="mk-head">
                <div>
                  <p className="mc-badge mc-badge--y">AIDMT · All India mocks</p>
                  <h2 className="h2" id="mocks-h">Every mock ends in a scorecard.</h2>
                  <p className="lede">Your rank, your weak spots, your climb. Here is a made-up UCEED student across three mocks.</p>
                </div>
                <MockSwitch />
              </div>
              <ol className="mk-grid">
                {MOCK_CARDS.map((id) => <li key={id} className={`mk-${id}`}><FeatureCard id={id} /></li>)}
              </ol>
              <p className="hm-mk-go"><a className="btn" href="/aidmt/">See the AIDMT mocks <Arrow /></a></p>
            </div>
          </div>
        </section>
      </SampleProvider>

      <section className="section hm-stories" id="stories" data-dot="Stories" aria-labelledby="st-h">
        <div className="wrap">
          <div className="head hm-head">
            <p className="eyebrow-l"><Dots />In their words</p>
            <h2 className="h2 rv" id="st-h">Hear it from them.</h2>
          </div>
          <VideoStories stories={STORIES.slice(0, 4)} />
          <p className="hm-more"><a className="btn btn--ghost" href="/results/">More stories and results <Arrow /></a></p>
        </div>
      </section>

      <section className="men-wrap section" id="mentors" data-dot="Mentors" aria-labelledby="men-h" style={{ paddingBlock: "0" }}>
        <div className="stage-m on-dark">
          <div className="wrap">
            <div className="men-head">
              <div>
                <p className="eyebrow-l"><Dots />Mentors</p>
                <h2 className="h2 rv" id="men-h">Taught by people who cleared it.</h2>
              </div>
              <a className="btn btn--ghost" href="/about/#mentors">Meet all mentors</a>
            </div>
            {/* People > Website mentors in the LMS: the first six. */}
            <MentorCards mentors={mentors.slice(0, 6)} reveal />
          </div>
        </div>
      </section>

      <section className="enrol-wrap book-wrap" id="book" data-dot="Free call" aria-labelledby="enrol-h">
        <div className="stage-e stage-book">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Free call</span></p>
              <h2 className="h2" id="enrol-h">Not sure where to start?</h2>
              <p className="lede">Leave your number. A mentor calls you back. Free, 10 minutes.</p>
            </div>
          </div>
          <div className="book-shell">
            <LeadForm source="home" withPlan={false} />
          </div>
        </div>
      </section>
    </>
  );
}
