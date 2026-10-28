"use client";

import { useEffect } from "react";
import { initHome } from "@/lib/home";

/* Prices, countdowns, course tabs, hero dots and the sticky bar on the home page. */
export function HomeBehaviour() {
  useEffect(() => initHome(), []);
  return null;
}
