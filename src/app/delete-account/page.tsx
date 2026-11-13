import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/LegalDoc";
import { CONTACT } from "@/lib/config";
import { pageMeta } from "@/lib/meta";

/* How to have a Divergent Classes account deleted. Google Play asks every app
   with sign-in for a public page like this one; the app's Settings links here. */
export const metadata: Metadata = pageMeta({
  title: "Delete your account | Divergent Classes",
  description: "How to ask Divergent Classes to delete your account and data, what is deleted, what we have to keep and how long it takes.",
  path: "/delete-account/",
});

const UPDATED = "13 November 2026";
const mail = <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Delete my account")}`}>{CONTACT.email}</a>;
const whatsapp = (
  <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Please delete my Divergent Classes account.")}`} target="_blank" rel="noopener">WhatsApp {CONTACT.phoneShown}</a>
);

const sections: DocSection[] = [
  {
    id: "ask",
    title: "How to ask",
    body: (
      <>
        <p>Send us a message from the phone number or email you sign in with, so we know the request is yours:</p>
        <ul>
          <li>Message us on {whatsapp}, or</li>
          <li>Email {mail} with the subject &quot;Delete my account&quot;.</li>
        </ul>
        <p>Tell us the name on the account. If you write from a different number or email, we will ask you to confirm from the one on the account first.</p>
      </>
    ),
  },
  {
    id: "deleted",
    title: "What we delete",
    body: (
      <ul>
        <li>Your profile: name, phone number, email and password.</li>
        <li>Your course data: progress, test attempts and scores, XP and badges.</li>
        <li>Work you uploaded for review, and your doubts and messages.</li>
        <li>Your sign-in sessions on every device.</li>
      </ul>
    ),
  },
  {
    id: "kept",
    title: "What we have to keep",
    body: (
      <p>Payment and invoice records (what you paid for, the amount, the date and the payment status) are kept for as long as Indian tax and accounting law requires, usually 8 years. They are not used for anything else.</p>
    ),
  },
  {
    id: "time",
    title: "How long it takes",
    body: (
      <p>We confirm your request and delete the account within 30 days. Any course you still have access to ends when the account is deleted, and it cannot be brought back afterwards.</p>
    ),
  },
];

export default function DeleteAccountPage() {
  return (
    <LegalDoc
      pill="Your account"
      title="Delete your account"
      lead="Delete your"
      mark="account."
      sub="How to ask us to delete your Divergent Classes account and data."
      updated={UPDATED}
      sections={sections}
      foot={<p>See also our <a href="/privacy/">Privacy policy</a>.</p>}
    />
  );
}
