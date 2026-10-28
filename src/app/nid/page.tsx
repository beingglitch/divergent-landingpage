import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CourseCards } from "@/components/CourseCards";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "NID DAT 2027: stages, dates and campuses | Divergent Classes",
  description: "NID DAT is the design entrance for B.Des at the National Institutes of Design. Prelims, Mains, dates, fees, campuses and how to prepare.",
  path: "/nid/",
});

export default function NidPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Exam guide</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>NID DAT 2027</span></p>
              <h1 className="h1" id="hero-h">Crack <span className="hl">NID DAT.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">The way into B.Des at the National Institutes of Design.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Prelims</span><b>20 Dec 2026</b></li>
              <li><span>Stages</span><b>Prelims · Mains</b></li>
              <li><span>Mode</span><b>Pen and paper · studio</b></li>
            </ul>
            <div className="hero-ctas">
              <a className="btn" href="/#plans">75-day crash course <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="/courses/?exam=nid">All NID courses</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pattern" data-dot="Stages" aria-labelledby="pat-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>The stages</p>
            <h2 className="h2 rv" id="pat-h">Clear Prelims. Then prove it in Mains.</h2>
          </div>
          <div className="parts">
            <div className="part rv">
              <p className="part-k">Stage 1 · DAT Prelims</p>
              <h3>3-hour paper</h3>
              <ul>
                <li><b>Design aptitude</b><span>Creativity, visualisation, problem-solving.</span></li>
                <li><b>Observation</b><span>Detail and analytical thinking.</span></li>
                <li><b>Reasoning</b><span>Patterns and decisions.</span></li>
              </ul>
            </div>
            <div className="part y rv" style={{"--i": "1"} as CSSProperties}>
              <p className="part-k">Stage 2 · DAT Mains</p>
              <h3>Studio + interview</h3>
              <ul>
                <li><b>Studio test</b><span>Hands-on tasks with materials.</span></li>
                <li><b>Sketching</b><span>Drawing, perspective, expression.</span></li>
                <li><b>Interview</b><span>How you think and explain.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint" id="facts" data-dot="Key facts" aria-labelledby="kf-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Key facts</p>
            <h2 className="h2 rv" id="kf-h">What to know first.</h2>
          </div>
          <dl className="kfacts">
            <div className="rv"><dt>Registration</dt><dd>Closes 30 Nov 2026.</dd></div>
            <div className="rv" style={{"--i": "1"} as CSSProperties}><dt>Admit card</dt><dd>From 10 Dec 2026.</dd></div>
            <div className="rv" style={{"--i": "2"} as CSSProperties}><dt>Mains</dt><dd>Dates not announced yet. Only for those shortlisted.</dd></div>
            <div className="rv" style={{"--i": "3"} as CSSProperties}><dt>Fee</dt><dd>₹3,000 (General, EWS, OBC-NCL). ₹2,000 female, ₹1,500 SC/ST, ₹500 PwD and third gender.</dd></div>
            <div className="rv" style={{"--i": "4"} as CSSProperties}><dt>Competition</dt><dd>15,451 wrote B.Des Prelims for 2025-26. 1,904 made Mains.</dd></div>
            <div className="rv" style={{"--i": "5"} as CSSProperties}><dt>Good to know</dt><dd>Clearing Prelims is not admission. Mains decides it.</dd></div>
          </dl>
          <p className="dates-note">Confirm every date on <a href="https://admissions.nid.edu/" target="_blank" rel="noopener">admissions.nid.edu</a>.</p>
        </div>
      </section>

      <section className="section" id="colleges" data-dot="Campuses" aria-labelledby="col-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Campuses</p>
            <h2 className="h2 rv" id="col-h">Seven NIDs, one test.</h2>
          </div>
          <ul className="campuses">
            <li className="campus-c rv"><img src="/assets/img/campus/nid-ahmedabad.webp" alt="NID Ahmedabad" width="402" height="257" loading="lazy" /><b>NID Ahmedabad</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-gandhinagar.webp" alt="NID Gandhinagar" width="720" height="331" loading="lazy" /><b>NID Gandhinagar</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-bengaluru.webp" alt="NID Bengaluru" width="720" height="377" loading="lazy" /><b>NID Bengaluru</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-andhra-pradesh.webp" alt="NID Andhra Pradesh" width="205" height="101" loading="lazy" /><b>NID Andhra Pradesh</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-kurukshetra.webp" alt="NID Haryana, Kurukshetra" width="412" height="187" loading="lazy" /><b>NID Haryana</b><span>Kurukshetra</span></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-madhya-pradesh.webp" alt="NID Madhya Pradesh, Bhopal" width="720" height="300" loading="lazy" /><b>NID Madhya Pradesh</b><span>Bhopal</span></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nid-assam.webp" alt="NID Assam, Jorhat" width="720" height="294" loading="lazy" /><b>NID Assam</b><span>Jorhat</span></li>
          </ul>
        </div>
      </section>

      <section className="men-wrap section" id="mentors" data-dot="Mentors" aria-labelledby="men-h" style={{"paddingBlock": "clamp(56px,6vw,88px) 0"} as CSSProperties}>
        <div className="stage-m on-dark">
          <div className="wrap">
            <div className="men-head">
              <div>
                <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>NID mentors</p>
                <h2 className="h2 rv" id="men-h">Taught by NID Ahmedabad students.</h2>
              </div>
              <a className="btn btn--ghost" href="/about/#mentors">All mentors <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            </div>
            <ul className="pmentors">
              <li className="pm n rv"><img src="/assets/img/mentors/atharva.webp" alt="Atharva" width="480" height="595" loading="lazy" /><b>Atharva</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/anshika.webp" alt="Anshika" width="343" height="449" loading="lazy" /><b>Anshika</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/ujjwal.webp" alt="Ujjwal" width="308" height="399" loading="lazy" /><b>Ujjwal</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/mentors/aayush.webp" alt="Aayush" width="343" height="420" loading="lazy" /><b>Aayush</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv"><img src="/assets/img/mentors/piyusha.webp" alt="Piyusha" width="480" height="600" loading="lazy" /><b>Piyusha</b><span>NID Ahmedabad</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="prepare" data-dot="Prepare" aria-labelledby="pp-h">
        <div className="wrap">
          <div className="head head--row">
            <div>
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Prepare with us</p>
              <h2 className="h2 rv" id="pp-h">Pick how you prepare.</h2>
            </div>
            <a className="btn btn--ghost" href="/courses/?exam=nid">All NID courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
          <ul className="ccards">
      <CourseCards only={["crash-75", "nid-5-mocks", "nid-2-mocks", "uceed-nid-mocks-bundle"]} />
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Start" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">Prelims is on 20 December. Start now.</h2>
              <p className="lede">The 75-day crash course starts 1–2 November.</p>
              <div className="acts">
                <a className="btn btn--dark" href="/#plans">See plans <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
                <a className="btn btn--light" href="/#book">Book a free call</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
