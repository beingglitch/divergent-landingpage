import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CourseCards } from "@/components/CourseCards";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "NIFT entrance: pattern and campuses | Divergent Classes",
  description: "The NIFT entrance tests creative and general ability for design programmes at the National Institute of Fashion Technology. Pattern, campuses and how to prepare.",
  path: "/nift/",
});

export default function NiftPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Exam guide</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>NIFT 2027</span></p>
              <h1 className="h1" id="hero-h">Crack <span className="hl">NIFT.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Creative and general ability, for design and fashion at NIFT.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Stages</span><b>Written · Situation test</b></li>
              <li><span>Written test</span><b>CAT + GAT</b></li>
              <li><span>Campuses</span><b>16 across India</b></li>
            </ul>
            <div className="hero-ctas">
              <a className="btn" href="/courses/?exam=nift">NIFT courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="/#book">Book a free call</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pattern" data-dot="Pattern" aria-labelledby="pat-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>The stages</p>
            <h2 className="h2 rv" id="pat-h">Write it. Then make it.</h2>
          </div>
          <div className="parts">
            <div className="part rv">
              <p className="part-k">Stage 1 · Written test</p>
              <h3>CAT and GAT</h3>
              <ul>
                <li><b>CAT</b><span>Creative Ability Test. Ideas and visualisation.</span></li>
                <li><b>GAT</b><span>General Ability Test. Reasoning, maths, awareness.</span></li>
              </ul>
            </div>
            <div className="part y rv" style={{"--i": "1"} as CSSProperties}>
              <p className="part-k">Stage 2 · Selection round</p>
              <h3>Hands-on</h3>
              <ul>
                <li><b>Situation test</b><span>Build a model from given materials.</span></li>
                <li><b>Interview</b><span>For some programmes.</span></li>
              </ul>
            </div>
          </div>
          <p className="dates-note">Dates for 2027 are not out yet. Confirm on <a href="https://nift.ac.in/" target="_blank" rel="noopener">nift.ac.in</a>.</p>
        </div>
      </section>

      <section className="section tint" id="toppers" data-dot="Toppers" aria-labelledby="tp-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>NIFT 2026</p>
            <h2 className="h2 rv" id="tp-h">Our NIFT toppers.</h2>
          </div>
          <ul className="posters posters--3">
            <li className="rv"><img src="/assets/img/toppers/navya-nift-7.webp" alt="Navya, NIFT 2026 AIR 7 (category), NIFT BFTech" width="520" height="650" loading="lazy" /></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/toppers/kalyani-nift-9.webp" alt="Kalyani Pisal, NIFT 2026 AIR 9" width="520" height="650" loading="lazy" /></li>
            <li className="rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/toppers/manya-nift-14.webp" alt="Manya Dwivedi, NIFT 2026 AIR 14 (category)" width="520" height="650" loading="lazy" /></li>
          </ul>
        </div>
      </section>

      <section className="section" id="colleges" data-dot="Campuses" aria-labelledby="col-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Campuses</p>
            <h2 className="h2 rv" id="col-h">Sixteen campuses to aim for.</h2>
          </div>
          <ul className="campuses campuses--sm">
            <li className="campus-c rv"><img src="/assets/img/campus/nift-delhi.webp" alt="NIFT Delhi" width="720" height="467" loading="lazy" /><b>Delhi</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-mumbai.webp" alt="NIFT Mumbai" width="720" height="480" loading="lazy" /><b>Mumbai</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-bangalore.webp" alt="NIFT Bengaluru" width="720" height="370" loading="lazy" /><b>Bengaluru</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-chennai.webp" alt="NIFT Chennai" width="720" height="336" loading="lazy" /><b>Chennai</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-gandhinagar.webp" alt="NIFT Gandhinagar" width="710" height="532" loading="lazy" /><b>Gandhinagar</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-hyderabad.webp" alt="NIFT Hyderabad" width="720" height="478" loading="lazy" /><b>Hyderabad</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-kolkata.webp" alt="NIFT Kolkata" width="720" height="480" loading="lazy" /><b>Kolkata</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-kannur.webp" alt="NIFT Kannur" width="297" height="211" loading="lazy" /><b>Kannur</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-patna.webp" alt="NIFT Patna" width="720" height="336" loading="lazy" /><b>Patna</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-bhopal.webp" alt="NIFT Bhopal" width="272" height="153" loading="lazy" /><b>Bhopal</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-shillong.webp" alt="NIFT Shillong" width="720" height="479" loading="lazy" /><b>Shillong</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-raebareli.webp" alt="NIFT Raebareli" width="720" height="332" loading="lazy" /><b>Raebareli</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-jodhpur.webp" alt="NIFT Jodhpur" width="588" height="455" loading="lazy" /><b>Jodhpur</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-srinagar.webp" alt="NIFT Srinagar" width="720" height="480" loading="lazy" /><b>Srinagar</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-panchkula.webp" alt="NIFT Panchkula" width="720" height="324" loading="lazy" /><b>Panchkula</b></li>
            <li className="campus-c rv"><img src="/assets/img/campus/nift-kangra.webp" alt="NIFT Kangra" width="284" height="177" loading="lazy" /><b>Kangra</b></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="prepare" data-dot="Prepare" aria-labelledby="pp-h">
        <div className="wrap">
          <div className="head head--row">
            <div>
              <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Prepare with us</p>
              <h2 className="h2 rv" id="pp-h">Pick how you prepare.</h2>
            </div>
            <a className="btn btn--ghost" href="/courses/?exam=nift">All NIFT courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
          <ul className="ccards">
      <CourseCards only={["nift-10-mocks", "crash-120-uceed-nid-nift", "nova-uceed-nid-nift", "free-120-day-trial"]} />
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Start" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">Learn from a NIFT Delhi mentor.</h2>
              <p className="lede">Om Mishra, from NIFT Delhi, mentors our NIFT students.</p>
              <div className="acts">
                <a className="btn btn--dark" href="/courses/?exam=nift">See NIFT courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
                <a className="btn btn--light" href="/#book">Book a free call</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
