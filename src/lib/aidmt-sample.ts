/* Made-up AIDMT scorecards for the demo on /aidmt/ (components/AidmtResultDemo).
   Every name, mark, rank and closing rank here is invented, and the page says
   so. The real scorecard is built in the app from each sitting's answers.

   Parts add up: the parts' `you` marks sum to `score`, and `mins` to the
   paper's length. Shares of each category are rough, for the demo only. */

export type Cls = "Class 11" | "Class 12" | "Dropper";
export type SamplePart = { name: string; max: number; you: number; avg: number; top: number; mins: number };
export type SampleSkill = { name: string; you: number; top: number };
export type SampleCollege = { name: string; close: number };
/* How a paper's objective questions went, to draw marks against time. */
export type SamplePace = { seed: number; plus: number; minus: number; parts: { name: string; n: number; mins: number; right: number; wrong: number; noNegative?: boolean }[] };
/* The study plan the scorecard's AI analysis writes. */
export type SamplePlan = { to: number; focus: { topic: string; gain: number; why: string }[]; weeks: string[] };
export type SampleQuestion = { n: number; part: string; secs: number; marks: number; outcome: "right" | "wrong" | "skipped" };

export type SampleScorecard = {
  id: string;
  name: string;
  cls: Cls;
  woman: boolean;
  exam: "UCEED" | "NID" | "NIFT";
  mock: string;
  takers: number;
  rank: number;
  classRank: number;
  classSize: number;
  womenRank: number | null;
  womenSize: number | null;
  /* Score spread: a bell with this middle and width. */
  mean: number;
  sd: number;
  parts: SamplePart[];
  skills: SampleSkill[];
  accuracy: { correct: number; wrong: number; skipped: number; negative: number; topper: number };
  easyMissed: { q: string; topic: string; right: number }[];
  /* Percentile in each AIDMT sat so far, oldest first. The last is this one. */
  progress: { mock: string; percentile: number }[];
  /* How many sit the real exam, to turn a percentile into a likely rank. */
  realTakers: number;
  colleges: SampleCollege[];
  pace: SamplePace;
  plan: SamplePlan;
};

export const CATEGORIES = [
  { key: "GEN", label: "General", share: 0.46 },
  { key: "EWS", label: "GEN-EWS", share: 0.11 },
  { key: "OBC", label: "OBC-NCL", share: 0.27 },
  { key: "SC", label: "SC", share: 0.1 },
  { key: "ST", label: "ST", share: 0.04 },
  { key: "PWD", label: "PwD", share: 0.02 },
] as const;
export type CategoryKey = (typeof CATEGORIES)[number]["key"];

const SKILLS = ["Visualisation", "Observation", "Problem solving", "Creativity", "Communication", "Aesthetic sense"];
const skills = (you: number[], top: number[]): SampleSkill[] => SKILLS.map((name, n) => ({ name, you: you[n], top: top[n] }));

export const SAMPLES: SampleScorecard[] = [
  {
    id: "aarav",
    name: "Aarav",
    cls: "Class 12",
    woman: false,
    exam: "UCEED",
    mock: "AIDMT 2 · UCEED mock",
    takers: 2140,
    rank: 64,
    classRank: 41,
    classSize: 1290,
    womenRank: null,
    womenSize: null,
    mean: 142,
    sd: 24,
    parts: [
      { name: "NAT", max: 64, you: 44, avg: 30, top: 58, mins: 38 },
      { name: "MSQ", max: 72, you: 46, avg: 34, top: 64, mins: 40 },
      { name: "MCQ", max: 64, you: 41, avg: 31, top: 56, mins: 32 },
      { name: "Sketching", max: 60, you: 34, avg: 29, top: 52, mins: 46 },
      { name: "Design aptitude", max: 40, you: 22, avg: 18, top: 34, mins: 24 },
    ],
    skills: skills([78, 66, 72, 48, 58, 61], [92, 88, 86, 84, 80, 85]),
    accuracy: { correct: 41, wrong: 9, skipped: 6, negative: 7, topper: 94 },
    easyMissed: [
      { q: "Q12", topic: "Perspective of a staircase", right: 86 },
      { q: "Q27", topic: "Colour wheel pairs", right: 81 },
      { q: "Q33", topic: "Folded paper cut", right: 78 },
    ],
    progress: [
      { mock: "Free sectional", percentile: 74.2 },
      { mock: "AIDMT 1", percentile: 88.6 },
      { mock: "AIDMT 2", percentile: 97.1 },
    ],
    realTakers: 16000,
    colleges: [
      { name: "IIT Bombay", close: 60 },
      { name: "IIT Delhi", close: 110 },
      { name: "IIT Guwahati", close: 260 },
      { name: "IIT Hyderabad", close: 300 },
      { name: "IIT Roorkee", close: 420 },
      { name: "IIITDM Jabalpur", close: 900 },
    ],
    pace: { seed: 7, plus: 4, minus: 1, parts: [
      { name: "NAT", n: 16, mins: 38, right: 11, wrong: 2, noNegative: true },
      { name: "MSQ", n: 18, mins: 40, right: 12, wrong: 4 },
      { name: "MCQ", n: 22, mins: 32, right: 18, wrong: 3 },
    ] },
    plan: {
      to: 214,
      focus: [
        { topic: "Creative drawing in Part B", gain: 12, why: "Your widest gap to the topper" },
        { topic: "Easy visualisation in NAT", gain: 8, why: "Three easy ones missed" },
        { topic: "Guessing on MSQ", gain: 7, why: "Lost to negative marking" },
      ],
      weeks: [
        "Ten timed concept sketches, 8 minutes each. Get two marked by a mentor.",
        "Redo this mock’s visualisation set, then 30 new NAT questions.",
        "Answer MSQs only when sure, then sit the next AIDMT.",
      ],
    },
  },
  {
    id: "meher",
    name: "Meher",
    cls: "Dropper",
    woman: true,
    exam: "NID",
    mock: "AIDMT 1 · NID mock",
    takers: 1680,
    rank: 212,
    classRank: 77,
    classSize: 520,
    womenRank: 88,
    womenSize: 790,
    mean: 46,
    sd: 13,
    parts: [
      { name: "Objective", max: 40, you: 26, avg: 19, top: 35, mins: 60 },
      { name: "Sketching", max: 30, you: 18, avg: 14, top: 27, mins: 60 },
      { name: "Design problem", max: 30, you: 17, avg: 13, top: 26, mins: 60 },
    ],
    skills: skills([70, 82, 58, 74, 52, 79], [90, 92, 84, 88, 82, 90]),
    accuracy: { correct: 29, wrong: 7, skipped: 4, negative: 2, topper: 92 },
    easyMissed: [
      { q: "Q4", topic: "Odd one out: textures", right: 84 },
      { q: "Q19", topic: "Count the cubes", right: 79 },
    ],
    progress: [
      { mock: "Free sectional", percentile: 70.4 },
      { mock: "AIDMT 1", percentile: 87.4 },
    ],
    realTakers: 12000,
    colleges: [
      { name: "NID Ahmedabad", close: 120 },
      { name: "NID Andhra Pradesh", close: 500 },
      { name: "NID Haryana", close: 600 },
      { name: "NID Madhya Pradesh", close: 650 },
      { name: "NID Assam", close: 750 },
    ],
    pace: { seed: 11, plus: 1, minus: 0.25, parts: [{ name: "Objective", n: 40, mins: 60, right: 29, wrong: 7 }] },
    plan: {
      to: 72,
      focus: [
        { topic: "Explaining design solutions", gain: 5, why: "Furthest from the topper" },
        { topic: "Counting and visualising cubes", gain: 3, why: "Missed one most got right" },
        { topic: "Odd one out with textures", gain: 3, why: "An easy one missed" },
      ],
      weeks: [
        "Explain three design solutions a day in under 60 words each.",
        "A timed set of 15 visualisation questions every day.",
        "Sit the next NID mock and compare this card.",
      ],
    },
  },
  {
    id: "isha",
    name: "Isha",
    cls: "Class 11",
    woman: true,
    exam: "NIFT",
    mock: "AIDMT 3 · NIFT mock",
    takers: 1320,
    rank: 389,
    classRank: 58,
    classSize: 310,
    womenRank: 170,
    womenSize: 640,
    mean: 104,
    sd: 31,
    parts: [
      { name: "GAT: Maths", max: 40, you: 18, avg: 14, top: 26, mins: 40 },
      { name: "GAT: English", max: 40, you: 22, avg: 17, top: 27, mins: 35 },
      { name: "GAT: GK and reasoning", max: 40, you: 17, avg: 14, top: 25, mins: 45 },
      { name: "CAT: Drawing", max: 80, you: 64, avg: 52, top: 76, mins: 180 },
    ],
    skills: skills([62, 74, 44, 80, 66, 83], [86, 88, 82, 90, 84, 91]),
    accuracy: { correct: 52, wrong: 14, skipped: 18, negative: 4, topper: 90 },
    easyMissed: [
      { q: "Q8", topic: "Percentages", right: 88 },
      { q: "Q41", topic: "Synonyms", right: 83 },
      { q: "Q57", topic: "Seating arrangement", right: 76 },
    ],
    progress: [
      { mock: "AIDMT 1", percentile: 52.0 },
      { mock: "AIDMT 2", percentile: 61.3 },
      { mock: "AIDMT 3", percentile: 70.6 },
    ],
    realTakers: 20000,
    colleges: [
      { name: "NIFT Delhi", close: 150 },
      { name: "NIFT Mumbai", close: 250 },
      { name: "NIFT Bengaluru", close: 350 },
      { name: "NIFT Hyderabad", close: 600 },
      { name: "NIFT Kolkata", close: 800 },
      { name: "NIFT Gandhinagar", close: 900 },
    ],
    pace: { seed: 5, plus: 1, minus: 0.25, parts: [
      { name: "GAT: Maths", n: 28, mins: 40, right: 17, wrong: 6 },
      { name: "GAT: English", n: 28, mins: 35, right: 19, wrong: 4 },
      { name: "GAT: GK and reasoning", n: 28, mins: 45, right: 16, wrong: 4 },
    ] },
    plan: {
      to: 139,
      focus: [
        { topic: "Problem solving in GAT Maths", gain: 8, why: "Your weakest skill" },
        { topic: "GK questions left blank", gain: 6, why: "Eight skipped" },
        { topic: "Negative marks in Maths", gain: 4, why: "Six wrong answers" },
      ],
      weeks: [
        "Percentages and ratios, 25 questions a day.",
        "Twenty minutes of news, then a 15-question GK quiz.",
        "Attempt any question you can narrow to two options.",
      ],
    },
  },
];

export const scoreOf = (s: SampleScorecard) => s.parts.reduce((sum, p) => sum + p.you, 0);
export const maxOf = (s: SampleScorecard) => s.parts.reduce((sum, p) => sum + p.max, 0);
export const topperOf = (s: SampleScorecard) => s.parts.reduce((sum, p) => sum + p.top, 0);
export const avgOf = (s: SampleScorecard) => s.parts.reduce((sum, p) => sum + p.avg, 0);
export const percentileOf = (rank: number, of: number) => Math.round((1 - (rank - 1) / of) * 1000) / 10;

/* A mock rank turned into a likely real-exam rank range, for one category. */
export function likelyRank(s: SampleScorecard, share: number) {
  const behind = 1 - percentileOf(s.rank, s.takers) / 100;
  const mid = Math.max(1, behind * s.realTakers * share);
  return { low: Math.max(1, Math.round(mid * 0.75)), high: Math.max(2, Math.round(mid * 1.35)) };
}

export type Band = "likely" | "possible" | "reach" | "far";
/* Likely: even the worse end of the range is inside last year's closing rank. */
export function bandOf(range: { low: number; high: number }, close: number): Band {
  if (range.high <= close) return "likely";
  if (range.low <= close) return "possible";
  if (range.low <= close * 1.6) return "reach";
  return "far";
}

/* A seeded shuffle, so the made-up questions come out the same on every visit. */
function seeded(seed: number) {
  let x = seed >>> 0;
  return () => (x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 4294967296;
}

/* The sample's objective questions, one by one: how long each took and the
   marks it brought. Counts match the accuracy card; the slowest wrong or
   skipped question in each part takes about three times as long as the rest. */
export function questionsOf(s: SampleScorecard): SampleQuestion[] {
  const r = seeded(s.pace.seed);
  const out: SampleQuestion[] = [];
  let n = 1;
  for (const part of s.pace.parts) {
    const kinds: SampleQuestion["outcome"][] = [
      ...Array<SampleQuestion["outcome"]>(part.right).fill("right"),
      ...Array<SampleQuestion["outcome"]>(part.wrong).fill("wrong"),
      ...Array<SampleQuestion["outcome"]>(part.n - part.right - part.wrong).fill("skipped"),
    ];
    for (let i = kinds.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
    }
    const weights = kinds.map((k) => (0.45 + r() * 1.3) * (k === "wrong" ? 1.5 : k === "skipped" ? 0.7 : 1));
    const slow = kinds.findIndex((k) => k !== "right");
    if (slow >= 0) weights[slow] *= 3.2;
    const total = weights.reduce((a, b) => a + b, 0);
    kinds.forEach((k, i) => {
      const marks = k === "right" ? s.pace.plus : k === "wrong" && !part.noNegative ? -s.pace.minus : 0;
      out.push({ n: n++, part: part.name, secs: Math.round((weights[i] / total) * part.mins * 60), marks, outcome: k });
    });
  }
  return out;
}
