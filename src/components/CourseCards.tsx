import { fromPrice } from "@/lib/config";
import { getCourses, isMainCourse, type SiteCourse } from "@/lib/courses";

/* The course cards, exactly the courses the app shows on its own course
   list (LMS admin, Content > Courses) with "Show on divergentclasses.com"
   on, in that list's order. A card is the course's thumbnail, title,
   subtitle and price. The 75-day course sells through the plans on the
   home page; a course sold elsewhere opens its link in a new tab. */

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function CourseCard({ c }: { c: SiteCourse }) {
  const main = isMainCourse(c);
  const href = main ? "/#plans" : c.href;
  const ext = !main && c.external ? { target: "_blank", rel: "noopener" } : {};
  const free = c.price === 0 && !c.priceFrom;
  return (
    <li className={"ccard" + (main ? " ccard--feat" : "")} data-exams={c.exams.join(" ")}>
      <a className={"ccard-art" + (c.thumbnail ? " ccard-art--img" : "")} href={href} {...ext} tabIndex={-1} aria-hidden="true">
        {c.thumbnail ? (
          <img src={c.thumbnail} alt="" width="640" height="360" loading="lazy" />
        ) : main ? (
          <>
            <b>75</b>
            <span>days to UCEED and NID</span>
          </>
        ) : null}
      </a>
      <div className="ccard-b">
        <h3>
          <a href={href} {...ext}>{c.title}</a>
        </h3>
        {c.subtitle ? <p className="ccard-m">{c.subtitle}</p> : null}
        <div className="ccard-f">
          <p className="ccard-p">
            {main ? (
              /* The 75-day price follows the date; site.ts keeps it current. */
              <b data-crash-from="">From {inr(fromPrice(new Date()))}</b>
            ) : (
              <b>{free ? "Free" : (c.priceFrom ? "From " : "") + inr(c.price)}</b>
            )}
            {!main && c.originalPrice ? <s>{inr(c.originalPrice)}</s> : null}
          </p>
          <a className="btn btn--sm" href={href} {...ext}>{main ? "See plans" : free ? "Enrol free" : c.external ? "See courses" : "Buy now"}</a>
        </div>
      </div>
    </li>
  );
}

export async function CourseCards() {
  const courses = await getCourses().catch(() => [] as SiteCourse[]);
  return (
    <>
      {courses.map((c) => (
        <CourseCard key={c.slug} c={c} />
      ))}
    </>
  );
}
