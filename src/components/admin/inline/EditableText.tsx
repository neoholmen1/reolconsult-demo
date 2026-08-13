"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";
import { useEditable } from "./EditableContext";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

export default function EditableText({
  fieldKey,
  fallback,
  as = "span",
  className,
  style,
  multiline = false,
  preserveLineBreaks = false,
}: {
  /** Nøkkel i EditableContext (f.eks. "hero.hero_title") */
  fieldKey: string;
  /** Tekst som vises når verdien er tom (samme som default-content på public siden) */
  fallback?: string;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  /** Tillat Enter for ny linje (relevant for textarea-felter) */
  multiline?: boolean;
  /** Behold \n fra public-side default som linjeskift når feltet ikke er fokusert */
  preserveLineBreaks?: boolean;
}) {
  const { get, set } = useEditable();
  const value = get(fieldKey);
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);

  // Tekst som vises når feltet ikke er fokusert: bruker verdi om satt, ellers fallback
  const displayValue = value ?? fallback ?? "";

  // Synk DOM-innhold med state når komponenten ikke er i edit-modus
  // (slik at undo/reset/parent-changes reflekteres)
  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== displayValue) {
      ref.current.textContent = displayValue;
    }
  }, [displayValue, editing]);

  function handleFocus() {
    setEditing(true);
    // Hvis feltet viser fallback men ikke har egen verdi, behold fallback i edit også
  }

  function handleBlur() {
    if (!ref.current) return;
    const next = (ref.current.textContent ?? "").trim();
    setEditing(false);
    // Tom string eller identisk med fallback lagres som null for å falle tilbake til public-default
    const cleanValue = next === "" || next === fallback?.trim() ? null : next;
    set(fieldKey, cleanValue);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = displayValue;
      ref.current?.blur();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
  }

  const editableClasses =
    "outline-none rounded-md transition-[box-shadow,background-color] duration-150 " +
    "ring-0 ring-offset-0 " +
    "hover:bg-rose-50/50 hover:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.25)] " +
    "focus:bg-white focus:shadow-[inset_0_0_0_1.5px_#dc2626] " +
    "data-[empty=true]:text-[#a3a3a3] data-[empty=true]:italic";

  // Preserve line breaks via CSS for the public default (\n)
  const styleWithBreaks: CSSProperties | undefined = preserveLineBreaks
    ? { ...style, whiteSpace: "pre-line" }
    : style;

  return createElement(
    as,
    {
      ref,
      contentEditable: true,
      suppressContentEditableWarning: true,
      role: "textbox",
      "aria-label": `Rediger ${fieldKey}`,
      "data-empty": displayValue === "" ? "true" : "false",
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: `${className ?? ""} ${editableClasses} cursor-text`,
      style: styleWithBreaks,
    },
    displayValue,
  );
}
