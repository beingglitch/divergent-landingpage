import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "About us | Divergent Classes",
  description: "We don't teach answers. We build designers. Meet the mentors from IIT, NID and NIFT behind Divergent Classes.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">About us</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Warning: may cause ideas</span></p>
              <h1 className="h1" id="hero-h">We build <span className="hl">designers.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Not answers. From confused to confident, with mentors who walked the same path.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Mentors from</span><b>IIT · NID · NIFT</b></li>
              <li><span>In live batches</span><b>1,500+ students</b></li>
              <li><span>Free community</span><b>10,000+ members</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="approach" data-dot="Approach" aria-labelledby="ap-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Our approach</p>
            <h2 className="h2 rv" id="ap-h">Think, get feedback, practise. Repeat.</h2>
          </div>
          <ul className="pillars">
            <li className="pillar rv"><span className="pillar-n">01</span><h3>Learn to think</h3><p>Structured prep for tricky questions, not memorised answers.</p></li>
            <li className="pillar y rv" style={{"--i": "1"} as CSSProperties}><span className="pillar-n">02</span><h3>Mentors on call</h3><p>1:1 feedback on your sheets and exam strategy from top rankers.</p></li>
            <li className="pillar d rv" style={{"--i": "2"} as CSSProperties}><span className="pillar-n">03</span><h3>Practice that counts</h3><p>Daily assignments and mocks at real exam level.</p></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="inside" data-dot="Inside Divergent" aria-labelledby="in-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>What you get</p>
            <h2 className="h2 rv" id="in-h">Batches, mocks and a crew.</h2>
          </div>
          <ul className="bento">
            <li className="bt bt--wide rv"><img src="/assets/img/about/workshop.webp" alt="A Divergent design workshop" width="1100" height="610" loading="lazy" /><span>Design workshops</span></li>
            <li className="bt rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/about/batch.webp" alt="Students and mentors in a batch session" width="900" height="506" loading="lazy" /><span>Batch moments</span></li>
            <li className="bt rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/work/work-06.webp" alt="A student's sketch" width="900" height="594" loading="lazy" /><span>Student work</span></li>
            <li className="bt rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/about/whatsapp.webp" alt="Divergent WhatsApp group" width="700" height="457" loading="lazy" /><span>WhatsApp groups</span></li>
            <li className="bt rv" style={{"--i": "4"} as CSSProperties}><img src="/assets/img/about/air51-podcast.webp" alt="Podcast with an IIT Guwahati student, UCEED AIR 51" width="700" height="394" loading="lazy" /><span>Topper talks</span></li>
          </ul>
        </div>
      </section>

      <section className="men-wrap section" id="mentors" data-dot="Mentors" aria-labelledby="men-h" style={{"paddingBlock": "clamp(56px,6vw,88px) 0"} as CSSProperties}>
        <div className="stage-m on-dark">
          <div className="wrap">
            <div className="men-head">
              <div>
                <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Mentors</p>
                <h2 className="h2 rv" id="men-h">Meet your mentors.</h2>
              </div>
            </div>
            <h3 className="men-k">UCEED · from IIT and IIIT</h3>
            <ul className="pmentors">
              <li className="pm rv"><img src="/assets/img/mentors/aanik.webp" alt="Aanik Sirothiya" width="478" height="597" loading="lazy" /><b>Aanik Sirothiya</b><span>IIT Delhi · UCEED AIR 17</span></li>
              <li className="pm rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/shardul.webp" alt="Shardul Deogade" width="388" height="485" loading="lazy" /><b>Shardul Deogade</b><span>IIT Delhi · UCEED AIR 101</span></li>
              <li className="pm rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/anushka.webp" alt="Anushka Kumar" width="288" height="360" loading="lazy" /><b>Anushka Kumar</b><span>IIT Delhi</span></li>
              <li className="pm rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/mentors/krishang.webp" alt="Krishang Vardhan Narain" width="226" height="282" loading="lazy" /><b>Krishang Vardhan Narain</b><span>IIT Delhi</span></li>
              <li className="pm rv"><img src="/assets/img/mentors/megha.webp" alt="Megha" width="268" height="335" loading="lazy" /><b>Megha</b><span>IIT Bombay</span></li>
              <li className="pm rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/vidyuth.webp" alt="Vidyuth" width="336" height="420" loading="lazy" /><b>Vidyuth</b><span>IIT Guwahati</span></li>
              <li className="pm rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/atulya.webp" alt="Atulya Srivastava" width="326" height="407" loading="lazy" /><b>Atulya Srivastava</b><span>IIIT Jabalpur · UCEED AIR 128</span></li>
              <li className="pm rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/mentors/ayushri.webp" alt="Ayushri Ghope" width="552" height="690" loading="lazy" /><b>Ayushri Ghope</b><span>IIIT Jabalpur · Rank 31</span></li>
              <li className="pm rv"><img src="/assets/img/mentors/kavya.webp" alt="Kavya Sahu" width="320" height="400" loading="lazy" /><b>Kavya Sahu</b><span>UCEED AIR 114 · CAT Rank 20</span></li>
            </ul>
            <h3 className="men-k n">NID · from NID campuses</h3>
            <ul className="pmentors">
              <li className="pm n rv"><img src="/assets/img/mentors/atharva.webp" alt="Atharva Lotake" width="480" height="595" loading="lazy" /><b>Atharva Lotake</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/anshika.webp" alt="Anshika Vijay" width="343" height="449" loading="lazy" /><b>Anshika Vijay</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/adarshdeep.webp" alt="Adarshdeep Kaur" width="506" height="632" loading="lazy" /><b>Adarshdeep Kaur</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/mentors/kratika.webp" alt="Kratika" width="333" height="416" loading="lazy" /><b>Kratika</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv"><img src="/assets/img/mentors/piyush.webp" alt="Piyush" width="406" height="507" loading="lazy" /><b>Piyush</b><span>NID Ahmedabad</span></li>
              <li className="pm n rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/ujjwal.webp" alt="Ujjwal Rathore" width="308" height="399" loading="lazy" /><b>Ujjwal Rathore</b><span>NID Bhopal</span></li>
              <li className="pm n rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/kankana.webp" alt="Kankana" width="411" height="514" loading="lazy" /><b>Kankana</b><span>NID Assam</span></li>
              <li className="pm n rv" style={{"--i": "3"} as CSSProperties}><img src="/assets/img/mentors/priyam.webp" alt="Priyam Biswas" width="430" height="537" loading="lazy" /><b>Priyam Biswas</b><span>NID Assam</span></li>
              <li className="pm n rv"><img src="/assets/img/mentors/shivansh.webp" alt="Shivansh Gupta" width="474" height="592" loading="lazy" /><b>Shivansh Gupta</b><span>NID Haryana · AIR 234</span></li>
              <li className="pm n rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/daksh.webp" alt="Daksh Meena" width="364" height="455" loading="lazy" /><b>Daksh Meena</b><span>NID Haryana</span></li>
            </ul>
            <h3 className="men-k f">NIFT · from NIFT</h3>
            <ul className="pmentors">
              <li className="pm f rv"><img src="/assets/img/mentors/om.webp" alt="Om Mishra" width="480" height="600" loading="lazy" /><b>Om Mishra</b><span>NIFT Delhi</span></li>
              <li className="pm f rv" style={{"--i": "1"} as CSSProperties}><img src="/assets/img/mentors/kalyani.webp" alt="Kalyani Pisal" width="394" height="492" loading="lazy" /><b>Kalyani Pisal</b><span>NIFT Mumbai · AIR 9</span></li>
              <li className="pm f rv" style={{"--i": "2"} as CSSProperties}><img src="/assets/img/mentors/mihika.webp" alt="Mihika Manudhane" width="449" height="561" loading="lazy" /><b>Mihika Manudhane</b><span>NIFT Mumbai · AIR 33</span></li>
            </ul>
            <p className="men-cta"><a className="btn" href="/#book">Talk to a mentor <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a></p>
          </div>
        </div>
      </section>

      <section className="section" id="promise" data-dot="Our promise" aria-labelledby="pr-h">
        <div className="wrap promise">
          <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Your effort, our mentorship</p>
          <h2 className="h2 rv" id="pr-h">Show up, and you'll <span className="hb">level up.</span></h2>
          <p className="lede rv" style={{"--i": "1"} as CSSProperties}>We don't just coach. We mentor, guide and push you the way toppers prepare.</p>
          <div className="acts">
            <a className="btn" href="/courses/">Explore courses <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
            <a className="btn btn--ghost" href="/results/">See results</a>
          </div>
        </div>
      </section>
    </>
  );
}
