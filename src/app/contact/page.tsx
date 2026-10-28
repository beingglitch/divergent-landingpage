import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Contact us | Divergent Classes",
  description: "Questions about batches, mocks or admissions? Call, WhatsApp or email the Divergent team, or book a free counselling call.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Contact us</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>We reply fast</span></p>
              <h1 className="h1" id="hero-h">Talk to <span className="hl">us.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Batches, mocks or admissions. Ask anything.</p>
            </div>
          </div>
          <div className="reach-shell">
            <ul className="reach reach--4">
              <li><a className="reach-c" href="/#book"><span className="reach-i"><svg width="24" height="24" aria-hidden="true"><use href="#i-cal" /></svg></span><b>Book a free call</b><span>10 minutes with a counsellor</span></a></li>
              <li><a className="reach-c" href="https://wa.me/918383056332?text=Hi%2C%20I%20would%20like%20to%20talk%20to%20a%20counsellor" target="_blank" rel="noopener"><span className="reach-i"><svg width="24" height="24" aria-hidden="true"><use href="#i-chat" /></svg></span><b>WhatsApp</b><span>+91 83830 56332</span></a></li>
              <li><a className="reach-c" href="tel:+918368033468"><span className="reach-i"><svg width="24" height="24" aria-hidden="true"><use href="#i-phone" /></svg></span><b>Call</b><span>+91 83680 33468</span></a></li>
              <li><a className="reach-c" href="mailto:support@divergentclasses.com"><span className="reach-i"><svg width="24" height="24" aria-hidden="true"><use href="#i-mail" /></svg></span><b>Email</b><span>support@divergentclasses.com</span></a></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="quick" data-dot="Quick answers" aria-labelledby="qa-h">
        <div className="wrap faq-grid">
          <div className="faq-side"><div className="stick">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Before you call</p>
            <h2 className="h2 rv" id="qa-h">Quick <span className="hb">answers.</span></h2>
          </div></div>
          <div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Who can join?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Class 11, Class 12 and droppers. <a href="/courses/">See courses by stage</a>.</p></div></div></div></div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Are classes live or recorded?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Both. Live classes are recorded, and Recorded plans exist too.</p></div></div></div></div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Is Part B (drawing) covered?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes, with sketch reviews from mentors.</p></div></div></div></div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">How are mocks conducted?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Online, in the real exam pattern, with analysis after.</p></div></div></div></div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Can I catch up if I join late?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>Yes. Every class so far is waiting as a recording.</p></div></div></div></div>
            <div className="faq"><h4><button className="faq-q" type="button" aria-expanded="false">Do I get one-on-one mentorship?<span className="ic" aria-hidden="true"></span></button></h4><div className="faq-a"><div className="clip"><div className="in"><p>On the Mentor plan, every week. <a href="/#plans">Compare plans</a>.</p></div></div></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
