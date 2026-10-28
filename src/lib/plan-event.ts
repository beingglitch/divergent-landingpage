import type { Batch, Exam, Plan } from "./config";

/* The plan picker announces each pick so the call form can prefill it. */
export type PlanPick = { plan: Plan; batch: Batch; exam: Exam; pack: boolean; slug: string; label: string };
export const PLAN_EVENT = "dc:plan";

declare global {
  interface Window { __dcPlan?: PlanPick }
}
