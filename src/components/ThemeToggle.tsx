"use client";

import { useEffect, useState } from "react";

/* Same key as the app, so the choice reads the same way in both. Each site
   keeps its own copy (different origins). With nothing stored the theme
   follows the device ("system"), which is the default. */
export const THEME_KEY = "divergent-theme";

/* Runs in <head> before paint so a dark reader never sees a white flash. */
export const THEME_BOOT = `(function(){try{var p=localStorage.getItem("${THEME_KEY}");var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark"}}catch(e){}})();`;

type Theme = "light" | "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  root.style.colorScheme = theme;
  // One tag per OS scheme: a picked theme overrides both.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", theme === "dark" ? "#0B0E11" : "#ffffff"));
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // The boot script has already set the attribute; this only mirrors it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

    // Until someone picks a theme here, keep following the device.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {}
      if (stored === "light" || stored === "dark") return;
      const next: Theme = media.matches ? "dark" : "light";
      setTheme(next);
      apply(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      className={`theme-btn ${className}`.trim()}
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(next);
        apply(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          /* Private mode: the switch still works for this visit. */
        }
      }}
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  );
}
