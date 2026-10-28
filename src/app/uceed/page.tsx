import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CourseCards } from "@/components/CourseCards";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "UCEED 2027: pattern, dates and colleges | Divergent Classes",
  description: "UCEED is IIT Bombay's design entrance for B.Des at the IITs. Pattern, dates, eligibility, colleges and how to prepare.",
  path: "/uceed/",
});

export default function UceedPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Exam guide</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>UCEED 2027</span></p>
              <h1 className="h1" id="hero-h">Crack <span className="hl">UCEED.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">IIT Bombay's design entrance for B.Des at the IITs.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Exam day</span><b>17 Jan 2027</b></li>
              <li><span>Format</span><b>3 hours · 300 marks</b></li>
              <li><span>Mode</span><b>Computer + drawing</b></li>
            </ul>
            <div className="hero-ctas">
              <a className="btn" href="/#plans">75-day crash course <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="/courses/?exam=uceed">All UCEED courses</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pattern" data-dot="Pattern" aria-labelledby="pat-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>The paper</p>
            <h2 className="h2 rv" id="pat-h">Two parts. One sitting.</h2>
          </div>
          <div className="parts">
            <div className="part rv">
              <p className="part-k">Part A · on computer</p>
              <h3>200 marks</h3>
              <ul>
                <li><b>NAT</b><span>Numerical answers. Tests accuracy.</span></li>
                <li><b>MCQ</b><span>One right answer. Logic and aptitude.</span></li>
                <li><b>MSQ</b><span>More than one right answer. Observation.</span></li>
              </ul>
            </div>
            <div className="part y rv" style={{"--i": "1"} as CSSProperties}>
              <p className="part-k">Part B · on paper</p>
              <h3>100 marks</h3>
              <ul>
                <li><b>Sketching</b><span>Objects, scenes and perspective.</span></li>
                <li><b>Design aptitude</b><span>Ideas you can explain and draw.</span></li>
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
            <div className="rv"><dt>Who can write it</dt><dd>Class 12 pass in 2026, or appearing in 2027. Any stream. IIT Guwahati and Roorkee need PCM.</dd></div>
            <div className="rv" style={{"--i": "1"} as CSSProperties}><dt>Registration</dt><dd>Closes 31 Oct 2026. Late fee of ₹500 till 6 Nov.</dd></div>
            <div className="rv" style={{"--i": "2"} as CSSProperties}><dt>Fee</dt><dd>₹4,000. ₹2,000 for female, SC, ST and PwD candidates.</dd></div>
            <div className="rv" style={{"--i": "3"} as CSSProperties}><dt>Admit card</dt><dd>From 1 Jan 2027.</dd></div>
            <div className="rv" style={{"--i": "4"} as CSSProperties}><dt>Seats</dt><dd>245 B.Des seats across seven institutes in 2026.</dd></div>
            <div className="rv" style={{"--i": "5"} as CSSProperties}><dt>Competition</dt><dd>15,408 wrote it in 2025. 5,703 qualified.</dd></div>
          </dl>
          <p className="dates-note">Confirm every date on <a href="https://uceed.iitb.ac.in/" target="_blank" rel="noopener">uceed.iitb.ac.in</a>.</p>
        </div>
      </section>

      <section className="section" id="colleges" data-dot="Colleges" aria-labelledby="col-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Colleges</p>
            <h2 className="h2 rv" id="col-h">Where UCEED takes you.</h2>
          </div>
          <ul className="campuses">
            <li className="campus-c rv"><img src="/assets/img/campus/iit-bombay.webp" alt="IIT Bombay" width="720" height="553" loading="lazy" /><b>IIT Bombay</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iit-delhi.webp" alt="IIT Delhi" width="301" height="231" loading="lazy" /><b>IIT Delhi</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iit-guwahati.webp" alt="IIT Guwahati" width="301" height="231" loading="lazy" /><b>IIT Guwahati</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iit-hyderabad.webp" alt="IIT Hyderabad" width="301" height="231" loading="lazy" /><b>IIT Hyderabad</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iit-roorkee.webp" alt="IIT Roorkee" width="299" height="168" loading="lazy" /><b>IIT Roorkee</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iit-indore.webp" alt="IIT Indore" width="276" height="183" loading="lazy" /><b>IIT Indore</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/iiitdm-jabalpur.webp" alt="IIITDM Jabalpur" width="302" height="167" loading="lazy" /><b>IIITDM Jabalpur</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/dtu.webp" alt="Delhi Technological University" width="720" height="404" loading="lazy" /><b>DTU</b><span>Also uses UCEED scores</span></li>
            <li className="campus-c rv"><img src="/assets/img/campus/cept.webp" alt="CEPT University" width="275" height="183" loading="lazy" /><b>CEPT University</b><span>Also uses UCEED scores</span></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="toppers" data-dot="Toppers" aria-labelledby="tp-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Our UCEED toppers</p>
            <h2 className="h2 rv" id="tp-h">They did it with us.</h2>
          </div>
          <ul className="toppers">
            <li className="tcard rv"><img src="/assets/img/toppers/ankit.webp" alt="Ankit" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 2</b><span className="tn">Ankit</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/priyanka.webp" alt="Priyanka" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 4</b><span className="tn">Priyanka</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/rudra.webp" alt="Rudra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 8</b><span className="tn">Rudra</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/ameya.webp" alt="Ameya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 10</b><span className="tn">Ameya</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/hiya.webp" alt="Hiya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 30</b><span className="tn">Hiya</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/shubhra.webp" alt="Shubhra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 35</b><span className="tn">Shubhra</span></li>
          </ul>
        </div>
      </section>

      <section className="section" id="prepare" data-dot="Prepare" aria-labelledby="pp-h">
        <div className="wrap">
          <div className="head head--row">
            <div>
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Prepare with us</p>
              <h2 className="h2 rv" id="pp-h">Pick how you prepare.</h2>
            </div>
            <a className="btn btn--ghost" href="/courses/?exam=uceed">All UCEED courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
          <ul className="ccards">
      <CourseCards only={["crash-75", "uceed-5-mocks", "uceed-topper-mock", "uceed-pyq-free"]} />
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Start" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">UCEED is on 17 January. Start now.</h2>
              <p className="lede">The 75-day crash course starts 3 November.</p>
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
