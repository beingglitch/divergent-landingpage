import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";
import { CONFIG, FREE_CLASS_URL, OTHERS_FROM, bundleSlug, checkoutUrl } from "@/lib/config";
import { LeadForm } from "@/components/LeadForm";
import { HomeBehaviour } from "@/components/HomeBehaviour";

export const metadata: Metadata = pageMeta({
  title: "Divergent Classes | 75-Day Crash Course for UCEED and NID",
  description: "75 days to UCEED and NID. Live classes, full mocks and weekly feedback from mentors who cleared the exams.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="hero" id="top" data-dot="Home" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">UCEED &amp; NID 2027</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>75-Day Crash Course</span></p>
              <h1 className="h1" id="hero-h"><span className="num">75 days</span> to <span className="hl">UCEED and NID.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Live classes, full mocks and weekly feedback from mentors who cleared it.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span data-hf-k="">Classes start</span><b data-eyebrow-start="">3 November</b></li>
              <li><span>Every week</span><b>3 classes · 5 in Combo</b></li>
              <li><span>Per exam</span><b>32+ classes · 10 mocks</b></li>
            </ul>
            <div className="offer">
              <p className="offer-p"><span className="offer-k">Plans from</span><s className="offer-was" data-was="" hidden></s><b data-from-p="">₹5,999</b></p>
              <p className="deadline" data-req="launchPrice" data-until={CONFIG.dates.launchEnds}><svg width="18" height="18" aria-hidden="true"><use href="#clock" /></svg>Launch price ends 2 November</p>
              <p className="deadline" data-req="diwaliPrice" data-after={CONFIG.dates.diwaliStart} data-until={CONFIG.dates.diwaliEnds}><svg width="18" height="18" aria-hidden="true"><use href="#clock" /></svg>Diwali offer ends 11 November</p>
            </div>
            <div className="hero-ctas">
              <a className="btn" href="#plans">Enrol now <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href={FREE_CLASS_URL}>Try a free class</a>
              <a className="btn btn--ghost" href="#book">Book a free call</a>
              <a className="btn btn--ghost" href="/courses/">Explore other courses and mocks <small className="btn-note">from ₹{OTHERS_FROM.toLocaleString("en-IN")}</small></a>
            </div>
            <div className="d75" aria-hidden="true">
              <div className="d75-h">
                <p className="d75-t"><span className="d75-n">75</span><span className="d75-w"><b>days,</b><span>every one planned.</span></span></p>
                <p className="d75-lab">Day 1 → 75<span>one dot per day</span></p>
              </div>
              <div className="dots" id="dots75"></div>
              <p className="d75-k"><span className="k1">Day 1 · 3 Nov</span><span className="k48">NID Prelims · 20 Dec</span><span className="k75">UCEED · 17 Jan</span></p>
            </div>
          </div>
        </div>
      </section>


      <section className="section results" id="results" data-dot="Results" aria-labelledby="res-h">
        <div className="wrap">
          <div className="res-head">
            <div>
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Results</p>
              <h2 className="h2 rv" id="res-h">Our track record.</h2>
            </div>
            <p className="res-src rv" style={{"--i": "1"} as CSSProperties}>Official ranks of Divergent students.</p>
          </div>
          <div className="res-top">
            <div className="res-airs rv">
              <p className="airs-k">UCEED · All India Ranks</p>
              <p className="airs"><span className="sr-only">UCEED All India Ranks 2, 4, 8 and 10.</span><span aria-hidden="true">2</span><span className="sep" aria-hidden="true">·</span><span aria-hidden="true">4</span><span className="sep" aria-hidden="true">·</span><span aria-hidden="true">8</span><span className="sep" aria-hidden="true">·</span><span aria-hidden="true">10</span></p>
            </div>
            <ul className="tiles">
              <li className="rv"><b><span data-count="30">30</span><em>+</em></b><span>UCEED 2026 top 200</span></li>
              <li className="rv" style={{"--i": "1"} as CSSProperties}><b><span data-count="18">18</span><em>+</em></b><span>into top NIDs</span></li>
              <li className="rv" style={{"--i": "2"} as CSSProperties}><b><span data-count="25">25</span><em>+</em></b><span>into top NIFTs</span></li>
              <li className="rv" style={{"--i": "3"} as CSSProperties}><b><span data-count="10000">10,000</span><em>+</em></b><span>in our community</span></li>
            </ul>
          </div>
          <ul className="toppers rv">
            <li className="tcard"><img src="/assets/img/toppers/ankit.webp" alt="Ankit" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 2</b><span className="tn">Ankit</span></li>
            <li className="tcard"><img src="/assets/img/toppers/priyanka.webp" alt="Priyanka" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 4</b><span className="tn">Priyanka</span></li>
            <li className="tcard"><img src="/assets/img/toppers/rudra.webp" alt="Rudra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 8</b><span className="tn">Rudra</span></li>
            <li className="tcard"><img src="/assets/img/toppers/ameya.webp" alt="Ameya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 10</b><span className="tn">Ameya</span></li>
            <li className="tcard"><img src="/assets/img/toppers/hiya.webp" alt="Hiya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 30</b><span className="tn">Hiya</span></li>
            <li className="tcard"><img src="/assets/img/toppers/debashis.webp" alt="Debashis" width="480" height="480" loading="lazy" /><span className="tk">NID</span><b>AIR 52</b><span className="tn">Debashis</span></li>
          </ul>
          <div className="res-foot">
            <a className="btn btn--dark" href="/results/">See every result <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
        </div>
      </section>


      <section className="section tint aud" id="for-you" data-dot="Who it's for" aria-labelledby="aud-h">
        <div className="wrap">
          <div className="head aud-head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Who it's for</p>
            <h2 className="h2 rv" id="aud-h">Which batch fits you?</h2>
          </div>
          <div className="who">
            <button type="button" className="who-c c1 rv" data-pick="live"><span className="who-top"><span className="who-n" aria-hidden="true">1</span><span className="tag">Class 12</span></span><span className="who-q">Juggling boards?</span><span className="who-p">3 classes a week, around school.</span><span className="go"><span className="go-t"><small>Best fit</small><b>Live or Recorded</b></span><span className="go-a" aria-hidden="true"><svg width="18" height="18"><use href="#arrow" /></svg></span></span></button>
            <button type="button" className="who-c c2 rv" style={{"--i": "1"} as CSSProperties} data-pick="mentor"><span className="who-top"><span className="who-n" aria-hidden="true">2</span><span className="tag">Dropper</span></span><span className="who-q">Need weekly follow-up?</span><span className="who-p">Someone who reviews your sheets.</span><span className="go"><span className="go-t"><small>Best fit</small><b>Mentor</b></span><span className="go-a" aria-hidden="true"><svg width="18" height="18"><use href="#arrow" /></svg></span></span></button>
            <button type="button" className="who-c c3 rv" style={{"--i": "2"} as CSSProperties} data-pick-batch="combo"><span className="who-top"><span className="who-n" aria-hidden="true">3</span><span className="tag">Both exams</span></span><span className="who-q">Writing UCEED and NID?</span><span className="who-p">Two tracks, one batch, one price.</span><span className="go"><span className="go-t"><small>Best fit</small><b>Combo</b></span><span className="go-a" aria-hidden="true"><svg width="18" height="18"><use href="#arrow" /></svg></span></span></button>
          </div>
          <p className="fine who-fine">In Class 11? See the <a href="/courses/?exam=all&amp;type=nova">NOVA foundation batch</a>.</p>
        </div>
      </section>


      <section className="section" id="dates" data-dot="Exam dates" aria-labelledby="dates-h">
        <div className="wrap">
          <div className="dates-head">
            <div className="head">
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Exam dates</p>
              <h2 className="h2 rv" id="dates-h">The clock is running.</h2>
            </div>
            <p className="nudge" id="nudge" hidden><svg width="20" height="20" aria-hidden="true"><use href="#clock" /></svg><span id="nudge-t"></span></p>
          </div>
          <div className="cds">
            <div className="cd y rv" data-countdown="2026-12-20T00:00:00" data-countdown-date="2026-12-20">
              <div className="cd-name"><span className="cd-x">NID DAT Prelims</span><span className="cd-when"><span data-cd-when="">20 Dec 2026</span></span></div>
              <div className="cd-row"><span className="cd-num" data-cd-num="">N/A</span><span className="cd-unit" data-cd-unit="">days to go</span></div>
              <ul className="cd-dates" data-tl="" aria-label="NID DAT key dates">
                <li data-end="2026-11-30T23:59:59"><span className="d">30 Nov</span><span className="w">Registration closes</span><span className="st"></span></li>
                <li data-end="2026-12-10T23:59:59"><span className="d">10 Dec</span><span className="w">Admit card</span><span className="st"></span></li>
              </ul>
            </div>
            <div className="cd b rv" style={{"--i": "1"} as CSSProperties} data-countdown="2027-01-17T09:00:00" data-countdown-date="2027-01-17">
              <div className="cd-name"><span className="cd-x">UCEED 2027</span><span className="cd-when"><span data-cd-when="">17 Jan 2027 · 9 am</span></span></div>
              <div className="cd-row"><span className="cd-num" data-cd-num="">N/A</span><span className="cd-unit" data-cd-unit="">days to go</span></div>
              <ul className="cd-dates" data-tl="" aria-label="UCEED key dates">
                <li data-end="2026-10-31T23:59:59"><span className="d">31 Oct</span><span className="w">Registration closes</span><span className="st"></span></li>
                <li data-end="2026-11-06T23:59:59"><span className="d">6 Nov</span><span className="w">Late registration (₹500)</span><span className="st"></span></li>
                <li data-end="2027-01-01T23:59:59"><span className="d">1 Jan</span><span className="w">Admit card</span><span className="st"></span></li>
              </ul>
            </div>
          </div>
          <p className="dates-note">Times in IST. Confirm on <a href="https://uceed.iitb.ac.in/" rel="noopener" target="_blank">uceed.iitb.ac.in</a> and <a href="https://admissions.nid.edu/" rel="noopener" target="_blank">admissions.nid.edu</a>.</p>
        </div>
      </section>


      <section className="section tint" id="course" data-dot="Course" aria-labelledby="sys-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>The course</p>
            <h2 className="h2 rv" id="sys-h">Two classes to learn. One to get it <span className="hb">checked.</span></h2>
          </div>
          <div className="sys-top">
            <div className="tabs-w"><span className="tabs-k" aria-hidden="true">Plan for</span>
            <div className="tabs" role="tablist" aria-label="Choose a batch">
              <button className="tab" role="tab" id="t-uceed" aria-selected="false" aria-controls="sys-panel" data-batch="uceed" tabIndex={-1}>UCEED</button>
              <button className="tab" role="tab" id="t-nid" aria-selected="false" aria-controls="sys-panel" data-batch="nid" tabIndex={-1}>NID</button>
              <button className="tab" role="tab" id="t-combo" aria-selected="true" aria-controls="sys-panel" data-batch="combo"><span className="lg">UCEED + NID </span>Combo</button>
            </div></div>
            <div className="sys-stats" aria-live="polite">
              <div><b data-sys="live">53+</b><span>live classes</span></div>
              <div><b data-sys="hours">106+</b><span>hours</span></div>
              <div><b data-sys="mocks">20</b><span>full mocks</span></div>
            </div>
          </div>
          <div id="sys-panel" className="sysbox" role="tabpanel" aria-labelledby="t-combo">
            <div className="week">
              <div className="week-h">
                <p className="step-k">Every week</p>
                <h3 data-sys="weekTitle">Combo: 5 classes a week</h3>
              </div>
              <div className="blocks" id="blocks"></div>
            </div>
            <div className="track" id="track" data-batch="combo">
              <div className="week-h">
                <p className="step-k">All 11 weeks</p>
                <h3>First class to exam day</h3>
              </div>
              <div className="tl" role="img" aria-label="UCEED and NID tracks run for eleven weeks from 3 November. NID Prelims ends week 7, UCEED ends week 11. A feedback class runs every week.">
                <div className="tl-g tl-mo" aria-hidden="true"><span></span><span style={{"gridColumn": "span 4"} as CSSProperties}>Nov</span><span style={{"gridColumn": "span 5"} as CSSProperties}>Dec</span><span style={{"gridColumn": "span 2"} as CSSProperties}>Jan</span></div>
                <div className="tl-g tl-wk" aria-hidden="true"><span className="tl-l">Week</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span></div>
                <div className="tl-g tl-r u"><span className="tl-l">UCEED</span><span className="tl-bar"></span></div>
                <div className="tl-g tl-r n"><span className="tl-l">NID</span><span className="tl-bar"></span></div>
                <div className="tl-g tl-r f"><span className="tl-l">Feedback</span><span className="tl-dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
                <span className="tl-mk m7"><em>NID Prelims</em></span>
                <span className="tl-mk m11"><em>UCEED</em></span>
              </div>
            </div>
          </div>
          <div className="incl">
            <div className="incl-top"><h3 className="incl-h">Every batch includes</h3></div>
            <ul className="checks">
              <li className="rv"><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Full syllabus</b></li>
              <li className="rv" style={{"--i": "1"} as CSSProperties}><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Practice sheets</b></li>
              <li className="rv" style={{"--i": "2"} as CSSProperties}><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Sketch reviews</b></li>
              <li className="rv" style={{"--i": "3"} as CSSProperties}><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Weekly doubt class</b></li>
              <li className="rv" style={{"--i": "4"} as CSSProperties}><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Mock analysis</b></li>
              <li className="rv" style={{"--i": "5"} as CSSProperties}><span className="ic" aria-hidden="true"><svg><use href="#tick" /></svg></span><b>Exam-day strategy</b></li>
            </ul>
          </div>
        </div>
      </section>


      <section className="men-wrap section" id="mentors" data-dot="Mentors" aria-labelledby="men-h" style={{"paddingBlock": "clamp(56px,6vw,88px) 0"} as CSSProperties}>
        <div className="stage-m on-dark">
          <div className="wrap">
            <div className="men-head">
              <div>
                <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Mentors</p>
                <h2 className="h2 rv" id="men-h">Taught by people who cleared it.</h2>
              </div>
              <a className="btn btn--ghost" href="/about/#mentors">Meet all mentors <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            </div>
            <ul className="pmentors rv">
              <li className="pm"><img src="/assets/img/mentors/ruturaj.webp" alt="Ruturaj" width="480" height="640" loading="lazy" /><b>Ruturaj</b><span>IIT Bombay</span></li>
              <li className="pm"><img src="/assets/img/mentors/kaushik.webp" alt="Kaushik" width="480" height="600" loading="lazy" /><b>Kaushik</b><span>IIT Delhi</span></li>
              <li className="pm n"><img src="/assets/img/mentors/atharva.webp" alt="Atharva" width="480" height="595" loading="lazy" /><b>Atharva</b><span>NID Ahmedabad</span></li>
              <li className="pm n"><img src="/assets/img/mentors/anshika.webp" alt="Anshika" width="343" height="449" loading="lazy" /><b>Anshika</b><span>NID Ahmedabad</span></li>
              <li className="pm"><img src="/assets/img/mentors/sparsh.webp" alt="Sparsh" width="480" height="638" loading="lazy" /><b>Sparsh</b><span>IIT Bombay</span></li>
              <li className="pm f"><img src="/assets/img/mentors/om.webp" alt="Om Mishra" width="480" height="600" loading="lazy" /><b>Om Mishra</b><span>NIFT Delhi</span></li>
            </ul>
          </div>
        </div>
      </section>


      <section className="section" id="plans" data-dot="Plans" aria-labelledby="plans-h">
        <div className="wrap">
          <div className="price-head" id="pricing">
            <div className="head">
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Plans</p>
              <h2 className="h2 rv" id="plans-h">One batch. Three ways in.</h2>
              <p className="lede rv" style={{"--i": "1"} as CSSProperties}>Same price for UCEED or NID.</p>
            </div>
            <div className="controls">
              <div className="tabs" role="radiogroup" aria-label="Batch" id="batchPick">
                <button className="tab" type="button" role="radio" aria-checked="false" data-batch="single" tabIndex={-1}>Single exam</button>
                <button className="tab" type="button" role="radio" aria-checked="true" data-batch="combo"><span className="lg">UCEED + NID </span>Combo</button>
              </div>
              <div className="sub" id="examPickWrap" hidden><span>Exam:</span>
                <div className="tabs sm" role="radiogroup" aria-label="Exam" id="examPick">
                  <button className="tab" type="button" role="radio" aria-checked="true" data-exam="UCEED">UCEED</button>
                  <button className="tab" type="button" role="radio" aria-checked="false" data-exam="NID" tabIndex={-1}>NID</button>
                </div>
              </div>
            </div>
          </div>
          <div className="pcards" role="radiogroup" aria-label="Plan" id="planPick">
            <div className="pcol" data-col="recorded">
              <button className="pcard" type="button" role="radio" aria-checked="false" data-plan="recorded" tabIndex={-1}>
                <span className="row"><span className="pn">Recorded</span><span className="radio" aria-hidden="true"></span></span>
                <span className="pb">On your schedule.</span>
                <span className="price" data-pr=""></span>
                <span data-save-wrap=""></span>
                <span className="gift" data-gift="" hidden></span>
              </button>
              <ul className="pstats" aria-label="Recorded plan at a glance">
                <li><b>Full</b><span>course</span></li>
                <li><b data-pv="rmocks">6</b><span>mocks</span></li>
                <li><b>3</b><span>sketch reviews</span></li>
              </ul>
              <div className="ppay" data-pay="recorded">
                <label className="ppack"><input type="checkbox" data-pack="" /><span>Add Mock &amp; Live Pack <b data-pack-add="">+₹{CONFIG.mockPack.toLocaleString("en-IN")}</b></span></label>
                <ul className="popts" data-opts="" aria-label="Payment options"></ul>
                <p className="pperk" data-perk="" hidden></p>
                <p className="pemi" data-emi="" data-req="emi" hidden>Pay in parts, or use EMI on your credit card.</p>
                <a className="btn btn--sm btn--block pjoin" data-join="" href={checkoutUrl(bundleSlug("recorded", "combo", "UCEED"), "join")}>Pay ₹{CONFIG.joinAmount.toLocaleString("en-IN")} to join</a>
              </div>
            </div>
            <div className="pcol" data-col="live">
              <button className="pcard" type="button" role="radio" aria-checked="true" data-plan="live">
                <span className="bdg" data-popular="" hidden><span className="badge">Most popular</span></span>
                <span className="row"><span className="pn">Live</span><span className="radio" aria-hidden="true"></span></span>
                <span className="pb">Your work checked weekly.</span>
                <span className="price" data-pr=""></span>
                <span data-save-wrap=""></span>
                <span className="gift" data-gift="" hidden></span>
              </button>
              <ul className="pstats" aria-label="Live plan at a glance">
                <li><b data-pv="live">32+</b><span>live classes</span></li>
                <li><b>Weekly</b><span>feedback</span></li>
                <li><b data-pv="mocks">10</b><span>mocks</span></li>
              </ul>
              <div className="ppay" data-pay="live">
                <ul className="popts" data-opts="" aria-label="Payment options"></ul>
                <p className="pperk" data-perk="" hidden></p>
                <p className="pemi" data-emi="" data-req="emi" hidden>Pay in parts, or use EMI on your credit card.</p>
                <a className="btn btn--sm btn--block pjoin" data-join="" href={checkoutUrl(bundleSlug("live", "combo", "UCEED"), "join")}>Pay ₹{CONFIG.joinAmount.toLocaleString("en-IN")} to join</a>
              </div>
            </div>
            <div className="pcol" data-col="mentor">
              <button className="pcard" type="button" role="radio" aria-checked="false" data-plan="mentor" tabIndex={-1}>
                <span className="bdg" data-req="mentorSeatsLimited"><span className="badge b">Limited seats</span></span>
                <span className="row"><span className="pn">Mentor</span><span className="radio" aria-hidden="true"></span></span>
                <span className="pb">A personal mentor.</span>
                <span className="price" data-pr=""></span>
                <span data-save-wrap=""></span>
                <span className="gift" data-gift="" hidden></span>
              </button>
              <ul className="pstats" aria-label="Mentor plan at a glance">
                <li><b data-pv="live">32+</b><span>live classes</span></li>
                <li><b>Weekly</b><span>1:1 check-in</span></li>
                <li><b data-pv="mocks">10</b><span>mocks</span></li>
              </ul>
              <div className="ppay" data-pay="mentor">
                <ul className="popts" data-opts="" aria-label="Payment options"></ul>
                <p className="pperk" data-perk="" hidden></p>
                <p className="pemi" data-emi="" data-req="emi" hidden>Pay in parts, or use EMI on your credit card.</p>
                <a className="btn btn--sm btn--block pjoin" data-join="" href={checkoutUrl(bundleSlug("mentor", "combo", "UCEED"), "join")}>Pay ₹{CONFIG.joinAmount.toLocaleString("en-IN")} to join</a>
              </div>
            </div>
          </div>

          <div className="psum" aria-live="polite">
            <p className="pick" style={{"margin": "0"} as CSSProperties}>You picked <b id="pickName">Live · Combo</b></p>
            <div className="acts">
              <a className="btn" href={checkoutUrl(bundleSlug("live", "combo", "UCEED"))} id="enrolBtn" data-enrol="">Enrol now <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href={FREE_CLASS_URL}>Try a free class</a>
              <a className="btn btn--ghost" href="#book">Book a free call</a>
              <a className="btn btn--ghost" href="/courses/">Explore other courses and mocks <small className="btn-note">from ₹{OTHERS_FROM.toLocaleString("en-IN")}</small></a>
            </div>
          </div>
          <div className="pfoot">
            <ul className="terms" aria-label="Payment terms">
              <li data-req="gst"><svg aria-hidden="true"><use href="#tick" /></svg>GST included</li>
              <li data-req="refund"><svg aria-hidden="true"><use href="#tick" /></svg>Full refund within 7 days of the batch start (by 10 November).</li>
              <li data-req="upgrades"><svg aria-hidden="true"><use href="#tick" /></svg>Upgrade any time</li>
            </ul>
            <p className="dsat"><b>Join with ₹{CONFIG.joinAmount.toLocaleString("en-IN")}.</b> It counts toward your fee and locks the price live that day. Pay the rest in full or in parts. Have a scholarship code? Add it at checkout.</p>
          </div>
          <details className="cmpx" data-req="planInclusions">
            <summary><span>Compare plans</span><span className="chev" aria-hidden="true"></span></summary>
            <table className="cmp">
              <caption className="sr-only">Features in the Recorded, Live and Mentor plans</caption>
              <thead><tr><th scope="col">Feature</th><th scope="col">Recorded</th><th scope="col">Live</th><th scope="col">Mentor</th></tr></thead>
              <tbody>
                <tr><th scope="row">Course, notes, tests</th><td data-label="Recorded">Yes</td><td data-label="Live">Yes</td><td data-label="Mentor">Yes</td></tr>
                <tr><th scope="row">Full mocks</th><td data-label="Recorded">3 mocks (6 in the Combo)</td><td data-label="Live">10 mocks (20 in the Combo), with analysis</td><td data-label="Mentor">10 mocks (20 in the Combo), with analysis</td></tr>
                <tr><th scope="row">Mock &amp; Live Pack</th><td data-label="Recorded">+₹{CONFIG.mockPack.toLocaleString("en-IN")}: 3 more mocks (6 in the Combo) and selected live sessions</td><td data-label="Live" className="no">N/A</td><td data-label="Mentor" className="no">N/A</td></tr>
                <tr><th scope="row">Live classes</th><td data-label="Recorded" className="no">No</td><td data-label="Live">Yes</td><td data-label="Mentor">Yes</td></tr>
                <tr><th scope="row">Sketch reviews</th><td data-label="Recorded">3</td><td data-label="Live">Weekly</td><td data-label="Mentor">Weekly + log</td></tr>
                <tr><th scope="row">Personal mentor, 1:1</th><td data-label="Recorded" className="no">No</td><td data-label="Live" className="no">No</td><td data-label="Mentor">Yes</td></tr>
                <tr><th scope="row">Exam-week call</th><td data-label="Recorded" className="no">No</td><td data-label="Live" className="no">No</td><td data-label="Mentor">Yes</td></tr>
                <tr><th scope="row">Payment options</th><td data-label="Recorded">Join with ₹1,000, then pay in full. Combo with the pack: 2 parts too.</td><td data-label="Live">Join with ₹1,000, then pay in full or in 2 parts. Combo: 3 parts too.</td><td data-label="Mentor">Join with ₹1,000, then pay in full, in 2 parts or in 3 parts.</td></tr>
              </tbody>
            </table>
          </details>
        </div>
      </section>


      <section className="section tint" id="faqs" data-dot="FAQs" aria-labelledby="faq-h">
        <div className="wrap faq-grid">
          <div className="faq-side"><div className="stick">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>FAQs</p>
            <h2 className="h2 rv" id="faq-h">Asked, <span className="hb">answered.</span></h2>
            <div className="ask rv" style={{"--i": "1"} as CSSProperties}>
              <p className="ask-h">Still unsure?</p>
              <p>Talk to a counsellor. Free, 10 minutes.</p>
              <a className="btn btn--sm" href="#book">Book a free call</a>
            </div>
          </div></div>
          <div>
            <div className="tabs faq-tabs" role="tablist" aria-label="FAQ topics" hidden>
              <button className="tab" type="button" role="tab" id="ft-batch" aria-selected="true" aria-controls="faq-batch">The batch</button>
              <button className="tab" type="button" role="tab" id="ft-exams" aria-selected="false" aria-controls="faq-exams" tabIndex={-1}>The exams</button>
            </div>
            <div className="faq-group" id="faq-batch" role="tabpanel" aria-labelledby="ft-batch">
              <h3>The batch</h3>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Is 75 days enough?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. Mocks show where you lose marks, and classes fix those first.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I prepare for UCEED and NID together?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. The Combo runs both tracks every week, with 20 full mocks.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">What if I miss a class?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Every class is recorded. Catch up and join from the next live class.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I join after 3 November?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. Classes run from 3 November, and you get recordings of everything you missed. If you join after 10 November, any part payments already due are paid when you join.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I switch plans?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Upgrade any time. Pay only the difference in plan price. The Mock &amp; Live Pack is not credited toward an upgrade.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Do you guarantee a rank?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>No one can. We guarantee the classes, mocks and feedback in your plan.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">How does joining with ₹1,000 work?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Pay ₹1,000 and you join the batch straight away, at the price live that day. It counts toward your fee. Then pay the rest in full by 10 November, or in parts.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I pay in parts, or use EMI?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. Live, Mentor and Recorded Combo with the Mock &amp; Live Pack can be paid in 2 parts, due 10 November and 1 December. Plans of ₹17,999 and above can also be paid in 3 parts, due 10 November, 1 December and 20 December. Each option shows its total. Other Recorded plans are paid in full. Any plan can use EMI on your credit card at the pay-in-full price; your bank charges its own interest. If a part payment is missed, live classes and new recordings pause 3 days after the due date and return once it is paid.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">How many mocks come with Recorded?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>3 mocks (6 in the Combo). Add the Mock &amp; Live Pack for ₹2,000 to get 3 more mocks (6 more in the Combo) and access to selected live sessions. Mocks are a mix of recorded mock-test resources and live mock sessions.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Do I get an onboarding call if I pay in full?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Mentor: pay in full and get a 1:1 onboarding call with Devansh. 15 minutes, in your first two weeks, plus first priority on the 80 Mentor seats. Live, and Recorded Combo with the Mock &amp; Live Pack: pay in full and join Devansh&apos;s onboarding session in week 1. Part payments do not include an onboarding call.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I get a refund?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. Full refund within 7 days of the batch start (by 10 November). This includes the ₹1,000 you paid to join.</p></div></div></div></div>
            </div>
            <div className="faq-group" id="faq-exams" role="tabpanel" aria-labelledby="ft-exams">
              <h3>The exams</h3>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">What is the UCEED format?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>3 hours, 300 marks. Part A online (200), Part B drawing (100). <a href="/uceed/">More on UCEED</a>.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Who can take UCEED 2027?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Class 12 pass in 2026 or appearing in 2027, any stream. IIT Guwahati and Roorkee need PCM.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">What are the NID DAT stages?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Prelims on 20 December, then Mains for those shortlisted. <a href="/nid/">More on NID DAT</a>.</p></div></div></div></div>
              <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Does a UCEED score guarantee an IIT seat?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>No. Seats depend on rank, category, choices and counselling.</p></div></div></div></div>
            </div>
          </div>
        </div>
      </section>


      <section className="enrol-wrap book-wrap" id="book" data-dot="Free call" aria-labelledby="enrol-h">
        <span id="enrol" className="book-anchor" aria-hidden="true"></span>
        <div className="stage-e stage-book">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Free call</span></p>
              <h2 className="h2" id="enrol-h" data-final-h="">Classes start <span style={{ whiteSpace: "nowrap" }}>3 November.</span></h2>
              <p className="lede">Not sure which plan? Leave your number and a counsellor will call you. Free, 10 minutes.</p>
            </div>
          </div>
          <div className="book-shell">
            <LeadForm />
          </div>
        </div>
      </section>

      <div className="sticky" id="sticky" aria-hidden="true">
        <span className="st-t"><b>75-Day Crash Course</b><span data-from="">from ₹5,999</span></span>
        <div className="st-acts">
          <a className="btn btn--ghost btn--sm st-book" href="#book" tabIndex={-1}>Free call</a>
          <a className="btn btn--sm" href="#plans" tabIndex={-1}>Enrol</a>
        </div>
      </div>
      <HomeBehaviour />
    </>
  );
}
