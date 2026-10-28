import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/LegalDoc";
import { APP_URL, CONTACT } from "@/lib/config";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Terms and conditions | Divergent Classes",
  description: "The terms for using the Divergent Classes website, app and courses. By using our services, you agree to these terms.",
  path: "/terms/",
});

const UPDATED = "28 October 2026";

const sections: DocSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: (
      <>
        <p>By accessing or using the Divergent Classes website, app or courses (the &quot;Platform&quot;), you confirm that you have read, understood and agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our services.</p>
        <p>Divergent Classes may update or change these Terms at any time without prior notice. If you keep using the Platform after a change, you accept the updated Terms.</p>
      </>
    ),
  },
  {
    id: "services",
    title: "Description of services",
    body: (
      <>
        <p>Divergent Classes runs an online learning platform with structured video courses, live classes, mock tests, mentorship sessions and community support for students preparing for design entrance exams such as UCEED, NID and NIFT.</p>
        <p>We may change, suspend or stop any part of the Platform at any time, including any feature, database or content.</p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <>
        <p>You must be at least 13 years old to use the Platform. If you are under 18, you confirm that a parent or guardian has agreed to you using the Platform and to these Terms.</p>
        <p>By creating an account, you confirm that the information you give is accurate, current and complete, and that you will keep your login details confidential.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "User accounts",
    body: (
      <>
        <p>You are responsible for keeping your login details confidential. Tell us straight away at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> if anyone uses your account without permission.</p>
        <p>Each account is for one person only. Sharing your account, login details or course access with anyone else is not allowed and may lead to your account being closed straight away, without a refund.</p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments and pricing",
    body: (
      <>
        <p>All course fees on the Platform are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Prices can change at any time.</p>
        <p>Payments are processed by Razorpay, a PCI-DSS compliant payment gateway. Divergent Classes does not store your card or payment details.</p>
        <p>Once a payment succeeds and course access is granted, see our <a href={`${APP_URL}/refund-policy`}>Refund and Cancellation Policy</a> to check whether you can get a refund.</p>
      </>
    ),
  },
  {
    id: "installments",
    title: "Installment payments",
    body: (
      <>
        <p>Some courses can be paid for in installments. If you choose installments, the amount and due date of each one are shown at checkout and in your account.</p>
        <p>Installments must be paid on time. If an installment is missed, your access to the course may pause until it is paid. Your progress is kept, and access returns once the payment is made.</p>
        <p>Paying in installments does not change the course fee or the refund terms for that course.</p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>All content on the Platform (including video lectures, PDFs, images, study material, assessments and software) belongs to Divergent Classes or its licensors and is protected by intellectual property law.</p>
        <p>You get a limited, non-exclusive, non-transferable licence to access and view the courses you buy, only for your own non-commercial study. You may not copy, share, change, build on, publicly show or otherwise exploit any content without our written permission.</p>
        <p>Sharing, downloading, screen-recording or redistributing any content without permission is not allowed and may lead to legal action.</p>
      </>
    ),
  },
  {
    id: "prohibited",
    title: "Prohibited conduct",
    body: (
      <p>You agree not to: (a) use the Platform for anything unlawful; (b) pretend to be any other person or organisation; (c) upload or send viruses, malware or any other harmful code; (d) try to get into any part of the Platform you are not allowed into; (e) scrape, crawl or systematically extract data from the Platform; (f) post or share content that is defamatory, obscene or infringes the rights of others.</p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer of warranties",
    body: (
      <>
        <p>The Platform and all content are provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose or non-infringement.</p>
        <p>Divergent Classes does not promise that the Platform will be uninterrupted, error-free or free of viruses or other harmful parts. We do not guarantee any particular result, rank or exam outcome from using our courses.</p>
      </>
    ),
  },
  {
    id: "limitation",
    title: "Limitation of liability",
    body: (
      <>
        <p>As far as the law allows, Divergent Classes and its officers, directors, employees and agents are not liable for any indirect, incidental, special, consequential or punitive damages arising from your use of, or inability to use, the Platform, even if we were told such damages were possible.</p>
        <p>Our total liability to you for any claim arising from these Terms will not be more than the total amount you paid Divergent Classes in the three months before the event that led to the claim.</p>
      </>
    ),
  },
  {
    id: "governing",
    title: "Governing law and disputes",
    body: (
      <>
        <p>These Terms are governed by the laws of India. Any dispute arising from these Terms is subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
        <p>Before starting any formal legal proceedings, you agree to first try to resolve the dispute informally by writing to us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>If you have any questions about these Terms, contact us:</p>
        <ul>
          <li>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          <li>Phone: <a href="tel:+918383056332">+91 83830 56332</a> or <a href="tel:+918368033468">+91 83680 33468</a></li>
          <li>Address: New Delhi, India</li>
        </ul>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      pill="Terms"
      title="Terms and conditions"
      lead="Terms and"
      mark="conditions."
      sub="Please read these before using the Divergent Classes website, app or courses."
      updated={UPDATED}
      sections={sections}
      foot={<p>See also our <a href="/privacy/">Privacy Policy</a> and <a href={`${APP_URL}/refund-policy`}>Refund and Cancellation Policy</a>.</p>}
    />
  );
}
