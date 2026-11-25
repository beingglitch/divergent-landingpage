/* One made-up NID student across the three AIDMT mocks of the 21 Days NID
   Masterclass, for the scorecard cards on /nid-masterclass/. Built on the NID
   sample of /aidmt/ (lib/aidmt-sample), so every card draws the same way;
   only the marks, ranks and skills change from mock to mock. Every number is
   invented, and the page says so.

   Parts add up: each mock's `you` marks are its score, and the percentiles in
   `progress` are the ranks of the mocks before it. */

import { SAMPLES, percentileOf, type SampleScorecard } from "./aidmt-sample";

const base = SAMPLES.find((s) => s.exam === "NID")!;
const TAKERS = 1680;

type Step = {
  rank: number;
  marks: [number, number, number];
  skills: number[];
  accuracy: { correct: number; wrong: number; skipped: number; negative: number };
};

const STEPS: Step[] = [
  { rank: 612, marks: [20, 13, 11], skills: [56, 64, 44, 60, 40, 62], accuracy: { correct: 24, wrong: 10, skipped: 6, negative: 2.5 } },
  { rank: 284, marks: [25, 17, 15], skills: [68, 74, 56, 70, 52, 72], accuracy: { correct: 28, wrong: 8, skipped: 4, negative: 2 } },
  { rank: 96, marks: [30, 21, 20], skills: [80, 84, 70, 80, 66, 82], accuracy: { correct: 32, wrong: 5, skipped: 3, negative: 1.25 } },
];

const mockName = (n: number) => `AIDMT ${n + 1}`;

export const MASTERCLASS_SAMPLES: SampleScorecard[] = STEPS.map((step, n) => ({
  ...base,
  id: `mc-${n + 1}`,
  name: "Meher",
  mock: `${mockName(n)} · NID mock`,
  takers: TAKERS,
  rank: step.rank,
  classRank: Math.round(step.rank * 0.32),
  classSize: 520,
  womenRank: Math.round(step.rank * 0.45),
  womenSize: 790,
  parts: base.parts.map((part, i) => ({ ...part, you: step.marks[i] })),
  skills: base.skills.map((skill, i) => ({ ...skill, you: step.skills[i] })),
  accuracy: { ...base.accuracy, ...step.accuracy },
  progress: STEPS.slice(0, n + 1).map((s, i) => ({ mock: mockName(i), percentile: percentileOf(s.rank, TAKERS) })),
}));
