import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  right,
  workspace = "Reolconsult AS",
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  workspace?: string;
}) {
  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-[76px] items-center justify-between px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[11px] text-[#a3a3a3]">
            <span className="font-medium text-[#737373]">{workspace}</span>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span className="font-medium text-[#171717]">{title}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <h1 className="text-[18px] font-semibold tracking-tight text-[#171717]">{title}</h1>
            {subtitle && (
              <span className="truncate text-[12.5px] text-[#737373]">{subtitle}</span>
            )}
          </div>
        </div>
        {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
      </div>
      {/* Subtle accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#dc2626]/15 to-transparent" />
    </div>
  );
}
