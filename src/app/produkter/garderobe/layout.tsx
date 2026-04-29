import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garderobeskap – Reol-Consult AS",
  description:
    "Garderobeskap, skoleskap og ladeskap. Velg dørtype, farger, lås og funksjoner.",
};

export default function GarderobeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
