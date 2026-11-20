/* The visitor's class: Class 11, Class 12 or Dropper. One per visitor.
   Chosen in the popup or the nav's class button, or read from a signed-in
   student's account. Kept in this browser so it is asked once, and
   broadcast so the courses page re-filters the moment it changes. */

export type StudentClass = "11" | "12" | "dropper";

export const CLASSES: { v: StudentClass; label: string }[] = [
  { v: "11", label: "Class 11" },
  { v: "12", label: "Class 12" },
  { v: "dropper", label: "Dropper" },
];

export const classLabel = (c: StudentClass | null) => CLASSES.find((x) => x.v === c)?.label ?? null;

const KEY = "dc-class";
/* Set when the visitor skips the popup, so it does not ask again. */
const SKIPPED = "dc-class-skipped";
export const CLASS_EVENT = "dc-class-change";

const isClass = (v: unknown): v is StudentClass => v === "11" || v === "12" || v === "dropper";

export function readClass(): StudentClass | null {
  try {
    const v = localStorage.getItem(KEY);
    return isClass(v) ? v : null;
  } catch {
    return null;
  }
}

export function writeClass(c: StudentClass | null) {
  try {
    if (c) localStorage.setItem(KEY, c);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent<StudentClass | null>(CLASS_EVENT, { detail: c }));
}

export function wasSkipped() {
  try {
    return localStorage.getItem(SKIPPED) === "1";
  } catch {
    return false;
  }
}

export function markSkipped() {
  try {
    localStorage.setItem(SKIPPED, "1");
  } catch {}
}

export { isClass };
