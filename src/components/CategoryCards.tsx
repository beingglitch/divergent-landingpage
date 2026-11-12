import { fromPrice } from "@/lib/config";
import { FESTIVAL_PRICES, courseType, getCourses, isMainCourse, type SiteCourse } from "@/lib/courses";

/* The 75-day course, sold through the plans on the home page, then the
   three course groups, each opening its category on Learnyst, where
   every course in the group is listed and sold. The cheapest price comes
   from the app's course feed (src/lib/courses.ts); without it the card
   simply shows no price. */
const LEARNYST = "https://courses.divergentclasses.com/learn/categories";

type Category = {
  key: string;
  kicker: string;
  title: string;
  line: string;
  art: [string, string];
  href: string;
  /* Which of the app's courses belong here, for the "From" price. */
  has: (c: SiteCourse) => boolean;
};

const CATEGORIES: Category[] = [
  {
    key: "crash",
    kicker: "Crash course",
    title: "120 Day Crash Course",
    line: "Class 12 and droppers. Live classes, mocks and feedback for UCEED, NID and NIFT.",
    art: ["120", "days to your exam"],
    href: `${LEARNYST}/120-crash-course`,
    has: (c) => !isMainCourse(c) && courseType(c) === "crash" && /120/.test(`${c.slug} ${c.title}`),
  },
  {
    key: "nova",
    kicker: "Class 11",
    title: "NOVA",
    line: "Two-year foundation for Class 11, for UCEED, NID and NIFT.",
    art: ["NOVA", "Class 11 foundation"],
    href: `${LEARNYST}/nova`,
    has: (c) => courseType(c) === "nova",
  },
  {
    key: "mocks",
    kicker: "Mocks",
    title: "Mock tests",
    line: "Full-length mocks for UCEED, NID and NIFT, with ranks and solutions.",
    art: ["Mocks", "full-length tests"],
    href: `${LEARNYST}/mocks`,
    has: (c) => courseType(c) === "mocks",
  },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const cheapest = (prices: number[]) => (prices.length ? Math.min(...prices) : null);

export async function CategoryCards() {
  const courses = await getCourses().catch(() => [] as SiteCourse[]);
  return (
    <>
      <li className="ccard ccard--feat" data-type="crash">
        <a className="ccard-art" href="/#plans" tabIndex={-1} aria-hidden="true">
          <b>75</b>
          <span>days to UCEED and NID</span>
        </a>
        <div className="ccard-b">
          <p className="ccard-k"><span>Crash course</span>UCEED · NID</p>
          <h3><a href="/#plans">75 Day Crash Course</a></h3>
          <p className="ccard-m">Class 12 and droppers. Live classes from 3 November, mocks and weekly feedback.</p>
          <div className="ccard-f">
            {/* The 75-day price follows the date; site.ts keeps it current. */}
            <p className="ccard-p"><b data-crash-from="">From {inr(fromPrice(new Date()))}</b></p>
            <a className="btn btn--sm" href="/#plans">See plans</a>
          </div>
        </div>
      </li>
      {CATEGORIES.map((cat) => {
        const inGroup = courses.filter((c) => cat.has(c) && c.price > 0);
        const from = cheapest(inGroup.map((c) => c.price));
        const festival = cheapest(inGroup.map((c) => Math.min(c.price, FESTIVAL_PRICES[c.slug]?.price ?? c.price)));
        const sale = from !== null && festival !== null && festival < from;
        return (
          <li key={cat.key} className="ccard ccard--cat" data-type={cat.key}>
            <a className="ccard-art" href={cat.href} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
              <b>{cat.art[0]}</b>
              <span>{cat.art[1]}</span>
            </a>
            <div className="ccard-b">
              <p className="ccard-k"><span>{cat.kicker}</span>UCEED · NID · NIFT</p>
              <h3><a href={cat.href} target="_blank" rel="noopener">{cat.title}</a></h3>
              <p className="ccard-m">{cat.line}</p>
              <div className="ccard-f">
                {sale ? <p className="ccard-p dw-only"><b>From {inr(festival!)}</b><s>{inr(from!)}</s></p> : null}
                {from !== null ? <p className={"ccard-p" + (sale ? " dw-hide" : "")}><b>From {inr(from)}</b></p> : <span />}
                <a className="btn btn--sm" href={cat.href} target="_blank" rel="noopener">See courses</a>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}
