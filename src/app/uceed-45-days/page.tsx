import { UCEED_45 } from "@/lib/masterclass";
import { ProgramPage, programMeta } from "@/components/ProgramPage";

/* The 45 Days UCEED 2027 program. The page is components/ProgramPage; its
   words, dates and plan slugs are UCEED_45 in lib/masterclass.ts, sample
   numbers until the real brief arrives (the page stays out of search till
   then). */
export const metadata = programMeta(UCEED_45);

export const revalidate = 60;

export default function Uceed45Page() {
  return <ProgramPage program={UCEED_45} />;
}
