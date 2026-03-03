import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reolconsult AS – Lager- og butikkinnredning",
  description:
    "Reolconsult leverer lager-, butikk-, verksted-, kontor- og garderobeinnredning. Kontakt oss for tilbud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="pt-[180px]">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
