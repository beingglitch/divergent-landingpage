import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Community | Divergent Classes",
  description: "Join 10,000+ design aspirants in the Divergent community on WhatsApp, Telegram, Instagram, Discord and more. Free resources and roadmaps.",
  path: "/community/",
});

export default function CommunityPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Community</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Free to join</span></p>
              <h1 className="h1" id="hero-h">Be <span className="hl">Divergent.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">10,000+ design aspirants. Daily practice, free resources and answers.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <div className="hero-ctas">
              <a className="btn" href="https://chat.whatsapp.com/KcvlrgUzdIcIw6hUYjELGX" target="_blank" rel="noopener">Join on WhatsApp <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
              <a className="btn btn--ghost" href="https://t.me/divergent_classes" target="_blank" rel="noopener">Join on Telegram</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="join" data-dot="Join" aria-labelledby="join-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Find us</p>
            <h2 className="h2 rv" id="join-h">Pick your platform.</h2>
          </div>
          <ul className="socials">
            <li className="rv"><a className="soc" href="https://chat.whatsapp.com/KcvlrgUzdIcIw6hUYjELGX" target="_blank" rel="noopener"><span className="soc-i wa"><svg width="24" height="24" aria-hidden="true"><use href="#i-chat" /></svg></span><b>WhatsApp</b><span>Divergent Classes</span></a></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><a className="soc" href="https://t.me/divergent_classes" target="_blank" rel="noopener"><span className="soc-i tg"><svg width="24" height="24" aria-hidden="true"><use href="#i-send" /></svg></span><b>Telegram</b><span>@divergent_classes</span></a></li>
            <li className="rv" style={{"--i": "2"} as CSSProperties}><a className="soc" href="https://www.instagram.com/divergent.classes/" target="_blank" rel="noopener"><span className="soc-i ig"><svg width="24" height="24" aria-hidden="true"><use href="#i-camera" /></svg></span><b>Instagram</b><span>@divergent.classes</span></a></li>
            <li className="rv" style={{"--i": "3"} as CSSProperties}><a className="soc" href="https://discord.com/channels/1227162893414432829/1227355644911157269" target="_blank" rel="noopener"><span className="soc-i dc"><svg width="24" height="24" aria-hidden="true"><use href="#i-game" /></svg></span><b>Discord</b><span>Premium community</span></a></li>
            <li className="rv"><a className="soc" href="https://www.reddit.com/r/divergent_classes_/" target="_blank" rel="noopener"><span className="soc-i rd"><svg width="24" height="24" aria-hidden="true"><use href="#i-people" /></svg></span><b>Reddit</b><span>r/divergent_classes_</span></a></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><a className="soc" href="https://in.pinterest.com/Divergent_Classes/" target="_blank" rel="noopener"><span className="soc-i pn"><svg width="24" height="24" aria-hidden="true"><use href="#i-pin" /></svg></span><b>Pinterest</b><span>@Divergent_Classes</span></a></li>
            <li className="rv" style={{"--i": "2"} as CSSProperties}><a className="soc" href="https://chat.whatsapp.com/BQsWjR04mc66Zc2PL55vbn" target="_blank" rel="noopener"><span className="soc-i wa"><svg width="24" height="24" aria-hidden="true"><use href="#i-people" /></svg></span><b>Class 11 group</b><span>Design Cuties on WhatsApp</span></a></li>
            <li className="rv" style={{"--i": "3"} as CSSProperties}><a className="soc" href="https://www.linkedin.com/company/divergent-classes/" target="_blank" rel="noopener"><span className="soc-i li"><svg width="24" height="24" aria-hidden="true"><use href="#i-in" /></svg></span><b>LinkedIn</b><span>Divergent Classes</span></a></li>
          </ul>
        </div>
      </section>

      <section className="section tint" id="free" data-dot="Free stuff" aria-labelledby="free-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Free resources</p>
            <h2 className="h2 rv" id="free-h">Start without paying.</h2>
          </div>
          <ul className="rlinks">
            <li className="rv"><a className="rlink" href="https://roadmap.divergentclasses.com/" target="_blank" rel="noopener"><span className="rl-k">Roadmap</span><b>UCEED Roadmap 2027</b><span>Curated by top IITians</span><svg className="rl-a" width="18" height="18" aria-hidden="true"><use href="#arrow" /></svg></a></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><a className="rlink" href="https://t.me/divergent_classes/715" target="_blank" rel="noopener"><span className="rl-k">Notes</span><b>Free study resources</b><span>On our Telegram</span><svg className="rl-a" width="18" height="18" aria-hidden="true"><use href="#arrow" /></svg></a></li>
            <li className="rv" style={{"--i": "2"} as CSSProperties}><a className="rlink" href="/courses/?type=free"><span className="rl-k">Courses</span><b>Free trials and past papers</b><span>Enrol free, start today</span><svg className="rl-a" width="18" height="18" aria-hidden="true"><use href="#arrow" /></svg></a></li>
            <li className="rv" style={{"--i": "3"} as CSSProperties}><a className="rlink" href="https://waitlist.divergentclasses.com/" target="_blank" rel="noopener"><span className="rl-k">Coming soon</span><b>Join the waitlist</b><span>Be first to know</span><svg className="rl-a" width="18" height="18" aria-hidden="true"><use href="#arrow" /></svg></a></li>
          </ul>
        </div>
      </section>

      <section className="section" id="watch" data-dot="Watch" aria-labelledby="watch-h">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow-l"><svg className="dots6" viewBox="0 0 14 21" aria-hidden="true"><circle className="b" cx="3.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "0"} as CSSProperties} cx="10.5" cy="3.5" r="3" /><circle className="y" style={{"--k": "1"} as CSSProperties} cx="3.5" cy="10.5" r="3" /><circle className="b" cx="10.5" cy="10.5" r="3" /><circle className="b" cx="3.5" cy="17.5" r="3" /><circle className="y" style={{"--k": "2"} as CSSProperties} cx="10.5" cy="17.5" r="3" /></svg>Watch</p>
            <h2 className="h2 rv" id="watch-h">From our channel.</h2>
          </div>
          <ul className="watch">
            <li className="rv"><a className="wcard" href="https://youtu.be/svKZMz3j65k" target="_blank" rel="noopener"><span className="wthumb"><img src="/assets/img/about/air51-podcast.webp" alt="" width="700" height="394" loading="lazy" /><span className="wplay" aria-hidden="true"><svg width="22" height="22"><use href="#play" /></svg></span></span><b>From Class 12 boards to UCEED topper</b><span>Divergent Classes Special</span></a></li>
            <li className="rv" style={{"--i": "1"} as CSSProperties}><a className="wcard" href="https://youtu.be/BpwPmF1PxmA" target="_blank" rel="noopener"><span className="wthumb"><img src="/assets/img/about/podcast.webp" alt="" width="700" height="394" loading="lazy" /><span className="wplay" aria-hidden="true"><svg width="22" height="22"><use href="#play" /></svg></span></span><b>From thinking it, to canvas</b><span>20 minutes on the creative process</span></a></li>
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="talk" data-dot="Talk to us" aria-labelledby="talk-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="talk-h">Want a plan, not just a group?</h2>
              <p className="lede">Book a free call. We'll map your next 75 days.</p>
              <div className="acts">
                <a className="btn btn--dark" href="/#book">Book a free call <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
                <a className="btn btn--light" href="/#plans">See the crash course</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
