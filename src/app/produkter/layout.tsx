import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produkter – Reol-Consult AS",
  description:
    "Innredning til lager, butikk, verksted, kontor, garderobe og skole. Se vårt sortiment fra Reol-Consult AS.",
};

export default function ProdukterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
