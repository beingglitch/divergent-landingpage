import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactPopup } from "@/components/ContactPopup";
import { Sprite } from "@/components/Sprite";
import { SiteBehaviour } from "@/components/SiteBehaviour";
/* Diwali 2026: switches itself off after 18 Nov. See src/lib/diwali.ts to remove. */
import { Diwali } from "@/components/Diwali";
import { SITE_URL } from "@/lib/meta";
import { PIXEL_ID } from "@/lib/config";
import { PIXEL_LOADER } from "@/lib/pixel";
import { UTM_CAPTURE } from "@/lib/utm";
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
  themeColor: "#ffffff",
  colorScheme: "light",
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
        <Diwali />
      </body>
    </html>
  );
}
