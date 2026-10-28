"use client";

import { useEffect } from "react";

/* Courses page: filter the list by exam and type, kept in the URL so a
   filtered view can be shared (/courses/?exam=nid&type=mocks). */
export function CoursesFilter() {
  useEffect(() => {
    const doc = document;
    const ac = new AbortController();
    const $ = (s: string, c: ParentNode = doc) => c.querySelector<HTMLElement>(s);
    const $$ = (s: string, c: ParentNode = doc) => Array.from(c.querySelectorAll<HTMLElement>(s));
    const cards = $$("#courseList .ccard"), count = $("#fcount"), empty = $("#fempty"), reset = $("#freset");
    const params = new URLSearchParams(location.search);
    const state: Record<string, string> = { exam: params.get("exam") || "all", type: params.get("type") || "all" };

    const render = (push: boolean) => {
      $$("[data-filter]").forEach((group) => {
        const key = group.getAttribute("data-filter") || "";
        if (!$('[data-value="' + state[key] + '"]', group)) state[key] = "all";
        $$(".chip-f", group).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-value") === state[key])));
      });
      let shown = 0;
      cards.forEach((c) => {
        const ok = (state.exam === "all" || (c.getAttribute("data-exams") || "").split(" ").includes(state.exam))
          && (state.type === "all" || c.getAttribute("data-type") === state.type);
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown + (shown === 1 ? " course" : " courses");
      if (empty) empty.hidden = shown > 0;
      if (push) {
        const q = new URLSearchParams();
        if (state.exam !== "all") q.set("exam", state.exam);
        if (state.type !== "all") q.set("type", state.type);
        const qs = q.toString();
        history.replaceState(history.state, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
      }
    };
    $$("[data-filter]").forEach((group) => {
      const key = group.getAttribute("data-filter") || "";
      $$(".chip-f", group).forEach((b) => b.addEventListener("click", () => {
        state[key] = b.getAttribute("data-value") || "all";
        render(true);
      }, { signal: ac.signal }));
    });
    reset?.addEventListener("click", () => { state.exam = "all"; state.type = "all"; render(true); }, { signal: ac.signal });
    render(false);
    return () => ac.abort();
  }, []);
  return null;
}
