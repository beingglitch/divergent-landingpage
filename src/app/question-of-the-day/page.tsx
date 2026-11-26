import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { QuestionOfTheDay } from "@/components/QuestionOfTheDay";

/* One aptitude question a day, free, from the AIDMT question set
   (components/QuestionOfTheDay). Linked from the home page's free tools. */
export const metadata: Metadata = pageMeta({
  title: "Question of the day for UCEED, NID and NIFT | Divergent Classes",
  description: "One design aptitude question every day, for UCEED, NID and NIFT. Answer in 60 seconds and see how everyone else answered.",
  path: "/question-of-the-day/",
});

export const revalidate = 60;

export default function QuestionOfTheDayPage() {
  return (
    <section className="hero hero--split am-hero qd-hero" id="top" aria-labelledby="hero-h">
      <div className="stage">
        <div className="arc">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="pills"><span className="pill">Free</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>New every day</span></p>
              <h1 className="h1" id="hero-h">One question. <span className="hl">Every day.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">The kind UCEED, NID and NIFT ask. 60 seconds, one try, then see how everyone else did.</p>
            </div>
            <div className="hero-media">
              <QuestionOfTheDay builtAt={Date.now()} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
