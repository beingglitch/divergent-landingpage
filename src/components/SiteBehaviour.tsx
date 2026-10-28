"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initSite } from "@/lib/site";

/* Wires up the nav, side dots, reveals, FAQs and the rest after hydration. */
export function SiteBehaviour() {
  const pathname = usePathname();
  useEffect(() => initSite(), [pathname]);
  return null;
}
