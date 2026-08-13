"use client";

import { type LucideIcon } from "lucide-react";

type Variant = "default" | "danger";

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: Variant;
}) {
  const styles =
    variant === "danger"
      ? "text-[#a3a3a3] hover:bg-red-50 hover:text-[#dc2626]"
      : "text-[#a3a3a3] hover:bg-[#f5f5f4] hover:text-[#171717]";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition duration-150 ${styles}`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
