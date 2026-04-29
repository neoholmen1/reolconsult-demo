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
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#171717]">{title}</h1>
        {dirty && status !== "saving" && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
            Ulagrede endringer
          </span>
        )}
        {status === "saved" && !dirty && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
            Lagret
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
            {errorMessage}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {rightContent}
        <button
          onClick={onSave}
          disabled={!dirty || status === "saving"}
          className="rounded-full bg-[#dc2626] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:bg-[#e5e5e5] disabled:text-[#a3a3a3]"
        >
          {status === "saving" ? "Lagrer..." : "Lagre"}
        </button>
      </div>
    </div>
  );
}
