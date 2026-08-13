import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  const buttonClass =
    "inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e5e4] bg-white px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fafaf9] to-[#f5f5f4] text-[#525252] ring-1 ring-inset ring-[#ececec]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 text-[15px] font-semibold tracking-tight text-[#171717]">{title}</h3>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[#737373]">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-7">
          {actionHref ? (
            <Link href={actionHref} className={buttonClass}>
              <Plus className="h-4 w-4" strokeWidth={2.25} />
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onAction} className={buttonClass}>
              <Plus className="h-4 w-4" strokeWidth={2.25} />
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
