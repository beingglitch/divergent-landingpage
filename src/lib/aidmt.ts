/* AIDMT, the All India Design Mock Test, as /aidmt/ and the home page strip
   show it. Everything comes from the LMS admin AIDMT tab (page text, prices,
   and the sittings with their dates) through /api/public/aidmt, picked up
   within a minute of a save. If the LMS cannot be reached, FALLBACK below is
   shown, so the page always renders. Until the LMS has a dated sitting that
   is still to close, FALLBACK's dates are shown with the LMS text.

   Dates here are IST wall clock ("2026-11-15T09:00:00"), read with ist(). */
import { APP_URL, ist } from "@/lib/config";
import { SITE_URL } from "@/lib/meta";

export type AidmtSitting = {
  key: string;
  /* "AIDMT 1", or "Free sectional". */
  name: string;
  /* The exam the paper is set like (NID, UCEED, NIFT). Empty for none. */
  exam: string;
  /* One line under the name. */
  detail: string;
  opens: string;
  closes: string;
  free: boolean;
  /* When and how solutions are walked through, e.g. "18 to 19 Nov, on a live meet". */
  solutions: string;
  /* Scorecards and ranks are out by the end of this day. */
  results: string | null;
  guide: { href: string; label: string } | null;
};

type Item = { title: string; body: string };
export type AidmtPart = { name: string; marks: number; note: string; topics: { name: string; detail: string }[]; footnote: string };

export type Aidmt = {
  hero: { pills: string[]; title: string; highlight: string; tagline: string; guideLabel: string; guideUrl: string };
  pricing: { wasPrice: number | null; perSitting: number; bundleSize: number; bundlePrice: number; extraPerSitting: number };
  /* Friends registered together for one price, when the offer is on. */
  group: { price: number; size: number } | null;
  registrationEnds: string | null;
  why: { heading: string; items: Item[] };
  pattern: { heading: string; intro: string; parts: AidmtPart[] };
  dates: { heading: string; note: string };
  steps: { heading: string; items: Item[] };
  rules: { heading: string; items: Item[] };
  madeBy: { heading: string; toppers: { name: string; exam: string; rank: string; photo: string }[] };
  faqs: { heading: string; items: { question: string; answer: string }[] };
  cta: { heading: string; lede: string };
  /* In date order. */
  series: AidmtSitting[];
  /* Where Register goes. */
  enrolUrl: string;
};

const ENROL_URL = `${APP_URL}/dashboard/aidmt`;

const topper = (name: string, exam: string, rank: string) => ({ name, exam, rank, photo: `/assets/img/toppers/${name.toLowerCase()}.webp` });

/* The page as it was before the LMS editor: shown when the LMS has nothing to give. */
export const FALLBACK: Aidmt = {
  hero: {
    pills: ["UCEED · CEED · NID · NIFT", "AIDMT 2027"],
    title: "All India",
    highlight: "Design Mock.",
    tagline: "Four national mocks, set like NID, UCEED and NIFT, plus a free sectional. Sit each one from home and see your All India Rank.",
    guideLabel: "New to AIDMT? Read the full guide",
    guideUrl: "/blog/aidmt-all-india-design-mock-test/",
  },
  pricing: { wasPrice: 499, perSitting: 99, bundleSize: 3, bundlePrice: 199, extraPerSitting: 89 },
  group: { price: 199, size: 3 },
  registrationEnds: null,
  why: {
    heading: "Know where you stand before exam day.",
    items: [
      { title: "Your All India Rank", body: "Sit the paper with students across India, on the same days, and see your rank and percentile." },
      { title: "Topic by topic", body: "Your accuracy in each of the 7 Part A topics, so you know what to fix first." },
      { title: "Guesswork, measured", body: "See how many marks negative marking cost you, and where you rushed." },
      { title: "What to practise next", body: "A short list of what to work on, based on the questions you got wrong." },
    ],
  },
  pattern: {
    heading: "Set like the real exam.",
    intro: "Each mock follows its exam. Here is AIDMT 2, the UCEED paper: two parts, 300 marks, 3 hours in one sitting.",
    parts: [
      {
        name: "Part A", marks: 200, note: "on computer",
        topics: [
          { name: "Visualisation", detail: "3D rotation, nets, isometric and orthographic views." },
          { name: "Science", detail: "Everyday physics, gears, levers and materials." },
          { name: "Observation", detail: "Visual detail, proportion and design sensitivity." },
          { name: "Environment", detail: "Environment and society." },
          { name: "Reasoning", detail: "Analytical and logical reasoning." },
          { name: "Language", detail: "Reading, grammar and communication." },
          { name: "Creativity", detail: "Lateral thinking and new ideas." },
        ],
        footnote: "MCQ, MSQ and numerical questions, as in UCEED.",
      },
      {
        name: "Part B", marks: 100, note: "drawing",
        topics: [
          { name: "Drawing", detail: "Perspective, proportion, the human figure, light and shade." },
          { name: "Design aptitude", detail: "Solve a design problem and explain it in a sketch." },
        ],
        footnote: "",
      },
    ],
  },
  dates: { heading: "Five dates, one series.", note: "Times in IST. ₹99 per mock, or any 3 for ₹199. The sectional is free." },
  steps: {
    heading: "Register to rank in four steps.",
    items: [
      { title: "Register", body: "Sign in with your mobile number and pick the mocks you want. Each mock takes registrations until its window closes." },
      { title: "Sit the mock", body: "Online, on a laptop or desktop, any time inside the mock's window. One attempt per mock." },
      { title: "Solutions and rank", body: "Scorecard, All India Rank, percentile and topic report, after each mock's solutions session." },
      { title: "Fix weak spots", body: "Practise the topics your report flags, then sit the next mock in the series." },
    ],
  },
  rules: {
    heading: "Read before you start.",
    items: [
      { title: "Pick your time", body: "Start any time inside a mock's window." },
      { title: "One attempt", body: "Each student sits each mock once, so the ranks stay fair." },
      { title: "Rank needs the window", body: "Only papers submitted inside the window get an All India Rank." },
      { title: "Laptop or desktop", body: "A recent browser and a steady connection. Phones are not supported." },
      { title: "Fair test", body: "Full screen, and switching windows is logged." },
    ],
  },
  madeBy: {
    heading: "Set by the team behind these ranks.",
    toppers: [topper("Ankit", "UCEED", "AIR 2"), topper("Priyanka", "UCEED", "AIR 4"), topper("Rudra", "UCEED", "AIR 8"), topper("Ameya", "UCEED", "AIR 10"), topper("Hiya", "UCEED", "AIR 30"), topper("Debashis", "NID", "AIR 52")],
  },
  faqs: {
    heading: "Asked, answered.",
    items: [
      { question: "What is AIDMT?", answer: "The All India Design Mock Test, run by Divergent Classes. AIDMT 2027 is a series of four national mocks, set like NID, UCEED and NIFT, each with a national rank, plus a free sectional." },
      { question: "Who can take it?", answer: "Anyone preparing for a design entrance: Class 11, Class 12 and droppers." },
      { question: "Can I take a mock again?", answer: "No. One attempt per student per mock, so the ranks stay fair and the questions stay private." },
      { question: "What does it cost?", answer: "₹99 a mock, or any 3 for ₹199. That covers marking, your rank, percentile and topic report. The sectional is free." },
      { question: "Is it linked to IIT Bombay, NID or NIFT?", answer: "No. AIDMT is an independent mock by Divergent Classes. It is practice, not an admission test." },
    ],
  },
  cta: { heading: "Register now and see where you stand.", lede: "₹99 a mock, with your rank, percentile and topic report, or any 3 for ₹199. Each mock takes registrations until its window closes." },
  series: [
    { key: "sectional", name: "Free sectional", exam: "", detail: "Part B only (drawing and design), free for everyone", opens: "2026-11-08T09:00:00", closes: "2026-11-11T23:59:59", free: true, solutions: "", results: null, guide: null },
    { key: "aidmt-1", name: "AIDMT 1", exam: "NID", detail: "NID full-length mock, ranked across India", opens: "2026-11-15T09:00:00", closes: "2026-11-17T23:59:59", free: true, solutions: "18 to 19 Nov, on a live meet", results: "2026-11-20T23:59:59", guide: null },
    { key: "aidmt-2", name: "AIDMT 2", exam: "UCEED", detail: "UCEED mock, ranked across India", opens: "2026-11-22T09:00:00", closes: "2026-11-25T23:59:59", free: false, solutions: "27 to 28 Nov, with a review session", results: null, guide: null },
    { key: "aidmt-3", name: "AIDMT 3", exam: "NIFT", detail: "NIFT mock, ranked across India", opens: "2026-11-29T09:00:00", closes: "2026-11-29T23:59:59", free: false, solutions: "", results: null, guide: null },
    { key: "aidmt-4", name: "AIDMT 4", exam: "NID", detail: "NID mock, ranked across India", opens: "2026-11-30T09:00:00", closes: "2026-11-30T23:59:59", free: false, solutions: "", results: null, guide: null },
  ],
  enrolUrl: ENROL_URL,
};

const AIDMT_REVALIDATE = 60;

/* An instant from the LMS ("2026-11-15T03:30:00.000Z") as IST wall clock. */
const toIst = (iso: string) => new Date(new Date(iso).getTime() + 330 * 60_000).toISOString().slice(0, 19);

/* Links to this site come back as full links; keep them on this site, so previews and local runs work. */
export function localLink(href: string): string {
  for (const origin of [SITE_URL, SITE_URL.replace("://www.", "://"), "https://divergentclasses.com", "https://www.divergentclasses.com"]) {
    if (href.startsWith(origin + "/")) return href.slice(origin.length);
  }
  return href;
}

type Api = Omit<Aidmt, "series" | "enrolUrl"> & {
  sittings: { id: string; name: string; exam: string; detail: string; opens: string; closes: string; results: string | null; solutions: string; free: boolean; guide: { href: string; label: string } | null }[];
};

/* AIDMT from the LMS, or FALLBACK. Sections missing from the answer keep the fallback's. */
export async function getAidmt(): Promise<Aidmt> {
  try {
    const response = await fetch(`${APP_URL}/api/public/aidmt`, { next: { revalidate: AIDMT_REVALIDATE } });
    if (!response.ok) throw new Error(`AIDMT failed to load (${response.status})`);
    const body = await response.json();
    if (!body.success || !body.data) throw new Error("AIDMT failed to load");
    const data = body.data as Api;
    const series: AidmtSitting[] = (Array.isArray(data.sittings) ? data.sittings : []).map((s) => ({
      key: s.id,
      name: s.name,
      exam: s.exam,
      detail: s.detail,
      opens: toIst(s.opens),
      closes: toIst(s.closes),
      free: s.free,
      solutions: s.solutions,
      results: s.results ? toIst(s.results) : null,
      guide: s.guide ? { href: localLink(s.guide.href), label: s.guide.label } : null,
    }));
    const { sittings: _sittings, ...text } = data;
    void _sittings;
    /* Until the admin has dated a sitting that is still to close, the fallback dates stand in. */
    const current = series.some((s) => ist(s.closes) >= new Date());
    const merged = { ...FALLBACK, ...text, enrolUrl: ENROL_URL, series: current ? series : FALLBACK.series };
    merged.hero = { ...merged.hero, guideUrl: localLink(merged.hero.guideUrl) };
    merged.madeBy = { ...merged.madeBy, toppers: merged.madeBy.toppers.map((t) => ({ ...t, photo: localLink(t.photo) })) };
    return merged;
  } catch (error) {
    console.error(error);
    return FALLBACK;
  }
}

/* The last date a sitting has anything to show: its close or results. */
export const sittingEnds = (s: AidmtSitting) => [s.closes, s.results].filter((d): d is string => !!d).sort().at(-1)!;

/* The last date anywhere in the series. The home strip shows until then. */
export const seriesEnds = (series: AidmtSitting[]) => series.map(sittingEnds).sort().at(-1) ?? "1970-01-01T00:00:00";

/* The sitting still to close at t (the one running, or the next one), or
   null once every window has closed. ranked skips free sittings. */
export function nextAidmt(series: AidmtSitting[], t: Date, ranked = false): AidmtSitting | null {
  return series.find((s) => (!ranked || !s.free) && t <= ist(s.closes)) ?? null;
}

/* Where a sitting stands at t. "after" is between its close and its results. */
export type AidmtState = "done" | "after" | "live" | "next" | "later";
export function aidmtState(series: AidmtSitting[], s: AidmtSitting, t: Date): AidmtState {
  if (t > ist(sittingEnds(s))) return "done";
  if (t > ist(s.closes)) return "after";
  if (t >= ist(s.opens)) return "live";
  return series.find((x) => t < ist(x.opens))?.key === s.key ? "next" : "later";
}

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o });

/* "9 Nov", "15 to 17 Nov" or "30 Nov to 2 Dec", in IST. long spells the month out. */
export function aidmtDays(from: string, to: string = from, long = false): string {
  const dm = fmt({ day: "numeric", month: long ? "long" : "short" });
  const a = dm.format(ist(from)), b = dm.format(ist(to));
  if (a === b) return a;
  const m = fmt({ month: "short" });
  return m.format(ist(from)) === m.format(ist(to)) ? `${fmt({ day: "numeric" }).format(ist(from))} to ${b}` : `${a} to ${b}`;
}

/* "9 am" or "11:59 pm", in IST. Spaces are made plain: some browsers put a
   narrow no-break space before am/pm, and the client components on /aidmt/
   must render the same text as the static HTML. */
export const aidmtTime = (s: string) => fmt({ hour: "numeric", minute: "2-digit", hour12: true }).format(ist(s)).toLowerCase().replace(/\s+/g, " ").replace(":00", "");

export const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
