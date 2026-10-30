import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/LegalDoc";
import { APP_URL, CONTACT } from "@/lib/config";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy | Divergent Classes",
  description: "What the Divergent Classes website and app collect, why, how long we keep it, who we share it with and your rights.",
  path: "/privacy/",
});

const UPDATED = "28 October 2026";
const mail = <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const sections: DocSection[] = [
  {
    id: "about",
    title: "About this policy",
    body: (
      <>
        <p>This policy explains what personal information Divergent Classes (&quot;we&quot;, &quot;us&quot;) collects when you use our website, divergentclasses.com, and our learning app at {APP_URL.replace(/^https?:\/\//, "")}, why we collect it and what you can do about it.</p>
        <p>By using the website or the app, you agree to this policy. If you are under 18, please read it with a parent or guardian.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>We only collect what we need to teach you and to run the service:</p>
        <ul>
          <li><b>Contact details:</b> your name, phone or WhatsApp number and email address.</li>
          <li><b>Study details:</b> your class (Class 11, Class 12 or dropper), the exams you are preparing for (such as UCEED, NID or NIFT) and the plan you are interested in.</li>
          <li><b>Account and course data:</b> your login, the courses you buy, your progress, test attempts, scores and the work you upload for review.</li>
          <li><b>Payment details:</b> payments are handled by Razorpay. Your card, UPI or bank details go straight to Razorpay and are never stored by us. We keep a record of what you paid for, the amount, the date and the payment status.</li>
          <li><b>Usage analytics:</b> pages visited, buttons used, device and browser type, and approximate location from your IP address. We use this in aggregate to see what works and fix what does not.</li>
          <li><b>Advertising measurement:</b> we use the Meta Pixel and Conversions API to see which ads lead to call requests, sign-ups and purchases. This sends Meta the pages you visit, the plan you look at and, in hashed form, your phone number or email.</li>
        </ul>
      </>
    ),
  },
  {
    id: "why",
    title: "Why we collect it",
    body: (
      <ul>
        <li>To call or message you back when you book a free counselling call.</li>
        <li>To create your account, give you access to the courses you buy and track your progress.</li>
        <li>To take payments, including installments, and send receipts and reminders.</li>
        <li>To send class schedules, exam dates and course updates. You can opt out of promotional messages at any time.</li>
        <li>To improve the website, the app and our teaching.</li>
        <li>To prevent fraud and account sharing, and to meet our legal obligations.</li>
      </ul>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>If you book a call but do not join a course, we keep your details for up to 12 months and then delete them.</p>
        <p>If you have an account, we keep your account and course data while your account is open and for up to 3 years after your last course ends, so you can come back to your work and so we can answer questions about past results.</p>
        <p>Payment and invoice records are kept for as long as Indian tax and accounting law requires, usually 8 years.</p>
        <p>Analytics data is kept in aggregate or for up to 26 months.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p><b>We never sell your personal information.</b> We share it only with:</p>
        <ul>
          <li><b>Razorpay</b>, our payment processor, to take your payments.</li>
          <li>Service providers that host our website and app, send messages and emails, and measure usage. They may only use your data to provide that service to us.</li>
          <li>Your assigned mentors and teachers, who see your name, progress and submitted work so they can teach you.</li>
          <li>Authorities, when the law requires it.</li>
        </ul>
        <p>Ranks and results are only shown publicly with the student&apos;s permission.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>Data is sent over encrypted connections (HTTPS) and access inside Divergent Classes is limited to the people who need it. No system is perfectly secure, so please keep your password private and tell us straight away if you think your account has been misused.</p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Under India&apos;s Digital Personal Data Protection Act, 2023, you can:</p>
        <ul>
          <li>Ask what personal data we hold about you and get a copy.</li>
          <li>Ask us to correct or update anything that is wrong.</li>
          <li>Ask us to delete your data, unless we have to keep it by law.</li>
          <li>Withdraw your consent to calls and messages at any time.</li>
          <li>Name someone to act for you, and raise a complaint with us or with the Data Protection Board of India.</li>
        </ul>
        <p>Email {mail} from the number or email on your account and we will reply within 30 days.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>The app uses cookies to keep you signed in. The website and app may use analytics cookies to count visits, and the website uses Meta Pixel cookies to measure our ads. You can block cookies in your browser, but parts of the app may stop working.</p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>We may update this policy. The date at the top shows the latest version. If a change is significant, we will tell you in the app or by email.</p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>Questions about your data? Email {mail} or call <a href="tel:+918383056332">+91 83830 56332</a>.</p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      pill="Privacy"
      title="Privacy policy"
      lead="Your"
      mark="privacy."
      sub="What we collect, why, and what you can do about it. In plain words."
      updated={UPDATED}
      sections={sections}
      foot={<p>See also our <a href="/terms/">Terms and Conditions</a>.</p>}
    />
  );
}
