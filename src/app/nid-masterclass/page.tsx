import { NID_21 } from "@/lib/masterclass";
import { ProgramPage, programMeta } from "@/components/ProgramPage";

/* The 21 Days NID Masterclass 2027. The page is components/ProgramPage;
   its words, dates and plan slugs are NID_21 in lib/masterclass.ts. */
export const metadata = programMeta(NID_21);

export const revalidate = 60;

export default function NidMasterclassPage() {
  return <ProgramPage program={NID_21} />;
}
