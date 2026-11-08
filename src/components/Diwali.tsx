"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { DIWALI, DIWALI_DEALS, diwaliStage, type DiwaliStage } from "@/lib/diwali";

/* Diwali 2026: lamps, a marigold toran, fireworks over the hero, a rangoli
   by the plans, and (while the offer runs) a popup a few seconds after
   landing that leads into a short tour of the offer on the page. Every
   piece reads its dates from src/lib/diwali.ts and renders nothing outside
   them. Styles are in src/app/diwali.css, all under html.diwali. */

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/* A clay diya with a flickering flame. */
export function Diya({ className = "" }: { className?: string }) {
  return (
    <svg className={"dw-diya " + className} viewBox="0 0 40 40" aria-hidden="true">
      <path className="dw-flame" d="M20 4c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z" />
      <path className="dw-flame-in" d="M20 11c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7z" />
      <path d="M3 24h34c-1 7-8 12-17 12S4 31 3 24z" fill="#C2571A" />
      <path d="M3 24h34c-.3 1.6-1 3-2 4.3H5C4 27 3.3 25.6 3 24z" fill="#E07A2E" />
      <circle cx="12" cy="30" r="1.3" fill="#FFC500" /><circle cx="20" cy="31.5" r="1.3" fill="#FFC500" /><circle cx="28" cy="30" r="1.3" fill="#FFC500" />
    </svg>
  );
}

/* A dot-and-petal rangoli. */
function Rangoli({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg className={"dw-rangoli " + className} viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="96" fill="none" stroke="#FFC500" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
      {petals.map((a) => <path key={"o" + a} transform={`rotate(${a})`} d="M0-90C18-62 18-40 0-26-18-40-18-62 0-90z" fill="#FF6A1A" opacity=".9" />)}
      {petals.map((a) => <path key={"m" + a} transform={`rotate(${a + 22.5})`} d="M0-70C12-52 12-38 0-28-12-38-12-52 0-70z" fill="#209BD2" />)}
      <circle r="30" fill="#FFC500" />
      {petals.map((a) => <path key={"i" + a} transform={`rotate(${a})`} d="M0-28C7-20 7-12 0-7-7-12-7-20 0-28z" fill="#E0306E" />)}
      <circle r="8" fill="#fff" />
      {petals.map((a) => <circle key={"d" + a} transform={`rotate(${a + 22.5})`} cy="-84" r="4" fill="#fff" />)}
    </svg>
  );
}

/* Fireworks on a canvas laid over the hero. A few bursts on arrival, then
   one now and then while the hero is on screen. Off for reduced motion. */
function Fireworks({ host }: { host: HTMLElement }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const COLORS = ["#FFC500", "#FFD84D", "#FF8A00", "#FF5A5F", "#7DD0F7", "#FFFFFF", "#F472B6"];
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; r: number };
    let parts: P[] = [], raf = 0, timer = 0, visible = true, w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => { w = host.clientWidth; h = host.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const burst = () => {
      const x = w * (0.12 + Math.random() * 0.76), y = h * (0.12 + Math.random() * 0.4);
      const c = COLORS[Math.floor(Math.random() * COLORS.length)], c2 = COLORS[Math.floor(Math.random() * COLORS.length)];
      const n = 46 + Math.floor(Math.random() * 30), speed = 2.2 + Math.random() * 1.8;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n, s = speed * (0.55 + Math.random() * 0.45);
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 55 + Math.random() * 35, c: i % 3 ? c : c2, r: 1.4 + Math.random() * 1.3 });
      }
    };
    const frame = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.22)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      parts = parts.filter((p) => p.life < p.max);
      for (const p of parts) {
        p.life++; p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.045; p.x += p.vx; p.y += p.vy;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(frame) : 0;
    };
    const fire = () => { if (!visible || document.hidden) return; burst(); if (!raf) raf = requestAnimationFrame(frame); };
    // Arrival: a short volley.
    const volley = [300, 750, 1200, 1700, 2400].map((ms) => window.setTimeout(fire, ms));
    timer = window.setInterval(() => { if (Math.random() < 0.7) fire(); }, 3200);
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; });
    io.observe(host);
    const ro = new ResizeObserver(size);
    ro.observe(host);
    return () => { volley.forEach(clearTimeout); clearInterval(timer); cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [host]);
  return <canvas ref={ref} className="dw-fw" aria-hidden="true" />;
}

/* The tour after the popup: each step lights up one part of the page with a
   note beside it. Steps whose part is missing are skipped. */
type Step = { sel: string; title: string; text: string };
const STEPS: Step[] = [
  { sel: "#planPick .pcol.on .pcard", title: "Diwali prices are on every plan", text: "₹1,000 off single-exam plans and ₹2,000 off Combos. The struck price is today's price, and it comes back after 11 Nov." },
  { sel: "#planPick .pcol.on .gift:not([hidden])", title: "Diwali gifts on Live and Mentor", text: "AI sketch review and free access to every AIDMT. Mentor plans paid in full also get a Divergent hoodie." },
  { sel: ".pjoinbox", title: "Not ready to pay it all?", text: "Join for ₹1,000. It locks the Diwali price, counts toward your fee, and is fully refundable till 10 Nov." },
  { sel: "#demo", title: "Try before you pay", text: "Take a free demo class first. Sign in with your phone number, no payment." },
];

function Tour({ onDone }: { onDone: () => void }) {
  const steps = useRef(STEPS.filter((s) => { const el = document.querySelector<HTMLElement>(s.sel); return !!el && el.offsetParent !== null; })).current;
  const [i, setI] = useState(0);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tipPos, setTipPos] = useState<CSSProperties>({});
  const step = steps[i];

  useEffect(() => {
    if (!step) { onDone(); return; }
    const el = document.querySelector<HTMLElement>(step.sel);
    if (!el) { onDone(); return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    let raf = 0;
    const place = () => {
      const r = el.getBoundingClientRect(), pad = 10;
      setBox({ top: r.top - pad, left: r.left - pad, width: r.width + pad * 2, height: r.height + pad * 2 });
      const tip = tipRef.current, th = tip?.offsetHeight || 180, tw = Math.min(360, window.innerWidth - 32), vh = window.innerHeight;
      const left = Math.min(Math.max(16, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 16);
      if (r.bottom + pad + th + 14 < vh) setTipPos({ top: r.bottom + pad + 14, left, width: tw });
      else if (r.top - pad - th - 14 > 0) setTipPos({ top: r.top - pad - th - 14, left, width: tw });
      else setTipPos({ bottom: 16, left, width: tw });
    };
    const loop = () => { place(); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [step, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
      if (e.key === "ArrowRight") setI((n) => n + 1);
      if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    };
    window.addEventListener("keydown", onKey);
    tipRef.current?.querySelector<HTMLElement>(".dw-tip-next")?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [i, onDone]);

  if (!step) return null;
  const last = i === steps.length - 1;
  return (
    <div className="dw-tour">
      <div className="dw-tour-hit" onClick={onDone} />
      {box ? <div className="dw-spot" style={box} aria-hidden="true" /> : null}
      <div className="dw-tip" ref={tipRef} style={tipPos} role="dialog" aria-modal="false" aria-labelledby="dw-tip-h" aria-describedby="dw-tip-p">
        <button type="button" className="dw-x dw-x--sm" onClick={onDone} aria-label="Close the tour">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
        <p className="dw-tip-k"><Diya />Diwali offer · {i + 1} of {steps.length}</p>
        <h3 id="dw-tip-h">{step.title}</h3>
        <p id="dw-tip-p">{step.text}</p>
        <div className="dw-tip-acts">
          {i > 0 ? <button type="button" className="btn btn--ghost btn--sm" onClick={() => setI(i - 1)}>Back</button> : <span />}
          <button type="button" className="btn btn--sm dw-tip-next" onClick={() => (last ? onDone() : setI(i + 1))}>{last ? "Got it" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}

/* The offer popup, a few seconds after every page load (and from the bunny
   button). Closes with the X, Escape or a click outside. */
function OfferPopup({ onClose, onTour }: { onClose: () => void; onTour: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    card.current?.querySelector<HTMLElement>(".dw-x")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !card.current) return;
      const f = Array.from(card.current.querySelectorAll<HTMLElement>("a,button"));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("dw-locked");
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.classList.remove("dw-locked"); back?.focus?.({ preventScroll: true }); };
  }, [onClose]);

  const home = location.pathname === "/";
  return (
    <div className="dw-pop-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dw-pop" ref={card} role="dialog" aria-modal="true" aria-labelledby="dw-pop-h" aria-describedby="dw-pop-d">
        <button type="button" className="dw-x" onClick={onClose} aria-label="Close the Diwali offer">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
        <div className="dw-pop-head">
          <div className="dw-pop-lamps" aria-hidden="true"><Diya /><Diya /><Diya /></div>
          <p className="dw-pop-k">Diwali offer · ends 11 Nov, 11:59 pm</p>
          <h2 id="dw-pop-h">Diwali pe ₹2,000 off. <span>Mentor ka feedback included.</span></h2>
          <p id="dw-pop-d" className="dw-pop-d">Start your design entrance prep with a mentor checking your work every week, for up to ₹2,000 less.</p>
        </div>
        <ul className="dw-deals">
          {DIWALI_DEALS.map((d) => (
            <li key={d.name} className={d.hot ? "hot" : undefined}>
              <a
                href={d.href}
                onClick={(e) => { if (home && d.href === "/#plans") { e.preventDefault(); onTour(); } }}
              >
                <span className="dw-deal-t">
                  <b>{d.name}{d.hot ? <em>Best value</em> : null}</b>
                  <small>{d.note}</small>
                </span>
                <span className="dw-deal-p">
                  <s aria-label={"Was " + inr(d.now)}>{inr(d.now)}</s>
                  <b>{inr(d.diwali)}</b>
                  <span className="dw-off">{inr(d.now - d.diwali)} off{d.code ? <> · <code>{d.code}</code></> : null}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="dw-pop-foot">
          {home ? (
            <button type="button" className="btn btn--block" onClick={onTour}>Show me the Diwali prices</button>
          ) : (
            <a className="btn btn--block" href="/?diwali-tour=1#plans">See the Diwali prices</a>
          )}
          <p>Join for ₹1,000 to lock the price. Fully refundable till 10 Nov.</p>
        </div>
      </div>
    </div>
  );
}

/* Puts children inside an element already on the page, once it exists. */
function Into({ sel, children, where = "append" }: { sel: string; children: ReactNode; where?: "append" | "prepend" }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const target = document.querySelector<HTMLElement>(sel);
    if (!target) return;
    const slot = document.createElement("span");
    slot.className = "dw-slot";
    if (where === "prepend") target.prepend(slot); else target.append(slot);
    setHost(slot);
    return () => { slot.remove(); setHost(null); };
  }, [sel, where]);
  return host ? createPortal(children, host) : null;
}

export function Diwali() {
  const pathname = usePathname() || "/";
  const [stage, setStage] = useState<DiwaliStage>("off");
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [pop, setPop] = useState(false);
  const [tour, setTour] = useState(false);
  // Opened by itself once per page load; moving between pages does not reopen it.
  const autoShown = useRef(false);

  // The stage depends on the visitor's clock, so it is read after hydration.
  useEffect(() => {
    const s = diwaliStage();
    setStage(s);
    const root = document.documentElement;
    root.classList.toggle("diwali", s !== "off");
    root.classList.toggle("diwali-offer", s === "offer");
    return () => root.classList.remove("diwali", "diwali-offer");
  }, []);

  useEffect(() => { setHero(document.querySelector<HTMLElement>(".hero .stage")); }, [pathname, stage]);

  // The popup: a few seconds after every page load, never over another dialog.
  useEffect(() => {
    if (stage !== "offer" || /^\/(privacy|terms)/.test(pathname)) return;
    if (pathname === "/" && /[?&]diwali-tour=1/.test(location.search)) {
      const t = window.setTimeout(() => setTour(true), 900);
      return () => clearTimeout(t);
    }
    if (autoShown.current) return;
    const t = window.setTimeout(() => {
      const busy = document.querySelector('[aria-modal="true"], .menu-btn[aria-expanded="true"], .dw-tour');
      autoShown.current = true;
      if (!busy) setPop(true);
    }, DIWALI.popupDelayMs);
    return () => clearTimeout(t);
  }, [stage, pathname]);

  // The bunny button (Footer) opens the contact card. While the offer runs it
  // opens the Diwali offers instead, except on the contact page.
  useEffect(() => {
    const bunny = document.querySelector<HTMLAnchorElement>("[data-bunny]");
    if (!bunny || stage !== "offer" || /^\/contact\/?$/.test(pathname)) return;
    const label = bunny.getAttribute("aria-label");
    bunny.setAttribute("aria-label", "See the Diwali offers");
    bunny.setAttribute("aria-haspopup", "dialog");
    bunny.classList.add("bunny-fab--diwali");
    // On window, capturing, so it runs before the contact card's own listener.
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-bunny]")) return;
      e.preventDefault();
      e.stopPropagation();
      autoShown.current = true;
      setTour(false);
      setPop(true);
    };
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      if (label) bunny.setAttribute("aria-label", label);
      bunny.removeAttribute("aria-haspopup");
      bunny.classList.remove("bunny-fab--diwali");
    };
  }, [stage, pathname]);

  const closePop = useCallback(() => setPop(false), []);
  const startTour = useCallback(() => { setPop(false); setTour(true); }, []);
  const endTour = useCallback(() => setTour(false), []);

  if (stage === "off") return null;
  const isHome = pathname === "/";
  return (
    <>
      {/* The marigold toran hangs from the menu on every page. */}
      <Into sel="#nav"><span className="dw-toran" aria-hidden="true" /></Into>
      {isHome ? (
        <>
          {hero ? createPortal(<Fireworks host={hero} />, hero) : null}
          <Into sel=".hero .pills">
            <span className="pill dw-pill"><Diya />{stage === "offer" ? "Diwali offer till 11 Nov" : "Happy Diwali"}</span>
          </Into>
          <Into sel=".hero .arc">
            <span className="dw-lamps" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <Diya key={i} className={"l" + i} />)}</span>
          </Into>
          <Into sel="#plans" where="prepend"><span aria-hidden="true"><Rangoli className="r1" /><Rangoli className="r2" /></span></Into>
          <Into sel="#book .arc"><span className="dw-lamps dw-lamps--sm" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Diya key={i} className={"l" + i} />)}</span></Into>
        </>
      ) : null}
      <Into sel="footer.foot" where="prepend"><span className="dw-greet" aria-hidden="true"><Diya />Happy Diwali from Divergent<Diya /></span></Into>
      {pop ? <OfferPopup onClose={closePop} onTour={isHome ? startTour : closePop} /> : null}
      {tour ? <Tour onDone={endTour} /> : null}
    </>
  );
}
