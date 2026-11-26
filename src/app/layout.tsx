import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactPopup } from "@/components/ContactPopup";
import { Sprite } from "@/components/Sprite";
import { SiteBehaviour } from "@/components/SiteBehaviour";
import { TitleTips } from "@/components/TitleTips";
/* The festival offer, set in the app's admin. Renders nothing when none is on. See src/lib/diwali.ts. */
import { Diwali } from "@/components/Diwali";
import { SITE_URL } from "@/lib/meta";
import { PIXEL_ID } from "@/lib/config";
import { PIXEL_LOADER } from "@/lib/pixel";
import { UTM_CAPTURE } from "@/lib/utm";
import { THEME_BOOT } from "@/components/ThemeToggle";
import "./styles.css";
import "./diwali.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Divergent Classes",
  description: "Online coaching for UCEED, NID and NIFT, by mentors from IIT, NID and NIFT.",
  icons: { icon: { url: "/assets/favicon.png", type: "image/png" } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E11" },
  ],
  // The theme follows the device until someone uses the header toggle. CSS
  // sets color-scheme per theme and ThemeToggle updates the theme-color tag.
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Instrument+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
        {/* Before paint, so a dark reader never sees a white flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        {/* Which ad or link brought them: see lib/utm. */}
        <script dangerouslySetInnerHTML={{ __html: UTM_CAPTURE }} />
        {PIXEL_ID ? <script dangerouslySetInnerHTML={{ __html: PIXEL_LOADER }} /> : null}
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Sprite />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ContactPopup />
        <SiteBehaviour />
        <TitleTips />
        <Diwali />
      </body>
    </html>
  );
}
