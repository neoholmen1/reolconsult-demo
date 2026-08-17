import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import JsonLd from "@/components/JsonLd";
import GlobalBackground from "@/components/GlobalBackground";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteProvider } from "@/components/SiteProvider";
import { getCurrentSite, getSiteSettingsOrFallback } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Varm editorial display-serif for store overskrifter
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reolconsult.no"),
  title: {
    default: "Reol-Consult AS – Lager- og butikkinnredning",
    template: "%s | Reol-Consult AS",
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
        url: "/og-reolconsult.png",
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
    images: ["/og-reolconsult.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getCurrentSite();
  const settings = await getSiteSettingsOrFallback(site?.id ?? null);

  // LocalBusiness structured data — vises på alle sider for konsistent NAP-signal
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://reolconsult.no/#organization",
    name: site?.name ?? "Reol-Consult AS",
    url: "https://reolconsult.no",
    logo: "https://reolconsult.no/logo-reolconsult.png",
    image: "https://reolconsult.no/og-reolconsult.png",
    telephone: settings.phone ? `+47 ${settings.phone}` : "+47 33 36 55 80",
    email: settings.email_general ?? "mail@reolconsult.no",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Smiløkka 7",
      postalCode: "3173",
      addressLocality: "Vear",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.2447,
      longitude: 10.4131,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      settings.social?.facebook,
      settings.social?.instagram,
      settings.social?.linkedin,
    ].filter(Boolean),
  };

  return (
    <html lang="no" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
        <JsonLd data={localBusinessLd} />
      </head>
      <body className={`${dmSans.className} antialiased`}>
        <ThemeProvider>
          <div className="grain-overlay" aria-hidden />
          <GlobalBackground />
          <SiteProvider value={{ site, settings }}>
            <Header />
            <main className="pt-[80px] pb-20 md:pt-[136px] md:pb-0">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <ScrollToTop />
            <CookieBanner />
            <Chatbot />
            <MobileStickyCTA />
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
