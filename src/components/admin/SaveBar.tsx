"use client";

type Status = "idle" | "saving" | "saved" | "error";

export default function SaveBar({
  title,
  dirty,
  status,
  onSave,
  errorMessage,
  rightContent,
}: {
  title: string;
  dirty: boolean;
  status: Status;
  onSave: () => void;
  errorMessage?: string | null;
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#ececec] bg-white/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center gap-3">
        <h1 className="text-[15px] font-semibold tracking-tight text-[#171717]">{title}</h1>
        {dirty && status !== "saving" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Ulagrede endringer
          </span>
        )}
        {status === "saved" && !dirty && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Lagret
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
            {errorMessage}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        <button
          onClick={onSave}
          disabled={!dirty || status === "saving"}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
        >
          {status === "saving" ? "Lagrer..." : "Lagre"}
        </button>
      </div>
    </div>
  );
}
