import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Butikkinnredning – Reol-Consult AS",
  description:
    "Gondoler, veggsystemer, kassedisker og tilbehør. Komplett butikkinnredning fra idé til ferdig montert.",
};

export default function ButikkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
