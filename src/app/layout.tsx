import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import { SiteProvider } from "@/components/SiteProvider";
import { getCurrentSite, getSiteSettingsOrFallback } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reolconsult.no"),
  title: {
    default: "Reol-Consult AS – Lager- og butikkinnredning",
    template: "%s",
  },
  description:
    "Reol-Consult leverer lager-, butikk-, verksted-, kontor- og garderobeinnredning. Kontakt oss for tilbud.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Reol-Consult AS",
    title: "Reol-Consult AS – Lager- og butikkinnredning",
    description:
      "Reol-Consult leverer lager-, butikk-, verksted-, kontor- og garderobeinnredning. Kontakt oss for tilbud.",
    images: [
      {
        url: "/logo-hd.png",
        width: 1200,
        height: 630,
        alt: "Reol-Consult AS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reol-Consult AS – Lager- og butikkinnredning",
    description:
      "Reol-Consult leverer lager-, butikk-, verksted-, kontor- og garderobeinnredning.",
    images: ["/logo-hd.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getCurrentSite();
  const settings = await getSiteSettingsOrFallback(site?.id ?? null);

  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${dmSans.className} antialiased`}>
        <SiteProvider value={{ site, settings }}>
          <Header />
          <main className="pt-[84px] md:pt-[192px]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ScrollToTop />
          <CookieBanner />
          <Chatbot />
        </SiteProvider>
      </body>
    </html>
  );
}
