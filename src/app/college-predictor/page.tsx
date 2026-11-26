import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollegePredictor } from "@/components/CollegePredictor";
import { PREDICTOR_SAMPLE, collegeCount } from "@/lib/predictor";
import "./predictor.css";

/* The college predictor: type a rank, see the IITs, NIDs and NIFTs it can
   reach (components/CollegePredictor). The closing ranks live in
   lib/predictor; while they are sample numbers (PREDICTOR_SAMPLE) the page
   stays out of search and is not linked from the home page. */
export const metadata: Metadata = {
  ...pageMeta({
    title: "College Predictor for UCEED, NID and NIFT | Divergent Classes",
    description: "Type your UCEED, NID or NIFT rank and category to see which IITs, NIDs and NIFTs are likely, borderline or a reach, from last year’s closing ranks.",
    path: "/college-predictor/",
  }),
  ...(PREDICTOR_SAMPLE ? { robots: { index: false, follow: true } } : {}),
};

export default function CollegePredictorPage() {
  const facts = [
    { n: collegeCount("UCEED"), label: "UCEED" },
    { n: collegeCount("NID"), label: "NID" },
    { n: collegeCount("NIFT"), label: "NIFT" },
  ];
  return (
    <div className="cp">
      <CollegePredictor
        intro={
          <>
            <p className="pills">
              <span className="pill">UCEED · NID · NIFT</span>
              <span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>Free tool</span>
            </p>
            <h1 className="h1" id="hero-h">Where can your rank <span className="hl">take you?<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
            <p className="hero-sub">Type your rank. See the IITs, NIDs and NIFTs in reach.</p>
            <ul className="cp-facts" aria-label="Colleges covered">
              {facts.map((f) => <li key={f.label}><b>{f.n}</b>{f.label} colleges</li>)}
            </ul>
          </>
        }
      />
    </div>
  );
}
