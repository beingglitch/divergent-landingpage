import courses from "@/data/courses.json";

type Course = {
  slug: string;
  title: string;
  sub?: string;
  exams: string[];
  type: string;
  meta: string;
  price: string;
  mrp?: string;
  img?: string;
  cta?: string;
  href: string;
  featured?: boolean;
};

const EXAM_NAMES: Record<string, string> = { uceed: "UCEED", nid: "NID", nift: "NIFT" };
const TYPE_NAMES: Record<string, string> = { crash: "Crash course", nova: "Class 11", mocks: "Mocks", self: "Self-learning", free: "Free" };
const ALL = courses as Course[];

function rupees(text: string | undefined): number {
  const digits = (text || "").replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function CourseCard({ c }: { c: Course }) {
  const ext = c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {};
  const off = c.mrp ? Math.round(100 - (rupees(c.price) * 100) / rupees(c.mrp)) : 0;
  return (
    <li className={"ccard" + (c.featured ? " ccard--feat" : "")} data-exams={c.exams.join(" ")} data-type={c.type}>
      <a className="ccard-art" href={c.href} {...ext} tabIndex={-1} aria-hidden="true">
        {c.img === "" ? (
          <>
            <b>75</b>
            <span>days to UCEED and NID</span>
          </>
        ) : (
          <img src={`/assets/img/courses/${c.slug}.webp`} alt="" width="640" height="360" loading="lazy" />
        )}
      </a>
      <div className="ccard-b">
        <p className="ccard-k">
          <span>{TYPE_NAMES[c.type]}</span>
          {c.exams.map((e) => EXAM_NAMES[e]).join(" · ")}
        </p>
        <h3>
          <a href={c.href} {...ext}>{c.title}</a>
        </h3>
        {c.sub ? <p className="ccard-s">{c.sub}</p> : null}
        <p className="ccard-m">{c.meta}</p>
        <div className="ccard-f">
          <p className="ccard-p">
            {/* The 75-day price follows the date; site.ts fills it in. */}
            <b data-crash-from={c.slug === "crash-75" ? "" : undefined}>{c.price}</b>
            {c.mrp ? (
              <>
                <s>{c.mrp}</s>
                <span className="off">{off}% off</span>
              </>
            ) : null}
          </p>
          <a className="btn btn--sm" href={c.href} {...ext}>{c.cta || "Buy now"}</a>
        </div>
      </div>
    </li>
  );
}

/* Course cards from src/data/courses.json. Pass only to pick some, in order. */
export function CourseCards({ only }: { only?: string[] }) {
  const bySlug = new Map(ALL.map((c) => [c.slug, c]));
  const picked = only ? only.map((s) => bySlug.get(s)).filter((c): c is Course => !!c) : ALL;
  return (
    <>
      {picked.map((c) => (
        <CourseCard key={c.slug} c={c} />
      ))}
    </>
  );
}
