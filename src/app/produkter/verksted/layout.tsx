import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verksted og industri – Reol-Consult AS",
  description:
    "Arbeidsbord, verktøyskap, transportløsninger, miljøsikring og løfteutstyr for verksted og industri.",
};

export default function VerkstedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
