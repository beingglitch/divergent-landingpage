/* The home page: prices, countdowns, the course tabs, the hero dots and the
   sticky bar. Prices, dates and links come from src/lib/config.ts.
   Returns a cleanup that undoes everything it set up. */
import { APP_URL, CONFIG, COURSE_SLUG, PLAN_NAMES, bundleSlug, checkoutUrl, ist, planLabel, pricePeriod, tierKey, type Batch, type Exam, type PayCode, type Plan } from "./config";

import { PLAN_EVENT, type PlanPick } from "./plan-event";

const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

export function initHome(): () => void {
  const doc = document;
  const A = CONFIG.approvals;
  const ac = new AbortController();
  const signal = ac.signal;
  const cleanups: Array<() => void> = [() => ac.abort()];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- time (IST) ---------- */
  // Preview another day: ?preview-date=2026-11-07 (or 2026-11-07T10:00).
  const pm = /[?&]preview-date=(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2})?/.exec(location.search);
  const NOW = pm ? () => ist(pm[1] + (pm[2] ? pm[2] + ":00" : "T12:00:00")) : () => new Date();
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
  const sameDay = (a: Date, b: Date) => ymd.format(a) === ymd.format(b);
  const D: Record<string, Date> = {};
  Object.keys(CONFIG.dates).forEach((k) => { D[k] = ist(CONFIG.dates[k]); });
  const inr = (n: number) => "₹" + Number(n).toLocaleString("en-IN");

  /* ---------- approvals and dated items ---------- */
  const ok = (list: string) => list.split(",").every((k) => !!A[k.trim()]);
  $$("[data-req]").forEach((el) => { if (!ok(el.getAttribute("data-req") || "")) el.hidden = true; });
  $$("[data-until]").forEach((el) => { if (NOW() > ist(el.getAttribute("data-until") || "")) el.hidden = true; });
  $$("[data-after]").forEach((el) => { if (NOW() < ist(el.getAttribute("data-after") || "")) el.hidden = true; });

  /* ---------- copy that changes with the date ---------- */
  (() => {
    const t = NOW();
    if (t > D.batchStartEnd) {
      const es = $("[data-eyebrow-start]"), hk = $("[data-hf-k]"), fh = $("[data-final-h]");
      if (es) es.textContent = "3 Nov · recordings ready";
      if (hk) hk.textContent = "Classes started";
      if (fh) fh.textContent = "Classes started 3 November. Recordings of everything you missed are waiting.";
    }
    const n = $("#nudge"), nt = $("#nudge-t");
    let msg = "";
    if (t <= D.uceedRegEnds) msg = "UCEED registration closes 31 October.";
    else if (t <= D.uceedLateEnds) msg = "UCEED late registration open till 6 November.";
    else if (t <= D.nidRegEnds) msg = "NID DAT registration closes 30 November.";
    if (msg && n && nt) { nt.textContent = msg; n.hidden = false; }
  })();

  /* ---------- countdowns and key-date status ---------- */
  const dfmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long" });
  const tickCountdowns = () => {
    const t = NOW();
    $$("[data-countdown]").forEach((el) => {
      const target = ist(el.getAttribute("data-countdown") || ""), day = ist(el.getAttribute("data-countdown-date") + "T12:00:00");
      const num = $("[data-cd-num]", el), unit = $("[data-cd-unit]", el), when = $("[data-cd-when]", el);
      if (!num || !unit) return;
      if (sameDay(t, day)) { num.textContent = "Today"; unit.textContent = dfmt.format(day); return; }
      if (t > target) { num.textContent = "Done"; unit.textContent = "held on " + (when?.textContent || "").split(" · ")[0]; return; }
      const ms = target.getTime() - t.getTime(), days = Math.floor(ms / 864e5), hrs = Math.floor((ms % 864e5) / 36e5);
      num.textContent = String(days);
      unit.textContent = days >= 2 ? "days to go" : (days === 1 ? "day" : "days") + ", " + hrs + (hrs === 1 ? " hour" : " hours") + " to go";
    });
    $$("[data-tl]").forEach((list) => {
      let nextSet = false;
      $$("li", list).forEach((li) => {
        if (li.hidden) return;
        const end = ist(li.getAttribute("data-end") || ""), st = $(".st", li);
        if (!st) return;
        const start = new Date(end.getTime() - 864e5 + 1000);
        li.classList.remove("done", "next", "today");
        if (t > end) { li.classList.add("done"); st.textContent = "Done"; }
        else if (t >= start) { li.classList.add("today"); st.textContent = "Today"; nextSet = true; }
        else if (!nextSet) { li.classList.add("next"); st.textContent = "Next"; nextSet = true; }
        else { st.textContent = ""; st.hidden = true; return; }
        st.hidden = false;
      });
    });
  };
  tickCountdowns();
  let cdTimer = setInterval(tickCountdowns, 30000);
  doc.addEventListener("visibilitychange", () => {
    if (doc.hidden) clearInterval(cdTimer);
    else { tickCountdowns(); cdTimer = setInterval(tickCountdowns, 30000); }
  }, { signal });
  cleanups.push(() => clearInterval(cdTimer));

  /* ---------- pricing ---------- */
  /* Prices come from the app so the page and checkout always agree. Until
     they arrive, or if the app can't be reached, CONFIG is used. */
  type LiveOption = { code: string; total: number };
  type LivePlan = { price: number; listPrice: number; options: LiveOption[] };
  const live: Record<string, LivePlan> = {};
  const state: { batch: Batch; plan: Plan; exam: Exam; pack: boolean } = { batch: "combo", plan: "live", exam: "UCEED", pack: false };
  const period = () => pricePeriod(NOW());
  type Quote = { slug: string; now: number; list: number; two: number; three: number };
  /* What a plan costs today. two and three are part-payment totals, 0 when not offered. */
  const quote = (plan: Plan, batch: Batch, pack: boolean): Quote => {
    const slug = bundleSlug(plan, batch, state.exam, pack), lp = live[slug];
    if (lp) {
      const tot = (c: string) => lp.options.find((o) => o.code === c)?.total || 0;
      return { slug, now: lp.price, list: lp.listPrice, two: tot("2-parts"), three: tot("3-parts") };
    }
    const t = CONFIG.prices[tierKey(plan, pack)][batch], per = period();
    return { slug, now: t.price[per], list: t.price.list, two: t.twoParts?.[per] || 0, three: t.threeParts?.[per] || 0 };
  };
  const PERK: Record<string, string> = {
    mentor: "Pay in full and get a 1:1 onboarding call with Devansh. 15 minutes, in your first two weeks.",
    live: "Pay in full and join Devansh's onboarding session in week 1.",
  };
  const renderPricing = () => {
    const per = period();
    $$("#planPick .pcol").forEach((col) => {
      const plan = col.getAttribute("data-col") as Plan, pack = plan === "recorded" && state.pack;
      const q = quote(plan, state.batch, pack), card = $(".pcard", col);
      if (!card) return;
      const prEl = $("[data-pr]", card);
      if (prEl) prEl.innerHTML = '<span class="cur">₹</span>' + q.now.toLocaleString("en-IN");
      const save = q.list - q.now, sw = $("[data-save-wrap]", card);
      const till = per === "launch" ? " till 2 November" : per === "diwali" ? " till 11 November" : "";
      if (sw) sw.innerHTML = save > 0 ? '<span class="save">Save ' + inr(save) + till + "</span>" : "";
      const g = $("[data-gift]", card);
      if (g) {
        if (per === "diwali" && A.diwaliGift) { g.textContent = "Diwali gift: an extra sketch review" + (plan === "recorded" ? "." : " and a 5-mock pack."); g.hidden = false; }
        else g.hidden = true;
      }
      /* Payment options: pay in full first, then the part totals, then the perk. */
      const opts = $("[data-opts]", col);
      if (opts) {
        const row = (code: PayCode, text: string) => '<li><a href="' + checkoutUrl(q.slug, code) + '">' + text + "</a></li>";
        opts.innerHTML = row("full", "Pay in full: " + inr(q.now))
          + (q.two ? row("2-parts", "2 parts: " + inr(q.two) + " total") : "")
          + (q.three ? row("3-parts", "3 parts: " + inr(q.three) + " total") : "");
      }
      const perk = $("[data-perk]", col);
      if (perk) {
        const txt = plan === "recorded" ? (pack && state.batch === "combo" ? PERK.live : "") : PERK[plan];
        perk.textContent = txt;
        perk.hidden = !txt;
      }
      const emi = $("[data-emi]", col);
      if (emi) emi.hidden = !(A.emi && q.two);
      const join = $<HTMLAnchorElement>("[data-join]", col);
      if (join) join.href = checkoutUrl(q.slug, "join");
      const packBox = $<HTMLInputElement>("[data-pack]", col);
      if (packBox) packBox.checked = state.pack;
      const packAdd = $("[data-pack-add]", col);
      if (packAdd) {
        const base = live[bundleSlug("recorded", state.batch, state.exam)], withPack = live[bundleSlug("recorded", state.batch, state.exam, true)];
        const add = base && withPack ? withPack.price - base.price : CONFIG.mockPack;
        packAdd.textContent = "+" + inr(add);
      }
      const pop = $("[data-popular]", card);
      if (pop) pop.hidden = !(plan === "live" && state.batch === "combo");
      const sel = plan === state.plan;
      card.setAttribute("aria-checked", String(sel));
      card.tabIndex = sel ? 0 : -1;
      col.classList.toggle("on", sel);
    });
    $$("#batchPick .tab").forEach((b) => { const s = b.getAttribute("data-batch") === state.batch; b.setAttribute("aria-checked", String(s)); b.tabIndex = s ? 0 : -1; });
    $$("#examPick .tab").forEach((b) => { const s = b.getAttribute("data-exam") === state.exam; b.setAttribute("aria-checked", String(s)); b.tabIndex = s ? 0 : -1; });
    const epw = $("#examPickWrap");
    if (epw) epw.hidden = state.batch !== "single";
    const pack = state.plan === "recorded" && state.pack, cur = quote(state.plan, state.batch, pack);
    const pn = $("#pickName");
    if (pn) pn.textContent = PLAN_NAMES[state.plan] + (pack ? " + Pack" : "") + " · " + (state.batch === "combo" ? "Combo" : state.exam) + " · " + inr(cur.now);
    // Every Enrol now on the page goes straight to checkout for the plan picked.
    $$<HTMLAnchorElement>("[data-enrol]").forEach((a) => { a.href = checkoutUrl(cur.slug); });
    const from = quote("recorded", "single", false).now;
    $$("[data-from]").forEach((f) => { f.textContent = "from " + inr(from); });
    $$("[data-from-p]").forEach((f) => { f.textContent = inr(from); });
    const was = +(CONFIG.heroWasPrice || 0);
    $$("[data-was]").forEach((w) => {
      const on = was > from;
      w.hidden = !on;
      if (on) { w.textContent = inr(was); w.setAttribute("aria-label", "Was " + inr(was)); }
    });
    $$("[data-pv]").forEach((el) => {
      const k = el.getAttribute("data-pv"), combo = state.batch === "combo";
      if (k === "rmocks") el.textContent = String((combo ? 6 : 3) * (state.pack ? 2 : 1));
      else el.textContent = k === "mocks" ? (combo ? "20" : "10") : (combo ? "53+" : "32+");
    });
  };
  /* Load today's prices from the app. */
  (async () => {
    try {
      const res = await fetch(APP_URL + "/api/public/course-plans?course=" + encodeURIComponent(COURSE_SLUG), { signal });
      if (!res.ok) return;
      const body = await res.json();
      const plans: unknown = body?.success ? body.data?.plans : null;
      if (!Array.isArray(plans)) return;
      for (const p of plans) {
        if (!p || typeof p.slug !== "string" || typeof p.price !== "number" || p.price <= 0) continue;
        const options: LiveOption[] = Array.isArray(p.options)
          ? p.options.filter((o: LiveOption) => o && typeof o.code === "string" && typeof o.total === "number").map((o: LiveOption) => ({ code: o.code, total: o.total }))
          : [];
        const listPrice = typeof p.listPrice === "number" ? p.listPrice : p.price;
        live[p.slug] = { price: p.price, listPrice, options };
        /* Each add-on, keyed "plan+addon", priced and scheduled with it ticked. */
        for (const a of Array.isArray(p.addOns) ? p.addOns : []) {
          if (!a || typeof a.slug !== "string" || typeof a.price !== "number") continue;
          const addOnOptions: LiveOption[] = Array.isArray(a.options)
            ? a.options.filter((o: LiveOption) => o && typeof o.code === "string" && typeof o.total === "number").map((o: LiveOption) => ({ code: o.code, total: o.total }))
            : [];
          live[p.slug + "+" + a.slug] = { price: p.price + a.price, listPrice: listPrice + a.price, options: addOnOptions };
        }
      }
      renderPricing();
    } catch {
      /* Offline or blocked: CONFIG prices stay. */
    }
  })();
  /* Tell the call form which plan the student picked. */
  const announce = () => {
    const pack = state.plan === "recorded" && state.pack;
    const pick: PlanPick = { ...state, pack, slug: bundleSlug(state.plan, state.batch, state.exam, pack), label: planLabel(state.plan, state.batch, state.exam, pack) };
    window.__dcPlan = pick;
    window.dispatchEvent(new CustomEvent<PlanPick>(PLAN_EVENT, { detail: pick }));
  };
  const radioKeys = (group: HTMLElement | null, attr: string, cb: (v: string) => void) => {
    if (!group) return;
    group.addEventListener("keydown", (e) => {
      const items = $$('[role="radio"]', group), i = items.indexOf(doc.activeElement as HTMLElement);
      if (i < 0) return;
      const k = e.key;
      let n: HTMLElement | null = null;
      if (k === "ArrowRight" || k === "ArrowDown") n = items[(i + 1) % items.length];
      if (k === "ArrowLeft" || k === "ArrowUp") n = items[(i - 1 + items.length) % items.length];
      if (n) { e.preventDefault(); cb(n.getAttribute(attr) || ""); n.focus(); }
    }, { signal });
  };
  const setBatch = (b: string) => { state.batch = b as Batch; renderPricing(); announce(); };
  const setPlan = (p: string) => { state.plan = p as Plan; renderPricing(); announce(); };
  const setExam = (x: string) => { state.exam = x as Exam; renderPricing(); announce(); };
  $$("#batchPick .tab").forEach((b) => b.addEventListener("click", () => setBatch(b.getAttribute("data-batch") || "combo"), { signal }));
  $$("#examPick .tab").forEach((b) => b.addEventListener("click", () => setExam(b.getAttribute("data-exam") || "UCEED"), { signal }));
  $$("#planPick .pcard").forEach((c) => c.addEventListener("click", () => setPlan(c.getAttribute("data-plan") || "live"), { signal }));
  $$<HTMLInputElement>("#planPick [data-pack]").forEach((box) => box.addEventListener("change", () => { state.pack = box.checked; state.plan = "recorded"; renderPricing(); announce(); }, { signal }));
  $$("#planPick .pcol").forEach((col) => col.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".pcard, a, .ppack")) setPlan(col.getAttribute("data-col") || "live");
  }, { signal }));
  radioKeys($("#batchPick"), "data-batch", setBatch);
  radioKeys($("#examPick"), "data-exam", setExam);
  radioKeys($("#planPick"), "data-plan", setPlan);
  const go = (sel: string) => { const t = $(sel); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); };
  $$("[data-pick]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); setPlan(el.getAttribute("data-pick") || "live"); go("#pricing"); }, { signal }));
  $$("[data-pick-batch]").forEach((el) => el.addEventListener("click", (e) => { e.preventDefault(); setBatch(el.getAttribute("data-pick-batch") || "combo"); go("#pricing"); }, { signal }));
  renderPricing();

  /* ---------- course tabs ---------- */
  type Sys = { live: string; hours: string; mocks: string; title: string; total: number; blocks: string[][] };
  const SYS: Record<string, Sys> = {
    uceed: { live: "32+", hours: "64+", mocks: "10", title: "UCEED: 3 classes a week", total: 3,
      blocks: [["u", "UCEED", "2", "teaching"], ["f", "Every week", "1", "feedback & doubts"]] },
    nid: { live: "32+", hours: "64+", mocks: "10", title: "NID: 3 classes a week", total: 3,
      blocks: [["d", "NID", "2", "teaching"], ["f", "Every week", "1", "feedback & doubts"]] },
    combo: { live: "53+", hours: "106+", mocks: "20", title: "Combo: 5 classes a week", total: 5,
      blocks: [["u", "UCEED", "2", "teaching"], ["d", "NID", "2", "teaching"], ["f", "Together", "1", "feedback & doubts"]] },
  };
  const sysTabs = $$('#course [role="tab"][data-batch]');
  const setSys = (b: string, focus?: boolean) => {
    const s = SYS[b];
    $$("[data-sys]").forEach((el) => {
      const k = el.getAttribute("data-sys") as keyof Sys;
      if (k === ("weekTitle" as keyof Sys)) el.textContent = s.title;
      else if (s[k]) el.textContent = String(s[k]);
    });
    const blocks = $("#blocks");
    if (blocks) {
      blocks.innerHTML = s.blocks.map((x, i) =>
        (i ? '<span class="op" aria-hidden="true">+</span>' : "") + '<div class="blk ' + x[0] + '" style="--i:' + i + '"><span class="t">' + x[1] + '</span><span class="c">' + x[2] + '</span><span class="n">' + x[3] + "</span></div>"
      ).join("") + '<span class="op" aria-hidden="true">=</span><div class="blk-sum"><b>' + s.total + "</b><span>a week</span></div>";
    }
    $("#track")?.setAttribute("data-batch", b);
    sysTabs.forEach((t) => {
      const on = t.getAttribute("data-batch") === b;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { $("#sys-panel")?.setAttribute("aria-labelledby", t.id); if (focus) t.focus(); }
    });
  };
  sysTabs.forEach((t) => t.addEventListener("click", () => setSys(t.getAttribute("data-batch") || "combo"), { signal }));
  $('#course [role="tablist"]')?.addEventListener("keydown", (e) => {
    const i = sysTabs.indexOf(doc.activeElement as HTMLElement);
    if (i < 0) return;
    let n: HTMLElement | null = null;
    if (e.key === "ArrowRight") n = sysTabs[(i + 1) % sysTabs.length];
    if (e.key === "ArrowLeft") n = sysTabs[(i - 1 + sysTabs.length) % sysTabs.length];
    if (e.key === "Home") n = sysTabs[0];
    if (e.key === "End") n = sysTabs[sysTabs.length - 1];
    if (n) { e.preventDefault(); setSys(n.getAttribute("data-batch") || "combo", true); }
  }, { signal });
  setSys("combo");

  /* ---------- hero: 75 dots, one per day from 3 Nov (NID Prelims 20 Dec is day 48, the last dot is labelled UCEED) ---------- */
  (() => {
    const g = $("#dots75");
    if (!g) return;
    g.textContent = "";
    const frag = doc.createDocumentFragment();
    for (let i = 1; i <= 75; i++) {
      const d = doc.createElement("i");
      if (i === 48) d.className = "mk-n"; else if (i === 75) d.className = "mk-u";
      d.style.setProperty("--i", String(i));
      frag.appendChild(d);
    }
    g.appendChild(frag);
    cleanups.push(() => { g.textContent = ""; });
  })();

  /* ---------- sticky CTA: after the hero, hidden near the plans, the call form and the footer ---------- */
  (() => {
    const st = $("#sticky"), hero = $(".hero");
    if (!st || !hero) return;
    const avoid = [$("#book"), $(".foot"), $(".psum")];
    let past = false;
    const blocked: Record<number, boolean> = {};
    const upd = () => {
      const show = past && !Object.values(blocked).some(Boolean);
      st.classList.toggle("show", show);
      st.setAttribute("aria-hidden", String(!show));
      doc.documentElement.classList.toggle("sticky-on", show);
      $$("a", st).forEach((a) => { a.tabIndex = show ? 0 : -1; });
    };
    const ho = new IntersectionObserver((es) => { past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; upd(); });
    ho.observe(hero);
    const ao = new IntersectionObserver((es) => { es.forEach((e) => { blocked[avoid.indexOf(e.target as HTMLElement)] = e.isIntersecting; }); upd(); });
    avoid.forEach((el) => { if (el) ao.observe(el); });
    cleanups.push(() => { ho.disconnect(); ao.disconnect(); doc.documentElement.classList.remove("sticky-on"); });
  })();

  return () => cleanups.forEach((fn) => fn());
}
