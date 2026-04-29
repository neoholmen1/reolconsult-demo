import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontormøbler – Reol-Consult AS",
  description:
    "Skrivebord (hev/senk), kontorstoler, oppbevaring, resepsjonsdisker, konferansebord og skjermvegger.",
};

export default function KontorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
