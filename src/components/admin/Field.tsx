"use client";

import { type ReactNode } from "react";

const inputClass =
  "w-full rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10";

export function FieldText({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "url";
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      {hint && <span className="ml-1.5 text-[11px] text-[#a3a3a3]">{hint}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1.5 ${inputClass}`}
      />
    </label>
  );
}

export function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      {hint && <span className="ml-1.5 text-[11px] text-[#a3a3a3]">{hint}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`mt-1.5 resize-y ${inputClass}`}
      />
    </label>
  );
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#ececec] bg-white p-5">
      {title && (
        <div className="mb-4">
          <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">{title}</h3>
          {description && (
            <p className="mt-0.5 text-[11.5px] text-[#737373]">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export const inputClassName = inputClass;
