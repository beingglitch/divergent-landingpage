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
  /* A word or two for the chip that picks this card on a phone. */
  short: string;
  heading: string;
  /* Not in the app's scorecard yet (LMS lib/aidmt-scorecard): shown with "Coming soon". */
  soon?: boolean;
};

export const FEATURES: Feature[] = [
  { id: "rank", short: "Rank", title: "Your rank", heading: "Where do you really stand?" },
  { id: "crowd", short: "The crowd", title: "Where you are in the crowd", heading: "How do you compare?" },
  { id: "parts", short: "Parts", title: "Part by part", heading: "Which part pulls you down?" },
  { id: "skills", short: "Skills", title: "Skill map", heading: "Your strongest skills" },
  { id: "accuracy", short: "Accuracy", title: "Accuracy", heading: "Is guessing costing you marks?" },
  { id: "time", short: "Time", title: "Marks against time", heading: "Which questions ate your time?", soon: true },
  { id: "missed", short: "Easy misses", title: "Easy ones you missed", heading: "Easy marks you missed" },
  { id: "progress", short: "Progress", title: "Mock to mock", heading: "Are you improving?" },
  { id: "colleges", short: "Colleges", title: "Colleges in range", heading: "Which colleges are in reach?", soon: true },
  { id: "plan", short: "AI plan", title: "Your plan", heading: "Your AI study plan", soon: true },
  { id: "share", short: "Share", title: "A rank card to share", heading: "Share your rank" },
];
