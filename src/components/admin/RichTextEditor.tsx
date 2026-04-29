"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Markdown-editoren importerer browser-globaler — last den client-side bare.
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-40 rounded-lg bg-[#fafafa]" /> },
);

export default function RichTextEditor({
  value,
  onChange,
  height = 220,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  height?: number;
  placeholder?: string;
}) {
  return (
    <div data-color-mode="light" className="rounded-lg border border-[#e5e5e5] overflow-hidden">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        textareaProps={{ placeholder }}
        preview="edit"
        visibleDragbar={false}
      />
    </div>
  );
}
