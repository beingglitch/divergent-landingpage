"use client";

import { usePathname } from "next/navigation";
import { OfferBar } from "@/components/OfferBar";

const EXAMS = ["uceed", "nid", "nift"];

export function Header() {
  const pathname = usePathname() || "/";
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
              <li><a href="/courses/" data-nav="courses" aria-current={cur("courses")}>Courses</a></li>
              <li className="dd">
                <button className="dd-btn" type="button" aria-expanded="false" aria-controls="dd-exams" data-nav="exams" aria-current={inExams ? "page" : undefined}>Exams <svg width="14" height="14" aria-hidden="true"><use href="#chev" /></svg></button>
                <ul className="dd-menu" id="dd-exams">
                  <li><a href="/uceed/" data-nav="uceed" aria-current={cur("uceed")}>UCEED</a></li>
                  <li><a href="/nid/" data-nav="nid" aria-current={cur("nid")}>NID DAT</a></li>
                  <li><a href="/nift/" data-nav="nift" aria-current={cur("nift")}>NIFT</a></li>
                </ul>
              </li>
              <li><a href="/results/" data-nav="results" aria-current={cur("results")}>Results</a></li>
              <li><a href="/about/" data-nav="about" aria-current={cur("about")}>About us</a></li>
              <li><a href="/community/" data-nav="community" aria-current={cur("community")}>Community</a></li>
            </ul>
          </nav>
          <div className="nav-cta">
            <a className="btn btn--ghost btn--sm" href="/contact/" data-nav="contact" aria-current={cur("contact")}>Contact us</a>
            <a className="btn btn--sm" href="/#plans">Enrol now <svg className="arr" width="16" height="16" aria-hidden="true"><use href="#arrow" /></svg></a>
          </div>
          <button className="menu-btn" type="button" aria-expanded="false" aria-controls="mnav"><span></span><b className="sr-only">Menu</b></button>
        </div>
        <div className="progress" aria-hidden="true"></div>
      </header>
      <div className="mnav" id="mnav" aria-label="Menu">
        <a className="ml" href="/courses/">Courses <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <p className="ml-k">Exams</p>
        <div className="ml-row">
          <a href="/uceed/">UCEED</a>
          <a href="/nid/">NID</a>
          <a href="/nift/">NIFT</a>
        </div>
        <a className="ml" href="/results/">Results <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/about/">About us <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/community/">Community <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <a className="ml" href="/contact/">Contact us <svg width="20" height="20" aria-hidden="true"><use href="#arrow" /></svg></a>
        <div className="mcta">
          <a className="btn btn--block" href="/#plans">Enrol now</a>
          <a className="btn btn--ghost btn--block" href="/#book">Book a free call</a>
        </div>
      </div>
      <nav className="sdots" aria-label="Sections on this page" hidden><ol></ol></nav>
    </>
  );
}
