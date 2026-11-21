/* The parts of the AIDMT scorecard, in the order the dashboard lays them out.
   /aidmt/ gives each a short section of its own, numbered like the yellow
   callouts on the hero dashboard; components/AidmtScorecard draws the cards.
   Each section says one thing: the card shows the rest.

   This is what every student's scorecard has to show after results, so the
   app's scorecard must keep up with anything promised here. */

export type FeatureId = "rank" | "crowd" | "parts" | "skills" | "accuracy" | "time" | "missed" | "progress" | "colleges" | "plan" | "share";

export type Feature = {
  id: FeatureId;
  /* The card's name, as on the dashboard. */
  title: string;
  heading: string;
  /* Two or three short bullets: what the card tells you. */
  points: string[];
  /* Not in the app's scorecard yet (LMS lib/aidmt-scorecard): shown with "Coming soon". */
  soon?: boolean;
};

export const FEATURES: Feature[] = [
  { id: "rank", title: "Your rank", heading: "Where do you really stand?", points: ["Your All India Rank and percentile", "Your rank among students in your class", "Among women and in your category: coming soon"] },
  { id: "crowd", title: "Where you are in the crowd", heading: "A score means nothing on its own.", points: ["Every score from the mock on one curve", "Where most students landed", "How far the topper is from you"] },
  { id: "parts", title: "Part by part", heading: "Find the part that’s pulling you down.", points: ["Each part against the average and the topper", "Your strongest and weakest parts, marked", "Where next week’s practice should go"] },
  { id: "skills", title: "Skill map", heading: "Know your strengths, and your blind spot.", points: ["Every question tests a design skill", "What comes naturally to you", "The skill that needs the most work"] },
  { id: "accuracy", title: "Accuracy", heading: "Is guessing costing you marks?", points: ["Right, wrong and skipped at a glance", "The exact marks negative marking took", "Sometimes fewer attempts score more"] },
  { id: "time", title: "Marks against time", heading: "Which questions ate your time?", points: ["Every question placed by the time it took", "The slow ones that still lost marks", "What to skip next time"], soon: true },
  { id: "missed", title: "Easy ones you missed", heading: "The easy marks you let slip.", points: ["Questions most students got right", "Solved in the mock’s solutions session", "So the same mistake never costs you twice"] },
  { id: "progress", title: "Mock to mock", heading: "Proof that you’re improving.", points: ["Your percentile across every mock", "The climb, even on slow weeks"] },
  { id: "colleges", title: "Colleges in range", heading: "Which colleges are in reach?", points: ["Your likely rank in the real exam", "Set against last year’s closing ranks", "An honest estimate, never a promise"], soon: true },
  { id: "plan", title: "Your plan", heading: "A plan made from your own paper.", points: ["AI finds where your easiest marks are", "Topics ranked by the marks you can win back", "A week by week roadmap to your best score"], soon: true },
  { id: "share", title: "A rank card to share", heading: "A rank worth sharing.", points: ["Your rank on a card for your story", "Or keep it as the number to beat"] },
];
