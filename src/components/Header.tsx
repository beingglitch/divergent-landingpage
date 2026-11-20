"use client";

import { usePathname } from "next/navigation";
import { OfferBar } from "@/components/OfferBar";
import { ClassPopup, CourseRows, CoursesMenu, useStudent } from "@/components/StudentClass";
import { APP_URL } from "@/lib/config";

/* The app's sign-in. A WhatsApp code signs a new number up too, so one
   button covers both; students looked for a sign-up link and found none. */
const LOGIN = `${APP_URL}/login`;
const DASHBOARD = `${APP_URL}/dashboard`;

const EXAMS = ["uceed", "nid", "nift"];

export function Header() {
  const pathname = usePathname() || "/";
  const { session, cls, choose } = useStudent();
  const signedIn = session.signedIn;
  const account = signedIn ? { href: DASHBOARD, label: "Dashboard", short: "Dashboard" } : { href: LOGIN, label: "Log in / Sign up", short: "Log in" };
  const here = pathname.split("/").filter(Boolean)[0] || "home";
  const cur = (key: string) => (key === here ? ("page" as const) : undefined);
  const inExams = EXAMS.includes(here);
  return (
    <>
      <header className="nav" id="nav">
        <OfferBar />
        <div className="wrap nav-in">
          <a className="brand" href="/" aria-label="Divergent Classes home">
            <img src="/assets/logo.png" alt="Divergent Classes" width="227" height="88" />
          </a>
          <nav aria-label="Main">
            <ul className="nav-links">
              <CoursesMenu cls={cls} choose={choose} current={inExams || here === "courses"} />
              <li><a href="/aidmt/" data-nav="aidmt" aria-current={cur("aidmt")}>AIDMT</a></li>
              <li><a href="/results/" data-nav="results" aria-current={cur("results")}>Results</a></li>
              <li><a href="/about/" data-nav="about" aria-current={cur("about")}>About us</a></li>
              <li><a href="/community/" data-nav="community" aria-current={cur("community")}>Community</a></li>
              <li><a href="/blog/" data-nav="blog" aria-current={cur("blog")}>Blog</a></li>
            </ul>
          </nav>
          <div className="nav-cta">
            <a className="btn btn--ghost btn--sm nav-contact" href="/contact/" data-nav="contact" aria-current={cur("contact")}>Contact us</a>
            <a className="btn btn--sm" href={account.href}>{account.label}</a>
          </div>
          <a className="btn btn--sm nav-login" href={account.href}>{account.short}</a>
          <button className="menu-btn" type="button" aria-expanded="false" aria-controls="mnav"><span></span><b className="sr-only">Menu</b></button>
        </div>
        <div className="progress" aria-hidden="true"></div>
      </header>
      <div className="mnav" id="mnav" aria-label="Menu">
        <div className="ml-pick cm-rows">
          <CourseRows size="md" cls={cls} choose={choose} />
        </div>
        <a className="ml" href="/courses/">Courses <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/aidmt/">AIDMT mock test <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/results/">Results <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/about/">About us <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/community/">Community <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/blog/">Blog <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/contact/">Contact us <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <div className="mcta">
          <a className="btn btn--block" href={account.href}>{account.label}</a>
          <a className="btn btn--ghost btn--block" href="/#book">Book a free call</a>
        </div>
      </div>
      <nav className="sdots" aria-label="Sections on this page" hidden><ol></ol></nav>
      <ClassPopup session={session} cls={cls} choose={choose} />
    </>
  );
}
