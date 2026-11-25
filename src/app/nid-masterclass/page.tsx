import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { CONTACT, ist } from "@/lib/config";
import { MASTERCLASS as M, MASTERCLASS_APP_URL, askToJoin, getMasterclassPrices, rupees, shortDate, whatsappHref, type MasterclassMode, type ModeKey } from "@/lib/masterclass";
import { MASTERCLASS_SAMPLES } from "@/lib/masterclass-sample";
import { getAidmt } from "@/lib/aidmt";
import { getMentorData, toneOf } from "@/lib/mentors";
import { STORIES } from "@/lib/testimonials";
import { MentorCards } from "@/components/MentorCards";
import { VideoStories } from "@/components/VideoStories";
import { AidmtChallenge, AidmtFaqMore } from "@/components/AidmtPromo";
import { FeatureCard, SampleProvider } from "@/components/AidmtScorecard";
import { MasterclassLive } from "@/components/MasterclassLive";
import { MasterclassQuiz } from "@/components/MasterclassQuiz";
import { MasterclassReview } from "@/components/MasterclassReview";
import { MasterclassBuy } from "@/components/MasterclassBuy";
import { ExamCountdown, MasterclassBar, MockSwitch } from "@/components/MasterclassPromo";

/* The 21 Days NID Masterclass 2027, built like /aidmt/: the page shows the
   program instead of describing it. After the hero (the 21 days as a sheet
   of squares, and the time left to Prelims), a working copy of the app's
   live-class screen plays a sample class (MasterclassLive); the readiness
   check finds the visitor's gaps (MasterclassQuiz); the topics sit on real
   sheets from our batches; a sheet gets a mentor's review
   (MasterclassReview); the 21 days are mapped; a made-up student's AIDMT
   scorecard climbs over the three mocks (AidmtScorecard cards); and one
   AIDMT question runs against a 60 second clock.

   Every Enrol opens the buy dialog (MasterclassBuy): one tap, a mobile
   number, Razorpay, no sign-in. Prices are the app's. Until the course's
   plans are published in the app, Enrol opens WhatsApp instead. Words,
   dates and plan slugs are in lib/masterclass.ts. */
export const metadata: Metadata = pageMeta({
  title: "21 Days NID Masterclass 2027: final-stretch NID prep | Divergent Classes",
  description: "A 21-day, mentor-led NID 2027 program: 13–14 masterclasses with mentors from NID and IIT, live or recorded, with live feedback and 3 AIDMT full-length NID mocks.",
  path: "/nid-masterclass/",
});

export const revalidate = 60;

const FAQS_SHOWN = 5;
/* The AIDMT questions that suit an NID paper: visual, observation, design awareness. */
const NID_QUESTIONS = ["cube-two-faces", "square-diagonals", "paper-fold-holes", "prism-edges", "light-primaries", "chandigarh-plan"];
/* Mock cards for the sample student, in this order. */
const MOCK_CARDS = ["rank", "progress", "skills", "parts"] as const;

const Arrow = () => <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg>;
const Tick = () => <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#tick" /></svg></span>;

/* "NID AIR 52 and UCEED AIR 2, 4 and 8": NID first on this page. */
function proofLine(toppers: { exam: string; rank: string }[]): string {
  const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0] ?? "");
  const byExam = (exam: string) => toppers.filter((t) => t.exam === exam).map((t) => t.rank.replace(/^AIR\s*/i, ""));
  const nid = byExam("NID"), uceed = byExam("UCEED").slice(0, 3);
  return [nid.length ? `NID AIR ${list(nid)}` : "", uceed.length ? `UCEED AIR ${list(uceed)}` : ""].filter(Boolean).join(" and ");
}

/* Small drawings for the topics with no student sheet. */
function TopicArt({ kind }: { kind: string }) {
  if (kind === "colour") {
    return (
      <svg className="tb-art" viewBox="0 0 200 140" aria-hidden="true">
        {["#FFC500", "#F59E0B", "#E5484D", "#A855F7", "#209BD2", "#16A34A"].map((c, i) => {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2, b = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
          return <path key={c} d={`M100,70 L${100 + Math.cos(a) * 52},${70 + Math.sin(a) * 52} A52,52 0 0,1 ${100 + Math.cos(b) * 52},${70 + Math.sin(b) * 52} Z`} fill={c} />;
        })}
        <circle cx="100" cy="70" r="20" className="tb-hole" />
      </svg>
    );
  }
  if (kind === "solve") {
    return (
      <svg className="tb-art" viewBox="0 0 200 140" aria-hidden="true">
        <path className="tb-path" d="M28,112 C60,112 52,40 92,40 S128,100 160,64 S176,30 176,30" />
        <circle cx="28" cy="112" r="8" className="tb-a" />
        <path d="M168 22h16v16h-16z" className="tb-b" />
        <text x="22" y="134" className="tb-lab">brief</text>
        <text x="150" y="16" className="tb-lab">idea</text>
      </svg>
    );
  }
  return (
    <svg className="tb-art tb-art--exam" viewBox="0 0 240 140" aria-hidden="true">
      <circle cx="70" cy="76" r="44" className="tb-watch" />
      <path d="M70 76V48M70 76l18 12" className="tb-hand" />
      <path d="M62 24h16M70 24v8" className="tb-hand" />
      <g className="tb-mocks">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${136 + i * 30} ${46 + i * 6})`}><rect width="44" height="56" rx="6" /><path d="M9 16h26M9 26h26M9 36h16" /></g>)}</g>
    </svg>
  );
}

/* A tiny live screen and a tiny player, for the program cards. */
function ModeArt({ mode, face }: { mode: ModeKey; face: string | null }) {
  return (
    <div className={`pg-art pg-art--${mode}`} aria-hidden="true">
      <svg className="pg-board" viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice">
        <path d="M0 34H200" className="hl" />
        <circle cx="12" cy="34" r="3" className="vp" /><circle cx="188" cy="34" r="3" className="vp" />
        <path d="M86 58 12 34M86 58 188 34M86 92 12 34M86 92 188 34" className="g" />
        <path d="M86 58V92M86 58 63 51M63 51V73M86 92 63 73M86 58 128 48M128 48V73M86 92 128 73M63 51 101 44M128 48 101 44" className="k" />
        <path d="M70 52 112 46M74 55 116 49" className="k s" />
      </svg>
      {mode === "live" ? (
        <>
          <span className="pg-live"><span className="lc-dot"></span>LIVE</span>
          {face ? <img className="pg-face" src={face} alt="" width="64" height="64" loading="lazy" /> : null}
          <span className="pg-bub b1">Do the slots go to VP2?</span>
          <span className="pg-bub b2 m">Yes, the long side.</span>
        </>
      ) : (
        <>
          <span className="pg-play"><svg width="18" height="18"><use href="#play" /></svg></span>
          <span className="pg-track"><b></b><i style={{ left: "22%" }}></i><i style={{ left: "46%" }}></i><i style={{ left: "70%" }}></i></span>
          <span className="pg-speed">1.5×</span>
        </>
      )}
    </div>
  );
}

export default async function NidMasterclassPage() {
  const [{ mentors, categories }, prices, aidmt] = await Promise.all([getMentorData(), getMasterclassPrices(), getAidmt()]);
  const builtAt = Date.now();
  const nidMentors = mentors.filter((m) => m.categories.includes("nid"));
  const faces = nidMentors.filter((m) => m.photo).slice(0, 3);
  const lead = nidMentors.find((m) => m.photo) ?? null;
  const closed = M.enrolEnds ? ist(M.enrolEnds) < new Date() : false;
  /* The dialog sells once the app has a price for a program. */
  const buy = !closed && M.modes.some((m) => prices[m.key]);
  const priced = M.modes.map((m) => prices[m.key]).filter((p): p is NonNullable<typeof p> => !!p);
  const from = priced.length ? priced.reduce((a, b) => (b.price < a.price ? b : a)) : null;
  const fromLabel = from ? `${priced.length > 1 ? "From " : ""}${rupees(from.price)}` : null;
  const ask = whatsappHref("Hi, I have a question about the 21 Days NID Masterclass 2027.");
  const toppers = [...aidmt.madeBy.toppers].sort((a, b) => Number(b.exam === "NID") - Number(a.exam === "NID"));
  const proof = proofLine(aidmt.madeBy.toppers);
  const proofFaces = toppers.filter((t) => t.photo).slice(0, 3);

  /* Every Enrol: the buy dialog for its program when selling, else WhatsApp. */
  const enrol = (mode: MasterclassMode | null) => (buy
    ? { href: MASTERCLASS_APP_URL, "data-mc-buy": mode?.key ?? "" }
    : { href: mode ? askToJoin(mode) : ask, target: "_blank", rel: "noopener" });
  const modeOf = (key: ModeKey) => M.modes.find((m) => m.key === key)!;
  let mockNo = 0;

  return (
    <div className="am mc">
      <section className="hero phero hero--split am-hero mc-hero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <p className="pills">
                  {M.hero.pills.map((pill, n) => n === M.hero.pills.length - 1
                    ? <span key={pill} className="pill pill--dark"><span className="dot" aria-hidden="true"></span>{pill}</span>
                    : <span key={pill} className="pill">{pill}</span>)}
                </p>
                <h1 className="h1" id="hero-h">{M.hero.title} <span className="hl">{M.hero.highlight}<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
                <p className="hero-sub">{M.hero.sub}</p>
                <div className="hero-ctas" id="hero-enrol">
                  {closed ? <span className="btn btn--dark" aria-disabled="true">Enrolment closed</span> : <a className="btn btn--dark" {...enrol(null)}>{buy ? "Enrol now" : "Enrol on WhatsApp"} <Arrow /></a>}
                  <a className="btn btn--ghost" href="#class">See a class</a>
                </div>
                <div className="mc-meta">
                  {fromLabel ? <p className="mc-price-h"><b>{fromLabel}</b>{from && from.listPrice > from.price ? <s>{rupees(from.listPrice)}</s> : null}{from?.offer ? <span>{from.offer}</span> : null}</p> : null}
                  {M.startsOn ? <p className="mc-starts">Starts {shortDate(M.startsOn)}</p> : null}
                  <ExamCountdown builtAt={builtAt} day={M.examDay} exam={M.examName} />
                </div>
                {proof ? (
                  <p className="am-proof">
                    <span className="am-proof-faces" aria-hidden="true">{proofFaces.map((t) => <img key={t.name} src={t.photo} alt="" width="36" height="36" />)}</span>
                    <span>From the team behind {proof}</span>
                  </p>
                ) : null}
              </div>
              <div className="hero-media">
                <div className="mc-sheet" role="img" aria-label="21 days of masterclasses leading to the NID exam">
                  <p className="mc-sheet-k">Your final 21 days</p>
                  <ol className="mc-days" aria-hidden="true">
                    {Array.from({ length: 21 }, (_, i) => <li key={i} style={{ "--d": String(i) } as CSSProperties}>{i + 1}</li>)}
                  </ol>
                  <p className="mc-exam" aria-hidden="true"><span>NID DAT</span><Arrow /></p>
                  <dl className="mc-facts">
                    {M.facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.n}</dd></div>)}
                  </dl>
                  <p className="mc-from"><span>Mentors from</span>{M.mentors.from.map((s) => <b key={s}>{s}</b>)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section mc-class" id="class" data-dot="A class" aria-labelledby="class-h">
        <div className="wrap">
          <div className="am-head am-head--c">
            <h2 className="h2" id="class-h">Step inside a masterclass.</h2>
            <p className="am-head-p">This is the class screen in the app, playing a sample class. Switch to Recording to see how replays work.</p>
          </div>
          <MasterclassLive mentor={lead ? { name: lead.name, line: lead.line, photo: lead.photo } : null} enrolHref={buy ? "#modes" : ask} />
        </div>
      </section>

      <section className="section tint mc-check" id="check" data-dot="Readiness" aria-labelledby="check-h">
        <div className="wrap">
          <div className="am-head am-head--c">
            <h2 className="h2" id="check-h">How ready are you for NID 2027?</h2>
            <p className="am-head-p">Eight quick questions. Get your readiness score and the masterclasses to start with.</p>
          </div>
          <MasterclassQuiz enrolHref="#modes" whatsapp={CONTACT.whatsapp} />
        </div>
      </section>

      <section className="section" id="topics" data-dot="What you learn" aria-labelledby="topics-h">
        <div className="wrap">
          <div className="am-head am-head--row">
            <div>
              <h2 className="h2" id="topics-h">What you’ll master in 21 days.</h2>
              <p className="am-head-p">One masterclass per area the NID paper tests. The sheets are real work from our batches.</p>
            </div>
            <a className="btn btn--ghost" href="/results/#work">See more sheets</a>
          </div>
          <ul className="tb">
            {M.topics.map((t, i) => (
              <li key={t.name} className={`tb-c tb-${t.size || "sq"}${t.img ? " has-img" : ""}`}>
                {t.img ? <img src={t.img} alt={`A student sheet for ${t.name.toLowerCase()}`} width={t.w} height={t.h} loading="lazy" /> : <TopicArt kind={t.size} />}
                {t.img ? <span className="tb-tag">From our batch</span> : null}
                <div className="tb-t">
                  <span className="tb-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t.name}</h3>
                  <p>{t.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="men-wrap section" id="mentors" data-dot="Mentors" aria-labelledby="men-h" style={{ paddingBlock: "0" }}>
        <div className="stage-m on-dark">
          <div className="wrap">
            <div className="men-head">
              <div>
                <h2 className="h2" id="men-h">{M.mentors.heading}</h2>
                <p className="lede">{M.mentors.lede}</p>
                <ul className="mc-inst">{M.mentors.from.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
            <MentorCards mentors={nidMentors} tone={toneOf(categories, "nid")} stagger />
          </div>
        </div>
      </section>

      <section className="section" id="review" data-dot="Feedback" aria-labelledby="review-h">
        <div className="wrap">
          <div className="am-head">
            <h2 className="h2" id="review-h">Every sheet gets a mentor’s eye.</h2>
            <p className="am-head-p">In live review rounds your mentor marks what works, what to fix and how. Tap a note to find it on the sheet.</p>
          </div>
          <MasterclassReview img={M.review.img} w={M.review.w} h={M.review.h} notes={M.review.notes} mark={M.review.mark} after={M.review.after} />
        </div>
      </section>

      <section className="section tint" id="plan" data-dot="21 days" aria-labelledby="plan-h">
        <div className="wrap">
          <div className="am-head">
            <h2 className="h2" id="plan-h">Your 21 days, mapped.</h2>
            <p className="am-head-p">Masterclasses most days, a review round each week, and an AIDMT mock to end each week.</p>
          </div>
          <ol className="jr">
            {M.journey.weeks.map((w, wi) => (
              <li key={w.title} className="jr-w">
                <p className="jr-k">Week {wi + 1}</p>
                <h3>{w.title}</h3>
                <ul className="jr-topics">{w.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                <ol className="jr-days">
                  {w.days.map((d, di) => {
                    const day = wi * 7 + di + 1;
                    const label = d === "mc" ? "Class" : d === "mock" ? `AIDMT ${++mockNo}` : "Review";
                    return <li key={day} className={`jr-d ${d}`}><b>{day}</b><small>{label}</small></li>;
                  })}
                </ol>
              </li>
            ))}
          </ol>
          <p className="jr-foot">
            <span className="jr-key mc">Masterclass</span><span className="jr-key review">Review and feedback</span><span className="jr-key mock">AIDMT mock</span>
            <small>{M.journey.note}</small>
          </p>
        </div>
      </section>

      <SampleProvider samples={MASTERCLASS_SAMPLES}>
        <section className="sct-ch sct-ch--dark mk" id="mocks" data-dot="Mocks" aria-labelledby="mocks-h">
          <div className="sct-ch-in">
            <div className="wrap">
              <div className="mk-head">
                <div>
                  <p className="mc-badge mc-badge--y">3 AIDMT mocks included</p>
                  <h2 className="h2" id="mocks-h">Watch your rank climb, mock by mock.</h2>
                  <p className="lede">After every AIDMT you get a full scorecard. Here is a sample NID student across all three. Made up, to show what yours looks like.</p>
                </div>
                <MockSwitch />
              </div>
              <ol className="mk-grid">
                {MOCK_CARDS.map((id) => <li key={id} className={`mk-${id}`}><FeatureCard id={id} /></li>)}
              </ol>
            </div>
          </div>
        </section>
      </SampleProvider>

      <section className="ft-end mk-end" aria-labelledby="mk-end-h">
        <div className="wrap">
          <div className="ft-end-in">
            <h2 className="h2" id="mk-end-h">Your first AIDMT is at the end of week 1.</h2>
            {closed ? null : <a className="btn btn--dark" {...enrol(null)}>{buy ? "Enrol now" : "Enrol on WhatsApp"} <Arrow /></a>}
          </div>
        </div>
      </section>

      {closed ? null : (
        <section className="section tint am-try" id="try" data-dot="Try one" aria-labelledby="try-h">
          <div className="wrap">
            <h2 className="h2" id="try-h">An AIDMT question. You have 60 seconds.</h2>
            <AidmtChallenge enrolUrl={buy ? MASTERCLASS_APP_URL : ask} register={buy ? "Get all 3 mocks" : "Ask about the mocks"} only={NID_QUESTIONS} buy={buy ? { "data-mc-buy": "" } : {}} />
          </div>
        </section>
      )}

      <section className="section" id="results" data-dot="Results" aria-labelledby="by-h">
        <div className="wrap">
          <div className="am-head am-head--row">
            <h2 className="h2" id="by-h">The team behind the toppers.</h2>
            <a className="btn btn--ghost" href="/results/">See every result</a>
          </div>
          {toppers.length ? (
            <ul className="toppers">
              {toppers.map((t) => (
                <li key={`${t.name}-${t.rank}`} className="tcard">{t.photo ? <img src={t.photo} alt={t.name} width="480" height="480" loading="lazy" /> : null}{t.exam ? <span className="tk">{t.exam}</span> : null}<b>{t.rank}</b><span className="tn">{t.name}</span></li>
              ))}
            </ul>
          ) : null}
          <div className="am-stories">
            <h3 className="am-stories-h">Students on our mocks and mentors</h3>
            <VideoStories stories={STORIES.filter((s) => s.mocks)} reveal={false} />
          </div>
        </div>
      </section>

      <section className="section tint" id="modes" data-dot="Programs" aria-labelledby="modes-h">
        <div className="wrap">
          <div className="am-head am-head--c">
            <h2 className="h2" id="modes-h">Pick your program.</h2>
            <p className="am-head-p">The same masterclasses and mocks in both. The difference is how you’re taught.</p>
          </div>
          <ul className="pg">
            {M.modes.map((mode, n) => {
              const p = prices[mode.key];
              return (
                <li key={mode.key} className={`pg-c${n ? "" : " pg-c--feat"}`}>
                  {n ? null : <span className="pg-flag">Most interactive</span>}
                  <ModeArt mode={mode.key} face={lead?.photo ?? null} />
                  <div className="pg-b">
                    <h3>{mode.name}</h3>
                    <p className="pg-line">{mode.line}</p>
                    <ul className="mc-list">{mode.points.map((pt) => <li key={pt}><Tick />{pt}</li>)}</ul>
                    <div className="pg-f">
                      {p ? <p className="mc-price"><b>{rupees(p.price)}</b>{p.listPrice > p.price ? <s>{rupees(p.listPrice)}</s> : null}{p.offer ? <span>{p.offer}</span> : null}</p> : null}
                      {closed ? <span className="btn btn--dark" aria-disabled="true">Enrolment closed</span> : (
                        <a className={n ? "btn btn--dark" : "btn"} {...enrol(mode)}>{buy && p ? `Enrol in ${mode.short}` : `Ask to join ${mode.short}`} <Arrow /></a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="pg-both"><span>Both include</span>{M.both.map((b) => <b key={b}>{b}</b>)}</p>
          <p className="pg-full"><a className="mc-link" href="/#plans">Want a full course instead? See the 75-day plans <Arrow /></a></p>
        </div>
      </section>

      <section className="section" id="faqs" data-dot="FAQs" aria-labelledby="faq-h">
        <div className="wrap faq-grid">
          <div className="faq-side"><div className="stick">
            <h2 className="h2" id="faq-h">Asked, <span className="hb">answered.</span></h2>
            <div className="am-ask">
              {faces.length ? <p className="am-ask-faces" aria-hidden="true">{faces.map((m) => <img key={m.id} src={m.photo} alt="" width="44" height="44" loading="lazy" />)}</p> : null}
              <p className="am-ask-h">Still unsure? Ask a mentor.</p>
              <div className="am-ask-acts">
                <a className="btn btn--sm am-ask-wa" href={ask} target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#i-chat" /></svg>WhatsApp us</a>
                <a className="btn btn--sm btn--ghost" href={`tel:${CONTACT.phone}`}><svg width="18" height="18" aria-hidden="true"><use href="#i-phone" /></svg>Call</a>
              </div>
              <a className="am-ask-guide" href="/nid/"><span>NID DAT 2027: stages, dates, campuses</span><Arrow /></a>
            </div>
          </div></div>
          <div>
            <div className="faq-group" id="mc-faqs">
              {M.faqs.map((faq) => (
                <div className="faq" key={faq.q}><h4><button className="faq-q" type="button" aria-expanded="false">{faq.q}<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>{faq.a}</p></div></div></div></div>
              ))}
            </div>
            {M.faqs.length > FAQS_SHOWN ? <AidmtFaqMore group="mc-faqs" total={M.faqs.length} /> : null}
          </div>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Enrol" aria-labelledby="start-h" style={{ paddingTop: "var(--inset)" }}>
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">{closed ? "Enrolment is closed." : M.close.heading}</h2>
              <p className="lede">{M.close.lede}</p>
              <ExamCountdown builtAt={builtAt} day={M.examDay} exam={M.examName} big />
              {closed ? null : (
                <div className="acts" id="end-enrol">
                  {(["live", "recorded"] as const).map((key, n) => {
                    const mode = modeOf(key);
                    const p = prices[key];
                    return (
                      <a key={key} className={n ? "btn btn--light" : "btn btn--dark"} {...enrol(mode)}>
                        {buy && p ? `Enrol in ${mode.short} · ${rupees(p.price)}` : `Ask to join ${mode.short}`} {n ? null : <Arrow />}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {buy ? <MasterclassBuy modes={M.modes} prices={prices} enrolUrl={MASTERCLASS_APP_URL} /> : null}
      {closed ? null : <MasterclassBar away={["#hero-enrol", "#end-enrol", "#modes", "footer"]} builtAt={builtAt} day={M.examDay} price={fromLabel} href={buy ? MASTERCLASS_APP_URL : ask} buy={buy} />}
    </div>
  );
}
