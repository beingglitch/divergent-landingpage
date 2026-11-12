import type { Metadata } from "next";
import { CourseCards } from "@/components/CourseCards";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Courses | Divergent Classes",
  description: "The 120 day crash course, NOVA for Class 11, and full mocks for UCEED, NID and NIFT.",
  path: "/courses/",
});

export default function CoursesPage() {
  return (
    <>
      <section className="hero phero" id="top" data-dot="Top" aria-labelledby="hero-h">
        <div className="stage">
          <div className="arc">
            <div className="wrap">
              <p className="pills"><span className="pill">Courses</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>UCEED · NID · NIFT</span></p>
              <h1 className="h1" id="hero-h">Find your <span className="hl">course.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">Crash course, Class 11 foundation or mocks. Pick your stage.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Class 11</span><b>NOVA foundation</b></li>
              <li><span>Class 12 and droppers</span><b>120 day crash course</b></li>
              <li><span>Everyone</span><b>Full mocks</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="all" data-dot="Courses" aria-labelledby="all-h">
        <div className="wrap">
          <h2 className="sr-only" id="all-h">All courses</h2>
          <ul className="ccards">
            <CourseCards />
          </ul>
        </div>
      </section>

      <section className="enrol-wrap" id="help" data-dot="Help" aria-labelledby="help-h">
        <div className="stage-e">
          <div className="arc">
            <div className="wrap">
              <h2 className="h2" id="help-h">Not sure which one?</h2>
              <p className="lede">Tell a counsellor your class and target. Free, 10 minutes.</p>
              <div className="acts">
                <a className="btn btn--dark" href="/#book">Book a free call <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
                <a className="btn btn--light" href="https://wa.me/918383056332?text=Hi%2C%20I%20need%20help%20choosing%20a%20course" target="_blank" rel="noopener">WhatsApp us</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
