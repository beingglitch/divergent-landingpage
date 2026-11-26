import { APP_URL, COURSE_PATH, FREE_CLASS_URL } from "@/lib/config";

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

/* The pill above the headline and the posters beside it are set in the app,
   under Highlights, Home page, and read here (api/public/home, the app's
   lib/home-page has the rules). Until the app answers, the built-in ones
   below stand in: the same as the app's defaults. */
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
  /* Pinned sheets (student work) or faces with a caption (toppers). */
  pictures: Array<{ src: string; caption: string }>;
  pictureStyle: "sheets" | "faces";
  /* A designed poster: it shows instead of the drawn one, with the same link. */
  poster?: { src: string; alt: string; w: number; h: number };
};

/* auto: the next AIDMT mock (components/Aidmt AidmtHeroLink). */
export type Announcement = { kind: "auto" } | { kind: "custom"; badge: string; text: string; href: string } | null;
export type HomeFeed = { announcement: Announcement; slides: Slide[] };

const work = (n: number) => ({ src: `/assets/img/work/work-${String(n).padStart(2, "0")}.webp`, caption: "" });

const BUILT_IN: HomeFeed = {
  announcement: { kind: "custom", badge: "New launch", text: "21 Days NID Masterclass", href: "/nid-masterclass/" },
  slides: [
    {
      key: "nid-21", tab: "NID 21", href: "/nid-masterclass/", theme: "night",
      kicker: "New · NID DAT 2027", big: "21", unit: "days", title: "NID Masterclass",
      line: "Every topic of the Prelims, with a mentor marking your work.",
      chips: ["Live or recorded", "14 masterclasses", "Prelims 20 Dec"], cta: "See the masterclass",
      pictures: [work(4), work(11)], pictureStyle: "sheets",
    },
    {
      key: "uceed-45", tab: "UCEED 45", href: "/uceed-45-days/", theme: "paper",
      kicker: "New · UCEED 2027", big: "45", unit: "days", title: "UCEED Sprint",
      line: "Part A drills and Part B sketching, all the way to the exam.",
      chips: ["Live or recorded", "25 masterclasses", "UCEED 17 Jan"], cta: "See the 45-day plan",
      pictures: [work(1), work(6)], pictureStyle: "sheets",
    },
    {
      key: "75-days", tab: "75 Days", href: COURSE_PATH, theme: "sun",
      kicker: "UCEED + NID", big: "75", unit: "days", title: "The Crash Course",
      line: "Live classes, 10 full mocks and weekly feedback.",
      chips: ["Recorded, Live or Mentor", "Plans from ₹5,999"], cta: "See the plans",
      pictures: [work(5), work(12)], pictureStyle: "sheets",
    },
    {
      key: "nift-2027", tab: "NIFT 2027", href: "/nift-interest/", theme: "blush",
      kicker: "Opening soon", big: "NIFT", unit: "2027", title: "Be first in line",
      line: "Our NIFT program opens soon. Get the plan and the fee first.",
      chips: ["B.Des · B.FTech", "GAT + CAT"], cta: "Get first access",
      pictures: [
        { src: "/assets/img/toppers/kalyani-nift-9.webp", caption: "AIR 9" },
        { src: "/assets/img/toppers/navya-nift-7.webp", caption: "Cat. AIR 7" },
        { src: "/assets/img/toppers/manya-nift-14.webp", caption: "Cat. AIR 14" },
      ],
      pictureStyle: "faces",
    },
  ],
};

/* The app's answer, read with care: anything that does not fit is left out. */
const str = (v: unknown) => (typeof v === "string" ? v : "");
const THEMES: SlideTheme[] = ["night", "paper", "sun", "blush"];
const linkOk = (v: string) => v.startsWith("/") || /^https?:\/\//.test(v);

function readSlide(raw: unknown): Slide | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const key = str(s.id), tab = str(s.tab), href = str(s.href);
  if (!key || !tab || !linkOk(href)) return null;
  const theme = THEMES.includes(s.theme as SlideTheme) ? (s.theme as SlideTheme) : "night";
  const pictures = (Array.isArray(s.pictures) ? s.pictures : [])
    .map((p) => (p && typeof p === "object" ? (p as Record<string, unknown>) : {}))
    .filter((p) => linkOk(str(p.src)))
    .map((p) => ({ src: str(p.src), caption: str(p.caption) }))
    .slice(0, 3);
  const rawPoster = s.poster && typeof s.poster === "object" ? (s.poster as Record<string, unknown>) : null;
  const poster = rawPoster && linkOk(str(rawPoster.url))
    ? { src: str(rawPoster.url), alt: str(rawPoster.alt), w: Number(rawPoster.width) || 1080, h: Number(rawPoster.height) || 1350 }
    : undefined;
  return {
    key, tab, href, theme,
    kicker: str(s.kicker), big: str(s.big), unit: str(s.unit), title: str(s.title), line: str(s.line),
    chips: Array.isArray(s.chips) ? s.chips.map(str).filter(Boolean).slice(0, 3) : [],
    cta: str(s.cta),
    pictures,
    pictureStyle: s.pictureStyle === "faces" ? "faces" : "sheets",
    poster,
  };
}

function readAnnouncement(raw: unknown): Announcement {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  if (a.kind === "auto") return { kind: "auto" };
  if (a.kind === "custom" && str(a.text) && linkOk(str(a.href))) return { kind: "custom", badge: str(a.badge), text: str(a.text), href: str(a.href) };
  return null;
}

/* The pill and the live posters, from the app; the built-in ones when it
   does not answer. Refreshed with the page, at most once a minute. */
export async function loadHome(): Promise<HomeFeed> {
  try {
    const res = await fetch(`${APP_URL}/api/public/home`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (res.ok && json?.success && json.data && typeof json.data === "object") {
      const data = json.data as Record<string, unknown>;
      const slides = Array.isArray(data.slides) ? data.slides.map(readSlide).filter((x): x is Slide => x !== null) : [];
      return { announcement: readAnnouncement(data.announcement), slides };
    }
  } catch {}
  return BUILT_IN;
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
