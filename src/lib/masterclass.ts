/* The 21 Days NID Masterclass 2027 (app/nid-masterclass/page.tsx). Every
   word, date and link on that page is here; prices come from the app.

   Selling: the course lives in the app (LMS admin, Courses) under the slug
   MASTERCLASS_COURSE, with one published pricing plan per program, slugs
   "live" and "recorded" (each mode's `plan`). The page reads their prices
   from the app once a minute (getMasterclassPrices), so the page and
   checkout always agree, and every Enrol opens the buy dialog
   (components/MasterclassBuy): a mobile number and Razorpay, no sign-in, as
   on /aidmt/. Until those plans are published, prices are hidden and Enrol
   opens WhatsApp instead.

   The 3 AIDMT mocks: in the LMS admin's AIDMT tab, set the NID sittings
   free for these two plans (freePlanIds), so buyers register in one tap.

   Dates are IST. */

import { APP_URL, CONTACT } from "./config";

/* The course in the app. */
export const MASTERCLASS_COURSE = process.env.NEXT_PUBLIC_MASTERCLASS_SLUG || "21-days-nid-masterclass";

/* The course page in the app, where Enrol goes before the dialog loads. */
export const MASTERCLASS_APP_URL = `${APP_URL}/dashboard/courses/${MASTERCLASS_COURSE}`;

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

export const MASTERCLASS = {
  /* NID DAT 2027 Prelims (B.Des). The countdowns run to the start of this day. */
  examDay: "2026-12-20",
  examName: "NID DAT Prelims",
  /* "2026-11-29": shown beside the countdown once set. */
  startsOn: null as string | null,
  /* After this moment (IST) every Enrol turns into "Enrolment closed". */
  enrolEnds: null as string | null,

  hero: {
    pills: ["Class 12 & droppers", "NID 2027"],
    title: "The final 21 days.",
    highlight: "Learn from the best.",
    sub: "A focused, mentor-led program for the last stretch before NID: masterclasses with mentors from NID and IIT, live feedback, recordings and three All India mocks.",
  },

  /* The numbers on the hero card. */
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
  ] as MasterclassMode[],

  /* Both programs include these. */
  both: ["13–14 masterclasses", "3 AIDMT NID mocks", "Session recordings", "NID and IIT mentors", "Exam strategy"],

  /* What the masterclasses cover, each shown on a real sheet from our batches where there is one. */
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

  /* A sheet from our batches with a mentor's kind of notes on it
     (components/MasterclassReview). x and y are on the image, 900 by 521. */
  review: {
    img: "/assets/img/work/work-09.webp",
    w: 900,
    h: 521,
    mark: "7/10",
    after: "9/10",
    notes: [
      { good: true, x: 318, y: 40, text: "Bold name and clear lettering. It reads from across the room." },
      { good: false, x: 598, y: 300, text: "Ground the main view: add a cast shadow under it." },
      { good: true, x: 300, y: 352, text: "A person wearing it. NID wants the user in the picture." },
      { good: false, x: 432, y: 418, text: "Labels too small. Letter them in capitals, twice the size." },
      { good: false, x: 874, y: 98, text: "The back view is flat-on. Turn it three-quarter to show the padding." },
      { good: true, x: 790, y: 352, text: "The laptop inside shows how big 40 L is. Smart." },
    ],
  },

  /* The 21 days. An indicative plan: the batch gets the exact timetable.
     mc is a masterclass, review a feedback and practice day, mock an AIDMT. */
  journey: {
    note: "An indicative plan. Your batch gets the exact timetable when it starts.",
    weeks: [
      { title: "Build the base", topics: ["Drawing & sketching", "Perspective", "Observation"], days: ["mc", "mc", "mc", "review", "mc", "mc", "mock"] },
      { title: "Think like a designer", topics: ["Creative thinking", "Colour & form", "Everyday objects"], days: ["mc", "mc", "review", "mc", "mc", "mc", "mock"] },
      { title: "Perform", topics: ["Design problems", "NID question practice", "Exam strategy"], days: ["mc", "mc", "mc", "review", "mc", "mock", "review"] },
    ] as { title: string; topics: string[]; days: ("mc" | "review" | "mock")[] }[],
  },

  mentors: {
    heading: "Taught by mentors from NID and IIT.",
    lede: "Mentors with 3+ years of teaching experience, who know the NID paper and how to approach a design question.",
    from: ["NID Ahmedabad", "NID Assam", "NID Bhopal", "NID Haryana", "IIT"],
  },

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

  close: {
    heading: "21 days. Expert mentors. One final push for NID 2027.",
    lede: "Learn. Create. Perform.",
  },
};

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");

export function whatsappHref(text: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* Where Enrol goes without the dialog: WhatsApp naming the program. */
export function askToJoin(mode: MasterclassMode): string {
  return whatsappHref(`Hi, I want to join the ${mode.name} program of the 21 Days NID Masterclass 2027.`);
}

/* "29 Nov" from "2026-11-29". */
export function shortDate(day: string): string {
  return new Date(day + "T12:00:00+05:30").toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

/* Today's price of each program from the app. Empty while the course or a
   plan is not published, or the app cannot be reached. */
export async function getMasterclassPrices(): Promise<Prices> {
  try {
    const res = await fetch(`${APP_URL}/api/public/course-plans?course=${encodeURIComponent(MASTERCLASS_COURSE)}`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const body = await res.json();
    const plans: { slug: string; price: number; listPrice: number; period: string | null }[] = body?.success && Array.isArray(body.data?.plans) ? body.data.plans : [];
    const out: Prices = {};
    for (const mode of MASTERCLASS.modes) {
      const p = plans.find((x) => x.slug === mode.plan);
      if (p && p.price > 0) out[mode.key] = { price: p.price, listPrice: p.listPrice, offer: p.period };
    }
    return out;
  } catch {
    return {};
  }
}
