/* The final-stretch programs, each on a page of its own built like /aidmt/
   (components/ProgramPage): the 21 Days NID Masterclass (/nid-masterclass/)
   and the 45 Days UCEED program (/uceed-45-days/). Every word, date and plan
   slug is here; prices come from the app.

   Selling: each program is a course in the app (LMS admin, Courses) under
   its `course` slug, with one published pricing plan per mode, slugs "live"
   and "recorded" (each mode's `plan`). The page reads their prices from the
   app once a minute (getProgramPrices), so the page and checkout always
   agree, and every Enrol opens the buy dialog (components/MasterclassBuy):
   a mobile number and Razorpay, no sign-in, as on /aidmt/. Until those plans
   are published, prices are hidden and Enrol opens WhatsApp instead.

   The 3 AIDMT mocks: in the LMS admin's AIDMT tab, set the program's
   sittings free for its two plans (freePlanIds), so buyers register in one
   tap. The interest form on each page (components/InterestForm) sends a
   lead to the app's Leads list, tagged with the program.

   Dates are IST. */

import { APP_URL, CONTACT } from "./config";

export type ModeKey = "live" | "recorded";

export type MasterclassMode = {
  key: ModeKey;
  /* The pricing plan's slug in the app. */
  plan: string;
  name: string;
  short: string;
  line: string;
  points: string[];
};

/* Today's price of a plan, as checkout will charge it. */
export type ModePrice = { price: number; listPrice: number; offer: string | null };
export type Prices = Partial<Record<ModeKey, ModePrice>>;

export type Topic = { name: string; detail: string; img: string | null; w: number; h: number; size: "tall" | "wide" | "" | "colour" | "solve" | "exam" };
export type ReviewNote = { good: boolean; x: number; y: number; text: string };
export type Day = "mc" | "review" | "mock";
/* A stretch of the program on the map: a week, or a block of days. */
export type Phase = { label: string; title: string; topics: string[]; days: Day[] };

export type Program = {
  /* The page, with its trailing slash. */
  path: string;
  exam: "NID" | "UCEED";
  /* The course's slug in the app. */
  course: string;
  /* "21 Days NID Masterclass 2027": the dialog, the pixel and messages. */
  name: string;
  /* "21 Days NID": the phone's Enrol bar. */
  short: string;
  days: number;
  /* Squares per row on the hero's card. */
  dayCols: number;
  /* Masterclasses in all, for "Masterclass 4 of 14" on the class screen. */
  classes: number;
  /* The exam the countdowns run to (the start of this day). */
  examDay: string;
  examName: string;
  /* "2026-11-29": shown beside the countdown once set. */
  startsOn: string | null;
  /* After this moment (IST) every Enrol turns into "Enrolment closed". */
  enrolEnds: string | null;
  /* noindex keeps a page out of search while its words are placeholders. */
  meta: { title: string; description: string; noindex?: boolean };
  hero: { pills: string[]; title: string; highlight: string; sub: string };
  facts: { n: string; k: string }[];
  modes: MasterclassMode[];
  both: string[];
  topics: Topic[];
  review: { img: string; w: number; h: number; mark: string; after: string; notes: ReviewNote[] };
  journey: { heading: string; lede: string; note: string; cols: number; phases: Phase[] };
  mentors: { heading: string; lede: string; from: string[]; category: "nid" | "uceed" };
  /* The yellow band after the mock cards. */
  firstMock: string;
  /* AIDMT questions for the 60 second clock; all of them when unset. */
  questions?: string[];
  faqs: { q: string; a: string }[];
  close: { heading: string; lede: string };
  /* The guide for this exam, linked from the FAQs. */
  guide: { href: string; label: string };
  /* How a lead from this page is tagged in the app. */
  lead: { plan: string; source: string };
};

/* The same sheet review on both pages: a real sheet from our batches, with
   the kind of notes a live review gives (components/MasterclassReview). x and
   y are on the image, 900 by 521. */
const REVIEW: Program["review"] = {
  img: "/assets/img/work/work-09.webp",
  w: 900,
  h: 521,
  mark: "7/10",
  after: "9/10",
  notes: [
    { good: true, x: 318, y: 40, text: "Bold name and clear lettering. It reads from across the room." },
    { good: false, x: 598, y: 300, text: "Ground the main view: add a cast shadow under it." },
    { good: true, x: 300, y: 352, text: "A person wearing it. Examiners want the user in the picture." },
    { good: false, x: 432, y: 418, text: "Labels too small. Letter them in capitals, twice the size." },
    { good: false, x: 874, y: 98, text: "The back view is flat-on. Turn it three-quarter to show the padding." },
    { good: true, x: 790, y: 352, text: "The laptop inside shows how big 40 L is. Smart." },
  ],
};

export const NID_21: Program = {
  path: "/nid-masterclass/",
  exam: "NID",
  course: process.env.NEXT_PUBLIC_MASTERCLASS_SLUG || "21-days-nid-masterclass",
  name: "21 Days NID Masterclass 2027",
  short: "21 Days NID",
  days: 21,
  dayCols: 7,
  classes: 14,
  /* NID DAT 2027 Prelims (B.Des). */
  examDay: "2026-12-20",
  examName: "NID DAT Prelims",
  startsOn: null,
  enrolEnds: null,
  meta: {
    title: "21 Days NID Masterclass 2027: final-stretch NID prep | Divergent Classes",
    description: "A 21-day, mentor-led NID 2027 program: 13–14 masterclasses with mentors from NID and IIT, live or recorded, with live feedback and 3 AIDMT full-length NID mocks.",
  },
  hero: {
    pills: ["Class 12 & droppers", "NID 2027"],
    title: "The final 21 days.",
    highlight: "Learn from the best.",
    sub: "A focused, mentor-led program for the last stretch before NID: masterclasses with mentors from NID and IIT, live feedback, recordings and three All India mocks.",
  },
  facts: [
    { n: "21", k: "days" },
    { n: "13–14", k: "masterclasses" },
    { n: "3", k: "AIDMT mocks" },
  ],
  modes: [
    {
      key: "live",
      plan: "live",
      name: "Live Masterclass",
      short: "Live",
      line: "In the room with your mentor.",
      points: [
        "Attend every masterclass live",
        "Ask doubts and get answers in class",
        "Your sheets reviewed in live feedback rounds",
        "Recordings of every session for revision",
        "3 AIDMT full-length NID mocks",
      ],
    },
    {
      key: "recorded",
      plan: "recorded",
      name: "Recorded Masterclass",
      short: "Recorded",
      line: "The same masterclasses, at your pace.",
      points: [
        "Recordings of every masterclass",
        "Taught by the same NID and IIT mentors",
        "Replay any chapter, watch at 1.5× or 2×",
        "Practise on your own schedule",
        "3 AIDMT full-length NID mocks",
      ],
    },
  ],
  both: ["13–14 masterclasses", "3 AIDMT NID mocks", "Session recordings", "NID and IIT mentors", "Exam strategy"],
  topics: [
    { name: "Drawing & sketching", detail: "Fundamentals that make every answer clearer on paper.", img: "/assets/img/work/work-01.webp", w: 900, h: 1200, size: "tall" },
    { name: "Visualization & perspective", detail: "Hold a form in your head and draw it from any side.", img: "/assets/img/work/work-06.webp", w: 900, h: 594, size: "wide" },
    { name: "Observation", detail: "See the detail others miss, then draw it.", img: "/assets/img/work/work-05.webp", w: 900, h: 806, size: "" },
    { name: "Product design & everyday objects", detail: "Pull apart the things around you and make them better.", img: "/assets/img/work/work-12.webp", w: 900, h: 584, size: "wide" },
    { name: "Creative thinking", detail: "Many ideas fast, then the one that stands out.", img: "/assets/img/work/work-11.webp", w: 900, h: 592, size: "" },
    { name: "Composition, colour & form", detail: "Arrange a page so it reads the way you mean it to.", img: null, w: 0, h: 0, size: "colour" },
    { name: "Problem-solving", detail: "Turn a vague brief into a clear answer.", img: null, w: 0, h: 0, size: "solve" },
    { name: "NID question practice & strategy", detail: "Exam-style questions, a time plan and a final game plan.", img: null, w: 0, h: 0, size: "exam" },
  ],
  review: REVIEW,
  /* An indicative plan: the batch gets the exact timetable. */
  journey: {
    heading: "Your 21 days, mapped.",
    lede: "Masterclasses most days, a review round each week, and an AIDMT mock to end each week.",
    note: "An indicative plan. Your batch gets the exact timetable when it starts.",
    cols: 7,
    phases: [
      { label: "Week 1", title: "Build the base", topics: ["Drawing & sketching", "Perspective", "Observation"], days: ["mc", "mc", "mc", "review", "mc", "mc", "mock"] },
      { label: "Week 2", title: "Think like a designer", topics: ["Creative thinking", "Colour & form", "Everyday objects"], days: ["mc", "mc", "review", "mc", "mc", "mc", "mock"] },
      { label: "Week 3", title: "Perform", topics: ["Design problems", "NID question practice", "Exam strategy"], days: ["mc", "mc", "mc", "review", "mc", "mock", "review"] },
    ],
  },
  mentors: {
    heading: "Taught by mentors from NID and IIT.",
    lede: "Mentors with 3+ years of teaching experience, who know the NID paper and how to approach a design question.",
    from: ["NID Ahmedabad", "NID Assam", "NID Bhopal", "NID Haryana", "IIT"],
    category: "nid",
  },
  firstMock: "Your first AIDMT is at the end of week 1.",
  /* The AIDMT questions that suit an NID paper: visual, observation, design awareness. */
  questions: ["cube-two-faces", "square-diagonals", "paper-fold-holes", "prism-edges", "light-primaries", "chandigarh-plan"],
  faqs: [
    { q: "What is the 21 Days NID Masterclass 2027?", a: "An intensive, mentor-led program for students targeting NID 2027. It focuses on design aptitude, creative thinking, drawing, visualization, problem-solving and exam-oriented practice." },
    { q: "Who can join?", a: "Class 12 students and droppers preparing for the NID 2027 entrance exam." },
    { q: "How long is the program?", a: "21 days, with about 13–14 expert-led masterclasses." },
    { q: "What is the difference between Live and Recorded?", a: "Live: attend sessions as they happen, join discussions, ask questions, get live feedback, and get the recordings for revision. Recorded: watch the recordings, learn at your own pace and revisit concepts whenever you need to." },
    { q: "How many mock tests are included?", a: "Three NID mock tests under AIDMT (All India Divergent Mock Tests), to practise and measure your preparation." },
    { q: "How do I pay? Do I need an account?", a: "Tap Enrol, pick Live or Recorded, enter your mobile number and pay. No sign-up first: the course is on that number, so sign in with it afterwards and it is there." },
    { q: "Who teaches the masterclasses?", a: "Mentors from NID Ahmedabad, NID Assam, NID Bhopal, NID Haryana and IITs, with 3+ years of teaching experience." },
    { q: "Will I get recordings if I join the Live program?", a: "Yes. Live students also get the session recordings for revision." },
    { q: "What topics are covered?", a: "Design aptitude, creative thinking, observation, drawing and sketching, visualization, perspective, composition, colour, form and problem-solving, all aimed at NID." },
    { q: "Is there feedback and doubt-solving?", a: "Yes. The program has live reviews and feedback, and students in live sessions can ask mentors their doubts during the session." },
    { q: "Is it suitable for beginners?", a: "Yes. The sessions strengthen design fundamentals while helping you practise NID-style questions." },
    { q: "Can droppers join?", a: "Absolutely. The masterclass suits both droppers and Class 12 students preparing for NID 2027." },
    { q: "Is this a complete NID preparation course?", a: "No. It is an intensive short program of key concepts, expert guidance, reviews and mock practice. It is not a replacement for a full-length course." },
    { q: "Should I choose Live or Recorded?", a: "Choose Live for real-time interaction, discussions and live feedback. Choose Recorded for flexible, self-paced learning and revision." },
  ],
  close: { heading: "21 days. Expert mentors. One final push for NID 2027.", lede: "Learn. Create. Perform." },
  guide: { href: "/nid/", label: "NID DAT 2027: stages, dates, campuses" },
  lead: { plan: "21 Days NID Masterclass", source: "nid-masterclass" },
};

/* PLACEHOLDER: the 45 Days UCEED program is laid out with sample numbers
   and words until the real brief arrives (class count, mentors, start date,
   the plan below and the FAQs). The page stays out of search meanwhile
   (meta.noindex) and is not linked or in the sitemap. The exam date is
   real: UCEED 2027 is on 17 January 2027 (/uceed/). */
export const UCEED_45: Program = {
  path: "/uceed-45-days/",
  exam: "UCEED",
  course: process.env.NEXT_PUBLIC_UCEED45_SLUG || "45-days-uceed",
  name: "45 Days UCEED 2027",
  short: "45 Days UCEED",
  days: 45,
  dayCols: 9,
  classes: 25,
  examDay: "2027-01-17",
  examName: "UCEED 2027",
  startsOn: null,
  enrolEnds: null,
  meta: {
    title: "45 Days UCEED 2027: final-stretch UCEED prep | Divergent Classes",
    description: "A 45-day, mentor-led UCEED 2027 program: masterclasses for Part A and Part B with IIT mentors, live or recorded, live feedback and 3 AIDMT full-length UCEED mocks.",
    noindex: true,
  },
  hero: {
    pills: ["Class 12 & droppers", "UCEED 2027"],
    title: "The final 45 days.",
    highlight: "Make every one count.",
    sub: "A focused, mentor-led program for the last stretch before UCEED: Part A and Part B masterclasses with IIT mentors, live feedback, recordings and three All India mocks.",
  },
  facts: [
    { n: "45", k: "days" },
    { n: "25", k: "masterclasses" },
    { n: "3", k: "AIDMT mocks" },
  ],
  modes: [
    {
      key: "live",
      plan: "live",
      name: "Live Program",
      short: "Live",
      line: "In the room with your mentor.",
      points: [
        "Attend every masterclass live",
        "Ask doubts and get answers in class",
        "Your Part B sheets reviewed live",
        "Recordings of every session for revision",
        "3 AIDMT full-length UCEED mocks",
      ],
    },
    {
      key: "recorded",
      plan: "recorded",
      name: "Recorded Program",
      short: "Recorded",
      line: "The same masterclasses, at your pace.",
      points: [
        "Recordings of every masterclass",
        "Taught by the same IIT mentors",
        "Replay any chapter, watch at 1.5× or 2×",
        "Practise on your own schedule",
        "3 AIDMT full-length UCEED mocks",
      ],
    },
  ],
  both: ["25 masterclasses", "3 AIDMT UCEED mocks", "Session recordings", "IIT mentors", "Part A and Part B"],
  topics: [
    { name: "Sketching for Part B", detail: "Objects, scenes and people, drawn fast and clear.", img: "/assets/img/work/work-01.webp", w: 900, h: 1200, size: "tall" },
    { name: "Visualisation & spatial ability", detail: "Turn, fold and cut forms in your head.", img: "/assets/img/work/work-06.webp", w: 900, h: 594, size: "wide" },
    { name: "Observation & design sensitivity", detail: "Notice what others miss in everyday things.", img: "/assets/img/work/work-05.webp", w: 900, h: 806, size: "" },
    { name: "Design thinking & problem-solving", detail: "From a user’s problem to an answer you can draw.", img: "/assets/img/work/work-12.webp", w: 900, h: 584, size: "wide" },
    { name: "Creativity", detail: "Many ideas fast, then the one that stands out.", img: "/assets/img/work/work-11.webp", w: 900, h: 592, size: "" },
    { name: "Colour, composition & aesthetics", detail: "What makes a page look right, and why.", img: null, w: 0, h: 0, size: "colour" },
    { name: "Analytical & logical reasoning", detail: "Patterns, sequences and quick decisions.", img: null, w: 0, h: 0, size: "solve" },
    { name: "NAT, MSQ and MCQ strategy", detail: "Which to answer, which to skip, and how to pace 3 hours.", img: null, w: 0, h: 0, size: "exam" },
  ],
  review: REVIEW,
  journey: {
    heading: "Your 45 days, mapped.",
    lede: "Masterclasses most days, review rounds every few days, and an AIDMT mock to end each stretch.",
    note: "An indicative plan. Your batch gets the exact timetable when it starts.",
    cols: 5,
    phases: [
      { label: "Days 1 to 15", title: "Build the base", topics: ["Sketching", "Visualisation", "Observation"], days: ["mc", "mc", "review", "mc", "mc", "review", "mc", "mc", "review", "mc", "mc", "review", "mc", "review", "mock"] },
      { label: "Days 16 to 30", title: "Think like a designer", topics: ["Design thinking", "Creativity", "Colour & composition"], days: ["mc", "mc", "review", "mc", "mc", "review", "mc", "mc", "review", "mc", "mc", "review", "mc", "review", "mock"] },
      { label: "Days 31 to 45", title: "Perform", topics: ["Reasoning", "NAT, MSQ, MCQ", "Exam strategy"], days: ["mc", "review", "mc", "review", "mc", "mc", "review", "mc", "review", "mc", "review", "mc", "mock", "review", "review"] },
    ],
  },
  mentors: {
    heading: "Taught by mentors from the IITs.",
    lede: "Mentors who cleared UCEED themselves and know both parts of the paper.",
    from: ["IIT Delhi", "IIT Bombay", "IIT Guwahati", "IIITDM Jabalpur"],
    category: "uceed",
  },
  firstMock: "Your first AIDMT is at the end of day 15.",
  faqs: [
    { q: "What is the 45 Days UCEED program?", a: "An intensive, mentor-led program for the last 45 days before UCEED 2027, covering Part A and Part B with masterclasses, live feedback and AIDMT mocks." },
    { q: "Who can join?", a: "Class 12 students and droppers preparing for UCEED 2027." },
    { q: "How long is the program?", a: "45 days, with about 25 masterclasses." },
    { q: "What is the difference between Live and Recorded?", a: "Live: attend sessions as they happen, ask questions and get live feedback, with the recordings for revision. Recorded: watch the recordings at your own pace and revisit any concept." },
    { q: "How many mock tests are included?", a: "Three full-length UCEED mocks under AIDMT (All India Divergent Mock Tests), each with an All India Rank and a scorecard." },
    { q: "How do I pay? Do I need an account?", a: "Tap Enrol, pick Live or Recorded, enter your mobile number and pay. No sign-up first: the course is on that number, so sign in with it afterwards and it is there." },
    { q: "What topics are covered?", a: "Part A: visualisation, observation, design sensitivity, reasoning, and how to handle NAT, MSQ and MCQ questions. Part B: sketching and design aptitude." },
    { q: "Will I get recordings if I join the Live program?", a: "Yes. Live students also get the session recordings for revision." },
    { q: "Is this a complete UCEED preparation course?", a: "No. It is an intensive short program of key concepts, expert guidance, reviews and mock practice. It is not a replacement for a full-length course." },
    { q: "Should I choose Live or Recorded?", a: "Choose Live for real-time interaction, discussions and live feedback. Choose Recorded for flexible, self-paced learning and revision." },
  ],
  close: { heading: "45 days. IIT mentors. One final push for UCEED 2027.", lede: "Learn. Practise. Perform." },
  guide: { href: "/uceed/", label: "UCEED 2027: pattern, dates, colleges" },
  lead: { plan: "45 Days UCEED", source: "uceed-45-days" },
};

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");

export function whatsappHref(text: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* Where Enrol goes without the dialog: WhatsApp naming the program. */
export function askToJoin(program: Program, mode: MasterclassMode): string {
  return whatsappHref(`Hi, I want to join the ${mode.name} of the ${program.name}.`);
}

/* The course page in the app, where Enrol goes before the dialog loads. */
export const programAppUrl = (program: Program) => `${APP_URL}/dashboard/courses/${program.course}`;

/* "29 Nov" from "2026-11-29". */
export function shortDate(day: string): string {
  return new Date(day + "T12:00:00+05:30").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

/* Today's price of each mode from the app. Empty while the course or a plan
   is not published, or the app cannot be reached. */
export async function getProgramPrices(program: Program): Promise<Prices> {
  try {
    const res = await fetch(`${APP_URL}/api/public/course-plans?course=${encodeURIComponent(program.course)}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const body = await res.json();
    const plans: { slug: string; price: number; listPrice: number; period: string | null }[] = body?.success && Array.isArray(body.data?.plans) ? body.data.plans : [];
    const out: Prices = {};
    for (const mode of program.modes) {
      const p = plans.find((x) => x.slug === mode.plan);
      if (p && p.price > 0) out[mode.key] = { price: p.price, listPrice: p.listPrice, offer: p.period };
    }
    return out;
  } catch {
    return {};
  }
}
