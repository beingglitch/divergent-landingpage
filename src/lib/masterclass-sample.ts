/* One made-up student per exam across a program's three AIDMT mocks, for the
   scorecard cards on the program pages (components/ProgramPage). Built on
   that exam's sample on /aidmt/ (lib/aidmt-sample), so every card draws the
   same way; only the marks, ranks and skills change from mock to mock. Every
   number is invented, and the page says so.

   Each step's marks are the paper's parts in order, and the percentiles in
   `progress` are the ranks of the mocks before it. */

import { SAMPLES, percentileOf, type SampleScorecard } from "./aidmt-sample";

type Step = {
  rank: number;
  marks: number[];
  skills: number[];
  accuracy: { correct: number; wrong: number; skipped: number; negative: number };
};

const STEPS: Record<"NID" | "UCEED", { takers: number; classShare: number; steps: Step[] }> = {
  /* Objective, Sketching, Design problem. */
  NID: {
    takers: 1680,
    classShare: 0.32,
    steps: [
      { rank: 612, marks: [20, 13, 11], skills: [56, 64, 44, 60, 40, 62], accuracy: { correct: 24, wrong: 10, skipped: 6, negative: 2.5 } },
      { rank: 284, marks: [25, 17, 15], skills: [68, 74, 56, 70, 52, 72], accuracy: { correct: 28, wrong: 8, skipped: 4, negative: 2 } },
      { rank: 96, marks: [30, 21, 20], skills: [80, 84, 70, 80, 66, 82], accuracy: { correct: 32, wrong: 5, skipped: 3, negative: 1.25 } },
    ],
  },
  /* NAT, MSQ, MCQ, Sketching, Design aptitude. */
  UCEED: {
    takers: 2140,
    classShare: 0.6,
    steps: [
      { rank: 980, marks: [32, 34, 30, 27, 17], skills: [60, 52, 58, 38, 46, 50], accuracy: { correct: 32, wrong: 14, skipped: 10, negative: 11 } },
      { rank: 260, marks: [40, 44, 39, 36, 23], skills: [70, 62, 66, 50, 54, 60], accuracy: { correct: 37, wrong: 11, skipped: 8, negative: 9 } },
      { rank: 48, marks: [50, 55, 48, 45, 29], skills: [82, 76, 80, 66, 68, 74], accuracy: { correct: 44, wrong: 7, skipped: 5, negative: 6 } },
    ],
  },
};

const mockName = (n: number) => `AIDMT ${n + 1}`;

export function samplesFor(exam: "NID" | "UCEED"): SampleScorecard[] {
  const base = SAMPLES.find((s) => s.exam === exam)!;
  const { takers, classShare, steps } = STEPS[exam];
  return steps.map((step, n) => ({
    ...base,
    id: `${exam.toLowerCase()}-${n + 1}`,
    mock: `${mockName(n)} · ${exam} mock`,
    takers,
    rank: step.rank,
    classRank: Math.max(1, Math.round(step.rank * classShare)),
    womenRank: base.woman ? Math.round(step.rank * 0.45) : null,
    parts: base.parts.map((part, i) => ({ ...part, you: step.marks[i] ?? part.you })),
    skills: base.skills.map((skill, i) => ({ ...skill, you: step.skills[i] ?? skill.you })),
    accuracy: { ...base.accuracy, ...step.accuracy },
    progress: steps.slice(0, n + 1).map((s, i) => ({ mock: mockName(i), percentile: percentileOf(s.rank, takers) })),
  }));
}
