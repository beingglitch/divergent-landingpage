import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sprite } from "@/components/Sprite";
import { SiteBehaviour } from "@/components/SiteBehaviour";
import { SITE_URL } from "@/lib/meta";
import { PIXEL_ID } from "@/lib/config";
import { PIXEL_LOADER } from "@/lib/pixel";
import "./styles.css";

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
        {PIXEL_ID ? <script dangerouslySetInnerHTML={{ __html: PIXEL_LOADER }} /> : null}
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Sprite />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SiteBehaviour />
      </body>
    </html>
  );
}
