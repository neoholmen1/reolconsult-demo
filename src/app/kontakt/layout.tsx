import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt – Reol-Consult AS",
  description:
    "Ta kontakt med Reol-Consult: telefon 33 36 55 80, e-post mail@reolconsult.no, eller besøk oss på Smiløkka 7, 3173 Vear.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
