"use client";

import { useEffect } from "react";

/**
 * Every `title` in the app shows the app's own tooltip instead of the
 * browser's plain box, with no change to the element that has it. On mouse
 * hover or keyboard focus the title moves to data-tip (so the browser shows
 * nothing) and a bubble in the site's colours appears above it, or
 * below when there is no room. Mounted once in app/layout, so
 * new code can keep writing title="..." and still get the styled tip.
 */

const DELAY = 250;
const GAP = 8;
const EDGE = 8;

export function TitleTips() {
  useEffect(() => {
    const tip = document.createElement("div");
    tip.id = "title-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    tip.style.cssText = [
      "position:fixed", "z-index:400", "pointer-events:none", "max-width:min(320px,calc(100vw - 16px))",
      "padding:6px 10px", "border-radius:10px", "background:var(--ink)", "color:var(--paper)", "font-family:var(--f-body)",
      "font-size:12.5px", "font-weight:500", "line-height:1.4", "white-space:pre-line", "overflow-wrap:anywhere",
      "box-shadow:var(--shadow-md)", "opacity:0", "transition:opacity .12s ease",
    ].join(";");
    document.body.appendChild(tip);

    let current: Element | null = null;
    let timer = 0;

    /* The title moves to data-tip the first time the element is pointed at.
       An element named only by its title keeps that name for screen readers. */
    const textOf = (el: Element) => {
      const title = el.getAttribute("title");
      if (title !== null) {
        el.removeAttribute("title");
        if (title.trim()) {
          el.setAttribute("data-tip", title);
          if (!el.getAttribute("aria-label") && !el.textContent?.trim()) el.setAttribute("aria-label", title);
        }
      }
      return el.getAttribute("data-tip") ?? "";
    };

    const hide = () => {
      window.clearTimeout(timer);
      if (current) {
        if (current.getAttribute("aria-describedby") === tip.id) current.removeAttribute("aria-describedby");
        current = null;
      }
      tip.style.opacity = "0";
      tip.hidden = true;
    };

    const place = (el: Element) => {
      const r = el.getBoundingClientRect();
      tip.hidden = false;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      const left = Math.min(Math.max(EDGE, r.left + r.width / 2 - w / 2), window.innerWidth - w - EDGE);
      const above = r.top - GAP - h;
      const top = above >= EDGE ? above : Math.min(r.bottom + GAP, window.innerHeight - h - EDGE);
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
      tip.style.opacity = "1";
    };

    const show = (el: Element, now = false) => {
      const text = textOf(el);
      if (!text) return;
      if (current === el && !tip.hidden) return;
      hide();
      current = el;
      timer = window.setTimeout(() => {
        if (current !== el || !el.isConnected) return;
        tip.textContent = el.getAttribute("data-tip") ?? text;
        if (!el.getAttribute("aria-describedby")) el.setAttribute("aria-describedby", tip.id);
        place(el);
      }, now ? 0 : DELAY);
    };

    const holder = (node: EventTarget | null) => (node instanceof Element ? node.closest("[title],[data-tip]") : null);

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = holder(e.target);
      if (el) show(el);
      else if (current) hide();
    };
    const onOut = (e: PointerEvent) => {
      if (!current) return;
      const to = e.relatedTarget;
      if (to instanceof Node && current.contains(to)) return;
      hide();
    };
    const onFocus = (e: FocusEvent) => {
      const el = holder(e.target);
      if (el && e.target instanceof Element && e.target.matches(":focus-visible")) show(el, true);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("focusout", hide, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("focusout", hide, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
      tip.remove();
    };
  }, []);
  return null;
}
