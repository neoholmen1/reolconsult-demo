import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skole og barnehage – Reol-Consult AS",
  description:
    "Pulter, stoler, tavler, elevskap, barnehagemøbler og oppbevaring for skole og barnehage.",
};

export default function SkoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
