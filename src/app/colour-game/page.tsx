import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ColourGame, ColourTiers } from "@/components/ColourGame";
import "./colour-game.css";

/* Odd colour out, a free 60 second game: spot the one tile in a different
   shade. It is a hook for students who have not met us yet, so the game sits
   on the first phone screen, and its end screen points to the AIDMT mock and
   the NID masterclass. The game is components/ColourGame. */
export const metadata: Metadata = pageMeta({
  title: "Odd Colour Out: test your colour eye | Divergent Classes",
  description: "One tile is a different shade. Find it before the clock runs out. A free 60 second colour sense game for UCEED and NID aspirants.",
  path: "/colour-game/",
});

export default function ColourGamePage() {
  return (
    <section className="hero phero hero--split cg-hero" id="top" aria-labelledby="hero-h">
      <div className="stage">
        <div className="arc">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="pills"><span className="pill">Free game</span><span className="pill pill--dark"><span className="dot" aria-hidden="true"></span>UCEED · NID</span></p>
              <h1 className="h1" id="hero-h">Odd colour <span className="hl">out.<svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 13C52 6 104 16 150 10S214 7 236 11" /></svg></span></h1>
              <p className="hero-sub">How sharp is your colour eye?</p>
              <ColourTiers />
            </div>
            <div className="hero-media">
              <ColourGame />
              <ul className="cg-rules" aria-label="Rules">
                <li>60 seconds</li>
                <li>Wrong tap costs 3s</li>
                <li>Harder every level</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
