import type { Metadata } from "next";
import { CourseCards } from "@/components/CourseCards";
import { CoursesFilter } from "@/components/CoursesFilter";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Courses | Divergent Classes",
  description: "Crash courses, Class 11 batches, mocks and free trials for UCEED, NID and NIFT.",
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
              <p className="hero-sub">Batches, mocks and free trials. Pick your exam and your stage.</p>
            </div>
          </div>
          <div className="wrap hero-low">
            <ul className="hfacts">
              <li><span>Class 11</span><b>NOVA foundation</b></li>
              <li><span>Class 12 and droppers</span><b>Crash courses</b></li>
              <li><span>Everyone</span><b>Full mocks · free trials</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="all" data-dot="Courses" aria-labelledby="all-h">
        <div className="wrap">
          <h2 className="sr-only" id="all-h">All courses</h2>
          <div className="filters" role="group" aria-label="Filter courses">
            <div className="fgroup"><span className="fk">Exam</span>
              <div className="chips-f" data-filter="exam">
                <button type="button" className="chip-f" aria-pressed="true" data-value="all">All</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="uceed">UCEED</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="nid">NID</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="nift">NIFT</button>
              </div>
            </div>
            <div className="fgroup"><span className="fk">Type</span>
              <div className="chips-f" data-filter="type">
                <button type="button" className="chip-f" aria-pressed="true" data-value="all">All</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="crash">Crash courses</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="nova">Class 11</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="mocks">Mocks</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="self">Self-learning</button>
                <button type="button" className="chip-f" aria-pressed="false" data-value="free">Free</button>
              </div>
            </div>
            <p className="fcount" id="fcount" aria-live="polite"></p>
          </div>
          <ul className="ccards" id="courseList">
      <CourseCards />
          </ul>
          <div className="fempty" id="fempty" hidden>
            <p>No course matches that yet.</p>
            <button type="button" className="btn btn--ghost btn--sm" id="freset">Show all courses</button>
          </div>
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
      <CoursesFilter />
    </>
  );
}
