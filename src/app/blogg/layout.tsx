import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogg – Reol-Consult AS",
  description: "Tips, råd og nyheter om innredning og lagerløsninger.",
};

export default function BloggLayout({ children }: { children: React.ReactNode }) {
  return children;
}
