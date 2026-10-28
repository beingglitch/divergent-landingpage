/* Runs on every page: top nav, side dots, reveals, FAQs, testimonial
   videos, the work gallery and the "Book a free call" links.
   Returns a cleanup that undoes everything it set up. */
import { fromPrice } from "./config";

const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

export function initSite(): () => void {
  const doc = document;
  const ac = new AbortController();
  const signal = ac.signal;
  const cleanups: Array<() => void> = [() => ac.abort()];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const y = $("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- top nav: progress, shadow, Exams menu, mobile menu ---------- */
  (() => {
    const nav = $(".nav"), bar = $(".progress");
    if (!nav || !bar) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = doc.documentElement.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0;
        bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
        nav.classList.toggle("scrolled", scrollY > 8);
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true, signal });
    onScroll();

    const dd = $(".dd"), ddBtn = $(".dd-btn");
    if (dd && ddBtn) {
      let closeTimer: ReturnType<typeof setTimeout> | undefined;
      const setDd = (open: boolean) => ddBtn.setAttribute("aria-expanded", String(open));
      ddBtn.addEventListener("click", () => setDd(ddBtn.getAttribute("aria-expanded") !== "true"), { signal });
      dd.addEventListener("mouseenter", () => { clearTimeout(closeTimer); setDd(true); }, { signal });
      dd.addEventListener("mouseleave", () => { closeTimer = setTimeout(() => setDd(false), 150); }, { signal });
      dd.addEventListener("focusout", (e) => { if (!dd.contains((e as FocusEvent).relatedTarget as Node | null)) setDd(false); }, { signal });
      doc.addEventListener("click", (e) => { if (!dd.contains(e.target as Node)) setDd(false); }, { signal });
      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && ddBtn.getAttribute("aria-expanded") === "true") { setDd(false); ddBtn.focus(); }
      }, { signal });
      cleanups.push(() => { clearTimeout(closeTimer); setDd(false); });
    }

    const btn = $(".menu-btn"), menu = $("#mnav"), main = $("#main"), foot = $(".foot");
    if (!btn || !menu) return;
    const blocks = [main, foot].filter((el): el is HTMLElement => !!el);
    const setMenu = (open: boolean) => {
      btn.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
      doc.body.style.overflow = open ? "hidden" : "";
      blocks.forEach((el) => { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
      if (open) { const f = $("a", menu); if (f) setTimeout(() => f.focus(), 60); }
      else btn.focus({ preventScroll: true });
    };
    btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"), { signal });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      doc.body.style.overflow = "";
      blocks.forEach((el) => el.removeAttribute("inert"));
    }, { signal }));
    doc.addEventListener("keydown", (e) => {
      if (!menu.classList.contains("open")) return;
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab") {
        const f = [btn, ...$$("a", menu)], i = f.indexOf(doc.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    }, { signal });
    addEventListener("resize", () => { if (innerWidth >= 1000 && menu.classList.contains("open")) setMenu(false); }, { signal });
    cleanups.push(() => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      doc.body.style.overflow = "";
      blocks.forEach((el) => el.removeAttribute("inert"));
    });
  })();

  /* ---------- side dots: one per [data-dot] section ---------- */
  (() => {
    const sections = $$("[data-dot][id]"), wrap = $(".sdots"), list = wrap && $("ol", wrap);
    if (!wrap || !list) return;
    list.textContent = "";
    wrap.hidden = true;
    if (sections.length < 2) return;
    const map: Record<string, HTMLAnchorElement> = {};
    sections.forEach((s) => {
      const li = doc.createElement("li"), a = doc.createElement("a"), label = doc.createElement("span");
      a.href = "#" + s.id;
      label.textContent = s.getAttribute("data-dot");
      a.appendChild(label); li.appendChild(a); list.appendChild(li); map[s.id] = a;
    });
    wrap.hidden = false;
    const links = $$<HTMLAnchorElement>("a", list);
    const mark = (id: string) => links.forEach((x) => { if (x === map[id]) x.setAttribute("aria-current", "true"); else x.removeAttribute("aria-current"); });
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) mark(e.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => so.observe(s));
    mark(sections[0].id);
    cleanups.push(() => { so.disconnect(); list.textContent = ""; wrap.hidden = true; });
  })();

  /* ---------- reveals + number counters ---------- */
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const count = (el: HTMLElement) => {
    const to = +(el.getAttribute("data-count") || 0);
    if (reduce) { el.textContent = to.toLocaleString("en-IN"); return; }
    const t0 = performance.now(), dur = to > 1000 ? 1300 : 900;
    const f = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * ease(p)).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(f); else el.textContent = to.toLocaleString("en-IN");
    };
    f(t0);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        $$("[data-count]", e.target).forEach(count);
        io.unobserve(e.target);
      }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$(".rv,.eyebrow-l").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  } else {
    $$(".rv,.eyebrow-l").forEach((el) => el.classList.add("in"));
  }

  /* ---------- FAQ topic tabs (without JS every group shows) ---------- */
  $$(".faq-tabs").forEach((tl) => {
    tl.hidden = false;
    doc.documentElement.classList.add("faq-tabbed");
    const tabs = $$('[role="tab"]', tl);
    const sel = (id: string | null, focus?: boolean) => tabs.forEach((t) => {
      const on = t.getAttribute("aria-controls") === id, p = doc.getElementById(t.getAttribute("aria-controls") || "");
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (p) p.hidden = !on;
      if (on && focus) t.focus();
    });
    tabs.forEach((t) => t.addEventListener("click", () => sel(t.getAttribute("aria-controls")), { signal }));
    tl.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(doc.activeElement as HTMLElement);
      if (i < 0) return;
      let n: HTMLElement | null = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); sel(n.getAttribute("aria-controls"), true); }
    }, { signal });
    sel(tabs[0].getAttribute("aria-controls"));
  });

  /* ---------- FAQ accordion ---------- */
  $$(".faq").forEach((f, i) => {
    const q = $(".faq-q", f), a = $(".faq-a", f);
    if (!q || !a) return;
    q.id = "faq-q-" + (i + 1); a.id = "faq-a-" + (i + 1);
    q.setAttribute("aria-controls", a.id);
    a.setAttribute("role", "region");
    a.setAttribute("aria-labelledby", q.id);
    q.addEventListener("click", () => {
      const open = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!open));
      f.classList.toggle("open", !open);
    }, { signal });
  });

  /* ---------- the 75-day course card: "From" price for today ---------- */
  $$("[data-crash-from]").forEach((el) => { el.textContent = "From ₹" + fromPrice(new Date()).toLocaleString("en-IN"); });

  /* ---------- testimonial videos: play one at a time ---------- */
  (() => {
    const cards = $$(".vcard");
    cards.forEach((card) => {
      const v = $<HTMLVideoElement>("video", card), b = $(".vplay", card);
      if (!v || !b) return;
      b.addEventListener("click", () => {
        cards.forEach((o) => { const ov = $<HTMLVideoElement>("video", o); if (ov && ov !== v && !ov.paused) ov.pause(); });
        v.controls = true; card.classList.add("on"); void v.play();
      }, { signal });
      v.addEventListener("pause", () => { if (v.ended || v.currentTime === 0) card.classList.remove("on"); }, { signal });
      v.addEventListener("ended", () => { card.classList.remove("on"); v.controls = false; v.load(); }, { signal });
    });
  })();

  /* ---------- work gallery: open a piece full size ---------- */
  (() => {
    const items = $$<HTMLAnchorElement>("[data-zoom]");
    if (!items.length) return;
    const dlg = doc.createElement("dialog");
    dlg.className = "zoom";
    dlg.innerHTML = '<button class="zoom-x" type="button" aria-label="Close">×</button><img alt="">';
    doc.body.appendChild(dlg);
    const img = $<HTMLImageElement>("img", dlg)!;
    items.forEach((a) => a.addEventListener("click", (e) => {
      if (!dlg.showModal) return;
      e.preventDefault();
      img.src = a.getAttribute("href") || "";
      img.alt = a.getAttribute("data-zoom") || "";
      dlg.showModal();
    }, { signal }));
    dlg.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (t === dlg || t.classList.contains("zoom-x")) dlg.close();
    }, { signal });
    cleanups.push(() => dlg.remove());
  })();

  /* ---------- "Book a free call": scroll to the form and focus Name ---------- */
  (() => {
    const goToForm = (smooth: boolean) => {
      const sec = doc.getElementById("book"), name = doc.getElementById("lead-name") as HTMLInputElement | null;
      if (!sec) return false;
      sec.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
      if (name) setTimeout(() => name.focus({ preventScroll: true }), smooth && !reduce ? 450 : 0);
      return true;
    };
    doc.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const href = a.getAttribute("href");
      if (href !== "#book" && href !== "/#book") return;
      if (location.pathname !== "/") return;
      if (goToForm(true)) {
        e.preventDefault();
        history.replaceState(null, "", "#book");
      }
    }, { signal });
    if (location.hash === "#book") {
      const t = setTimeout(() => goToForm(false), 60);
      cleanups.push(() => clearTimeout(t));
    }
  })();

  return () => cleanups.forEach((fn) => fn());
}
