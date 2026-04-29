import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lagerinnredning – Reol-Consult AS",
  description:
    "Pallreoler, småvarereoler, mesanin, grenreoler og spesialreoler i galvanisert stål. HMS sikkerhetskontroll.",
};

export default function LagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
