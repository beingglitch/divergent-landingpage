import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { InterestForm } from "@/components/InterestForm";

/* The NIFT 2027 interest form: one screen, the site's split hero with the
   form in it (components/InterestForm). A sign-up lands in the app's Leads
   list as exam NIFT, plan "NIFT 2027 (course)", source nift-interest, with
   the page and the visitor's UTM tags. */
export const metadata: Metadata = pageMeta({
  title: "NIFT 2027: get first access to our NIFT program | Divergent Classes",
  description: "Preparing for NIFT 2027? Leave your number and get the plan, dates and fee of our NIFT program on WhatsApp before anyone else.",
  path: "/nift-interest/",
});

/* NIFT 2026 ranks from our students (as on /results/). */
const FACES = [
  { src: "/assets/img/toppers/kalyani-nift-9.webp", name: "Kalyani" },
  { src: "/assets/img/toppers/navya-nift-7.webp", name: "Navya" },
  { src: "/assets/img/toppers/manya-nift-14.webp", name: "Manya" },
];

const POINTS = ["GAT, CAT and the Situation Test", "Mentors from NIFT", "AIDMT NIFT mocks with an All India Rank"];

export default function NiftInterestPage() {
  return (
    <div className="nf">
      <section className="hero phero hero--split am-hero nf-hero" id="top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <p className="pills"><span className="pill">B.Des · B.FTech</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>NIFT 2027</span></p>
                <h1 className="h1" id="hero-h">NIFT 2027 starts here. <span className="hl">Be first in line.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
                <p className="hero-sub">Our NIFT program opens soon. Leave your number and we’ll WhatsApp you the plan, the dates and the fee before anyone else.</p>
                <ul className="nf-points">{POINTS.map((p) => <li key={p}><span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#tick" /></svg></span>{p}</li>)}</ul>
                <p className="am-proof">
                  <span className="am-proof-faces" aria-hidden="true">{FACES.map((f) => <img key={f.name} src={f.src} alt="" width="36" height="36" />)}</span>
                  <span>From the team behind NIFT 2026 AIR 9, and AIR 7 and 14 in category</span>
                </p>
              </div>
              <div className="hero-media">
                <InterestForm
                  exam="NIFT"
                  plan="NIFT 2027"
                  source="nift-interest"
                  title="Get first access"
                  sub="Takes 20 seconds. No payment."
                  submit="Get early access"
                  done="We’ll WhatsApp you the NIFT plan, dates and fee first."
                  choice={{ label: "Course", options: ["B.Des", "B.FTech", "Not sure yet"] }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
