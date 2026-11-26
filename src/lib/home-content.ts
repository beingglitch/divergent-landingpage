import { NID_21, UCEED_45, getProgramPrices, rupees, shortDate, type Prices, type Program } from "@/lib/masterclass";
import { APP_URL, COURSE_PATH, FREE_CLASS_URL, fromPrice } from "@/lib/config";

/* The words and pictures of the home page (app/page.tsx), kept apart from
   its layout so a poster, a topper or a tool can change without touching
   the page. */

/* ------------------------------------------------------------ exam days */

/* Exam days in IST, from the bodies that set them. UCEED and CEED 2027:
   IIT Bombay, 17 Jan 2027. NID DAT 2027 Prelims: NID, 20 Dec 2026. NIFT
   2027 Stage 1: the NTA exam calendar, 10 Jan 2027. Check them again when
   the admit cards come out. */
export type ExamDay = { key: string; name: string; day: string; href: string; site: string };

export const EXAM_DAYS: ExamDay[] = [
  { key: "nid", name: "NID DAT Prelims", day: "2026-12-20", href: "/nid/", site: "https://admissions.nid.edu/" },
  { key: "nift", name: "NIFT 2027", day: "2027-01-10", href: "/nift/", site: "https://exams.nta.nic.in/niftee/" },
  { key: "uceed", name: "UCEED 2027", day: "2027-01-17", href: "/uceed/", site: "https://uceed.iitb.ac.in/" },
  { key: "ceed", name: "CEED 2027", day: "2027-01-17", href: "https://ceed.iitb.ac.in/", site: "https://ceed.iitb.ac.in/" },
];

/* ------------------------------------------------------------ the posters */

/* One slide of the hero carousel. The poster is drawn in code from these
   fields; set `poster` to a designed image (public/assets/img/posters/) and
   that shows instead, with the same link. */
export type SlideTheme = "night" | "paper" | "sun" | "blush";
export type Slide = {
  key: string;
  /* The short name on the tab under the carousel. */
  tab: string;
  href: string;
  theme: SlideTheme;
  kicker: string;
  /* The big number or word, and the small word under it. */
  big: string;
  unit: string;
  title: string;
  line: string;
  chips: string[];
  cta: string;
  /* Student work pinned to the poster (decorative). */
  art?: Array<{ src: string; w: number; h: number }>;
  /* Toppers on the poster instead of work. */
  faces?: Array<{ src: string; rank: string }>;
  poster?: { src: string; alt: string; w: number; h: number };
};

const work = (n: number, w: number, h: number) => ({ src: `/assets/img/work/work-${String(n).padStart(2, "0")}.webp`, w, h });

/* The lowest price across a program's modes, once its plans are live in the app. */
const lowest = (prices: Prices) => {
  const all = Object.values(prices).map((p) => p?.price).filter((n): n is number => typeof n === "number" && n > 0);
  return all.length ? Math.min(...all) : null;
};

function programSlide(P: Program, prices: Prices, rest: Pick<Slide, "key" | "tab" | "theme" | "kicker" | "title" | "line" | "cta" | "art">): Slide {
  const from = lowest(prices);
  return {
    ...rest,
    href: P.path,
    big: String(P.days),
    unit: "days",
    chips: ["Live or recorded", `${P.classes} masterclasses`, from ? `From ${rupees(from)}` : `${P.examName.replace(/ 20\d\d$/, "")} ${shortDate(P.examDay)}`],
  };
}

/* NID Masterclass, UCEED 45 Days, the 75-day course and NIFT 2027, in that
   order: the nearest exam first. */
export async function homeSlides(now: Date): Promise<Slide[]> {
  const [nid, uceed] = await Promise.all([getProgramPrices(NID_21), getProgramPrices(UCEED_45)]);
  return [
    programSlide(NID_21, nid, {
      key: "nid-21",
      tab: "NID 21",
      theme: "night",
      kicker: "New · NID DAT 2027",
      title: "NID Masterclass",
      line: "Every topic of the Prelims, with a mentor marking your work.",
      cta: "See the masterclass",
      art: [work(4, 874, 1280), work(11, 900, 592)],
    }),
    programSlide(UCEED_45, uceed, {
      key: "uceed-45",
      tab: "UCEED 45",
      theme: "paper",
      kicker: "New · UCEED 2027",
      title: "UCEED Sprint",
      line: "Part A drills and Part B sketching, all the way to the exam.",
      cta: "See the 45-day plan",
      art: [work(1, 900, 1200), work(6, 900, 594)],
    }),
    {
      key: "75-days",
      tab: "75 Days",
      href: COURSE_PATH,
      theme: "sun",
      kicker: "UCEED + NID",
      big: "75",
      unit: "days",
      title: "The Crash Course",
      line: "Live classes, 10 full mocks and weekly feedback.",
      chips: ["Recorded, Live or Mentor", `Plans from ${rupees(fromPrice(now))}`],
      cta: "See the plans",
      art: [work(5, 900, 806), work(12, 900, 584)],
    },
    {
      key: "nift-2027",
      tab: "NIFT 2027",
      href: "/nift-interest/",
      theme: "blush",
      kicker: "Opening soon",
      big: "NIFT",
      unit: "2027",
      title: "Be first in line",
      line: "Our NIFT program opens soon. Get the plan and the fee first.",
      chips: ["B.Des · B.FTech", "GAT + CAT"],
      cta: "Get first access",
      faces: [
        { src: "/assets/img/toppers/kalyani-nift-9.webp", rank: "AIR 9" },
        { src: "/assets/img/toppers/navya-nift-7.webp", rank: "Cat. AIR 7" },
        { src: "/assets/img/toppers/manya-nift-14.webp", rank: "Cat. AIR 14" },
      ],
    },
  ];
}

/* ------------------------------------------------------------ proof */

/* Official ranks of our students (as on /results/). */
export type Topper = { name: string; exam: string; rank: string; src: string };
const t = (name: string, exam: string, rank: string, file: string): Topper => ({ name, exam, rank, src: `/assets/img/toppers/${file}.webp` });
export const TOPPERS: Topper[] = [
  t("Ankit", "UCEED", "AIR 2", "ankit"),
  t("Priyanka", "UCEED", "AIR 4", "priyanka"),
  t("Harsh", "UCEED", "AIR 6", "harsh-uceed-6"),
  t("Navya", "NIFT", "AIR 7 (cat.)", "navya-nift-7"),
  t("Rudra", "UCEED", "AIR 8", "rudra"),
  t("Kalyani", "NIFT", "AIR 9", "kalyani-nift-9"),
  t("Ameya", "UCEED", "AIR 10", "ameya"),
  t("Manya", "NIFT", "AIR 14 (cat.)", "manya-nift-14"),
  t("Hiya", "UCEED", "AIR 30", "hiya"),
  t("Shubhra", "UCEED", "AIR 35", "shubhra"),
  t("Debashis", "NID", "AIR 52", "debashis"),
  t("Aditi", "UCEED", "AIR 55", "aditi"),
  t("Satvika", "UCEED", "AIR 69", "satvika"),
  t("Himani", "UCEED", "AIR 118", "himani"),
  t("Riya", "UCEED", "AIR 158", "riya"),
];

/* The four numbers under the hero (as on /results/). */
export const STATS: Array<{ n: number; label: string }> = [
  { n: 30, label: "in the UCEED 2026 top 200" },
  { n: 18, label: "into top NIDs" },
  { n: 25, label: "into top NIFTs" },
  { n: 10000, label: "students in our community" },
];

/* ------------------------------------------------------------ the exams */

export const EXAM_CARDS = [
  { key: "uceed", name: "UCEED", line: "B.Des at the IITs", img: "/assets/img/campus/iit-bombay.webp", w: 720, h: 553, campus: "IIT Bombay", href: "/uceed/", when: "17 Jan 2027" },
  { key: "nid", name: "NID DAT", line: "B.Des at the NIDs", img: "/assets/img/campus/nid-ahmedabad.webp", w: 402, h: 257, campus: "NID Ahmedabad", href: "/nid/", when: "Prelims 20 Dec" },
  { key: "nift", name: "NIFT", line: "B.Des and B.FTech", img: "/assets/img/campus/nift-delhi.webp", w: 720, h: 467, campus: "NIFT Delhi", href: "/nift/", when: "10 Jan 2027" },
];

/* ------------------------------------------------------------ free tools */

export type ToolIcon = "sketch" | "question" | "palette" | "swords" | "papers" | "chart" | "gauge" | "medal" | "compass" | "spark" | "live";
export type Tool = {
  key: string;
  name: string;
  sub: string;
  tag: string;
  icon: ToolIcon;
  tone: "sky" | "lilac" | "cream" | "mint" | "blush" | "ink";
  href: string;
  /* Wide tiles span two columns. */
  wide?: boolean;
  /* Not built yet: the tile asks for a WhatsApp number instead of linking. */
  soon?: boolean;
};

/* The app pages need a sign-in (free); LeetDesign is its own free site. The
   countdown tile is not in this list: the page puts it between them. */
export function homeTools({ predictorReady }: { predictorReady: boolean }): Tool[] {
  return [
    { key: "sketch", name: "Daily sketch problem", sub: "A new UCEED Part B problem every day, with a leaderboard.", tag: "Daily", icon: "sketch", tone: "cream", href: "https://leetdesign.divergentclasses.com/", wide: true },
    { key: "qotd", name: "Question of the day", sub: "60 seconds. See how everyone did.", tag: "Daily", icon: "question", tone: "sky", href: "/question-of-the-day/" },
    { key: "colour", name: "Odd colour out", sub: "How sharp is your eye?", tag: "Game", icon: "palette", tone: "blush", href: "/colour-game/" },
    { key: "arena", name: "Designer Arena", sub: "Quiz battles. Climb the board.", tag: "Game", icon: "swords", tone: "lilac", href: `${APP_URL}/arena` },
    { key: "pyq", name: "Free PYQs", sub: "Past papers, free with sign-in.", tag: "Free", icon: "papers", tone: "mint", href: `${APP_URL}/dashboard/pyq` },
    { key: "predictor", name: "College predictor", sub: "Your rank in, your colleges out.", tag: predictorReady ? "New" : "Coming soon", icon: "compass", tone: "lilac", href: "/college-predictor/", wide: true, soon: !predictorReady },
    { key: "aidmt", name: "AIDMT mock", sub: "Your All India Rank.", tag: "Mock", icon: "chart", tone: "sky", href: "/aidmt/" },
    { key: "readiness", name: "Readiness check", sub: "2 minutes. Know your level.", tag: "Quiz", icon: "gauge", tone: "cream", href: "/nid-masterclass/#check" },
    { key: "live", name: "Free live class", sub: "Sit in on a real class.", tag: "Free", icon: "live", tone: "mint", href: FREE_CLASS_URL },
    { key: "scholarship", name: "Scholarship test", sub: "Free to register.", tag: "Free", icon: "medal", tone: "cream", href: `${APP_URL}/scholarship` },
    { key: "prep-ai", name: "Prep AI", sub: "Ask any doubt, any hour.", tag: "Coming soon", icon: "spark", tone: "ink", href: "#", wide: true, soon: true },
  ];
}
