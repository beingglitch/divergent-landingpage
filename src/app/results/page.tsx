import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Results | Divergent Classes",
  description: "Official UCEED, NID and NIFT ranks of Divergent students, in their own words.",
  path: "/results/",
});

export default function ResultsPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Results</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>UCEED · NID · NIFT</span></p>
              <h1 className="h1" id="hero-h">Our students <span className="hl">made it.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Official ranks, and the students behind them.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Best UCEED rank</span><b>AIR 2</b></li>
              <li><span>UCEED 2026</span><b>30+ in top 200</b></li>
              <li><span>Top NIDs and NIFTs</span><b>40+ students</b></li>
            </ul>
            <div className="hero-ctas">
              <a className="btn" href="/courses/">Explore courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="/#book">Book a free call</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="y2026" data-dot="2026" aria-labelledby="y26-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>2026 results</p>
            <h2 className="h2 rv" id="y26-h">Fresh off the 2026 lists.</h2>
          </div>
          <ul className="posters">
            <li className="rv"><img src="/assets/img/toppers/harsh-uceed-6.webp" alt="Harsh, UCEED 2026 AIR 6" width="520" height="693" loading="lazy" /></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/toppers/navya-nift-7.webp" alt="Navya, NIFT 2026 AIR 7 (category), NIFT BFTech" width="520" height="650" loading="lazy" /></li>
            <li className="rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/toppers/kalyani-nift-9.webp" alt="Kalyani Pisal, NIFT 2026 AIR 9" width="520" height="650" loading="lazy" /></li>
            <li className="rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/toppers/manya-nift-14.webp" alt="Manya Dwivedi, NIFT 2026 AIR 14 (category)" width="520" height="650" loading="lazy" /></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="toppers" data-dot="Toppers" aria-labelledby="top-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Toppers</p>
            <h2 className="h2 rv" id="top-h">Ranks you can check.</h2>
          </div>
          <ul className="toppers toppers--grid">
            <li className="tcard rv"><img src="/assets/img/toppers/ankit.webp" alt="Ankit" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 2</b><span className="tn">Ankit</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/priyanka.webp" alt="Priyanka" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 4</b><span className="tn">Priyanka</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/rudra.webp" alt="Rudra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 8</b><span className="tn">Rudra</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/ameya.webp" alt="Ameya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 10</b><span className="tn">Ameya</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/hiya.webp" alt="Hiya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 30</b><span className="tn">Hiya</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/shubhra.webp" alt="Shubhra" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 35</b><span className="tn">Shubhra</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/kishwar.webp" alt="Kishwar" width="480" height="480" loading="lazy" /><span className="tk">Topper</span><b>AIR 43</b><span className="tn">Kishwar</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/debashis.webp" alt="Debashis" width="480" height="480" loading="lazy" /><span className="tk">NID</span><b>AIR 52</b><span className="tn">Debashis</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/aditi.webp" alt="Aditi" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 55</b><span className="tn">Aditi</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/satvika.webp" alt="Satvika" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 69</b><span className="tn">Satvika</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/himani.webp" alt="Himani" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 118</b><span className="tn">Himani</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/laxmi.webp" alt="Laxmi" width="480" height="480" loading="lazy" /><span className="tk">Topper</span><b>AIR 130</b><span className="tn">Laxmi</span></li>
            <li className="tcard rv"><img src="/assets/img/toppers/riya.webp" alt="Riya" width="480" height="480" loading="lazy" /><span className="tk">UCEED</span><b>AIR 158</b><span className="tn">Riya</span></li>
          </ul>
        </div>
      </section>

      <section className="section" id="stories" data-dot="In their words" aria-labelledby="st-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>In their words</p>
            <h2 className="h2 rv" id="st-h">Hear it from them.</h2>
          </div>
          <ul className="vcards">
            <li className="vcard rv"><div className="vbox"><video preload="none" playsInline poster="/assets/video/ruhaniyat.webp" src="/assets/video/ruhaniyat.mp4"></video><button className="vplay" type="button" aria-label="Play Ruhaniyat's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“Divergent helped me improve Part B, and the mock tests helped me reduce mistakes.”</blockquote><p className="vwho"><b>Ruhaniyat</b><span>UCEED AIR 14</span></p></li>
            <li className="vcard rv" style={{"--i": "1"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/jacinth.webp" src="/assets/video/jacinth.mp4"></video><button className="vplay" type="button" aria-label="Play Jacinth's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“The mock tests by Divergent are by far the best I came across.”</blockquote><p className="vwho"><b>Jacinth Hussain Pegu</b><span>UCEED AIR 5 (category)</span></p></li>
            <li className="vcard rv" style={{"--i": "2"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/rohith.webp" src="/assets/video/rohith.mp4"></video><button className="vplay" type="button" aria-label="Play Rohith's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“Divergent mock tests and sessions were very helpful in my preparation.”</blockquote><p className="vwho"><b>Rohith Seetharaman</b><span>UCEED AIR 45</span></p></li>
            <li className="vcard rv" style={{"--i": "3"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/megha.webp" src="/assets/video/megha.mp4"></video><button className="vplay" type="button" aria-label="Play Megha's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“The mocks were pretty helpful, and so were the free sketching and GK classes.”</blockquote><p className="vwho"><b>Megha Mhetre</b><span>UCEED AIR 60</span></p></li>
            <li className="vcard rv"><div className="vbox"><video preload="none" playsInline poster="/assets/video/atsi.webp" src="/assets/video/atsi.mp4"></video><button className="vplay" type="button" aria-label="Play Atsi's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“I joined 3 months before the exam. The exam-like mocks really helped.”</blockquote><p className="vwho"><b>Atsi Lakhera</b><span>UCEED AIR 90</span></p></li>
            <li className="vcard rv" style={{"--i": "1"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/sharanya.webp" src="/assets/video/sharanya.mp4"></video><button className="vplay" type="button" aria-label="Play Sharanya's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“It quickly felt like a safe space to learn and grow.”</blockquote><p className="vwho"><b>Kadapala Sharanya Reddy</b><span>UCEED AIR 178</span></p></li>
            <li className="vcard rv" style={{"--i": "2"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/samruddha.webp" src="/assets/video/samruddha.mp4"></video><button className="vplay" type="button" aria-label="Play Samruddha's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“A very personalised experience. Classic padhai, along with fun sessions.”</blockquote><p className="vwho"><b>Samruddha Ghosh</b><span>UCEED AIR 205</span></p></li>
            <li className="vcard rv" style={{"--i": "3"} as CSSProperties}><div className="vbox"><video preload="none" playsInline poster="/assets/video/ayushri.webp" src="/assets/video/ayushri.mp4"></video><button className="vplay" type="button" aria-label="Play Ayushri's video"><svg width="22" height="22" aria-hidden="true"><use href="#play" /></svg></button></div><blockquote>“The mentors didn't just teach. They guided us at every step.”</blockquote><p className="vwho"><b>Ayushri</b><span>UCEED AIR 205 (category)</span></p></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="work" data-dot="Student work" aria-labelledby="work-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Student work</p>
            <h2 className="h2 rv" id="work-h">Sheets from our batches.</h2>
          </div>
          <ul className="gallery">
            <li><a href="/assets/img/work/work-01.webp" data-zoom="Student sketch 1"><img src="/assets/img/work/work-01.webp" alt="Student sketch 1" width="900" height="1200" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-02.webp" data-zoom="Student sketch 2"><img src="/assets/img/work/work-02.webp" alt="Student sketch 2" width="900" height="568" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-03.webp" data-zoom="Student sketch 3"><img src="/assets/img/work/work-03.webp" alt="Student sketch 3" width="900" height="642" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-04.webp" data-zoom="Student sketch 4"><img src="/assets/img/work/work-04.webp" alt="Student sketch 4" width="874" height="1280" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-05.webp" data-zoom="Student sketch 5"><img src="/assets/img/work/work-05.webp" alt="Student sketch 5" width="900" height="806" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-06.webp" data-zoom="Student sketch 6"><img src="/assets/img/work/work-06.webp" alt="Student sketch 6" width="900" height="594" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-07.webp" data-zoom="Student sketch 7"><img src="/assets/img/work/work-07.webp" alt="Student sketch 7" width="720" height="890" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-08.webp" data-zoom="Student sketch 8"><img src="/assets/img/work/work-08.webp" alt="Student sketch 8" width="900" height="619" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-09.webp" data-zoom="Student sketch 9"><img src="/assets/img/work/work-09.webp" alt="Student sketch 9" width="900" height="521" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-10.webp" data-zoom="Student sketch 10"><img src="/assets/img/work/work-10.webp" alt="Student sketch 10" width="900" height="636" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-11.webp" data-zoom="Student sketch 11"><img src="/assets/img/work/work-11.webp" alt="Student sketch 11" width="900" height="592" loading="lazy" /></a></li>
            <li><a href="/assets/img/work/work-12.webp" data-zoom="Student sketch 12"><img src="/assets/img/work/work-12.webp" alt="Student sketch 12" width="900" height="584" loading="lazy" /></a></li>
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="start" data-dot="Start" aria-labelledby="start-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="start-h">Your rank could be next.</h2>
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
